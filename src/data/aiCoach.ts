import type { Exercise, Difficulty } from "@/data/exercises";
import type { Dict } from "@/i18n";

export type CoachModel =
  | "nvidia/nemotron-3.5-super-vl:free"
  | "dots-studio/dots-3-note-preview:free"
  | "nvidia/nemotron-3.5-lightning:free"
  | "nvidia/nemotron-3.5-content-safety:free";

export const COACH_MODELS: { value: CoachModel; label: string; provider: string }[] = [
  { value: "nvidia/nemotron-3.5-super-vl:free", label: "Nemotron 3.5 Super VL", provider: "NVIDIA" },
  { value: "dots-studio/dots-3-note-preview:free", label: "Dots3-Note Preview", provider: "Dots Studio" },
  { value: "nvidia/nemotron-3.5-lightning:free", label: "Nemotron 3.5 Lightning", provider: "NVIDIA" },
  { value: "nvidia/nemotron-3.5-content-safety:free", label: "Nemotron 3.5 Content Safety", provider: "NVIDIA" },
];

export interface CoachSettings {
  model: CoachModel;
  enabled: boolean;
  tone: "encouraging" | "strict" | "calm";
  focus: "technique" | "intensity" | "recovery";
  includeWarmup: boolean;
  includeMotivation: boolean;
}

export const DEFAULT_COACH_SETTINGS: CoachSettings = {
  model: "nvidia/nemotron-3.5-super-vl:free",
  enabled: true,
  tone: "encouraging",
  focus: "technique",
  includeWarmup: true,
  includeMotivation: true,
};

interface WorkoutStats {
  totalReps: number;
  totalTime: number;
  hasTimed: boolean;
  hasReps: boolean;
}

function analyze(workout: Exercise[]): WorkoutStats {
  let totalReps = 0;
  let totalTime = 0;
  for (const ex of workout) {
    if (ex.mode === "reps") totalReps += ex.reps ?? 0;
    else totalTime += ex.seconds ?? 0;
  }
  return {
    totalReps,
    totalTime,
    hasTimed: workout.some((e) => e.mode === "time"),
    hasReps: workout.some((e) => e.mode === "reps"),
  };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCoachPrompt(
  workout: Exercise[],
  difficulty: Difficulty,
  settings: CoachSettings = DEFAULT_COACH_SETTINGS,
  t: Dict,
): string {
  const stats = analyze(workout);
  const label = t.difficulty[difficulty];

  const parts: string[] = [];
  parts.push(t.coach.intro(label));
  parts.push(t.coach.toneIntro[settings.tone]);

  if (settings.includeWarmup) {
    parts.push(t.coach.warmup(pick(t.coach.warmups)));
  }

  const exerciseNames = workout.map((e) => t.exercises[e.id].name).join(", ");
  parts.push(t.coach.complex(exerciseNames));
  parts.push(t.coach.pacing[difficulty]);

  const tip =
    t.exercises[workout[0].id].cue ??
    t.exercises[workout[Math.floor(workout.length / 2)].id].cue;
  parts.push(t.coach.technique(tip));
  parts.push(t.coach.focusTip[settings.focus]);

  const totalLoad =
    stats.hasReps && stats.hasTimed
      ? t.coach.loadBoth(stats.totalReps, stats.totalTime)
      : stats.hasReps
        ? t.coach.loadReps(stats.totalReps)
        : t.coach.loadTime(stats.totalTime);
  parts.push(totalLoad);

  if (settings.includeMotivation) {
    parts.push(`\n🔥 ${pick(t.coach.motivation)}`);
  }

  return parts.join("\n");
}

export type CoachSectionId =
  | "plan"
  | "warmup"
  | "technique"
  | "load"
  | "motivation";

export interface CoachChip {
  label: string;
  value: string;
}

export interface CoachSection {
  id: CoachSectionId;
  body: string;
  /** Short supporting line shown under the body */
  note?: string;
  chips?: CoachChip[];
}

/**
 * Builds the compact, sectioned version of the coach guidance that the
 * redesigned panel renders. Same inputs as `generateCoachPrompt`, but split
 * into scannable blocks instead of one long message.
 */
export function generateCoachSections(
  workout: Exercise[],
  difficulty: Difficulty,
  settings: CoachSettings,
  t: Dict,
): CoachSection[] {
  const stats = analyze(workout);
  const sections: CoachSection[] = [];

  sections.push({
    id: "plan",
    body: t.coach.pacing[difficulty],
    chips: workout.map((ex) => ({
      label: t.exercises[ex.id].name,
      value:
        ex.mode === "time"
          ? `${ex.seconds ?? 0} ${t.sec}`
          : `${ex.reps ?? 0} ${t.reps}`,
    })),
  });

  if (settings.includeWarmup) {
    sections.push({
      id: "warmup",
      body: pick(t.coach.warmups),
    });
  }

  const tip =
    t.exercises[workout[0].id].cue ??
    t.exercises[workout[Math.floor(workout.length / 2)].id].cue;
  sections.push({
    id: "technique",
    body: tip,
    note: t.coach.focusTip[settings.focus],
  });

  const totalLoad =
    stats.hasReps && stats.hasTimed
      ? t.coach.loadBoth(stats.totalReps, stats.totalTime)
      : stats.hasReps
        ? t.coach.loadReps(stats.totalReps)
        : t.coach.loadTime(stats.totalTime);

  sections.push({
    id: "load",
    body: totalLoad.replace(/^\s*📊[^:]*:\s*/, ""),
  });

  if (settings.includeMotivation) {
    sections.push({
      id: "motivation",
      body: pick(t.coach.motivation),
    });
  }

  return sections;
}

export function estimateDuration(workout: Exercise[]): number {
  let seconds = 0;
  for (const ex of workout) {
    if (ex.mode === "time") seconds += ex.seconds ?? 0;
    else seconds += (ex.reps ?? 0) * 2.5;
  }
  return Math.max(1, Math.round(seconds / 60));
}
