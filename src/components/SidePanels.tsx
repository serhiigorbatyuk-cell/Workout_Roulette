import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  Bot,
  Dumbbell,
  Flame,
  Home,
  Play,
  Shuffle,
  SlidersHorizontal,
  Target,
  Timer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { WORKOUT_TYPES, type WorkoutType } from "@/data/exercises";
import { useI18n } from "@/i18n";

const FEATURE_ICONS = [Timer, Dumbbell, Home, Bot];
const STEP_ICONS = [SlidersHorizontal, Shuffle, Play];

const TYPE_ICONS: Record<WorkoutType, LucideIcon> = {
  fullBody: Dumbbell,
  upper: ArrowUp,
  lower: ArrowDown,
  core: Target,
  cardio: Flame,
  mobility: Wind,
};

function PanelShell({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Dumbbell;
  children: ReactNode;
}) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/70 to-slate-950/60 p-5 shadow-xl shadow-black/30 backdrop-blur">
        {/* accent glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/15 blur-2xl" />

        <div className="relative flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand2-600 text-slate-950 shadow-md shadow-brand-500/25">
            <Icon className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
        </div>

        <div className="relative mt-5">{children}</div>
      </div>
    </aside>
  );
}

function WorkoutTypeList({
  type,
  onSelect,
}: {
  type: WorkoutType;
  onSelect: (type: WorkoutType) => void;
}) {
  const { t } = useI18n();

  return (
    <ul className="space-y-2">
      {WORKOUT_TYPES.map((value) => {
        const Icon = TYPE_ICONS[value];
        const active = value === type;
        return (
          <li key={value}>
            <button
              onClick={() => onSelect(value)}
              aria-pressed={active}
              className={`group flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-all active:scale-[0.98] ${
                active
                  ? "border-brand-400/40 bg-brand-400/15 text-white shadow-lg shadow-brand-500/10"
                  : "border-white/5 bg-white/[0.02] text-slate-300 hover:border-white/15 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? "bg-brand-400/20 text-brand-300"
                    : "bg-white/5 text-slate-400 group-hover:text-brand-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
              <span className="text-xs font-semibold leading-tight">
                {t.workoutTypes[value]}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

interface LeftSidePanelProps {
  onPickLevel: () => void;
  onSpin: () => void;
  onShowWorkout: () => void;
}

export function LeftSidePanel({
  onPickLevel,
  onSpin,
  onShowWorkout,
}: LeftSidePanelProps) {
  const { t } = useI18n();
  const actions = [onPickLevel, onSpin, onShowWorkout];

  return (
    <PanelShell title={t.side.featuresTitle} icon={Dumbbell}>
      <ul className="space-y-4">
        {t.side.features.map((feature, index) => {
          const Icon = FEATURE_ICONS[index] ?? Timer;
          return (
            <li key={feature.title} className="group flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-brand-300 ring-1 ring-white/10 transition-colors group-hover:bg-brand-400/15 group-hover:ring-brand-400/30">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight text-white">
                  {feature.title}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-slate-400">
                  {feature.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="my-4 border-t border-white/10" />

      <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <Shuffle className="h-3 w-3" />
        {t.side.stepsTitle}
      </p>
      <ol className="relative space-y-1.5">
        {/* connector line */}
        <span className="pointer-events-none absolute left-3.5 top-3 bottom-3 w-px bg-gradient-to-b from-brand-400/40 via-brand-400/15 to-transparent" />

        {t.side.steps.map((step, index) => {
          const Icon = STEP_ICONS[index] ?? Play;
          return (
            <li key={step.title}>
              <button
                onClick={actions[index]}
                className="group relative flex w-full items-start gap-2.5 rounded-xl p-1 text-left transition-colors hover:bg-white/5 active:scale-[0.99]"
              >
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-brand-300 ring-1 ring-brand-400/30 transition-colors group-hover:bg-brand-400/15">
                  <Icon className="h-3 w-3" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold leading-tight text-white">
                    <span className="mr-1 text-brand-400">{index + 1}.</span>
                    {step.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-slate-400">
                    {step.desc}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </PanelShell>
  );
}

interface RightSidePanelProps {
  type: WorkoutType;
  onSelect: (type: WorkoutType) => void;
  onSpin: () => void;
}

export function RightSidePanel({ type, onSelect, onSpin }: RightSidePanelProps) {
  const { t } = useI18n();

  return (
    <PanelShell title={t.workoutTypeLabel} icon={Dumbbell}>
      <WorkoutTypeList type={type} onSelect={onSelect} />

      <button
        onClick={onSpin}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-brand-400/30 bg-brand-400/10 px-3 py-2.5 text-xs font-semibold text-brand-300 transition-all hover:bg-brand-400/20 hover:text-white active:scale-[0.98]"
      >
        <Shuffle className="h-3.5 w-3.5" />
        {t.quickStart}
      </button>
    </PanelShell>
  );
}
