import { CalendarCheck, Dumbbell, Flame, Timer, Trash2 } from "lucide-react";
import { useI18n } from "@/i18n";
import type { WorkoutStatsData } from "@/history";

interface WorkoutStatsProps {
  stats: WorkoutStatsData;
  onClear: () => void;
}

export function WorkoutStats({ stats, onClear }: WorkoutStatsProps) {
  const { t } = useI18n();
  if (stats.total === 0) return null;

  const tiles = [
    { icon: Flame, value: stats.streak, label: t.stats.streak },
    { icon: Dumbbell, value: stats.total, label: t.stats.workouts },
    { icon: Timer, value: stats.minutes, label: t.stats.minutes },
  ];

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-400/15 text-brand-300 ring-1 ring-brand-400/20">
            <CalendarCheck className="h-4 w-4" />
          </span>
          <p className="text-sm font-semibold text-slate-200">{t.stats.title}</p>
        </div>
        <button
          onClick={onClear}
          aria-label={t.stats.clear}
          title={t.stats.clear}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400 active:scale-95"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {tiles.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/5 bg-slate-950/50 px-2 py-3 text-center"
          >
            <Icon className="mx-auto h-4 w-4 text-brand-300" />
            <p className="mt-1.5 text-2xl font-black tabular-nums tracking-tight text-white">
              {value}
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
