import { useCallback, useEffect, useState } from "react";
import {
  DIFFICULTIES,
  isExerciseId,
  type Difficulty,
  type ExerciseId,
} from "@/data/exercises";

const FAVORITES_KEY = "workout-roulette-favorites";
const CUSTOM_KEY = "workout-roulette-custom-workouts";
const MAX_CUSTOM_WORKOUTS = 30;

export interface CustomWorkout {
  id: string;
  name: string;
  exerciseIds: ExerciseId[];
  difficulty: Difficulty;
  createdAt: number;
}

function createId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to the timestamp id
  }
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isDifficulty(value: unknown): value is Difficulty {
  return (
    typeof value === "string" &&
    DIFFICULTIES.includes(value as Difficulty)
  );
}

function uniqueIds(value: unknown): ExerciseId[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<ExerciseId>();
  const result: ExerciseId[] = [];
  value.forEach((item) => {
    if (isExerciseId(item) && !seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  });
  return result;
}

function loadFavorites(): ExerciseId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return uniqueIds(JSON.parse(raw));
  } catch {
    return [];
  }
}

function loadCustomWorkouts(): CustomWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is CustomWorkout => {
        if (!item || typeof item !== "object") return false;
        const entry = item as Partial<CustomWorkout>;
        return (
          typeof entry.id === "string" &&
          typeof entry.name === "string" &&
          entry.name.trim().length > 0 &&
          Array.isArray(entry.exerciseIds) &&
          entry.exerciseIds.length > 0 &&
          entry.exerciseIds.every(isExerciseId) &&
          isDifficulty(entry.difficulty) &&
          typeof entry.createdAt === "number"
        );
      })
      .slice(0, MAX_CUSTOM_WORKOUTS);
  } catch {
    return [];
  }
}

/** Saved exercises and custom workouts, both persisted in LocalStorage. */
export function useFavorites() {
  const [favorites, setFavorites] = useState<ExerciseId[]>(loadFavorites);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // storage may be unavailable — favorites work for this session only
    }
  }, [favorites]);

  const toggle = useCallback((id: ExerciseId) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }, []);

  const remove = useCallback((id: ExerciseId) => {
    setFavorites((current) => current.filter((item) => item !== id));
  }, []);

  const clear = useCallback(() => setFavorites([]), []);

  const has = useCallback(
    (id: ExerciseId) => favorites.includes(id),
    [favorites],
  );

  return { favorites, has, toggle, remove, clear };
}

export function useCustomWorkouts() {
  const [workouts, setWorkouts] = useState<CustomWorkout[]>(
    loadCustomWorkouts,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(workouts));
    } catch {
      // storage may be unavailable — custom workouts work for this session only
    }
  }, [workouts]);

  const save = useCallback(
    (name: string, exerciseIds: ExerciseId[], difficulty: Difficulty) => {
      const trimmed = name.trim();
      const ids = uniqueIds(exerciseIds);
      if (!trimmed || ids.length === 0) return;

      const entry: CustomWorkout = {
        id: createId(),
        name: trimmed,
        exerciseIds: ids,
        difficulty,
        createdAt: Date.now(),
      };
      setWorkouts((current) =>
        [entry, ...current].slice(0, MAX_CUSTOM_WORKOUTS),
      );
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setWorkouts((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setWorkouts([]), []);

  return { workouts, save, remove, clear };
}
