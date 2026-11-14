import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  EXERCISE_COUNTS,
  type ExerciseCount,
} from "@/data/exercises";

export type ThemeId = "emerald" | "ocean" | "violet" | "sunset" | "rose";

export type MusicStyle = "focus" | "energy" | "calm" | "pulse" | "night";

export const MUSIC_STYLES: MusicStyle[] = [
  "focus",
  "energy",
  "calm",
  "pulse",
  "night",
];

/** Where the workout soundtrack comes from: synth loops, a user file or Spotify. */
export type MusicSource = "procedural" | "custom" | "spotify";

export const MUSIC_SOURCES: MusicSource[] = ["procedural", "custom", "spotify"];

export type BackgroundId =
  | "aurora"
  | "midnight"
  | "sunset"
  | "forest"
  | "graphite";

export interface BackgroundOption {
  value: BackgroundId;
  /** Preview gradient used by the settings swatch */
  swatch: string;
}

export const BACKGROUNDS: BackgroundOption[] = [
  {
    value: "aurora",
    swatch: "radial-gradient(circle at 30% 20%, #34d399, #0f766e 55%, #0b1120)",
  },
  {
    value: "midnight",
    swatch: "radial-gradient(circle at 30% 20%, #6366f1, #0e7490 55%, #0b1120)",
  },
  {
    value: "sunset",
    swatch: "radial-gradient(circle at 30% 20%, #fb923c, #be185d 55%, #0b1120)",
  },
  {
    value: "forest",
    swatch: "radial-gradient(circle at 30% 20%, #4ade80, #14532d 55%, #0b1120)",
  },
  {
    value: "graphite",
    swatch: "radial-gradient(circle at 30% 20%, #94a3b8, #1e293b 55%, #0b1120)",
  },
];

export interface ThemeOption {
  value: ThemeId;
  /** Preview gradient used by the settings swatch */
  swatch: string;
}

export const THEMES: ThemeOption[] = [
  { value: "emerald", swatch: "linear-gradient(135deg, #34d399, #0d9488)" },
  { value: "ocean", swatch: "linear-gradient(135deg, #38bdf8, #0891b2)" },
  { value: "violet", swatch: "linear-gradient(135deg, #a78bfa, #9333ea)" },
  { value: "sunset", swatch: "linear-gradient(135deg, #fb923c, #d97706)" },
  { value: "rose", swatch: "linear-gradient(135deg, #fb7185, #db2777)" },
];

export interface Preferences {
  theme: ThemeId;
  background: BackgroundId;
  sound: boolean;
  music: boolean;
  musicStyle: MusicStyle;
  musicSource: MusicSource;
  musicVolume: number;
  customTrackId: string | null;
  exerciseCount: ExerciseCount;
  reduceMotion: boolean;
  keepAwake: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: "emerald",
  background: "aurora",
  sound: true,
  music: false,
  musicStyle: "focus",
  musicSource: "procedural",
  musicVolume: 0.6,
  customTrackId: null,
  exerciseCount: 3,
  reduceMotion: false,
  keepAwake: false,
};

const STORAGE_KEY = "workout-roulette-prefs";

function isTheme(value: unknown): value is ThemeId {
  return typeof value === "string" && THEMES.some((theme) => theme.value === value);
}

function isMusicStyle(value: unknown): value is MusicStyle {
  return (
    typeof value === "string" &&
    MUSIC_STYLES.some((style) => style === value)
  );
}

function isMusicSource(value: unknown): value is MusicSource {
  return (
    typeof value === "string" &&
    MUSIC_SOURCES.some((source) => source === value)
  );
}

function isBackground(value: unknown): value is BackgroundId {
  return (
    typeof value === "string" &&
    BACKGROUNDS.some((background) => background.value === value)
  );
}

function loadPreferences(): Preferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      theme: isTheme(parsed.theme) ? parsed.theme : DEFAULT_PREFERENCES.theme,
      background: isBackground(parsed.background)
        ? parsed.background
        : DEFAULT_PREFERENCES.background,
      sound: typeof parsed.sound === "boolean" ? parsed.sound : DEFAULT_PREFERENCES.sound,
      music:
        typeof parsed.music === "boolean" ? parsed.music : DEFAULT_PREFERENCES.music,
      musicStyle: isMusicStyle(parsed.musicStyle)
        ? parsed.musicStyle
        : DEFAULT_PREFERENCES.musicStyle,
      musicSource: isMusicSource(parsed.musicSource)
        ? parsed.musicSource
        : DEFAULT_PREFERENCES.musicSource,
      musicVolume:
        typeof parsed.musicVolume === "number" &&
        Number.isFinite(parsed.musicVolume)
          ? Math.min(1, Math.max(0, parsed.musicVolume))
          : DEFAULT_PREFERENCES.musicVolume,
      customTrackId:
        typeof parsed.customTrackId === "string"
          ? parsed.customTrackId
          : DEFAULT_PREFERENCES.customTrackId,
      exerciseCount: EXERCISE_COUNTS.includes(parsed.exerciseCount as ExerciseCount)
        ? (parsed.exerciseCount as ExerciseCount)
        : DEFAULT_PREFERENCES.exerciseCount,
      reduceMotion:
        typeof parsed.reduceMotion === "boolean"
          ? parsed.reduceMotion
          : DEFAULT_PREFERENCES.reduceMotion,
      keepAwake:
        typeof parsed.keepAwake === "boolean"
          ? parsed.keepAwake
          : DEFAULT_PREFERENCES.keepAwake,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

interface PreferencesContextValue {
  prefs: Preferences;
  update: (patch: Partial<Preferences>) => void;
  reset: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(loadPreferences);

  const update = useCallback((patch: Partial<Preferences>) => {
    setPrefs((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setPrefs(DEFAULT_PREFERENCES);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = prefs.theme;
    root.dataset.bg = prefs.background;
    root.dataset.motion = prefs.reduceMotion ? "reduced" : "full";
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // storage may be unavailable — preferences still work for this session
    }
  }, [prefs]);

  const value = useMemo(
    () => ({ prefs, update, reset }),
    [prefs, update, reset],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
