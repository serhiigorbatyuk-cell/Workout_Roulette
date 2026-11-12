import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DIFFICULTIES,
  WORKOUT_TYPES,
  isExerciseId,
  type Difficulty,
  type ExerciseId,
  type WorkoutType,
} from "@/data/exercises";

export interface HistoryEntry {
  id: string;
  /** Local calendar day, YYYY-MM-DD — used for streaks. */
  date: string;
  timestamp: number;
  type: WorkoutType;
  difficulty: Difficulty;
  count: number;
  minutes: number;
}

/** A workout the roulette picked, stored with enough data to reopen it. */
export interface RecentWorkout {
  id: string;
  /** Local calendar day, YYYY-MM-DD. */
  date: string;
  timestamp: number;
  type: WorkoutType;
  difficulty: Difficulty;
  exerciseIds: ExerciseId[];
  minutes: number;
}

export type RecentWorkoutInput = Omit<
  RecentWorkout,
  "id" | "timestamp" | "date"
>;

export interface WorkoutStatsData {
  total: number;
  minutes: number;
  streak: number;
}

const STORAGE_KEY = "workout-roulette-history";
const RECENT_STORAGE_KEY = "workout-roulette-recent";
const MAX_ENTRIES = 365;
const MAX_RECENT = 20;

/** Local (not UTC) YYYY-MM-DD, so a late workout still counts as today. */
export function dayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isWorkoutType(value: unknown): value is WorkoutType {
  return (
    typeof value === "string" &&
    WORKOUT_TYPES.includes(value as WorkoutType)
  );
}

function isDifficulty(value: unknown): value is Difficulty {
  return (
    typeof value === "string" &&
    DIFFICULTIES.includes(value as Difficulty)
  );
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is HistoryEntry => {
        if (!item || typeof item !== "object") return false;
        const entry = item as Partial<HistoryEntry>;
        return (
          typeof entry.id === "string" &&
          typeof entry.date === "string" &&
          typeof entry.timestamp === "number" &&
          isWorkoutType(entry.type) &&
          isDifficulty(entry.difficulty) &&
          typeof entry.count === "number" &&
          typeof entry.minutes === "number"
        );
      })
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

function isRecentWorkout(value: unknown): value is RecentWorkout {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<RecentWorkout>;
  return (
    typeof entry.id === "string" &&
    typeof entry.date === "string" &&
    typeof entry.timestamp === "number" &&
    isWorkoutType(entry.type) &&
    isDifficulty(entry.difficulty) &&
    Array.isArray(entry.exerciseIds) &&
    entry.exerciseIds.length > 0 &&
    entry.exerciseIds.every(isExerciseId) &&
    typeof entry.minutes === "number"
  );
}

function loadRecent(): RecentWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentWorkout).slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

function workoutSignature(entry: {
  type: WorkoutType;
  difficulty: Difficulty;
  exerciseIds: ExerciseId[];
}): string {
  return `${entry.type}|${entry.difficulty}|${[...entry.exerciseIds]
    .sort()
    .join(",")}`;
}

export function computeStats(entries: HistoryEntry[]): WorkoutStatsData {
  const total = entries.length;
  const minutes = entries.reduce((sum, entry) => sum + entry.minutes, 0);

  const days = new Set(entries.map((entry) => entry.date));
  const cursor = new Date();
  // A workout today keeps the streak alive; otherwise start from yesterday.
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { total, minutes, streak };
}

function createEntryId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to the timestamp id
  }
  return `w-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useWorkoutHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadHistory);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage may be unavailable — stats work for this session only
    }
  }, [entries]);

  const record = useCallback(
    (workout: Omit<HistoryEntry, "id" | "timestamp" | "date">) => {
      setEntries((current) => [
        {
          ...workout,
          id: createEntryId(),
          date: dayKey(),
          timestamp: Date.now(),
        },
        ...current,
      ].slice(0, MAX_ENTRIES));
    },
    [],
  );

  const clear = useCallback(() => setEntries([]), []);

  const stats = useMemo(() => computeStats(entries), [entries]);

  return { entries, stats, record, clear };
}

export function useRecentWorkouts() {
  const [entries, setEntries] = useState<RecentWorkout[]>(loadRecent);

  useEffect(() => {
    try {
      window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // storage may be unavailable — history works for this session only
    }
  }, [entries]);

  const record = useCallback((workout: RecentWorkoutInput) => {
    const entry: RecentWorkout = {
      ...workout,
      id: createEntryId(),
      date: dayKey(),
      timestamp: Date.now(),
    };
    setEntries((current) => {
      if (
        current[0] &&
        workoutSignature(current[0]) === workoutSignature(entry)
      ) {
        return current;
      }
      return [entry, ...current].slice(0, MAX_RECENT);
    });
  }, []);

  const replace = useCallback(
    (previous: RecentWorkoutInput, next: RecentWorkoutInput) => {
      const fallback: RecentWorkout = {
        ...next,
        id: createEntryId(),
        date: dayKey(),
        timestamp: Date.now(),
      };
      setEntries((current) => {
        const previousSignature = workoutSignature(previous);
        const index = current.findIndex(
          (entry) => workoutSignature(entry) === previousSignature,
        );
        if (index === -1) {
          return [fallback, ...current].slice(0, MAX_RECENT);
        }
        const copy = [...current];
        copy[index] = {
          ...copy[index],
          type: next.type,
          difficulty: next.difficulty,
          exerciseIds: next.exerciseIds,
          minutes: next.minutes,
        };
        return copy;
      });
    },
    [],
  );

  const clear = useCallback(() => setEntries([]), []);

  return { entries, record, replace, clear };
}
