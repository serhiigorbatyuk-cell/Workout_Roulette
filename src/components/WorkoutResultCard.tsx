import { useState } from "react";
import {
  Check,
  Copy,
  RotateCcw,
  Share2,
  Trophy,
  X,
} from "lucide-react";
import type { Difficulty, Exercise, WorkoutType } from "@/data/exercises";
import { useI18n } from "@/i18n";
import { useFeatureText } from "@/featuresI18n";
import { copyText } from "@/clipboard";

interface WorkoutResultCardProps {
  workout: Exercise[];
  difficulty: Difficulty;
  workoutType: WorkoutType;
  minutes: number;
  onClose: () => void;
  onAgain: () => void;
}

export function WorkoutResultCard({
  workout,
  difficulty,
  workoutType,
  minutes,
  onClose,
  onAgain,
}: WorkoutResultCardProps) {
  const { t } = useI18n();
  const f = useFeatureText();
  const [copied, setCopied] = useState(false);

  function buildText(): string {
    return [
      `Workout Roulette · ${t.workoutTypes[workoutType]}`,
      `${t.level}: ${t.difficulty[difficulty]}`,
      `${f.result.exercises}: ${workout.length}`,
      `${f.result.duration}: ${t.minutes(minutes)}`,
      "",
      ...workout.map(
        (exercise, index) => `${index + 1}. ${t.exercises[exercise.id].name}`,
      ),
      "",
      window.location.href,
    ].join("\n");
  }

  async function copyResult(): Promise<boolean> {
    const copied = await copyText(buildText());
    if (copied) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
    return copied;
  }

  async function handleShare() {
    const text = buildText();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Workout Roulette", text });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }
    await copyResult();
  }

  return (
    <div
      className="relative mb-5 overflow-hidden rounded-3xl border border-brand-400/30 bg-gradient-to-br from-brand-400/15 via-slate-900/90 to-brand2-600/15 p-5 shadow-2xl shadow-brand-500/10 sm:p-6"
      style={{ animation: "resultIn 0.5s ease-out both" }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-brand2-500/15 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand2-600 text-slate-950 shadow-lg shadow-brand-500/30">
            <Trophy className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="min-w-0">
            <p className="text-base font-bold text-white">{f.result.title}</p>
            <p className="text-[11px] text-slate-400">{f.result.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label={f.result.close}
          title={f.result.close}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-white/20 hover:text-white active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mt-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2.5">
          <p className="text-2xl font-black tabular-nums text-brand-300">
            {workout.length}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {f.result.exercises}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2.5">
          <p className="text-2xl font-black tabular-nums text-brand-300">
            {t.minutes(minutes)}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {f.result.duration}
          </p>
        </div>
      </div>

      <div className="relative mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => void handleShare()}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-400 px-3 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-brand-300 active:scale-[0.98]"
        >
          <Share2 className="h-4 w-4" />
          {f.result.share}
        </button>
        <button
          onClick={() => void copyResult()}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all active:scale-[0.98] ${
            copied
              ? "border-brand-400/40 bg-brand-400/15 text-brand-300"
              : "border-white/10 bg-white/5 text-slate-200 hover:border-brand-400/30 hover:text-brand-300"
          }`}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? f.result.copied : f.result.copy}
        </button>
        <button
          onClick={onAgain}
          aria-label={f.result.again}
          title={f.result.again}
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-brand-400/30 hover:text-brand-300 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
