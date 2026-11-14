/**
 * Shared synthesised cues for timers and workout events.
 *
 * A single AudioContext is reused for every cue: browsers limit the number of
 * contexts and creating one per beep made rapid ticks unreliable. Every call
 * is wrapped in try/catch so audio failures never break the workout.
 */

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;

    if (!sharedContext || sharedContext.state === "closed") {
      sharedContext = new Ctor();
    }
    if (sharedContext.state === "suspended") {
      void sharedContext.resume().catch(() => {});
    }
    return sharedContext;
  } catch {
    return null;
  }
}

interface Tone {
  frequency: number;
  /** Offset from now, in seconds. */
  start: number;
  /** Total length, in seconds. */
  duration: number;
  /** Relative level inside the cue, 0–1. */
  level?: number;
  type?: OscillatorType;
}

function playTones(tones: Tone[], masterLevel: number): void {
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    tones.forEach((tone) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tone.type ?? "sine";
      osc.frequency.setValueAtTime(tone.frequency, now + tone.start);

      const peak = Math.max(
        0.0002,
        masterLevel * (tone.level ?? 1),
      );
      const startAt = now + tone.start;
      const endAt = startAt + tone.duration;

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

      osc.connect(gain).connect(ctx.destination);
      osc.start(startAt);
      osc.stop(endAt + 0.02);
    });
  } catch {
    // audio is unavailable — ignore
  }
}

/** Rising two-note cue when a workout starts. */
export function playStart(): void {
  playTones(
    [
      { frequency: 523.25, start: 0, duration: 0.14 },
      { frequency: 783.99, start: 0.14, duration: 0.2 },
    ],
    0.16,
  );
}

/** Short confirmation when one exercise is marked as done. */
export function playExerciseComplete(): void {
  playTones(
    [
      { frequency: 659.25, start: 0, duration: 0.1, level: 0.85 },
      { frequency: 880, start: 0.1, duration: 0.18 },
    ],
    0.16,
  );
}

/** Quiet countdown tick used by both timers. */
export function playTick(): void {
  playTones([{ frequency: 880, start: 0, duration: 0.05 }], 0.07);
}

/** Small fanfare when the whole workout is complete. */
export function playFinish(): void {
  playTones(
    [
      { frequency: 523.25, start: 0, duration: 0.13 },
      { frequency: 659.25, start: 0.13, duration: 0.13 },
      { frequency: 783.99, start: 0.26, duration: 0.13 },
      { frequency: 1046.5, start: 0.39, duration: 0.3 },
    ],
    0.18,
  );
}

/** Soft two-note cue when the rest timer reaches zero or is skipped. */
export function playRest(): void {
  playTones(
    [
      { frequency: 440, start: 0, duration: 0.18, type: "triangle" },
      { frequency: 329.63, start: 0.18, duration: 0.28, type: "triangle" },
    ],
    0.14,
  );
}

/** Backwards-compatible single beep (used by the exercise countdown). */
export function playBeep(): void {
  playTones([{ frequency: 880, start: 0, duration: 0.4 }], 0.18);
}
