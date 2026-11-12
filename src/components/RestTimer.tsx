import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useI18n } from "@/i18n";
import { usePreferences } from "@/preferences";
import { playBeep } from "@/sound";

const PRESETS = [30, 45, 60];
const DEFAULT_DURATION = 45;

export function RestTimer() {
  const { t } = useI18n();
  const { prefs } = usePreferences();
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
    playBeep();
  }, [remaining, prefs.sound]);

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

  function reset() {
    setRemaining(duration);
    setRunning(false);
  }

  const progress =
    duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const isDone = remaining === 0;

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

      <div className="mt-2 flex items-center gap-2">
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

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={toggle}
            aria-label={running ? t.pause : t.start}
            title={running ? t.pause : t.start}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-400/10 text-brand-300 ring-1 ring-brand-400/30 transition-all hover:bg-brand-400/20 hover:scale-105 active:scale-95"
          >
            {isDone ? (
              <RotateCcw className="h-4 w-4" />
            ) : running ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={reset}
            aria-label={t.restReset}
            title={t.restReset}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
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
