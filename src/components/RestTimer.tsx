import { useEffect, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Timer,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { usePreferences } from "@/preferences";
import { useFeatureText } from "@/featuresI18n";
import { playRest, playTick } from "@/sound";

const PRESETS = [30, 45, 60];
const DEFAULT_DURATION = 45;

export function RestTimer() {
  const { t } = useI18n();
  const { prefs } = usePreferences();
  const f = useFeatureText();
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [remaining, setRemaining] = useState(DEFAULT_DURATION);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      return;
    }
    const id = setInterval(
      () => setRemaining((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [running, remaining]);

  // Cue once when the countdown reaches zero.
  useEffect(() => {
    if (remaining !== 0 || !prefs.sound) return;
    playRest();
  }, [remaining, prefs.sound]);

  // Quiet tick for the final three seconds.
  useEffect(() => {
    if (!running || !prefs.sound) return;
    if (remaining > 0 && remaining <= 3) playTick();
  }, [remaining, running, prefs.sound]);

  function selectPreset(seconds: number) {
    setDuration(seconds);
    setRemaining(seconds);
    setRunning(false);
  }

  function toggle() {
    if (remaining === 0) {
      setRemaining(duration);
      setRunning(true);
      return;
    }
    setRunning((value) => !value);
  }

  function skip() {
    setRunning(false);
    setRemaining(0);
  }

  function reset() {
    setRemaining(duration);
    setRunning(false);
  }

  const progress =
    duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const isDone = remaining === 0;
  const mainLabel = running ? f.rest.pause : isDone ? t.start : f.rest.resume;

  return (
    <div
      className={`rounded-2xl border bg-slate-900/60 px-4 py-3 backdrop-blur transition-colors ${
        isDone ? "border-brand-400/40" : "border-white/10"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Timer className="h-4 w-4 text-brand-300" />
          {t.restTitle}
        </div>
        <div className="flex items-center gap-1">
          {PRESETS.map((seconds) => {
            const active = seconds === duration;
            return (
              <button
                key={seconds}
                onClick={() => selectPreset(seconds)}
                aria-pressed={active}
                aria-label={`${seconds} ${t.sec}`}
                className={`rounded-lg px-2 py-1 text-[10px] font-bold tabular-nums transition-all active:scale-95 ${
                  active
                    ? "bg-brand-400/20 text-brand-300 ring-1 ring-brand-400/30"
                    : "text-slate-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                {seconds}s
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span
          className={`text-2xl font-black tabular-nums tracking-tight ${
            isDone ? "text-brand-400" : "text-white"
          }`}
        >
          {remaining.toString().padStart(2, "0")}
        </span>
        <span className="text-xs font-medium text-slate-500">{t.sec}</span>
        {isDone && (
          <span className="text-xs font-semibold text-brand-300">
            {t.restDone}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <button
          onClick={toggle}
          aria-label={mainLabel}
          title={mainLabel}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-brand-400/25 bg-brand-400/10 px-2 py-1.5 text-[10px] font-bold text-brand-300 transition-all hover:bg-brand-400/20 active:scale-95"
        >
          {isDone ? (
            <RotateCcw className="h-3.5 w-3.5" />
          ) : running ? (
            <Pause className="h-3.5 w-3.5" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
          {mainLabel}
        </button>
        <button
          onClick={skip}
          disabled={isDone}
          aria-label={f.rest.skip}
          title={f.rest.skip}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-semibold text-slate-300 transition-all hover:border-brand-400/30 hover:text-brand-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SkipForward className="h-3.5 w-3.5" />
          {f.rest.skip}
        </button>
        <button
          onClick={reset}
          aria-label={t.restReset}
          title={t.restReset}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isDone
              ? "bg-brand-400"
              : "bg-gradient-to-r from-brand-400 to-brand2-400"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
