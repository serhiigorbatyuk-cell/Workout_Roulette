import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, Info, X } from "lucide-react";
import { getExerciseIcon, type ExerciseId } from "@/data/exercises";
import { EXERCISE_STEPS } from "@/data/exerciseSteps";
import { useI18n } from "@/i18n";
import { useFeatureText } from "@/featuresI18n";

interface ExerciseDemoProps {
  exerciseId: ExerciseId | null;
  onClose: () => void;
}

export function ExerciseDemo({ exerciseId, onClose }: ExerciseDemoProps) {
  const { t, lang } = useI18n();
  const f = useFeatureText();

  useEffect(() => {
    if (!exerciseId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [exerciseId, onClose]);

  if (!exerciseId) return null;

  const Icon = getExerciseIcon(exerciseId);
  const text = t.exercises[exerciseId];
  const demo = EXERCISE_STEPS[lang][exerciseId];

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${f.demo.title}: ${text.name}`}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-slate-900 shadow-2xl sm:max-h-[88vh] sm:rounded-3xl"
        style={{ animation: "sheetUp 0.28s ease-out" }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/5 px-5 pb-3 pt-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-300/80">
              {f.demo.title}
            </p>
            <h2 className="mt-0.5 truncate text-lg font-bold text-white">
              {text.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={f.demo.close}
            title={f.demo.close}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
          <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-400/15 via-slate-900 to-brand2-600/15">
            <span className="absolute h-28 w-28 rounded-full border border-brand-400/20 demo-ring" />
            <span
              className="absolute h-36 w-36 rounded-full border border-brand2-400/15 demo-ring"
              style={{ animationDelay: "0.4s" }}
            />
            <span className="absolute h-24 w-24 rounded-full bg-brand-400/15 blur-2xl" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-brand2-600 text-slate-950 shadow-xl shadow-brand-500/30 demo-float">
              <Icon className="h-10 w-10" strokeWidth={2.2} />
            </span>
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {f.demo.stepsTitle}
          </p>

          <ol className="mt-2 space-y-2">
            {demo.steps.map((step, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-slate-950/50 px-3 py-2.5"
                style={{
                  animation: `stepIn 0.35s ease-out ${index * 0.08 + 0.05}s both`,
                }}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-400/15 text-[10px] font-bold text-brand-300 ring-1 ring-brand-400/25">
                  {index + 1}
                </span>
                <span className="text-xs leading-relaxed text-slate-300">
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-3 flex items-start gap-2 rounded-xl border border-brand-400/20 bg-brand-400/5 px-3 py-2.5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300" />
            <p className="text-[11px] leading-relaxed text-brand-200/90">
              {text.cue}
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 px-5 py-3">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-brand-300 active:scale-[0.98]"
          >
            <Check className="h-4 w-4" strokeWidth={3} />
            {f.demo.done}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
