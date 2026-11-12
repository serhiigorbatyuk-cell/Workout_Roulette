import { useEffect, useState } from "react";
import type { Exercise } from "@/data/exercises";
import { Check, Play, Pause, RefreshCw, RotateCcw } from "lucide-react";
import { useI18n } from "@/i18n";
import { usePreferences } from "@/preferences";
import { playBeep } from "@/sound";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  completed: boolean;
  onToggleComplete: () => void;
  onReroll: () => void;
}

export function ExerciseCard({
  exercise,
  index,
  completed,
  onToggleComplete,
  onReroll,
}: ExerciseCardProps) {
  const { t } = useI18n();
  const { prefs } = usePreferences();
  const text = t.exercises[exercise.id];
  const Icon = exercise.icon;
  const isTimeMode = exercise.mode === "time";
  const totalSeconds = exercise.seconds ?? 0;

  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    setRunning(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running || !isTimeMode) return;
    if (remaining <= 0) {
      setRunning(false);
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [running, isTimeMode, remaining]);

  // Beep once when the countdown reaches zero.
  useEffect(() => {
    if (!isTimeMode || totalSeconds === 0) return;
    if (remaining !== 0) return;
    if (!prefs.sound) return;
    playBeep();
  }, [remaining, isTimeMode, totalSeconds, prefs.sound]);

  function toggleTimer() {
    if (isDone) {
      setRemaining(totalSeconds);
      setRunning(true);
      return;
    }
    setRunning((value) => !value);
  }

  const progress = isTimeMode && totalSeconds > 0
    ? ((totalSeconds - remaining) / totalSeconds) * 100
    : 0;

  const isDone = isTimeMode && remaining === 0;

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 p-5 shadow-2xl transition-all duration-300 sm:p-6 ${
        completed
          ? "border-brand-400/50 shadow-brand-500/15"
          : "border-white/10 hover:border-brand-400/40 hover:shadow-brand-500/10"
      }`}
      style={{ animation: `cardIn 0.5s ease-out ${index * 0.12}s both` }}
    >
      {/* accent glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-500/15 blur-3xl transition-opacity duration-300 group-hover:bg-brand-500/25" />

      <div className="relative flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand2-600 text-slate-950 shadow-lg shadow-brand-500/30">
          <Icon className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-brand-300 ring-1 ring-brand-400/20">
            {t.exercise} {index + 1}
          </span>
          <button
            onClick={onReroll}
            aria-label={t.reroll}
            title={t.reroll}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-400 transition-all hover:border-brand-400/50 hover:text-brand-300 active:scale-90"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onToggleComplete}
            aria-pressed={completed}
            aria-label={completed ? t.markUndone : t.markDone}
            title={completed ? t.markUndone : t.markDone}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all active:scale-90 ${
              completed
                ? "border-brand-400 bg-brand-400 text-slate-950 shadow-lg shadow-brand-500/30"
                : "border-white/15 bg-white/5 text-slate-400 hover:border-brand-400/50 hover:text-brand-300"
            }`}
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <h3 className="relative mt-4 text-xl font-bold text-white sm:mt-5">{text.name}</h3>
      <p className="relative mt-1 text-sm leading-relaxed text-slate-400">{text.cue}</p>

      <div className="relative mt-4 flex items-center justify-between sm:mt-5">
        {isTimeMode ? (
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-black tabular-nums tracking-tight ${
                isDone ? "text-brand-400" : "text-white"
              }`}
            >
              {remaining.toString().padStart(2, "0")}
            </span>
            <span className="text-sm font-medium text-slate-500">{t.sec}</span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tabular-nums tracking-tight text-white">
              {exercise.reps}
            </span>
            <span className="text-sm font-medium text-slate-500">{t.reps}</span>
          </div>
        )}

        {isTimeMode && (
          <button
            onClick={toggleTimer}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-400/10 text-brand-300 ring-1 ring-brand-400/30 transition-all hover:bg-brand-400/20 hover:scale-105 active:scale-95"
            aria-label={running ? t.pause : t.start}
          >
            {isDone ? (
              <RotateCcw className="h-5 w-5" />
            ) : running ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {isTimeMode && (
        <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand2-400 transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
