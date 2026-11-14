import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Play,
  Plus,
  Save,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import {
  ALL_EXERCISE_IDS,
  DIFFICULTIES,
  getExerciseIcon,
  type Difficulty,
  type ExerciseId,
} from "@/data/exercises";
import type { CustomWorkout } from "@/library";
import { useI18n } from "@/i18n";
import { useFeatureText } from "@/featuresI18n";

interface WorkoutBuilderProps {
  open: boolean;
  initialDifficulty: Difficulty | "";
  customWorkouts: CustomWorkout[];
  onClose: () => void;
  onStart: (ids: ExerciseId[], difficulty: Difficulty) => void;
  onSaveWorkout: (
    name: string,
    ids: ExerciseId[],
    difficulty: Difficulty,
  ) => void;
  onDeleteWorkout: (id: string) => void;
}

export function WorkoutBuilder({
  open,
  initialDifficulty,
  customWorkouts,
  onClose,
  onStart,
  onSaveWorkout,
  onDeleteWorkout,
}: WorkoutBuilderProps) {
  const { t } = useI18n();
  const f = useFeatureText();

  const [selected, setSelected] = useState<ExerciseId[]>([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Difficulty>(
    initialDifficulty || "intermediate",
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLevel(initialDifficulty || "intermediate");
    setError(null);
    setSaved(false);
  }, [open, initialDifficulty]);

  useEffect(() => {
    if (!open) return;

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
  }, [open, onClose]);

  if (!open) return null;

  const available = ALL_EXERCISE_IDS.filter((id) => !selected.includes(id));

  function addExercise(id: ExerciseId) {
    setError(null);
    setSelected((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  function removeExercise(id: ExerciseId) {
    setSelected((current) => current.filter((item) => item !== id));
  }

  function moveExercise(index: number, delta: number) {
    setSelected((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleStart() {
    if (selected.length === 0) {
      setError(f.builder.minOne);
      return;
    }
    setError(null);
    onStart(selected, level);
  }

  function handleSave() {
    if (!name.trim()) {
      setError(f.builder.nameRequired);
      return;
    }
    if (selected.length === 0) {
      setError(f.builder.minOne);
      return;
    }
    onSaveWorkout(name, selected, level);
    setName("");
    setError(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center bg-slate-950/75 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={f.builder.title}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-slate-900 shadow-2xl sm:max-h-[88vh] sm:rounded-3xl"
        style={{ animation: "sheetUp 0.28s ease-out" }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/5 px-4 pb-3 pt-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand2-600 text-slate-950 shadow-lg shadow-brand-500/25">
              <Wand2 className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-white">
                {f.builder.title}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {f.builder.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={f.builder.close}
            title={f.builder.close}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {t.difficultyLabel}
            </p>
            <div className="mt-1.5 flex gap-1.5">
              {DIFFICULTIES.map((value) => {
                const active = value === level;
                return (
                  <button
                    key={value}
                    onClick={() => setLevel(value)}
                    aria-pressed={active}
                    className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-all active:scale-[0.98] ${
                      active
                        ? "border-brand-400/40 bg-brand-400/15 text-brand-300"
                        : "border-white/10 bg-slate-950/40 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {t.difficulty[value]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {f.builder.addHint}
              </p>
              {available.length === 0 ? (
                <p className="mt-2 rounded-xl border border-dashed border-white/10 bg-slate-950/40 px-3 py-4 text-center text-[11px] text-slate-500">
                  {f.builder.allAdded}
                </p>
              ) : (
                <div className="mt-2 grid max-h-52 grid-cols-2 gap-1.5 overflow-y-auto pr-0.5 sm:max-h-64">
                  {available.map((id) => {
                    const Icon = getExerciseIcon(id);
                    return (
                      <button
                        key={id}
                        onClick={() => addExercise(id)}
                        className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-slate-950/50 px-2 py-1.5 text-left transition-all hover:border-brand-400/30 hover:bg-brand-400/5 active:scale-[0.98]"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-400/10 text-brand-300">
                          <Icon className="h-3 w-3" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11px] text-slate-300">
                          {t.exercises[id].name}
                        </span>
                        <Plus className="h-3 w-3 shrink-0 text-brand-300" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <p className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                <span>{f.builder.selected}</span>
                <span className="tabular-nums text-brand-300">
                  {selected.length}
                </span>
              </p>
              {selected.length === 0 ? (
                <p className="mt-2 rounded-xl border border-dashed border-white/10 bg-slate-950/40 px-3 py-4 text-center text-[11px] text-slate-500">
                  {f.builder.empty}
                </p>
              ) : (
                <ol className="mt-2 max-h-52 space-y-1.5 overflow-y-auto pr-0.5 sm:max-h-64">
                  {selected.map((id, index) => {
                    const Icon = getExerciseIcon(id);
                    return (
                      <li
                        key={id}
                        className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-slate-950/50 py-1.5 pl-1.5 pr-1"
                      >
                        <span className="w-3 shrink-0 text-center text-[10px] tabular-nums text-slate-600">
                          {index + 1}
                        </span>
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-400/10 text-brand-300">
                          <Icon className="h-3 w-3" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11px] text-slate-300">
                          {t.exercises[id].name}
                        </span>
                        <button
                          onClick={() => moveExercise(index, -1)}
                          disabled={index === 0}
                          aria-label={f.builder.moveUp}
                          title={f.builder.moveUp}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/5 hover:text-brand-300 active:scale-90 disabled:opacity-25"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => moveExercise(index, 1)}
                          disabled={index === selected.length - 1}
                          aria-label={f.builder.moveDown}
                          title={f.builder.moveDown}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/5 hover:text-brand-300 active:scale-90 disabled:opacity-25"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeExercise(id)}
                          aria-label={f.builder.remove}
                          title={f.builder.remove}
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400 active:scale-90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/5 bg-slate-950/40 p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError(null);
                }}
                placeholder={f.builder.savePlaceholder}
                aria-label={f.builder.savePlaceholder}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-white outline-none placeholder:text-slate-600 focus:border-brand-400/50"
              />
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-brand-400/30 bg-brand-400/10 px-4 py-2 text-xs font-bold text-brand-300 transition-all hover:bg-brand-400/20 active:scale-[0.98]"
              >
                <Save className="h-3.5 w-3.5" />
                {f.builder.save}
              </button>
            </div>
            {error && (
              <p className="mt-1.5 text-[10px] text-red-300">{error}</p>
            )}
            {saved && (
              <p className="mt-1.5 flex items-center gap-1 text-[10px] text-brand-300">
                <Check className="h-3 w-3" />
                {f.builder.savedToast}
              </p>
            )}
          </div>

          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {f.builder.savedTitle}
            </p>
            {customWorkouts.length === 0 ? (
              <p className="mt-1.5 text-[11px] text-slate-600">
                {f.builder.savedEmpty}
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {customWorkouts.map((workout) => (
                  <li
                    key={workout.id}
                    className="flex items-center gap-2 rounded-xl border border-white/5 bg-slate-950/50 px-2.5 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-200">
                        {workout.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {workout.exerciseIds.length} ·{" "}
                        {t.difficulty[workout.difficulty]}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        onStart(workout.exerciseIds, workout.difficulty)
                      }
                      aria-label={f.builder.start}
                      title={f.builder.start}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-400/25 bg-brand-400/10 text-brand-300 transition-all hover:bg-brand-400/20 active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteWorkout(workout.id)}
                      aria-label={f.builder.delete}
                      title={f.builder.delete}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400 active:scale-95"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 px-4 py-3 sm:px-5">
          <button
            onClick={handleStart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-400 to-brand2-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-brand-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Play className="h-4 w-4" />
            {f.builder.start}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
