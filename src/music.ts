import { useEffect, useRef } from "react";
import type { MusicStyle } from "@/preferences";

function clampVolume(volume: number): number {
  if (!Number.isFinite(volume)) return 0.6;
  return Math.min(1, Math.max(0, volume));
}

function masterLevel(volume: number): number {
  return Math.max(0.0001, 0.16 * clampVolume(volume));
}

interface StyleConfig {
  /** Beats per minute of the generated loop */
  bpm: number;
  /** Bass root notes in Hz, one per bar */
  bass: number[];
  /** Step indices (eighth notes) that trigger a kick */
  kick: number[];
  /** Step indices that trigger a hi-hat */
  hat: number[];
  /** Light chord layer on bar starts */
  pad: boolean;
}

const STYLE_CONFIG: Record<MusicStyle, StyleConfig> = {
  focus: {
    bpm: 84,
    bass: [55, 55, 65.41, 73.42],
    kick: [0, 8, 11],
    hat: [2, 6, 10, 14],
    pad: true,
  },
  energy: {
    bpm: 118,
    bass: [55, 65.41, 73.42, 82.41],
    kick: [0, 4, 8, 12],
    hat: [2, 6, 10, 14],
    pad: false,
  },
  calm: {
    bpm: 62,
    bass: [55, 65.41, 73.42, 65.41],
    kick: [0],
    hat: [4, 12],
    pad: true,
  },
  pulse: {
    bpm: 104,
    bass: [55, 61.74, 69.3, 73.42],
    kick: [0, 6, 8, 14],
    hat: [2, 5, 10, 13],
    pad: false,
  },
  night: {
    bpm: 70,
    bass: [43.65, 49, 55, 49],
    kick: [0, 10],
    hat: [6, 14],
    pad: true,
  },
};

/**
 * Tiny procedural workout soundtrack. It is synthesised with the Web Audio
 * API, so it needs no audio files and can be toggled instantly.
 */
export function useWorkoutMusic(
  enabled: boolean,
  style: MusicStyle,
  volume = 0.6,
) {
  const masterRef = useRef<GainNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = clampVolume(volume);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;

    let ctx: AudioContext;
    try {
      ctx = new Ctor();
    } catch {
      return;
    }

    const config = STYLE_CONFIG[style];
    const master = ctx.createGain();
    masterRef.current = master;
    ctxRef.current = ctx;
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(
      masterLevel(volumeRef.current),
      ctx.currentTime + 0.9,
    );
    master.connect(ctx.destination);

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noise.length; i += 1) {
      noise[i] = Math.random() * 2 - 1;
    }

    function kick(time: number) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(135, time);
      osc.frequency.exponentialRampToValueAtTime(44, time + 0.18);
      gain.gain.setValueAtTime(0.55, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
      osc.connect(gain).connect(master);
      osc.start(time);
      osc.stop(time + 0.24);
    }

    function hat(time: number) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 7000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      src.connect(filter).connect(gain).connect(master);
      src.start(time);
      src.stop(time + 0.06);
    }

    function bass(time: number, freq: number) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.value = freq;
      filter.type = "lowpass";
      filter.frequency.value = 420;
      const beat = 60 / config.bpm;
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(0.32, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + beat * 1.6);
      osc.connect(filter).connect(gain).connect(master);
      osc.start(time);
      osc.stop(time + beat * 1.7);
    }

    function pad(time: number, freq: number) {
      for (const ratio of [2, 3]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq * ratio;
        const beat = 60 / config.bpm;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.035, time + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, time + beat * 3.2);
        osc.connect(gain).connect(master);
        osc.start(time);
        osc.stop(time + beat * 3.3);
      }
    }

    const stepDuration = 60 / config.bpm / 2;
    let step = 0;
    let nextTime = ctx.currentTime + 0.08;

    function schedule() {
      while (nextTime < ctx.currentTime + 0.25) {
        const bar = Math.floor(step / 8) % config.bass.length;
        const root = config.bass[bar];
        if (config.kick.includes(step)) kick(nextTime);
        if (config.hat.includes(step)) hat(nextTime);
        if (step % 8 === 0) {
          bass(nextTime, root);
          if (config.pad) pad(nextTime, root);
        }
        nextTime += stepDuration;
        step = (step + 1) % 16;
      }
    }

    schedule();
    const timer = window.setInterval(schedule, 80);

    const resume = () => {
      if (ctx.state === "suspended") void ctx.resume();
    };
    window.addEventListener("pointerdown", resume);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pointerdown", resume);
      masterRef.current = null;
      ctxRef.current = null;
      try {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      } catch {
        // ignore
      }
      window.setTimeout(() => {
        void ctx.close().catch(() => {});
      }, 320);
    };
  }, [enabled, style]);

  useEffect(() => {
    const master = masterRef.current;
    const ctx = ctxRef.current;
    if (!master || !ctx) return;

    try {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(
        masterLevel(volume),
        ctx.currentTime,
        0.12,
      );
    } catch {
      // the context may already be closing
    }
  }, [volume]);
}

/**
 * Plays a user-uploaded track on loop. The object URL comes from
 * `useCustomTrack`; when it disappears the audio element is torn down.
 */
export function useCustomMusic(
  enabled: boolean,
  url: string | null,
  volume = 0.6,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!enabled || !url || typeof window === "undefined") return;

    const audio = new Audio(url);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = clampVolume(volume);
    audioRef.current = audio;

    const play = () => {
      const promise = audio.play();
      if (promise) void promise.catch(() => {});
    };

    play();
    // Browsers may block the first autoplay until the user interacts.
    window.addEventListener("pointerdown", play);
    window.addEventListener("keydown", play);

    return () => {
      window.removeEventListener("pointerdown", play);
      window.removeEventListener("keydown", play);
      audioRef.current = null;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    };
  }, [enabled, url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = clampVolume(volume);
    }
  }, [volume]);
}
