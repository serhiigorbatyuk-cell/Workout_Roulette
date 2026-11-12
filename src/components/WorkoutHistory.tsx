import { useState } from "react";
import {
  ChevronDown,
  Dumbbell,
  History,
  Play,
  Timer,
  Trash2,
} from "lucide-react";
import { buildWorkoutFromIds } from "@/data/exercises";
import { useI18n, type Lang } from "@/i18n";
import type { RecentWorkout } from "@/history";

interface WorkoutHistoryProps {
  entries: RecentWorkout[];
  onLoad: (entry: RecentWorkout) => void;
  onClear: () => void;
}

const LOCALES: Record<Lang, string> = {
  uk: "uk-UA",
  en: "en-GB",
  pl: "pl-PL",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
};

function formatDate(timestamp: number, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(LOCALES[lang], {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

export function WorkoutHistory({
  entries,
  onLoad,
  onClear,
}: WorkoutHistoryProps) {
  const { t, lang } = useI18n();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (entries.length === 0) return null;

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-400/15 text-brand-300 ring-1 ring-brand-400/20">
            <History className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-200">
              {t.history.title}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {t.history.subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          aria-label={t.history.clear}
          title={t.history.clear}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400 active:scale-95"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto pr-1">
        {entries.map((entry) => {
          const expanded = expandedId === entry.id;
          const exercises = expanded
            ? buildWorkoutFromIds(entry.exerciseIds, entry.difficulty)
            : [];

          return (
            <li
              key={entry.id}
              className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50"
            >
              <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-200">
                    {t.workoutTypes[entry.type]} ·{" "}
                    {t.difficulty[entry.difficulty]}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
                    <span>{formatDate(entry.timestamp, lang)}</span>
                    <span
                      className="flex items-center gap-1"
                      title={t.history.exercises}
                    >
                      <Dumbbell className="h-3 w-3" />
                      {entry.exerciseIds.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {t.minutes(entry.minutes)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onLoad(entry)}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-brand-400/25 bg-brand-400/10 px-2.5 py-1.5 text-[11px] font-semibold text-brand-300 transition-all hover:bg-brand-400/20 active:scale-95"
                >
                  <Play className="h-3 w-3" />
                  {t.history.load}
                </button>
                <button
                  onClick={() =>
                    setExpandedId(expanded ? null : entry.id)
                  }
                  aria-expanded={expanded}
                  aria-label={
                    expanded ? t.history.hideDetails : t.history.showDetails
                  }
                  title={
                    expanded ? t.history.hideDetails : t.history.showDetails
                  }
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {expanded && (
                <ol className="space-y-1.5 border-t border-white/5 px-3 py-2.5">
                  {exercises.map((exercise, index) => (
                    <li
                      key={`${exercise.id}-${index}`}
                      className="flex items-center justify-between gap-3 text-[11px]"
                    >
                      <span className="min-w-0 truncate text-slate-300">
                        <span className="mr-1.5 tabular-nums text-slate-600">
                          {index + 1}.
                        </span>
                        {t.exercises[exercise.id].name}
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums text-brand-300">
                        {exercise.mode === "time"
                          ? `${exercise.seconds ?? 0} ${t.sec}`
                          : `${exercise.reps ?? 0} ${t.reps}`}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
