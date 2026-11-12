import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dumbbell,
  Shuffle,
  AlertCircle,
  ChevronDown,
  Sparkles,
  Settings,
  Music,
  VolumeX,
  Share2,
  Check,
  Trophy,
} from "lucide-react";
import {
  generateWorkout,
  generateDifferentWorkout,
  pickExercise,
  DIFFICULTIES,
  WORKOUT_TYPES,
  EXERCISE_COUNTS,
  type Difficulty,
  type Exercise,
  type ExerciseCount,
  type WorkoutType,
} from "@/data/exercises";
import {
  generateCoachPrompt,
  generateCoachSections,
  estimateDuration,
  DEFAULT_COACH_SETTINGS,
  COACH_MODELS,
  type CoachSettings,
} from "@/data/aiCoach";
import { ExerciseCard } from "@/components/ExerciseCard";
import { CoachPanel } from "@/components/CoachPanel";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LeftSidePanel, RightSidePanel } from "@/components/SidePanels";
import { useI18n } from "@/i18n";
import { usePreferences } from "@/preferences";
import { useCustomMusic, useWorkoutMusic } from "@/music";
import { useCustomTrack } from "@/customTrack";
import { dayKey, useWorkoutHistory } from "@/history";
import { WorkoutStats } from "@/components/WorkoutStats";
import { RestTimer } from "@/components/RestTimer";

type AppState = "empty" | "success" | "error";

export default function App() {
  const { t } = useI18n();
  const { prefs, update: updatePrefs, reset: resetPrefs } = usePreferences();
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [workoutType, setWorkoutType] = useState<WorkoutType>("fullBody");
  const [workout, setWorkout] = useState<Exercise[] | null>(null);
  const [state, setState] = useState<AppState>("empty");
  const [spinning, setSpinning] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<CoachSettings>(DEFAULT_COACH_SETTINGS);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const recordedRef = useRef(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const { stats, record: recordWorkout, clear: clearHistory } =
    useWorkoutHistory();

  const customTrack = useCustomTrack(prefs.customTrackId);
  const customActive =
    prefs.musicSource === "custom" && Boolean(customTrack.url);

  useWorkoutMusic(
    prefs.music && prefs.musicSource === "procedural",
    prefs.musicStyle,
    prefs.musicVolume,
  );
  useCustomMusic(
    prefs.music && customActive,
    customTrack.url,
    prefs.musicVolume,
  );

  async function handleAddTrack(file: File) {
    const id = await customTrack.add(file);
    if (id) {
      updatePrefs({ customTrackId: id, musicSource: "custom", music: true });
    }
  }

  function handleSelectTrack(id: string) {
    updatePrefs({ customTrackId: id, musicSource: "custom", music: true });
  }

  async function handleRemoveTrack(id: string) {
    await customTrack.remove(id);
    if (prefs.customTrackId === id) {
      const next =
        customTrack.tracks.find((track) => track.id !== id) ?? null;
      updatePrefs({
        customTrackId: next?.id ?? null,
        musicSource: next ? prefs.musicSource : "procedural",
      });
    }
  }

  // Keep the screen awake during a workout when the user enables it.
  useEffect(() => {
    if (!prefs.keepAwake) return;
    type Sentinel = { release: () => Promise<void> };
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: "screen") => Promise<Sentinel> };
    };
    let sentinel: Sentinel | null = null;
    let active = true;

    const request = async () => {
      if (!active || !nav.wakeLock) return;
      try {
        sentinel = await nav.wakeLock.request("screen");
      } catch {
        // not supported or denied — silently ignore
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") void request();
    };

    void request();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", onVisibility);
      void sentinel?.release().catch(() => {});
      sentinel = null;
    };
  }, [prefs.keepAwake]);

  const coachPrompt = useMemo(
    () =>
      workout && difficulty
        ? generateCoachPrompt(workout, difficulty, settings, t)
        : "",
    [workout, difficulty, settings, t],
  );

  const coachSections = useMemo(
    () =>
      workout && difficulty
        ? generateCoachSections(workout, difficulty, settings, t)
        : [],
    [workout, difficulty, settings, t],
  );

  const duration = useMemo(
    () => (workout ? estimateDuration(workout) : 0),
    [workout],
  );

  const completedCount = completed.filter(Boolean).length;
  const progress =
    workout && workout.length > 0
      ? Math.round((completedCount / workout.length) * 100)
      : 0;

  function applyWorkout(next: Exercise[]) {
    recordedRef.current = false;
    setWorkout(next);
    setCompleted(next.map(() => false));
    setState("success");
  }

  function handleSpin() {
    if (!difficulty) {
      setState("error");
      setWorkout(null);
      setCompleted([]);
      selectRef.current?.focus();
      selectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const previous = workout;
    setSpinning(true);
    setState("empty");
    setWorkout(null);
    setCompleted([]);
    setTimeout(() => {
      applyWorkout(
        previous
          ? generateDifferentWorkout(
              previous,
              difficulty,
              workoutType,
              prefs.exerciseCount,
            )
          : generateWorkout(difficulty, workoutType, prefs.exerciseCount),
      );
      setSpinning(false);
    }, 650);
  }

  function handleDaily() {
    if (!difficulty) {
      setState("error");
      setWorkout(null);
      setCompleted([]);
      selectRef.current?.focus();
      selectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const seed = `daily-${dayKey()}-${difficulty}-${workoutType}-${prefs.exerciseCount}`;
    setSpinning(true);
    setState("empty");
    setWorkout(null);
    setTimeout(() => {
      applyWorkout(
        generateWorkout(
          difficulty,
          workoutType,
          prefs.exerciseCount,
          seed,
        ),
      );
      setSpinning(false);
    }, 650);
  }

  function handleSelect(value: string) {
    setDifficulty(value as Difficulty);
    if (state === "error") setState("empty");
  }

  function handleCountChange(count: ExerciseCount) {
    updatePrefs({ exerciseCount: count });
  }

  function handleTypeChange(next: WorkoutType) {
    setWorkoutType(next);
    if (difficulty && state === "success") {
      applyWorkout(
        generateWorkout(difficulty, next, prefs.exerciseCount),
      );
    }
  }

  function toggleComplete(index: number) {
    setCompleted((current) =>
      current.map((done, i) => (i === index ? !done : done)),
    );
  }

  function handleReroll(index: number) {
    if (!workout || !difficulty) return;
    const replacement = pickExercise(
      difficulty,
      workoutType,
      workout.map((exercise) => exercise.id),
    );
    if (!replacement) return;

    setWorkout((current) =>
      current
        ? current.map((exercise, i) => (i === index ? replacement : exercise))
        : current,
    );
    setCompleted((current) =>
      current.map((done, i) => (i === index ? false : done)),
    );
  }

  // Record a workout once, as soon as every exercise is marked as done.
  useEffect(() => {
    if (!workout || !difficulty) return;
    if (workout.length === 0 || completed.length !== workout.length) return;
    if (!completed.every(Boolean)) return;
    if (recordedRef.current) return;

    recordedRef.current = true;
    recordWorkout({
      type: workoutType,
      difficulty,
      count: workout.length,
      minutes: estimateDuration(workout),
    });
  }, [completed, workout, difficulty, workoutType, recordWorkout]);

  function handlePickLevel() {
    selectRef.current?.focus();
    selectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleShowWorkout() {
    outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildShareText(): string {
    if (!workout || !difficulty) return "";
    const exercises = workout.map((exercise, index) => {
      const name = t.exercises[exercise.id].name;
      const amount =
        exercise.mode === "time"
          ? `${exercise.seconds} ${t.sec}`
          : `${exercise.reps} ${t.reps}`;
      return `${index + 1}. ${name} — ${amount}`;
    });

    return [
      `Workout Roulette · ${t.workoutTypes[workoutType]}`,
      `${t.level}: ${t.difficulty[difficulty]}`,
      "",
      ...exercises,
      "",
      window.location.href,
    ].join("\n");
  }

  async function handleShare() {
    if (!workout || !difficulty) return;
    const text = buildShareText();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Workout Roulette", text });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setShareFeedback(true);
      window.setTimeout(() => setShareFeedback(false), 2200);
    } catch {
      // clipboard is unavailable — nothing else we can do
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-white transition-colors duration-700"
      style={{ backgroundColor: "rgb(var(--bg-base))" }}
    >
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/4 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full blur-[120px] transition-colors duration-700"
          style={{ backgroundColor: "rgb(var(--bg-glow-1) / 0.20)" }}
        />
        <div
          className="absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full blur-[120px] transition-colors duration-700"
          style={{ backgroundColor: "rgb(var(--bg-glow-2) / 0.15)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-[120px] transition-colors duration-700"
          style={{ backgroundColor: "rgb(var(--bg-glow-3) / 0.15)" }}
        />
      </div>

      {/* grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: "var(--bg-grid-opacity)",
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-8 sm:py-16">
        <div className="flex w-full items-start justify-center gap-8">
          <LeftSidePanel
            onPickLevel={handlePickLevel}
            onSpin={handleSpin}
            onShowWorkout={handleShowWorkout}
          />
          <div className="flex w-full max-w-md flex-col items-center">
            {/* header */}
            <header className="w-full max-w-md">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => updatePrefs({ music: !prefs.music })}
                  aria-pressed={prefs.music}
                  aria-label={t.appearance.music}
                  title={t.appearance.music}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all active:scale-95 sm:h-11 sm:w-11 ${
                    prefs.music
                      ? "border-brand-400/40 bg-brand-400/15 text-brand-300 shadow-lg shadow-brand-500/10"
                      : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-brand-400/40 hover:text-brand-300"
                  }`}
                >
                  {prefs.music ? (
                    <Music className="h-5 w-5" />
                  ) : (
                    <VolumeX className="h-5 w-5" />
                  )}
                </button>
                <LanguageSwitcher />
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-11 sm:w-11 border border-white/10 bg-slate-900/80 text-slate-300 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
                  aria-label={t.settingsAria}
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2.5 sm:mt-5 sm:gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 bg-gradient-to-br from-brand-400 to-brand2-600 text-slate-950 shadow-lg shadow-brand-500/30">
                  <Dumbbell className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h1 className="text-xl font-black leading-tight tracking-tight sm:text-3xl">
                  Workout <span className="text-brand-400">Roulette</span>
                </h1>
              </div>
            </header>
            <p className="mt-3 max-w-md px-2 text-center text-sm leading-relaxed text-slate-400 sm:px-0 sm:text-base">
              {t.appSubtitle}
            </p>

            {/* controls */}
            <div className="mt-8 w-full max-w-md sm:mt-10">
              {/* workout type chips — mobile fallback; on desktop they live in the right panel */}
              <div className="lg:hidden">
                <p className="mb-2 block text-sm font-medium text-slate-300">
                  {t.workoutTypeLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {WORKOUT_TYPES.map((value) => {
                    const active = value === workoutType;
                    return (
                      <button
                        key={value}
                        onClick={() => handleTypeChange(value)}
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                          active
                            ? "border-brand-400/40 bg-brand-400/15 text-brand-300"
                            : "border-white/10 bg-slate-900/70 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {t.workoutTypes[value]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="mb-2 mt-5 block text-sm font-medium text-slate-300 lg:mt-0">
                {t.difficultyLabel}
              </label>
              <div className="relative">
                <select
                  ref={selectRef}
                  value={difficulty}
                  onChange={(e) => handleSelect(e.target.value)}
                  className={`w-full appearance-none rounded-2xl border bg-slate-900/80 px-4 py-3.5 pr-12 text-base font-medium text-white outline-none transition-all ${
                    state === "error"
                      ? "border-red-400/60 ring-1 ring-red-400/40"
                      : "border-white/10 focus:border-brand-400/60 focus:ring-1 focus:ring-brand-400/40"
                  }`}
                >
                  <option value="" disabled>
                    {t.difficultyPlaceholder}
                  </option>
                  {DIFFICULTIES.map((value) => (
                    <option key={value} value={value} className="bg-slate-900">
                      {t.difficulty[value]}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>

              <label className="mb-2 mt-4 block text-sm font-medium text-slate-300">
                {t.exerciseCountLabel}
              </label>
              <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-white/10 bg-slate-900/60 p-1.5">
                {EXERCISE_COUNTS.map((count) => {
                  const active = count === prefs.exerciseCount;
                  return (
                    <button
                      key={count}
                      onClick={() => handleCountChange(count)}
                      aria-pressed={active}
                      className={`rounded-xl py-2 text-sm font-bold tabular-nums transition-all active:scale-95 ${
                        active
                          ? "bg-brand-400/20 text-brand-300 ring-1 ring-brand-400/30"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>

              {/* main action button */}
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="group relative mt-4 flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl sm:mt-5 bg-gradient-to-r from-brand-400 to-brand2-500 px-6 py-4 text-lg font-bold text-slate-950 shadow-xl shadow-brand-500/30 transition-all hover:shadow-brand-500/50 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                style={spinning ? { animation: "pulseGlow 1s ease-in-out infinite" } : undefined}
              >
                <Shuffle
                  className={`h-6 w-6 transition-transform ${spinning ? "duration-700" : "duration-300 group-hover:rotate-180"}`}
                  style={spinning ? { animation: "spinRoulette 0.65s linear infinite" } : undefined}
                />
                {spinning ? t.spinning : t.spin}
              </button>

              <button
                onClick={handleDaily}
                disabled={spinning}
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-brand2-400/30 bg-brand2-400/10 px-6 py-3 text-sm font-semibold text-brand2-400 transition-all hover:border-brand2-400/50 hover:bg-brand2-400/20 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
                {t.daily}
              </button>

              {/* error message */}
              {state === "error" && (
                <div
                  className="mt-4 flex items-center gap-2.5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  style={{ animation: "shake 0.4s ease-in-out" }}
                >
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                  <span>{t.selectError}</span>
                </div>
              )}
            </div>
          </div>
          <RightSidePanel
            type={workoutType}
            onSelect={handleTypeChange}
            onSpin={handleSpin}
          />
        </div>

        {/* output area */}
        <div ref={outputRef} className="mt-8 w-full sm:mt-10">
          {state === "empty" && !workout && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/40 px-5 py-12 text-center sm:px-6 sm:py-16">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-400/10 text-brand-400 ring-1 ring-brand-400/20"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                <Sparkles className="h-9 w-9" />
              </div>
              <p className="mt-5 max-w-sm text-base text-slate-300">
                {t.emptyTitle}
              </p>
              <p className="mt-1 text-xs text-slate-500">{t.emptyHint}</p>
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="mt-6 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-400 to-brand2-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-brand-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
              >
                <Shuffle className="h-4 w-4" />
                {t.spin}
              </button>
            </div>
          )}

          {state === "success" && workout && (
            <>
              <div className="mb-6 flex flex-col items-center gap-1 text-center">
                <p className="text-sm font-medium text-brand-400">
                  {t.ready}
                </p>
                <p className="text-xs text-slate-500">
                  {t.level}: {difficulty ? t.difficulty[difficulty] : ""}
                </p>
              </div>

              <div className="mb-5 grid gap-3 lg:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 backdrop-blur">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                    <span className="text-slate-300">
                      {t.progressLabel}{" "}
                      <span className="text-brand-300">{completedCount}</span>
                      <span className="text-slate-500"> / {workout.length}</span>
                    </span>
                    {completedCount === workout.length ? (
                      <span className="flex items-center gap-1.5 text-right text-brand-300">
                        <Trophy className="h-3.5 w-3.5 shrink-0" />
                        {t.allDone}
                      </span>
                    ) : (
                      <span className="tabular-nums text-slate-400">
                        {progress}%
                      </span>
                    )}
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand2-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <RestTimer />
              </div>

              <div
                className={`grid gap-5 ${
                  workout.length === 3
                    ? "sm:grid-cols-3"
                    : workout.length === 4
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {workout.map((ex, i) => (
                  <ExerciseCard
                    key={`${ex.id}-${i}`}
                    exercise={ex}
                    index={i}
                    completed={completed[i] ?? false}
                    onToggleComplete={() => toggleComplete(i)}
                    onReroll={() => handleReroll(i)}
                  />
                ))}
              </div>

              {settings.enabled && (
                <CoachPanel
                  prompt={coachPrompt}
                  sections={coachSections}
                  durationMinutes={duration}
                  modelName={COACH_MODELS.find((model) => model.value === settings.model)?.label ?? "AI"}
                />
              )}

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleSpin}
                  disabled={spinning}
                  className="group flex items-center gap-2.5 rounded-2xl border border-brand-400/30 bg-brand-400/10 px-6 py-3.5 font-semibold text-brand-300 transition-all hover:bg-brand-400/20 hover:scale-105 active:scale-95 disabled:opacity-60"
                >
                  <Shuffle className="h-5 w-5 transition-transform group-hover:rotate-180" />
                  {t.spinAgain}
                </button>
                <button
                  onClick={() => void handleShare()}
                  className={`flex items-center gap-2.5 rounded-2xl border px-6 py-3.5 font-semibold transition-all active:scale-95 ${
                    shareFeedback
                      ? "border-brand-400/40 bg-brand-400/15 text-brand-300"
                      : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-brand-400/30 hover:text-brand-300"
                  }`}
                >
                  {shareFeedback ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Share2 className="h-5 w-5" />
                  )}
                  {shareFeedback ? t.copied : t.share}
                </button>
              </div>
            </>
          )}
        </div>

        <WorkoutStats stats={stats} onClear={clearHistory} />

        <footer className="mt-auto pt-12 text-center text-xs text-slate-600">
          {t.footer}
        </footer>
      </div>

      <SettingsDrawer
        open={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
        prefs={prefs}
        onPrefsChange={updatePrefs}
        onReset={() => {
          resetPrefs();
          setSettings(DEFAULT_COACH_SETTINGS);
        }}
        customTracks={customTrack.tracks}
        activeTrackId={customTrack.activeId}
        customTrackError={customTrack.error}
        customTrackBusy={customTrack.busy}
        onAddTrack={handleAddTrack}
        onSelectTrack={handleSelectTrack}
        onRemoveTrack={handleRemoveTrack}
        onClearTrackError={customTrack.clearError}
      />
    </div>
  );
}
