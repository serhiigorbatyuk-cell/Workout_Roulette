import {
  Dumbbell,
  Heart,
  Activity,
  Flame,
  Zap,
  Wind,
  Footprints,
  PersonStanding,
  Armchair,
  Timer,
  type LucideIcon,
} from "lucide-react";

export type Difficulty = "beginner" | "intermediate" | "pro";

export type WorkoutType =
  | "fullBody"
  | "upper"
  | "lower"
  | "core"
  | "cardio"
  | "mobility";

export type ExerciseId =
  | "squats"
  | "plank"
  | "pushups"
  | "jumpingJacks"
  | "lunges"
  | "highKnees"
  | "crunches"
  | "gluteBridge"
  | "burpees"
  | "mountainClimbers"
  | "abPulses"
  | "jumpSquats"
  | "superman"
  | "climbers"
  | "tPushups";

export interface Exercise {
  /** Stable id used to look up the translated name and cue */
  id: ExerciseId;
  icon: LucideIcon;
  /** "reps" shows a rep count; "time" shows a countdown timer */
  mode: "reps" | "time";
  /** reps count when mode === "reps" */
  reps?: number;
  /** seconds when mode === "time" */
  seconds?: number;
}

interface DifficultyPreset {
  repsScale: number;
  timeScale: number;
  pool: ExerciseId[];
}

const ALL_IDS: ExerciseId[] = [
  "squats",
  "plank",
  "pushups",
  "jumpingJacks",
  "lunges",
  "highKnees",
  "crunches",
  "gluteBridge",
  "burpees",
  "mountainClimbers",
  "abPulses",
  "jumpSquats",
  "superman",
  "climbers",
  "tPushups",
];

const ALL_ID_SET = new Set<string>(ALL_IDS);

const ICONS: Record<ExerciseId, LucideIcon> = {
  squats: PersonStanding,
  plank: Activity,
  pushups: Armchair,
  jumpingJacks: Footprints,
  lunges: PersonStanding,
  highKnees: Heart,
  crunches: Flame,
  gluteBridge: Zap,
  burpees: Dumbbell,
  mountainClimbers: Wind,
  abPulses: Heart,
  jumpSquats: Zap,
  superman: Wind,
  climbers: Footprints,
  tPushups: Armchair,
};

const MODES: Record<ExerciseId, "reps" | "time"> = {
  squats: "reps",
  plank: "time",
  pushups: "reps",
  jumpingJacks: "time",
  lunges: "reps",
  highKnees: "time",
  crunches: "reps",
  gluteBridge: "time",
  burpees: "reps",
  mountainClimbers: "time",
  abPulses: "reps",
  jumpSquats: "reps",
  superman: "time",
  climbers: "time",
  tPushups: "reps",
};

const HARD_IDS: ExerciseId[] = ["burpees", "jumpSquats", "tPushups"];

/** Pools per workout type. Every pool keeps at least 3 exercises after
 *  beginner filtering, so a spin can always fill the 3-card workout. */
const TYPE_POOLS: Record<WorkoutType, ExerciseId[]> = {
  fullBody: ALL_IDS,
  upper: [
    "pushups",
    "tPushups",
    "superman",
    "plank",
    "mountainClimbers",
    "climbers",
  ],
  lower: ["squats", "lunges", "jumpSquats", "gluteBridge", "jumpingJacks", "highKnees"],
  core: ["plank", "crunches", "abPulses", "mountainClimbers", "superman", "climbers"],
  cardio: ["jumpingJacks", "highKnees", "burpees", "mountainClimbers", "climbers", "jumpSquats"],
  mobility: ["gluteBridge", "superman", "plank", "climbers", "lunges"],
};

const PRESETS: Record<Difficulty, DifficultyPreset> = {
  beginner: {
    repsScale: 10,
    timeScale: 20,
    pool: ALL_IDS.filter((id) => !HARD_IDS.includes(id)),
  },
  intermediate: {
    repsScale: 15,
    timeScale: 35,
    pool: ALL_IDS,
  },
  pro: {
    repsScale: 25,
    timeScale: 50,
    pool: ALL_IDS,
  },
};

function scaleReps(base: number, difficulty: Difficulty): number {
  const preset = PRESETS[difficulty];
  return Math.round((base * preset.repsScale) / 10);
}

const BASE_REPS: Partial<Record<ExerciseId, number>> = {
  squats: 12,
  pushups: 8,
  lunges: 10,
  crunches: 12,
  burpees: 8,
  jumpSquats: 10,
  tPushups: 8,
  abPulses: 14,
};

/** FNV-1a hash used to turn a text seed into a 32-bit integer. */
function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

/** Small deterministic PRNG (mulberry32) — same seed, same workout. */
function createRandom(seed?: string): () => number {
  if (!seed) return Math.random;
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const MIN_EXERCISES = 3;
export const MAX_EXERCISES = 5;
export const EXERCISE_COUNTS = [3, 4, 5] as const;
export type ExerciseCount = (typeof EXERCISE_COUNTS)[number];

/** Builds the exact pool a workout of this type/level may draw from. */
function buildPool(
  difficulty: Difficulty,
  type: WorkoutType,
  count: number,
): ExerciseId[] {
  const preset = PRESETS[difficulty];
  let pool = TYPE_POOLS[type].filter((id) => preset.pool.includes(id));

  // A type pool can be smaller than the requested count (e.g. beginner upper
  // body after hard exercises are filtered out) — top it up from the level.
  if (pool.length < count) {
    pool = [...pool, ...preset.pool.filter((id) => !pool.includes(id))];
  }

  return pool;
}

export function generateWorkout(
  difficulty: Difficulty,
  type: WorkoutType = "fullBody",
  count: number = MIN_EXERCISES,
  /** Optional seed: with a seed the result is fully deterministic. */
  seed?: string,
): Exercise[] {
  const pool = buildPool(difficulty, type, count);
  const wanted = Math.max(1, Math.min(count, pool.length));
  const random = createRandom(seed);
  const picked = shuffle(pool, random).slice(0, wanted);

  return picked.map((id) => createExercise(id, difficulty));
}

function workoutKey(workout: Exercise[]): string {
  return workout
    .map((exercise) => exercise.id)
    .sort()
    .join("|");
}

/**
 * Generates a workout that is not identical to the current one. It first tries
 * random spins (preferring a set with no shared exercises), then forces a swap
 * when the pool still has an unused exercise. If the pool is completely used,
 * only the order can change.
 */
export function generateDifferentWorkout(
  current: Exercise[],
  difficulty: Difficulty,
  type: WorkoutType = "fullBody",
  count: number = current.length,
): Exercise[] {
  if (current.length === 0 || current.length !== count) {
    return generateWorkout(difficulty, type, count);
  }

  const currentKey = workoutKey(current);
  const currentIds = new Set(current.map((exercise) => exercise.id));
  const pool = buildPool(difficulty, type, count);

  let best: Exercise[] | null = null;
  let bestOverlap = Infinity;

  for (let attempt = 0; attempt < 32; attempt += 1) {
    const next = generateWorkout(difficulty, type, count);
    if (next.length !== count) continue;

    const overlap = next.filter((exercise) =>
      currentIds.has(exercise.id),
    ).length;
    if (overlap === 0) return next;

    if (overlap < bestOverlap) {
      best = next;
      bestOverlap = overlap;
    }
  }

  if (best && workoutKey(best) !== currentKey) return best;

  // Force at least one new exercise from the same pool.
  const available = pool.filter((id) => !currentIds.has(id));
  if (available.length > 0) {
    const replacementId =
      available[Math.floor(Math.random() * available.length)];
    const index = Math.floor(Math.random() * current.length);
    return current.map((exercise, i) =>
      i === index ? createExercise(replacementId, difficulty) : exercise,
    );
  }

  // Every exercise of the pool is already used — only the order can change.
  return shuffle(current, Math.random);
}

function createExercise(id: ExerciseId, difficulty: Difficulty): Exercise {
  const mode = MODES[id];
  if (mode === "reps") {
    const baseReps = BASE_REPS[id] ?? 10;
    return { id, icon: ICONS[id], mode, reps: scaleReps(baseReps, difficulty) };
  }
  return {
    id,
    icon: ICONS[id],
    mode,
    seconds: PRESETS[difficulty].timeScale,
  };
}

export function isExerciseId(value: unknown): value is ExerciseId {
  return typeof value === "string" && ALL_ID_SET.has(value);
}

/** Rebuilds a workout from stored ids (used by the recent-history panel). */
export function buildWorkoutFromIds(
  ids: ExerciseId[],
  difficulty: Difficulty,
): Exercise[] {
  return ids.map((id) => createExercise(id, difficulty));
}

/**
 * Picks a single replacement exercise that is not already in the workout.
 * Used by the per-card "swap exercise" button.
 */
export function pickExercise(
  difficulty: Difficulty,
  type: WorkoutType = "fullBody",
  exclude: ExerciseId[] = [],
  seed?: string,
): Exercise | null {
  const preset = PRESETS[difficulty];
  let pool = TYPE_POOLS[type].filter(
    (id) => preset.pool.includes(id) && !exclude.includes(id),
  );

  // If the whole type pool is already used, fall back to the level pool so a
  // swap is still possible (a workout never has more than 5 exercises).
  if (pool.length === 0) {
    pool = preset.pool.filter((id) => !exclude.includes(id));
  }
  if (pool.length === 0) return null;

  const random = createRandom(seed);
  const id = pool[Math.floor(random() * pool.length)];
  return createExercise(id, difficulty);
}

export const DIFFICULTIES: Difficulty[] = ["beginner", "intermediate", "pro"];
export const WORKOUT_TYPES: WorkoutType[] = [
  "fullBody",
  "upper",
  "lower",
  "core",
  "cardio",
  "mobility",
];

export const TIMER_ICON = Timer;
