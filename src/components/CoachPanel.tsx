import { useState } from "react";
import {
  Bot,
  Copy,
  Check,
  Clock,
  ChevronDown,
  Target,
  Leaf,
  Lightbulb,
  BarChart3,
  Flame,
  type LucideIcon,
} from "lucide-react";
import type { CoachSection, CoachSectionId } from "@/data/aiCoach";
import { useI18n } from "@/i18n";

const SECTION_ICONS: Record<CoachSectionId, LucideIcon> = {
  plan: Target,
  warmup: Leaf,
  technique: Lightbulb,
  load: BarChart3,
  motivation: Flame,
};

interface CoachPanelProps {
  prompt: string;
  sections: CoachSection[];
  durationMinutes: number;
  modelName: string;
}

export function CoachPanel({
  prompt,
  sections,
  durationMinutes,
  modelName,
}: CoachPanelProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);

  function copy() {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div
      className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/95 shadow-xl"
      style={{ animation: "cardIn 0.5s ease-out 0.35s both" }}
    >
      {/* soft accent glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-brand2-500/10 blur-3xl" />

      {/* header */}
      <div className="relative flex items-center justify-between gap-3 border-b border-white/5 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand2-600 text-slate-950 shadow-lg shadow-brand-500/20">
            <Bot className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {t.coachTitle}
            </p>
            <p className="truncate text-xs text-slate-500">{modelName}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-brand-400/10 px-3 py-1.5 text-xs font-medium text-brand-300 ring-1 ring-brand-400/20">
            <Clock className="h-3.5 w-3.5" />
            {t.minutes(durationMinutes)}
          </div>
          <button
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? t.coach.collapse : t.coach.expand}
            title={open ? t.coach.collapse : t.coach.expand}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-90"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* body */}
      {open && (
        <div className="relative space-y-2.5 px-4 py-4 sm:px-5">
          {sections.map((section) => {
            const Icon = SECTION_ICONS[section.id];
            return (
              <div
                key={section.id}
                className="rounded-2xl border border-white/5 bg-white/[0.025] p-3 sm:p-3.5"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-400/10 text-brand-300 ring-1 ring-brand-400/15">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {t.coach.sectionTitles[section.id]}
                  </p>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {section.body}
                </p>

                {section.note && (
                  <p className="mt-1.5 text-xs leading-relaxed text-brand-300/90">
                    {section.note}
                  </p>
                )}

                {section.chips && section.chips.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {section.chips.map((chip, i) => (
                      <span
                        key={`${chip.label}-${i}`}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-800/70 px-2.5 py-1 text-[11px] ring-1 ring-white/5"
                      >
                        <span className="text-slate-300">{chip.label}</span>
                        <span className="font-semibold text-brand-300">
                          {chip.value}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* footer */}
      <div className="relative flex items-center justify-between gap-3 border-t border-white/5 px-4 py-3 sm:px-5">
        <p className="hidden text-[11px] text-slate-600 sm:block">
          {t.coachSubtitle}
        </p>
        <button
          onClick={copy}
          className="ml-auto flex min-h-10 items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white active:scale-95"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-brand-400" />
              {t.copied}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t.copyPrompt}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
