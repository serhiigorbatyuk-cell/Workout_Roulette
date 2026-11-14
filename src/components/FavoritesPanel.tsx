import { Heart, Play, Trash2, X } from "lucide-react";
import { getExerciseIcon, type ExerciseId } from "@/data/exercises";
import { useI18n } from "@/i18n";
import { useFeatureText } from "@/featuresI18n";

interface FavoritesPanelProps {
  favorites: ExerciseId[];
  onRemove: (id: ExerciseId) => void;
  onClear: () => void;
  onStart: () => void;
}

export function FavoritesPanel({
  favorites,
  onRemove,
  onClear,
  onStart,
}: FavoritesPanelProps) {
  const { t } = useI18n();
  const f = useFeatureText();

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/20">
            <Heart className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-200">
              {f.favorites.title}
              {favorites.length > 0 && (
                <span className="ml-1.5 text-brand-300">
                  {favorites.length}
                </span>
              )}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {f.favorites.subtitle}
            </p>
          </div>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={onClear}
            aria-label={f.favorites.clear}
            title={f.favorites.clear}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400 active:scale-95"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 px-4 py-4 text-center text-xs text-slate-500">
          {f.favorites.empty}
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {favorites.map((id) => {
              const Icon = getExerciseIcon(id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-950/50 py-1.5 pl-2 pr-1 transition-colors hover:border-brand-400/30"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-400/10 text-brand-300">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[11px] font-medium text-slate-300">
                    {t.exercises[id].name}
                  </span>
                  <button
                    onClick={() => onRemove(id)}
                    aria-label={f.favorites.remove}
                    title={f.favorites.remove}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400 active:scale-90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={onStart}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-400/30 bg-brand-400/10 px-5 py-3 text-sm font-semibold text-brand-300 transition-all hover:bg-brand-400/20 active:scale-[0.99]"
          >
            <Play className="h-4 w-4" />
            {f.favorites.start}
          </button>
        </>
      )}
    </section>
  );
}
