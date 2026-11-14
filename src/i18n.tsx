import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Difficulty, ExerciseId, WorkoutType } from "@/data/exercises";
import type { CoachSettings } from "@/data/aiCoach";
import type { MusicStyle, BackgroundId, ThemeId, MusicSource } from "@/preferences";
import type { CustomTrackError } from "@/customTrack";

export type Lang = "uk" | "en" | "pl" | "de" | "es" | "fr";

export const LANGUAGES: {
  value: Lang;
  label: string;
  flag: string;
  code: string;
}[] = [
  { value: "uk", label: "Українська", flag: "🇺🇦", code: "UK" },
  { value: "en", label: "English", flag: "🇬🇧", code: "EN" },
  { value: "pl", label: "Polski", flag: "🇵🇱", code: "PL" },
  { value: "de", label: "Deutsch", flag: "🇩🇪", code: "DE" },
  { value: "es", label: "Español", flag: "🇪🇸", code: "ES" },
  { value: "fr", label: "Français", flag: "🇫🇷", code: "FR" },
];

export interface Dict {
  documentTitle: string;
  appSubtitle: string;
  difficultyLabel: string;
  difficultyPlaceholder: string;
  difficulty: Record<Difficulty, string>;
  workoutTypeLabel: string;
  workoutTypes: Record<WorkoutType, string>;
  exerciseCountLabel: string;
  quickStart: string;
  daily: string;
  spin: string;
  spinning: string;
  selectError: string;
  emptyTitle: string;
  emptyHint: string;
  ready: string;
  level: string;
  spinAgain: string;
  share: string;
  progressLabel: string;
  allDone: string;
  markDone: string;
  markUndone: string;
  stats: {
    title: string;
    streak: string;
    workouts: string;
    minutes: string;
    clear: string;
  };
  history: {
    title: string;
    subtitle: string;
    clear: string;
    load: string;
    exercises: string;
    showDetails: string;
    hideDetails: string;
  };
  footer: string;
  exercise: string;
  sec: string;
  reps: string;
  start: string;
  pause: string;
  reroll: string;
  restTitle: string;
  restReset: string;
  restDone: string;
  coachTitle: string;
  coachSubtitle: string;
  minutes: (n: number) => string;
  copied: string;
  copyPrompt: string;
  settingsAria: string;
  language: string;
  appearance: {
    title: string;
    theme: string;
    themes: Record<ThemeId, string>;
    background: string;
    backgrounds: Record<BackgroundId, string>;
    sound: string;
    soundDesc: string;
    music: string;
    musicDesc: string;
    musicStyles: Record<MusicStyle, string>;
    musicSources: Record<MusicSource, string>;
    uploadTrack: string;
    addTrack: string;
    musicVolume: string;
    replaceTrack: string;
    removeTrack: string;
    trackHint: string;
    trackErrors: Record<CustomTrackError, string>;
    spotify: {
      title: string;
      setupTitle: string;
      setupDesc: string;
      clientId: string;
      clientIdPlaceholder: string;
      save: string;
      redirectUri: string;
      copy: string;
      copied: string;
      connect: string;
      disconnect: string;
      connectedAs: (name: string) => string;
      search: string;
      searchPlaceholder: string;
      searching: string;
      noResults: string;
      tracks: string;
      playlists: string;
      nowPlaying: string;
      play: string;
      pause: string;
      next: string;
      previous: string;
      premium: string;
      notConfigured: string;
      authError: string;
      playbackError: string;
      networkError: string;
      noDevice: string;
      playerStarting: string;
      hint: string;
    };
    motion: string;
    motionDesc: string;
    keepAwake: string;
    keepAwakeDesc: string;
    reset: string;
  };
  side: {
    featuresTitle: string;
    features: { title: string; desc: string }[];
    stepsTitle: string;
    steps: { title: string; desc: string }[];
  };
  settings: {
    title: string;
    subtitle: string;
    close: string;
    coachOn: string;
    coachOff: string;
    aiModel: string;
    free: string;
    tone: string;
    toneOptions: Record<CoachSettings["tone"], { label: string; desc: string }>;
    focus: string;
    focusOptions: Record<CoachSettings["focus"], { label: string; desc: string }>;
    sections: string;
    warmup: string;
    warmupDesc: string;
    motivation: string;
    motivationDesc: string;
    enabled: string;
    disabled: string;
    apiKeys: string;
    apiKeysDesc: string;
    addKeyAria: string;
    otherService: string;
    keyNamePlaceholder: string;
    keyValuePlaceholder: string;
    addKeyButton: string;
    keyWarning: string;
    showKey: string;
    hideKey: string;
    deleteKey: string;
    done: string;
  };
  exercises: Record<ExerciseId, { name: string; cue: string }>;
  coach: {
    intro: (level: string) => string;
    warmup: (text: string) => string;
    complex: (names: string) => string;
    technique: (tip: string) => string;
    loadReps: (reps: number) => string;
    loadTime: (seconds: number) => string;
    loadBoth: (reps: number, seconds: number) => string;
    warmups: string[];
    pacing: Record<Difficulty, string>;
    motivation: string[];
    toneIntro: Record<CoachSettings["tone"], string>;
    focusTip: Record<CoachSettings["focus"], string>;
    sectionTitles: {
      plan: string;
      warmup: string;
      technique: string;
      load: string;
      motivation: string;
    };
    collapse: string;
    expand: string;
  };
}

const uk: Dict = {
  documentTitle: "Workout Roulette — домашнє тренування за 5 секунд",
  appSubtitle: "Натисни кнопку — і отримай випадкове тренування на 3–5 вправ за 5 секунд.",
  difficultyLabel: "Рівень складності",
  difficultyPlaceholder: "Вибери рівень...",
  difficulty: {
    beginner: "Початковий",
    intermediate: "Середній",
    pro: "Професійний",
  },
  workoutTypeLabel: "Тип тренування",
  workoutTypes: {
    fullBody: "Все тіло",
    upper: "Верх тіла",
    lower: "Низ тіла",
    core: "Прес і кор",
    cardio: "Кардіо",
    mobility: "Мобільність",
  },
  quickStart: "Швидкий старт",
  spin: "Зіграти тренування",
  spinning: "Крутимо рулетку...",
  selectError: "Будь ласка, вибери рівень складності перед запуском рулетки!",
  emptyTitle:
    "Натисни кнопку нижче, щоб випадковим чином згенерувати своє тренування на сьогодні!",
  emptyHint: "Вибери рівень складності й тисни «Зіграти тренування»",
  ready: "Твоє тренування готове",
  level: "Рівень",
  spinAgain: "Повторити тренування",
  share: "Поділитися",
  exerciseCountLabel: "Кількість вправ",
  daily: "Тренування дня",
  progressLabel: "Виконано",
  allDone: "Тренування завершено!",
  markDone: "Позначити виконаною",
  markUndone: "Скасувати відмітку",
  stats: {
    title: "Твоя статистика",
    streak: "Днів поспіль",
    workouts: "Тренувань",
    minutes: "Хвилин",
    clear: "Очистити історію",
  },
  history: {
    title: "Історія тренувань",
    subtitle: "Останні обрані тренування",
    clear: "Очистити історію тренувань",
    load: "Показати",
    exercises: "Вправи",
    showDetails: "Показати вправи",
    hideDetails: "Сховати вправи",
  },
  footer: "Workout Roulette — тренуйся вдома без підготовки",
  exercise: "Вправа",
  reroll: "Замінити вправу",
  restTitle: "Відпочинок",
  restReset: "Скинути таймер",
  restDone: "Час вийшов!",
  sec: "сек",
  reps: "повторень",
  start: "Старт",
  pause: "Пауза",
  coachTitle: "AI-коуч",
  coachSubtitle: "коротка персональна інструкція",
  minutes: (n) => `~${n} хв`,
  copied: "Скопійовано",
  copyPrompt: "Копіювати промпт",
  settingsAria: "Налаштування",
  language: "Мова",
  appearance: {
    title: "Вигляд і звук",
    theme: "Кольорова тема",
    themes: {
      emerald: "Смарагд",
      ocean: "Океан",
      violet: "Фіалка",
      sunset: "Захід сонця",
      rose: "Роза",
    },
    background: "Фон сайту",
    backgrounds: {
      aurora: "Полярне сяйво",
      midnight: "Північ",
      sunset: "Захід сонця",
      forest: "Ліс",
      graphite: "Графіт",
    },
    sound: "Звук таймера",
    soundDesc: "Короткий сигнал, коли час вийшов",
    music: "Музика на тренуванні",
    musicDesc: "Фоновий ритм, який можна вимкнути будь-коли",
    musicStyles: {
      focus: "Фокус",
      energy: "Енергія",
      calm: "Спокій",
      pulse: "Пульс",
      night: "Ніч",
    },
    musicSources: {
      procedural: "Вбудовані",
      custom: "Мої треки",
      spotify: "Spotify",
    },
    uploadTrack: "Завантажити свій трек",
    addTrack: "Додати трек",
    musicVolume: "Гучність музики",
    replaceTrack: "Замінити трек",
    removeTrack: "Видалити трек",
    trackHint: "MP3, WAV, OGG або M4A · до 30 МБ",
    trackErrors: {
      tooLarge: "Файл завеликий — максимум 30 МБ",
      unsupported: "Це не аудіофайл. Обери MP3, WAV, OGG або M4A",
      tooMany: "Максимум 10 треків — видали зайвий",
      failed: "Не вдалося зберегти трек. Спробуй ще раз",
    },
    spotify: {
      title: "Spotify",
      setupTitle: "Підключення Spotify",
      setupDesc:
        "Створи застосунок на developer.spotify.com, встав його Client ID і додай наведений Redirect URI у налаштуваннях застосунку.",
      clientId: "Client ID",
      clientIdPlaceholder: "Встав Client ID застосунку",
      save: "Зберегти",
      redirectUri: "Redirect URI",
      copy: "Копіювати",
      copied: "Скопійовано",
      connect: "Увійти через Spotify",
      disconnect: "Від'єднати",
      connectedAs: (name) => `Підключено: ${name}`,
      search: "Пошук у Spotify",
      searchPlaceholder: "Трек, виконавець або плейлист",
      searching: "Шукаємо…",
      noResults: "Нічого не знайдено",
      tracks: "Треки",
      playlists: "Плейлисти",
      nowPlaying: "Зараз грає",
      play: "Грати",
      pause: "Пауза",
      next: "Наступний",
      previous: "Попередній",
      premium: "Для відтворення у браузері потрібен Spotify Premium.",
      notConfigured: "Спочатку збережи Client ID.",
      authError: "Не вдалося підключитися до Spotify. Спробуй ще раз.",
      playbackError:
        "Не вдалося відтворити. Перевір, чи Spotify не зайнятий на іншому пристрої.",
      networkError: "Помилка мережі. Перевір з'єднання.",
      noDevice: "Плеєр ще не готовий. Зачекай кілька секунд.",
      playerStarting: "Готуємо плеєр…",
      hint: "Відтворення йде через офіційний Spotify Web Playback SDK.",
    },
    motion: "Менше анімацій",
    motionDesc: "Вимкнути зайві ефекти й рух",
    keepAwake: "Не гасити екран",
    keepAwakeDesc: "Екран не згасне під час тренування",
    reset: "Скинути налаштування",
  },
  side: {
    featuresTitle: "Чому це працює",
    features: [
      { title: "5 секунд", desc: "від ідеї до готового плану" },
      { title: "3–5 вправ", desc: "збалансований міні-комплекс" },
      { title: "0 обладнання", desc: "тільки ти і підлога" },
      { title: "AI-тренер", desc: "персональні підказки" },
    ],
    stepsTitle: "Як це працює",
    steps: [
      { title: "Обери рівень", desc: "початковий, середній або про" },
      { title: "Крути рулетку", desc: "отримай 3 випадкові вправи" },
      { title: "Тренуйся", desc: "з таймером і підказками" },
    ],
  },
  settings: {
    title: "Налаштування",
    subtitle: "Тренер, тема, звук і доступність",
    close: "Закрити",
    coachOn: "Увімкнено · інструкція показується",
    coachOff: "Вимкнено · інструкція прихована",
    aiModel: "AI модель",
    free: "free",
    tone: "Тон тренера",
    toneOptions: {
      encouraging: { label: "Підтримуючий", desc: "Мотивує й підбадьорює" },
      strict: { label: "Суворий", desc: "Тисне на максимум" },
      calm: { label: "Спокійний", desc: "Без стресу, у своєму темпі" },
    },
    focus: "Фокус тренування",
    focusOptions: {
      technique: { label: "Техніка", desc: "Якість рухів понад усе" },
      intensity: { label: "Інтенсивність", desc: "Максимум зусиль, мін. пауз" },
      recovery: { label: "Відновлення", desc: "Дихання й паузи між вправами" },
    },
    sections: "Розділи інструкції",
    warmup: "Розминка",
    warmupDesc: "Підказка для розігріву перед стартом",
    motivation: "Мотивація",
    motivationDesc: "Фінальний підбадьорливий підсумок",
    enabled: "увімкнено",
    disabled: "вимкнено",
    apiKeys: "API keys",
    apiKeysDesc: "Створюй і керуй ключами для AI-сервісів",
    addKeyAria: "Додати API key",
    otherService: "Інший сервіс",
    keyNamePlaceholder: "Назва ключа, наприклад Production",
    keyValuePlaceholder: "Встав API key",
    addKeyButton: "Додати ключ",
    keyWarning:
      "Не використовуй цей режим для робочих секретів: ключ тимчасово живе лише у памʼяті цієї вкладки.",
    showKey: "Показати ключ",
    hideKey: "Приховати ключ",
    deleteKey: "Видалити ключ",
    done: "Готово",
  },
  exercises: {
    squats: {
      name: "Присідання",
      cue: "Опускайся повільно, піднімайся вибухово",
    },
    plank: {
      name: "Планка",
      cue: "Тримай таз, не прогинай поперек",
    },
    pushups: {
      name: "Віджимання",
      cue: "Лікті під кутом 45°",
    },
    jumpingJacks: {
      name: "Стрибки на місці",
      cue: "М'яке приземлення на носки",
    },
    lunges: {
      name: "Випади",
      cue: "Коліно не виходить за носок",
    },
    highKnees: {
      name: "Бігові підйоми",
      cue: "Коліна до грудей у ритмі",
    },
    crunches: {
      name: "Прес",
      cue: "Підіймайся за рахунок м'язів живота",
    },
    gluteBridge: {
      name: "Місток",
      cue: "Притисни таз до стелі",
    },
    burpees: {
      name: "Берпи",
      cue: "Один рух — одна секунда",
    },
    mountainClimbers: {
      name: "Горизонтальні бігові",
      cue: "Стійка на передпліччях, ритм",
    },
    abPulses: {
      name: "Накладки на прес",
      cue: "Не відривай поперек",
    },
    jumpSquats: {
      name: "Присідання з стрибком",
      cue: "Вибух у верхній точці",
    },
    superman: {
      name: "Супермен",
      cue: "Підіймай руки й ноги одночасно",
    },
    climbers: {
      name: "Альпініст",
      cue: "Коліна до грудей по черзі",
    },
    tPushups: {
      name: "Т-віджимання",
      cue: "Розгортання у верхній точці",
    },
  },
  coach: {
    intro: (level) => `🎯 Твоє тренування — рівень «${level}».`,
    sectionTitles: {
      plan: "План",
      warmup: "Розминка",
      technique: "Техніка",
      load: "Навантаження",
      motivation: "Мотивація",
    },
    collapse: "Згорнути",
    expand: "Розгорнути",
    warmup: (text) => `\n🟢 Розминка. ${text}`,
    complex: (names) => `\n📋 Комплекс: ${names}.`,
    technique: (tip) => `\n💡 Техніка: ${tip}`,
    loadReps: (reps) => `\n📊 Навантаження: ${reps} повторень сумарно.`,
    loadTime: (seconds) =>
      `\n📊 Навантаження: ${seconds} секунд сумарно у статичних вправах.`,
    loadBoth: (reps, seconds) =>
      `\n📊 Навантаження: ${reps} повторень сумарно + ${seconds} секунд у статичних вправах.`,
    warmups: [
      "Перед стартом — 60 секунд легких стрибків на місці, щоб підняти пульс.",
      "5 обертів руками вперед і назад, 10 нахилів корпуса.",
      "Розігрій суглоби: коліна по черзі до грудей, потім махи ногами по 10 разів.",
    ],
    pacing: {
      beginner:
        "Темп — спокійний. Головне зараз — чиста техніка, а не швидкість. Роби паузу 30–40 секунд між вправами.",
      intermediate:
        "Тримай стабільний темп із відпочинком 20–30 секунд між вправами. Не поспішай у першій, зберігай силу на фініш.",
      pro: "Режим високої інтенсивності: відпочинок не більше 15 секунд між вправами. Можеш пройти комплекс 2–3 рази по колу.",
    },
    motivation: [
      "Ти вже зробив найважливіше — почав. Далі легше.",
      "Кожен повтор наближає тебе до кращої форми. Не здавайся на останній вправі.",
      "5 хвилин сьогодні — це більше, ніж нуль. Погнали.",
      "Твоє тіло вміє більше, ніж думає голова. Вірь собі.",
      "Фінішуєш комплекс — заслужив повагу. А потім можна ще коло.",
    ],
    toneIntro: {
      encouraging: "Ти зможеш. Головне — почати й не зупинятись.",
      strict: "Без відмазок. Робиш по максимуму або не починаєш взагалі.",
      calm: "Без стресу. Слухай тіло й рухайся у своєму темпі.",
    },
    focusTip: {
      technique:
        "Фокус на техніці: якість кожного повтору важливіша за кількість.",
      intensity:
        "Фокус на інтенсивності: тисни на максимум, скорочуй паузи до мінімуму.",
      recovery:
        "Фокус на відновленні: між вправами роби 1–2 глибоких вдихи-видихи.",
    },
  },
};

const en: Dict = {
  documentTitle: "Workout Roulette — a home workout in 5 seconds",
  appSubtitle:
    "Hit the button — get a random 3–5 exercise workout in 5 seconds.",
  difficultyLabel: "Difficulty level",
  difficultyPlaceholder: "Choose a level...",
  difficulty: {
    beginner: "Beginner",
    intermediate: "Intermediate",
    pro: "Pro",
  },
  workoutTypeLabel: "Workout type",
  workoutTypes: {
    fullBody: "Full body",
    upper: "Upper body",
    lower: "Lower body",
    core: "Core",
    cardio: "Cardio",
    mobility: "Mobility",
  },
  quickStart: "Quick start",
  spin: "Spin the workout",
  spinning: "Spinning the roulette...",
  selectError: "Please choose a difficulty level before spinning the roulette!",
  emptyTitle:
    "Hit the button below to randomly generate your workout for today!",
  emptyHint: "Pick a difficulty level and press “Spin the workout”",
  ready: "Your workout is ready",
  level: "Level",
  spinAgain: "Repeat workout",
  share: "Share",
  exerciseCountLabel: "Number of exercises",
  daily: "Workout of the day",
  progressLabel: "Completed",
  allDone: "Workout complete!",
  markDone: "Mark as done",
  markUndone: "Mark as not done",
  stats: {
    title: "Your stats",
    streak: "Day streak",
    workouts: "Workouts",
    minutes: "Minutes",
    clear: "Clear history",
  },
  history: {
    title: "Workout history",
    subtitle: "Your recently selected workouts",
    clear: "Clear workout history",
    load: "View",
    exercises: "Exercises",
    showDetails: "Show exercises",
    hideDetails: "Hide exercises",
  },
  footer: "Workout Roulette — train at home with no prep",
  exercise: "Exercise",
  reroll: "Swap exercise",
  restTitle: "Rest",
  restReset: "Reset timer",
  restDone: "Time's up!",
  sec: "sec",
  reps: "reps",
  start: "Start",
  pause: "Pause",
  coachTitle: "AI Coach",
  coachSubtitle: "personal guidance",
  minutes: (n) => `~${n} min`,
  copied: "Copied",
  copyPrompt: "Copy prompt",
  settingsAria: "Settings",
  language: "Language",
  appearance: {
    title: "Appearance & sound",
    theme: "Colour theme",
    themes: {
      emerald: "Emerald",
      ocean: "Ocean",
      violet: "Violet",
      sunset: "Sunset",
      rose: "Rose",
    },
    background: "Site background",
    backgrounds: {
      aurora: "Aurora",
      midnight: "Midnight",
      sunset: "Sunset",
      forest: "Forest",
      graphite: "Graphite",
    },
    sound: "Timer sound",
    soundDesc: "A short beep when time is up",
    music: "Workout music",
    musicDesc: "A background beat you can turn off anytime",
    musicStyles: {
      focus: "Focus",
      energy: "Energy",
      calm: "Calm",
      pulse: "Pulse",
      night: "Night",
    },
    musicSources: {
      procedural: "Built-in",
      custom: "My tracks",
      spotify: "Spotify",
    },
    uploadTrack: "Upload your track",
    addTrack: "Add track",
    musicVolume: "Music volume",
    replaceTrack: "Replace track",
    removeTrack: "Remove track",
    trackHint: "MP3, WAV, OGG or M4A · up to 30 MB",
    trackErrors: {
      tooLarge: "File is too large — 30 MB max",
      unsupported: "That's not an audio file. Pick MP3, WAV, OGG or M4A",
      tooMany: "Up to 10 tracks — remove one first",
      failed: "Couldn't save the track. Please try again",
    },
    spotify: {
      title: "Spotify",
      setupTitle: "Connect Spotify",
      setupDesc:
        "Create an app at developer.spotify.com, paste its Client ID and add the Redirect URI below to the app settings.",
      clientId: "Client ID",
      clientIdPlaceholder: "Paste the app Client ID",
      save: "Save",
      redirectUri: "Redirect URI",
      copy: "Copy",
      copied: "Copied",
      connect: "Log in with Spotify",
      disconnect: "Disconnect",
      connectedAs: (name) => `Connected: ${name}`,
      search: "Search Spotify",
      searchPlaceholder: "Track, artist or playlist",
      searching: "Searching…",
      noResults: "Nothing found",
      tracks: "Tracks",
      playlists: "Playlists",
      nowPlaying: "Now playing",
      play: "Play",
      pause: "Pause",
      next: "Next",
      previous: "Previous",
      premium: "Spotify Premium is required for browser playback.",
      notConfigured: "Save a Client ID first.",
      authError: "Could not connect to Spotify. Please try again.",
      playbackError:
        "Playback failed. Check that Spotify is not active on another device.",
      networkError: "Network error. Check your connection.",
      noDevice: "The player is not ready yet. Wait a few seconds.",
      playerStarting: "Preparing the player…",
      hint: "Playback uses the official Spotify Web Playback SDK.",
    },
    motion: "Reduce motion",
    motionDesc: "Turn off extra effects and movement",
    keepAwake: "Keep screen awake",
    keepAwakeDesc: "The screen stays on during your workout",
    reset: "Reset settings",
  },
  side: {
    featuresTitle: "Why it works",
    features: [
      { title: "5 seconds", desc: "from idea to a ready plan" },
      { title: "3–5 exercises", desc: "a balanced mini circuit" },
      { title: "0 equipment", desc: "just you and the floor" },
      { title: "AI coach", desc: "personal guidance" },
    ],
    stepsTitle: "How it works",
    steps: [
      { title: "Pick a level", desc: "beginner, intermediate or pro" },
      { title: "Spin the roulette", desc: "get 3 random exercises" },
      { title: "Train", desc: "with a timer and cues" },
    ],
  },
  settings: {
    title: "Settings",
    subtitle: "Coach, theme, sound and accessibility",
    close: "Close",
    coachOn: "Enabled · guidance is shown",
    coachOff: "Disabled · guidance is hidden",
    aiModel: "AI model",
    free: "free",
    tone: "Coach tone",
    toneOptions: {
      encouraging: { label: "Encouraging", desc: "Motivates and cheers you on" },
      strict: { label: "Strict", desc: "Pushes you to the max" },
      calm: { label: "Calm", desc: "No stress, at your own pace" },
    },
    focus: "Workout focus",
    focusOptions: {
      technique: { label: "Technique", desc: "Quality of movement above all" },
      intensity: { label: "Intensity", desc: "Maximum effort, minimum rest" },
      recovery: { label: "Recovery", desc: "Breathing and rest between exercises" },
    },
    sections: "Guidance sections",
    warmup: "Warm-up",
    warmupDesc: "A warm-up tip before you start",
    motivation: "Motivation",
    motivationDesc: "An encouraging closing note",
    enabled: "on",
    disabled: "off",
    apiKeys: "API keys",
    apiKeysDesc: "Create and manage keys for AI services",
    addKeyAria: "Add API key",
    otherService: "Other service",
    keyNamePlaceholder: "Key name, e.g. Production",
    keyValuePlaceholder: "Paste API key",
    addKeyButton: "Add key",
    keyWarning:
      "Don't use this mode for real secrets: the key lives only in this tab's memory.",
    showKey: "Show key",
    hideKey: "Hide key",
    deleteKey: "Delete key",
    done: "Done",
  },
  exercises: {
    squats: { name: "Squats", cue: "Lower slowly, rise explosively" },
    plank: { name: "Plank", cue: "Keep your pelvis level, don't arch your lower back" },
    pushups: { name: "Push-ups", cue: "Elbows at a 45° angle" },
    jumpingJacks: { name: "Jumping jacks", cue: "Land softly on your toes" },
    lunges: { name: "Lunges", cue: "Keep your knee behind your toes" },
    highKnees: { name: "High knees", cue: "Knees to chest in a steady rhythm" },
    crunches: { name: "Crunches", cue: "Rise using your abdominal muscles" },
    gluteBridge: { name: "Glute bridge", cue: "Press your hips toward the ceiling" },
    burpees: { name: "Burpees", cue: "One move — one second" },
    mountainClimbers: {
      name: "Mountain climbers",
      cue: "Forearm plank, keep the rhythm",
    },
    abPulses: { name: "Ab pulses", cue: "Don't lift your lower back" },
    jumpSquats: { name: "Jump squats", cue: "Explode at the top" },
    superman: { name: "Superman", cue: "Lift arms and legs at the same time" },
    climbers: { name: "Climbers", cue: "Knees to chest one at a time" },
    tPushups: { name: "T push-ups", cue: "Rotate at the top" },
  },
  coach: {
    intro: (level) => `🎯 Your workout — level “${level}”.`,
    sectionTitles: {
      plan: "Plan",
      warmup: "Warm-up",
      technique: "Technique",
      load: "Load",
      motivation: "Motivation",
    },
    collapse: "Collapse",
    expand: "Expand",
    warmup: (text) => `\n🟢 Warm-up. ${text}`,
    complex: (names) => `\n📋 Circuit: ${names}.`,
    technique: (tip) => `\n💡 Technique: ${tip}`,
    loadReps: (reps) => `\n📊 Load: ${reps} reps in total.`,
    loadTime: (seconds) =>
      `\n📊 Load: ${seconds} seconds in total in static exercises.`,
    loadBoth: (reps, seconds) =>
      `\n📊 Load: ${reps} reps in total + ${seconds} seconds in static exercises.`,
    warmups: [
      "Before you start — 60 seconds of light jumping jacks to raise your heart rate.",
      "5 arm circles forward and back, 10 torso bends.",
      "Loosen your joints: knees to chest one at a time, then 10 leg swings each side.",
    ],
    pacing: {
      beginner:
        "Pace — easy. Right now clean technique matters more than speed. Rest 30–40 seconds between exercises.",
      intermediate:
        "Keep a steady pace with 20–30 seconds of rest between exercises. Don't rush the first one, save energy for the finish.",
      pro: "High-intensity mode: no more than 15 seconds of rest between exercises. You can run the circuit 2–3 times.",
    },
    motivation: [
      "You've already done the most important thing — started. It gets easier from here.",
      "Every rep brings you closer to better shape. Don't give up on the last exercise.",
      "5 minutes today is more than zero. Let's go.",
      "Your body can do more than your head thinks. Believe in yourself.",
      "Finishing the circuit earns respect. Then you can go another round.",
    ],
    toneIntro: {
      encouraging: "You've got this. The main thing is to start and not stop.",
      strict: "No excuses. Go all out or don't start at all.",
      calm: "No stress. Listen to your body and move at your own pace.",
    },
    focusTip: {
      technique:
        "Focus on technique: the quality of every rep matters more than the count.",
      intensity:
        "Focus on intensity: push to the max, keep rest to a minimum.",
      recovery:
        "Focus on recovery: take 1–2 deep breaths between exercises.",
    },
  },
};

const pl: Dict = {
  documentTitle: "Workout Roulette — trening w domu w 5 sekund",
  appSubtitle:
    "Naciśnij przycisk — i otrzymaj losowy trening z 3–5 ćwiczeń w 5 sekund.",
  difficultyLabel: "Poziom trudności",
  difficultyPlaceholder: "Wybierz poziom...",
  difficulty: {
    beginner: "Początkujący",
    intermediate: "Średni",
    pro: "Profesjonalny",
  },
  workoutTypeLabel: "Typ treningu",
  workoutTypes: {
    fullBody: "Całe ciało",
    upper: "Góra ciała",
    lower: "Dolna część ciała",
    core: "Brzuch i core",
    cardio: "Cardio",
    mobility: "Mobilność",
  },
  quickStart: "Szybki start",
  spin: "Zagraj trening",
  spinning: "Kręcimy ruletką...",
  selectError: "Proszę wybrać poziom trudności przed uruchomieniem ruletki!",
  emptyTitle:
    "Naciśnij przycisk poniżej, aby losowo wygenerować swój trening na dziś!",
  emptyHint: "Wybierz poziom trudności i naciśnij „Zagraj trening”",
  ready: "Twój trening jest gotowy",
  level: "Poziom",
  spinAgain: "Powtórz trening",
  share: "Udostępnij",
  exerciseCountLabel: "Liczba ćwiczeń",
  daily: "Trening dnia",
  progressLabel: "Ukończono",
  allDone: "Trening ukończony!",
  markDone: "Oznacz jako wykonane",
  markUndone: "Cofnij oznaczenie",
  stats: {
    title: "Twoje statystyki",
    streak: "Dni z rzędu",
    workouts: "Treningi",
    minutes: "Minuty",
    clear: "Wyczyść historię",
  },
  history: {
    title: "Historia treningów",
    subtitle: "Ostatnio wybrane treningi",
    clear: "Wyczyść historię treningów",
    load: "Pokaż",
    exercises: "Ćwiczenia",
    showDetails: "Pokaż ćwiczenia",
    hideDetails: "Ukryj ćwiczenia",
  },
  footer: "Workout Roulette — trenuj w domu bez przygotowań",
  exercise: "Ćwiczenie",
  reroll: "Zmień ćwiczenie",
  restTitle: "Odpoczynek",
  restReset: "Resetuj timer",
  restDone: "Czas minął!",
  sec: "sek",
  reps: "powtórzeń",
  start: "Start",
  pause: "Pauza",
  coachTitle: "Trener AI",
  coachSubtitle: "spersonalizowana instrukcja",
  minutes: (n) => `~${n} min`,
  copied: "Skopiowano",
  copyPrompt: "Kopiuj prompt",
  settingsAria: "Ustawienia",
  language: "Język",
  appearance: {
    title: "Wygląd i dźwięk",
    theme: "Motyw kolorystyczny",
    themes: {
      emerald: "Szmaragd",
      ocean: "Ocean",
      violet: "Fiolet",
      sunset: "Zachód słońca",
      rose: "Róż",
    },
    background: "Tło strony",
    backgrounds: {
      aurora: "Zorza",
      midnight: "Północ",
      sunset: "Zachód słońca",
      forest: "Las",
      graphite: "Grafit",
    },
    sound: "Dźwięk timera",
    soundDesc: "Krótki sygnał, gdy czas minie",
    music: "Muzyka na treningu",
    musicDesc: "Rytm w tle, który możesz wyłączyć w każdej chwili",
    musicStyles: {
      focus: "Skupienie",
      energy: "Energia",
      calm: "Spokój",
      pulse: "Puls",
      night: "Noc",
    },
    musicSources: {
      procedural: "Wbudowane",
      custom: "Moje utwory",
      spotify: "Spotify",
    },
    uploadTrack: "Wgraj własny utwór",
    addTrack: "Dodaj utwór",
    musicVolume: "Głośność muzyki",
    replaceTrack: "Zmień utwór",
    removeTrack: "Usuń utwór",
    trackHint: "MP3, WAV, OGG lub M4A · do 30 MB",
    trackErrors: {
      tooLarge: "Plik jest za duży — maksymalnie 30 MB",
      unsupported: "To nie jest plik audio. Wybierz MP3, WAV, OGG lub M4A",
      tooMany: "Maksymalnie 10 utworów — usuń jeden",
      failed: "Nie udało się zapisać utworu. Spróbuj ponownie",
    },
    spotify: {
      title: "Spotify",
      setupTitle: "Połączenie ze Spotify",
      setupDesc:
        "Utwórz aplikację na developer.spotify.com, wklej jej Client ID i dodaj poniższy Redirect URI w ustawieniach aplikacji.",
      clientId: "Client ID",
      clientIdPlaceholder: "Wklej Client ID aplikacji",
      save: "Zapisz",
      redirectUri: "Redirect URI",
      copy: "Kopiuj",
      copied: "Skopiowano",
      connect: "Zaloguj się przez Spotify",
      disconnect: "Odłącz",
      connectedAs: (name) => `Połączono: ${name}`,
      search: "Szukaj w Spotify",
      searchPlaceholder: "Utwór, wykonawca lub playlista",
      searching: "Szukam…",
      noResults: "Nic nie znaleziono",
      tracks: "Utwory",
      playlists: "Playlisty",
      nowPlaying: "Teraz gra",
      play: "Odtwórz",
      pause: "Pauza",
      next: "Następny",
      previous: "Poprzedni",
      premium: "Do odtwarzania w przeglądarce potrzebny jest Spotify Premium.",
      notConfigured: "Najpierw zapisz Client ID.",
      authError: "Nie udało się połączyć ze Spotify. Spróbuj ponownie.",
      playbackError:
        "Nie udało się odtworzyć. Sprawdź, czy Spotify nie działa na innym urządzeniu.",
      networkError: "Błąd sieci. Sprawdź połączenie.",
      noDevice: "Odtwarzacz nie jest jeszcze gotowy. Poczekaj kilka sekund.",
      playerStarting: "Przygotowuję odtwarzacz…",
      hint: "Odtwarzanie działa przez oficjalny Spotify Web Playback SDK.",
    },
    motion: "Mniej animacji",
    motionDesc: "Wyłącz dodatkowe efekty i ruch",
    keepAwake: "Nie wygaszaj ekranu",
    keepAwakeDesc: "Ekran nie zgaśnie podczas treningu",
    reset: "Resetuj ustawienia",
  },
  side: {
    featuresTitle: "Dlaczego to działa",
    features: [
      { title: "5 sekund", desc: "od pomysłu do gotowego planu" },
      { title: "3–5 ćwiczeń", desc: "zbalansowany mini-obwód" },
      { title: "0 sprzętu", desc: "tylko ty i podłoga" },
      { title: "Trener AI", desc: "spersonalizowane wskazówki" },
    ],
    stepsTitle: "Jak to działa",
    steps: [
      { title: "Wybierz poziom", desc: "początkujący, średni lub pro" },
      { title: "Kręć ruletką", desc: "otrzymaj 3 losowe ćwiczenia" },
      { title: "Trenuj", desc: "z timerem i podpowiedziami" },
    ],
  },
  settings: {
    title: "Ustawienia",
    subtitle: "Trener, motyw, dźwięk i dostępność",
    close: "Zamknij",
    coachOn: "Włączony · instrukcja jest widoczna",
    coachOff: "Wyłączony · instrukcja jest ukryta",
    aiModel: "Model AI",
    free: "free",
    tone: "Ton trenera",
    toneOptions: {
      encouraging: { label: "Wspierający", desc: "Motywuje i dodaje otuchy" },
      strict: { label: "Surowy", desc: "Naciska na maksimum" },
      calm: { label: "Spokojny", desc: "Bez stresu, we własnym tempie" },
    },
    focus: "Fokus treningu",
    focusOptions: {
      technique: { label: "Technika", desc: "Jakość ruchów przede wszystkim" },
      intensity: { label: "Intensywność", desc: "Maksymalny wysiłek, min. przerw" },
      recovery: { label: "Regeneracja", desc: "Oddech i przerwy między ćwiczeniami" },
    },
    sections: "Sekcje instrukcji",
    warmup: "Rozgrzewka",
    warmupDesc: "Wskazówka na rozgrzewkę przed startem",
    motivation: "Motywacja",
    motivationDesc: "Końcowe pokrzepiające podsumowanie",
    enabled: "włączono",
    disabled: "wyłączono",
    apiKeys: "Klucze API",
    apiKeysDesc: "Twórz klucze do usług AI i zarządzaj nimi",
    addKeyAria: "Dodaj klucz API",
    otherService: "Inna usługa",
    keyNamePlaceholder: "Nazwa klucza, np. Production",
    keyValuePlaceholder: "Wklej klucz API",
    addKeyButton: "Dodaj klucz",
    keyWarning:
      "Nie używaj tego trybu do prawdziwych sekretów: klucz żyje tylko w pamięci tej karty.",
    showKey: "Pokaż klucz",
    hideKey: "Ukryj klucz",
    deleteKey: "Usuń klucz",
    done: "Gotowe",
  },
  exercises: {
    squats: { name: "Przysiady", cue: "Schodź powoli, wstawaj dynamicznie" },
    plank: { name: "Deska", cue: "Utrzymuj miednicę, nie wyginaj lędźwi" },
    pushups: { name: "Pompki", cue: "Łokcie pod kątem 45°" },
    jumpingJacks: { name: "Skoki w miejscu", cue: "Miękkie lądowanie na palcach" },
    lunges: { name: "Wykroki", cue: "Kolano nie wychodzi za palce stóp" },
    highKnees: { name: "Wysokie kolana", cue: "Kolana do klatki w równym rytmie" },
    crunches: { name: "Brzuszki", cue: "Unosić się siłą mięśni brzucha" },
    gluteBridge: { name: "Mostek biodrowy", cue: "Dociśnij miednicę do sufitu" },
    burpees: { name: "Burpees", cue: "Jeden ruch — jedna sekunda" },
    mountainClimbers: {
      name: "Mountain climbers",
      cue: "Podpór na przedramionach, rytm",
    },
    abPulses: { name: "Pulsy na brzuch", cue: "Nie odrywaj lędźwi" },
    jumpSquats: { name: "Przysiady ze skokiem", cue: "Wybuch w górnej fazie" },
    superman: { name: "Superman", cue: "Unieś ręce i nogi jednocześnie" },
    climbers: { name: "Wspinacz", cue: "Kolana do klatki na zmianę" },
    tPushups: { name: "Pompki T", cue: "Obrót w górnej fazie" },
  },
  coach: {
    intro: (level) => `🎯 Twój trening — poziom „${level}”.`,
    sectionTitles: {
      plan: "Plan",
      warmup: "Rozgrzewka",
      technique: "Technika",
      load: "Obciążenie",
      motivation: "Motywacja",
    },
    collapse: "Zwiń",
    expand: "Rozwiń",
    warmup: (text) => `\n🟢 Rozgrzewka. ${text}`,
    complex: (names) => `\n📋 Obwód: ${names}.`,
    technique: (tip) => `\n💡 Technika: ${tip}`,
    loadReps: (reps) => `\n📊 Obciążenie: łącznie ${reps} powtórzeń.`,
    loadTime: (seconds) =>
      `\n📊 Obciążenie: łącznie ${seconds} sekund w ćwiczeniach statycznych.`,
    loadBoth: (reps, seconds) =>
      `\n📊 Obciążenie: łącznie ${reps} powtórzeń + ${seconds} sekund w ćwiczeniach statycznych.`,
    warmups: [
      "Przed startem — 60 sekund lekkich skoków w miejscu, aby podnieść tętno.",
      "5 krążeń ramion w przód i w tył, 10 skłonów tułowia.",
      "Rozluźnij stawy: kolana na zmianę do klatki, potem 10 wymachów nóg na stronę.",
    ],
    pacing: {
      beginner:
        "Tempo — spokojne. Liczy się czysta technika, nie szybkość. Rób 30–40 sekund przerwy między ćwiczeniami.",
      intermediate:
        "Utrzymuj równe tempo z 20–30 sekundami przerwy między ćwiczeniami. Nie spiesz się w pierwszym, zachowaj siły na finisz.",
      pro: "Tryb wysokiej intensywności: przerwa nie dłuższa niż 15 sekund między ćwiczeniami. Możesz przejść obwód 2–3 razy.",
    },
    motivation: [
      "Zrobiłeś już najważniejsze — zacząłeś. Dalej będzie łatwiej.",
      "Każde powtórzenie przybliża cię do lepszej formy. Nie poddawaj się na ostatnim ćwiczeniu.",
      "5 minut dziś to więcej niż zero. Jedziemy.",
      "Twoje ciało potrafi więcej, niż myśli głowa. Wierz w siebie.",
      "Ukończenie obwodu to powód do dumy. A potem można jeszcze jedną rundę.",
    ],
    toneIntro: {
      encouraging: "Dasz radę. Najważniejsze to zacząć i nie przestawać.",
      strict: "Bez wymówek. Robisz na maksa albo wcale nie zaczynasz.",
      calm: "Bez stresu. Słuchaj ciała i ruszaj się we własnym tempie.",
    },
    focusTip: {
      technique:
        "Fokus na technice: jakość każdego powtórzenia ważniejsza niż liczba.",
      intensity:
        "Fokus na intensywności: ciśnij na maksimum, skracaj przerwy do minimum.",
      recovery:
        "Fokus na regeneracji: między ćwiczeniami zrób 1–2 głębokie wdechy i wydechy.",
    },
  },
};

const de: Dict = {
  documentTitle: "Workout Roulette — Home-Workout in 5 Sekunden",
  appSubtitle:
    "Drück den Button — und erhalte in 5 Sekunden ein zufälliges Workout mit 3–5 Übungen.",
  difficultyLabel: "Schwierigkeitsgrad",
  difficultyPlaceholder: "Wähle ein Level...",
  difficulty: {
    beginner: "Anfänger",
    intermediate: "Mittel",
    pro: "Profi",
  },
  workoutTypeLabel: "Trainingsart",
  workoutTypes: {
    fullBody: "Ganzkörper",
    upper: "Oberkörper",
    lower: "Unterkörper",
    core: "Bauch & Core",
    cardio: "Cardio",
    mobility: "Mobilität",
  },
  quickStart: "Schnellstart",
  spin: "Workout starten",
  spinning: "Roulette dreht sich...",
  selectError:
    "Bitte wähle vor dem Start des Roulettes einen Schwierigkeitsgrad!",
  emptyTitle:
    "Drück den Button unten, um dein Workout für heute zufällig zu generieren!",
  emptyHint: "Wähle einen Schwierigkeitsgrad und drück „Workout starten“",
  ready: "Dein Workout ist bereit",
  level: "Level",
  spinAgain: "Training wiederholen",
  share: "Teilen",
  exerciseCountLabel: "Anzahl der Übungen",
  daily: "Workout des Tages",
  progressLabel: "Erledigt",
  allDone: "Workout geschafft!",
  markDone: "Als erledigt markieren",
  markUndone: "Markierung aufheben",
  stats: {
    title: "Deine Statistik",
    streak: "Tage in Folge",
    workouts: "Workouts",
    minutes: "Minuten",
    clear: "Verlauf löschen",
  },
  history: {
    title: "Trainingsverlauf",
    subtitle: "Deine zuletzt gewählten Trainings",
    clear: "Trainingsverlauf löschen",
    load: "Anzeigen",
    exercises: "Übungen",
    showDetails: "Übungen anzeigen",
    hideDetails: "Übungen ausblenden",
  },
  footer: "Workout Roulette — trainiere zu Hause ohne Vorbereitung",
  exercise: "Übung",
  reroll: "Übung tauschen",
  restTitle: "Pause",
  restReset: "Timer zurücksetzen",
  restDone: "Zeit ist um!",
  sec: "Sek",
  reps: "Wdh.",
  start: "Start",
  pause: "Pause",
  coachTitle: "KI-Coach",
  coachSubtitle: "persönliche Anleitung",
  minutes: (n) => `~${n} Min`,
  copied: "Kopiert",
  copyPrompt: "Prompt kopieren",
  settingsAria: "Einstellungen",
  language: "Sprache",
  appearance: {
    title: "Aussehen & Ton",
    theme: "Farbthema",
    themes: {
      emerald: "Smaragd",
      ocean: "Ozean",
      violet: "Violett",
      sunset: "Sonnenuntergang",
      rose: "Rose",
    },
    background: "Seitenhintergrund",
    backgrounds: {
      aurora: "Polarlicht",
      midnight: "Mitternacht",
      sunset: "Sonnenuntergang",
      forest: "Wald",
      graphite: "Graphit",
    },
    sound: "Timer-Ton",
    soundDesc: "Ein kurzer Ton, wenn die Zeit abläuft",
    music: "Musik beim Training",
    musicDesc: "Hintergrundrhythmus, jederzeit abschaltbar",
    musicStyles: {
      focus: "Fokus",
      energy: "Energie",
      calm: "Ruhe",
      pulse: "Puls",
      night: "Nacht",
    },
    musicSources: {
      procedural: "Integriert",
      custom: "Meine Tracks",
      spotify: "Spotify",
    },
    uploadTrack: "Eigenen Track hochladen",
    addTrack: "Track hinzufügen",
    musicVolume: "Musiklautstärke",
    replaceTrack: "Track ersetzen",
    removeTrack: "Track entfernen",
    trackHint: "MP3, WAV, OGG oder M4A · bis 30 MB",
    trackErrors: {
      tooLarge: "Datei ist zu groß — maximal 30 MB",
      unsupported: "Das ist keine Audiodatei. Wähle MP3, WAV, OGG oder M4A",
      tooMany: "Maximal 10 Tracks — entferne zuerst einen",
      failed: "Track konnte nicht gespeichert werden. Bitte erneut versuchen",
    },
    spotify: {
      title: "Spotify",
      setupTitle: "Spotify verbinden",
      setupDesc:
        "Erstelle eine App auf developer.spotify.com, füge die Client ID ein und trage die folgende Redirect URI in den App-Einstellungen ein.",
      clientId: "Client ID",
      clientIdPlaceholder: "Client ID der App einfügen",
      save: "Speichern",
      redirectUri: "Redirect URI",
      copy: "Kopieren",
      copied: "Kopiert",
      connect: "Mit Spotify anmelden",
      disconnect: "Trennen",
      connectedAs: (name) => `Verbunden: ${name}`,
      search: "Spotify durchsuchen",
      searchPlaceholder: "Titel, Künstler oder Playlist",
      searching: "Suche…",
      noResults: "Nichts gefunden",
      tracks: "Titel",
      playlists: "Playlists",
      nowPlaying: "Läuft gerade",
      play: "Abspielen",
      pause: "Pause",
      next: "Weiter",
      previous: "Zurück",
      premium: "Für die Wiedergabe im Browser ist Spotify Premium erforderlich.",
      notConfigured: "Speichere zuerst eine Client ID.",
      authError: "Verbindung zu Spotify fehlgeschlagen. Bitte erneut versuchen.",
      playbackError:
        "Wiedergabe fehlgeschlagen. Prüfe, ob Spotify auf einem anderen Gerät läuft.",
      networkError: "Netzwerkfehler. Prüfe die Verbindung.",
      noDevice: "Der Player ist noch nicht bereit. Warte ein paar Sekunden.",
      playerStarting: "Player wird vorbereitet…",
      hint: "Die Wiedergabe nutzt das offizielle Spotify Web Playback SDK.",
    },
    motion: "Weniger Animationen",
    motionDesc: "Zusätzliche Effekte und Bewegung ausschalten",
    keepAwake: "Bildschirm wach halten",
    keepAwakeDesc: "Der Bildschirm bleibt beim Training an",
    reset: "Einstellungen zurücksetzen",
  },
  side: {
    featuresTitle: "Warum es funktioniert",
    features: [
      { title: "5 Sekunden", desc: "von der Idee zum fertigen Plan" },
      { title: "3–5 Übungen", desc: "ein ausgewogener Mini-Zirkel" },
      { title: "0 Ausrüstung", desc: "nur du und der Boden" },
      { title: "KI-Coach", desc: "persönliche Hinweise" },
    ],
    stepsTitle: "So funktioniert's",
    steps: [
      { title: "Level wählen", desc: "Anfänger, Mittel oder Profi" },
      { title: "Roulette drehen", desc: "erhalte 3 zufällige Übungen" },
      { title: "Trainieren", desc: "mit Timer und Hinweisen" },
    ],
  },
  settings: {
    title: "Einstellungen",
    subtitle: "Coach, Design, Ton und Barrierefreiheit",
    close: "Schließen",
    coachOn: "Aktiviert · Anleitung wird angezeigt",
    coachOff: "Deaktiviert · Anleitung ist ausgeblendet",
    aiModel: "KI-Modell",
    free: "free",
    tone: "Ton des Coaches",
    toneOptions: {
      encouraging: { label: "Ermutigend", desc: "Motiviert und baut auf" },
      strict: { label: "Streng", desc: "Treibt dich ans Maximum" },
      calm: { label: "Ruhig", desc: "Kein Stress, in deinem Tempo" },
    },
    focus: "Trainingsfokus",
    focusOptions: {
      technique: { label: "Technik", desc: "Qualität der Bewegung über alles" },
      intensity: { label: "Intensität", desc: "Maximale Anstrengung, min. Pausen" },
      recovery: { label: "Erholung", desc: "Atmung und Pausen zwischen Übungen" },
    },
    sections: "Abschnitte der Anleitung",
    warmup: "Aufwärmen",
    warmupDesc: "Tipp zum Aufwärmen vor dem Start",
    motivation: "Motivation",
    motivationDesc: "Ermutigende Schlussbotschaft",
    enabled: "an",
    disabled: "aus",
    apiKeys: "API-Schlüssel",
    apiKeysDesc: "Erstelle und verwalte Schlüssel für KI-Dienste",
    addKeyAria: "API-Schlüssel hinzufügen",
    otherService: "Anderer Dienst",
    keyNamePlaceholder: "Schlüsselname, z. B. Production",
    keyValuePlaceholder: "API-Schlüssel einfügen",
    addKeyButton: "Schlüssel hinzufügen",
    keyWarning:
      "Nutze diesen Modus nicht für echte Geheimnisse: Der Schlüssel lebt nur im Speicher dieses Tabs.",
    showKey: "Schlüssel anzeigen",
    hideKey: "Schlüssel verbergen",
    deleteKey: "Schlüssel löschen",
    done: "Fertig",
  },
  exercises: {
    squats: { name: "Kniebeugen", cue: "Langsam absenken, explosiv aufstehen" },
    plank: {
      name: "Unterarmstütz",
      cue: "Becken halten, Kreuz nicht durchhängen lassen",
    },
    pushups: { name: "Liegestütze", cue: "Ellbogen im 45°-Winkel" },
    jumpingJacks: { name: "Hampelmänner", cue: "Sanft auf den Fußballen landen" },
    lunges: { name: "Ausfallschritte", cue: "Knie bleibt hinter den Zehen" },
    highKnees: { name: "Kniehebelauf", cue: "Knie im Rhythmus zur Brust" },
    crunches: { name: "Sit-ups", cue: "Mit der Bauchmuskulatur hochkommen" },
    gluteBridge: { name: "Glute Bridge", cue: "Becken zur Decke drücken" },
    burpees: { name: "Burpees", cue: "Eine Bewegung — eine Sekunde" },
    mountainClimbers: {
      name: "Mountain Climbers",
      cue: "Unterarmstütz, Rhythmus halten",
    },
    abPulses: { name: "Bauchpulse", cue: "Kreuz nicht abheben" },
    jumpSquats: {
      name: "Sprung-Kniebeugen",
      cue: "Explosion in der oberen Position",
    },
    superman: { name: "Superman", cue: "Arme und Beine gleichzeitig heben" },
    climbers: { name: "Climber", cue: "Knie abwechselnd zur Brust" },
    tPushups: { name: "T-Liegestütze", cue: "Rotation in der oberen Position" },
  },
  coach: {
    intro: (level) => `🎯 Dein Workout — Level „${level}“.`,
    sectionTitles: {
      plan: "Plan",
      warmup: "Aufwärmen",
      technique: "Technik",
      load: "Belastung",
      motivation: "Motivation",
    },
    collapse: "Einklappen",
    expand: "Ausklappen",
    warmup: (text) => `\n🟢 Aufwärmen. ${text}`,
    complex: (names) => `\n📋 Zirkel: ${names}.`,
    technique: (tip) => `\n💡 Technik: ${tip}`,
    loadReps: (reps) =>
      `\n📊 Belastung: insgesamt ${reps} Wiederholungen.`,
    loadTime: (seconds) =>
      `\n📊 Belastung: insgesamt ${seconds} Sekunden bei statischen Übungen.`,
    loadBoth: (reps, seconds) =>
      `\n📊 Belastung: insgesamt ${reps} Wiederholungen + ${seconds} Sekunden bei statischen Übungen.`,
    warmups: [
      "Vor dem Start — 60 Sekunden leichtes Hampelmann-Training, um den Puls zu heben.",
      "5 Armkreise vor und zurück, 10 Rumpfbeugen.",
      "Gelenke lockern: Knie abwechselnd zur Brust, dann 10 Beinschwünge pro Seite.",
    ],
    pacing: {
      beginner:
        "Tempo — ruhig. Jetzt zählt saubere Technik, nicht Geschwindigkeit. Mach 30–40 Sekunden Pause zwischen den Übungen.",
      intermediate:
        "Halte ein gleichmäßiges Tempo mit 20–30 Sekunden Pause zwischen den Übungen. Überstürze die erste nicht, spare Kraft für das Finale.",
      pro: "Hochintensivmodus: höchstens 15 Sekunden Pause zwischen den Übungen. Du kannst den Zirkel 2–3 Mal durchlaufen.",
    },
    motivation: [
      "Du hast das Wichtigste schon geschafft — angefangen. Ab jetzt wird es leichter.",
      "Jede Wiederholung bringt dich näher an eine bessere Form. Gib bei der letzten Übung nicht auf.",
      "5 Minuten heute sind mehr als null. Los geht's.",
      "Dein Körper kann mehr, als dein Kopf denkt. Glaub an dich.",
      "Den Zirkel zu beenden verdient Respekt. Danach geht noch eine Runde.",
    ],
    toneIntro: {
      encouraging:
        "Du schaffst das. Das Wichtigste ist, anzufangen und nicht aufzuhören.",
      strict: "Keine Ausreden. Alles geben oder gar nicht anfangen.",
      calm: "Kein Stress. Hör auf deinen Körper und bewege dich in deinem Tempo.",
    },
    focusTip: {
      technique:
        "Fokus auf Technik: Die Qualität jeder Wiederholung zählt mehr als die Anzahl.",
      intensity:
        "Fokus auf Intensität: Gib alles, halte die Pausen minimal.",
      recovery:
        "Fokus auf Erholung: Atme zwischen den Übungen 1–2 Mal tief ein und aus.",
    },
  },
};

const es: Dict = {
  documentTitle: "Workout Roulette — entrenamiento en casa en 5 segundos",
  appSubtitle:
    "Pulsa el botón y obtén un entrenamiento aleatorio de 3–5 ejercicios en 5 segundos.",
  difficultyLabel: "Nivel de dificultad",
  difficultyPlaceholder: "Elige un nivel...",
  difficulty: {
    beginner: "Principiante",
    intermediate: "Intermedio",
    pro: "Profesional",
  },
  workoutTypeLabel: "Tipo de entrenamiento",
  workoutTypes: {
    fullBody: "Cuerpo completo",
    upper: "Tren superior",
    lower: "Tren inferior",
    core: "Core",
    cardio: "Cardio",
    mobility: "Movilidad",
  },
  quickStart: "Inicio rápido",
  spin: "Jugar entrenamiento",
  spinning: "Girando la ruleta...",
  selectError: "¡Elige un nivel de dificultad antes de girar la ruleta!",
  emptyTitle:
    "¡Pulsa el botón de abajo para generar al azar tu entrenamiento de hoy!",
  emptyHint: "Elige un nivel de dificultad y pulsa «Jugar entrenamiento»",
  ready: "Tu entrenamiento está listo",
  level: "Nivel",
  spinAgain: "Repetir entrenamiento",
  share: "Compartir",
  exerciseCountLabel: "Número de ejercicios",
  daily: "Entrenamiento del día",
  progressLabel: "Completado",
  allDone: "¡Entrenamiento completado!",
  markDone: "Marcar como hecho",
  markUndone: "Quitar la marca",
  stats: {
    title: "Tus estadísticas",
    streak: "Días seguidos",
    workouts: "Entrenamientos",
    minutes: "Minutos",
    clear: "Borrar historial",
  },
  history: {
    title: "Historial de entrenamientos",
    subtitle: "Tus entrenamientos recientes",
    clear: "Borrar historial de entrenamientos",
    load: "Ver",
    exercises: "Ejercicios",
    showDetails: "Mostrar ejercicios",
    hideDetails: "Ocultar ejercicios",
  },
  footer: "Workout Roulette — entrena en casa sin preparación",
  exercise: "Ejercicio",
  reroll: "Cambiar ejercicio",
  restTitle: "Descanso",
  restReset: "Reiniciar temporizador",
  restDone: "¡Tiempo!",
  sec: "seg",
  reps: "repeticiones",
  start: "Iniciar",
  pause: "Pausa",
  coachTitle: "Entrenador IA",
  coachSubtitle: "instrucción personal",
  minutes: (n) => `~${n} min`,
  copied: "Copiado",
  copyPrompt: "Copiar prompt",
  settingsAria: "Ajustes",
  language: "Idioma",
  appearance: {
    title: "Apariencia y sonido",
    theme: "Tema de color",
    themes: {
      emerald: "Esmeralda",
      ocean: "Océano",
      violet: "Violeta",
      sunset: "Atardecer",
      rose: "Rosa",
    },
    background: "Fondo del sitio",
    backgrounds: {
      aurora: "Aurora",
      midnight: "Medianoche",
      sunset: "Atardecer",
      forest: "Bosque",
      graphite: "Grafito",
    },
    sound: "Sonido del temporizador",
    soundDesc: "Un pitido corto cuando acaba el tiempo",
    music: "Música durante el entrenamiento",
    musicDesc: "Ritmo de fondo que puedes apagar cuando quieras",
    musicStyles: {
      focus: "Enfoque",
      energy: "Energía",
      calm: "Calma",
      pulse: "Pulso",
      night: "Noche",
    },
    musicSources: {
      procedural: "Integradas",
      custom: "Mis pistas",
      spotify: "Spotify",
    },
    uploadTrack: "Sube tu pista",
    addTrack: "Añadir pista",
    musicVolume: "Volumen de la música",
    replaceTrack: "Cambiar pista",
    removeTrack: "Quitar pista",
    trackHint: "MP3, WAV, OGG o M4A · hasta 30 MB",
    trackErrors: {
      tooLarge: "El archivo es demasiado grande: máximo 30 MB",
      unsupported: "No es un archivo de audio. Elige MP3, WAV, OGG o M4A",
      tooMany: "Máximo 10 pistas: elimina una primero",
      failed: "No se pudo guardar la pista. Inténtalo de nuevo",
    },
    spotify: {
      title: "Spotify",
      setupTitle: "Conectar Spotify",
      setupDesc:
        "Crea una app en developer.spotify.com, pega su Client ID y añade el Redirect URI de abajo en los ajustes de la app.",
      clientId: "Client ID",
      clientIdPlaceholder: "Pega el Client ID de la app",
      save: "Guardar",
      redirectUri: "Redirect URI",
      copy: "Copiar",
      copied: "Copiado",
      connect: "Iniciar sesión con Spotify",
      disconnect: "Desconectar",
      connectedAs: (name) => `Conectado: ${name}`,
      search: "Buscar en Spotify",
      searchPlaceholder: "Canción, artista o playlist",
      searching: "Buscando…",
      noResults: "No se encontró nada",
      tracks: "Canciones",
      playlists: "Playlists",
      nowPlaying: "Reproduciendo",
      play: "Reproducir",
      pause: "Pausa",
      next: "Siguiente",
      previous: "Anterior",
      premium: "Se necesita Spotify Premium para reproducir en el navegador.",
      notConfigured: "Guarda primero un Client ID.",
      authError: "No se pudo conectar con Spotify. Inténtalo de nuevo.",
      playbackError:
        "No se pudo reproducir. Comprueba que Spotify no esté activo en otro dispositivo.",
      networkError: "Error de red. Comprueba la conexión.",
      noDevice: "El reproductor aún no está listo. Espera unos segundos.",
      playerStarting: "Preparando el reproductor…",
      hint: "La reproducción usa el Spotify Web Playback SDK oficial.",
    },
    motion: "Reducir animaciones",
    motionDesc: "Desactiva efectos y movimiento extra",
    keepAwake: "Mantener pantalla activa",
    keepAwakeDesc: "La pantalla no se apaga durante el entrenamiento",
    reset: "Restablecer ajustes",
  },
  side: {
    featuresTitle: "Por qué funciona",
    features: [
      { title: "5 segundos", desc: "de la idea al plan listo" },
      { title: "3–5 ejercicios", desc: "un mini circuito equilibrado" },
      { title: "0 equipamiento", desc: "solo tú y el suelo" },
      { title: "Entrenador IA", desc: "consejos personalizados" },
    ],
    stepsTitle: "Cómo funciona",
    steps: [
      { title: "Elige un nivel", desc: "principiante, intermedio o pro" },
      { title: "Gira la ruleta", desc: "obtén 3–5 ejercicios al azar" },
      { title: "Entrena", desc: "con temporizador y consejos" },
    ],
  },
  settings: {
    title: "Ajustes",
    subtitle: "Entrenador, tema, sonido y accesibilidad",
    close: "Cerrar",
    coachOn: "Activado · la instrucción se muestra",
    coachOff: "Desactivado · la instrucción está oculta",
    aiModel: "Modelo de IA",
    free: "free",
    tone: "Tono del entrenador",
    toneOptions: {
      encouraging: { label: "Motivador", desc: "Motiva y anima" },
      strict: { label: "Estricto", desc: "Te lleva al máximo" },
      calm: { label: "Tranquilo", desc: "Sin estrés, a tu ritmo" },
    },
    focus: "Enfoque del entrenamiento",
    focusOptions: {
      technique: { label: "Técnica", desc: "La calidad del movimiento ante todo" },
      intensity: { label: "Intensidad", desc: "Máximo esfuerzo, mín. pausas" },
      recovery: { label: "Recuperación", desc: "Respiración y pausas entre ejercicios" },
    },
    sections: "Secciones de la instrucción",
    warmup: "Calentamiento",
    warmupDesc: "Consejo para calentar antes de empezar",
    motivation: "Motivación",
    motivationDesc: "Mensaje final de ánimo",
    enabled: "activado",
    disabled: "desactivado",
    apiKeys: "Claves API",
    apiKeysDesc: "Crea y gestiona claves para servicios de IA",
    addKeyAria: "Añadir clave API",
    otherService: "Otro servicio",
    keyNamePlaceholder: "Nombre de la clave, p. ej. Production",
    keyValuePlaceholder: "Pega la clave API",
    addKeyButton: "Añadir clave",
    keyWarning:
      "No uses este modo para secretos reales: la clave solo vive en la memoria de esta pestaña.",
    showKey: "Mostrar clave",
    hideKey: "Ocultar clave",
    deleteKey: "Eliminar clave",
    done: "Listo",
  },
  exercises: {
    squats: { name: "Sentadillas", cue: "Baja despacio, sube explosivo" },
    plank: {
      name: "Plancha",
      cue: "Mantén la pelvis, no arquees la espalda baja",
    },
    pushups: { name: "Flexiones", cue: "Codos a 45°" },
    jumpingJacks: {
      name: "Saltos en el sitio",
      cue: "Aterriza suave sobre las puntas",
    },
    lunges: { name: "Zancadas", cue: "La rodilla no pasa la punta del pie" },
    highKnees: { name: "Rodillas altas", cue: "Rodillas al pecho con ritmo" },
    crunches: { name: "Abdominales", cue: "Sube con los músculos del abdomen" },
    gluteBridge: {
      name: "Puente de glúteos",
      cue: "Empuja la pelvis hacia el techo",
    },
    burpees: { name: "Burpees", cue: "Un movimiento — un segundo" },
    mountainClimbers: {
      name: "Mountain climbers",
      cue: "Plancha sobre antebrazos, mantén el ritmo",
    },
    abPulses: { name: "Pulsos abdominales", cue: "No despeques la espalda baja" },
    jumpSquats: {
      name: "Sentadillas con salto",
      cue: "Explota en la parte alta",
    },
    superman: { name: "Superman", cue: "Levanta brazos y piernas a la vez" },
    climbers: { name: "Escalador", cue: "Rodillas al pecho alternando" },
    tPushups: { name: "Flexiones en T", cue: "Gira en la parte alta" },
  },
  coach: {
    intro: (level) => `🎯 Tu entrenamiento — nivel «${level}».`,
    sectionTitles: {
      plan: "Plan",
      warmup: "Calentamiento",
      technique: "Técnica",
      load: "Carga",
      motivation: "Motivación",
    },
    collapse: "Contraer",
    expand: "Expandir",
    warmup: (text) => `\n🟢 Calentamiento. ${text}`,
    complex: (names) => `\n📋 Circuito: ${names}.`,
    technique: (tip) => `\n💡 Técnica: ${tip}`,
    loadReps: (reps) => `\n📊 Carga: ${reps} repeticiones en total.`,
    loadTime: (seconds) =>
      `\n📊 Carga: ${seconds} segundos en total en ejercicios estáticos.`,
    loadBoth: (reps, seconds) =>
      `\n📊 Carga: ${reps} repeticiones en total + ${seconds} segundos en ejercicios estáticos.`,
    warmups: [
      "Antes de empezar: 60 segundos de saltos suaves en el sitio para subir el pulso.",
      "5 círculos de brazos hacia delante y atrás, 10 flexiones de tronco.",
      "Suelta las articulaciones: rodillas al pecho alternando, luego 10 balanceos de piernas por lado.",
    ],
    pacing: {
      beginner:
        "Ritmo tranquilo. Ahora importa la técnica limpia, no la velocidad. Descansa 30–40 segundos entre ejercicios.",
      intermediate:
        "Mantén un ritmo constante con 20–30 segundos de descanso entre ejercicios. No te apresures en el primero, guarda energía para el final.",
      pro: "Modo de alta intensidad: máximo 15 segundos de descanso entre ejercicios. Puedes hacer el circuito 2–3 veces.",
    },
    motivation: [
      "Ya hiciste lo más importante: empezar. Ahora es más fácil.",
      "Cada repetición te acerca a una mejor forma. No te rindas en el último ejercicio.",
      "5 minutos hoy es más que cero. Vamos.",
      "Tu cuerpo puede más de lo que cree tu cabeza. Cree en ti.",
      "Terminar el circuito merece respeto. Y luego otra ronda.",
    ],
    toneIntro: {
      encouraging: "Tú puedes. Lo importante es empezar y no parar.",
      strict: "Sin excusas. Date al máximo o no empieces.",
      calm: "Sin estrés. Escucha a tu cuerpo y muévete a tu ritmo.",
    },
    focusTip: {
      technique:
        "Enfoque en la técnica: la calidad de cada repetición importa más que la cantidad.",
      intensity:
        "Enfoque en la intensidad: empuja al máximo, reduce las pausas al mínimo.",
      recovery:
        "Enfoque en la recuperación: haz 1–2 respiraciones profundas entre ejercicios.",
    },
  },
};

const fr: Dict = {
  documentTitle: "Workout Roulette — un entraînement à la maison en 5 secondes",
  appSubtitle:
    "Appuie sur le bouton et obtiens un entraînement aléatoire de 3–5 exercices en 5 secondes.",
  difficultyLabel: "Niveau de difficulté",
  difficultyPlaceholder: "Choisis un niveau...",
  difficulty: {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    pro: "Pro",
  },
  workoutTypeLabel: "Type d'entraînement",
  workoutTypes: {
    fullBody: "Corps complet",
    upper: "Haut du corps",
    lower: "Bas du corps",
    core: "Gainage",
    cardio: "Cardio",
    mobility: "Mobilité",
  },
  quickStart: "Démarrage rapide",
  spin: "Lancer l'entraînement",
  spinning: "La roulette tourne...",
  selectError:
    "Choisis un niveau de difficulté avant de lancer la roulette !",
  emptyTitle:
    "Appuie sur le bouton ci-dessous pour générer ton entraînement du jour au hasard !",
  emptyHint:
    "Choisis un niveau de difficulté et appuie sur « Lancer l'entraînement »",
  ready: "Ton entraînement est prêt",
  level: "Niveau",
  spinAgain: "Refaire l'entraînement",
  share: "Partager",
  exerciseCountLabel: "Nombre d'exercices",
  daily: "Entraînement du jour",
  progressLabel: "Terminé",
  allDone: "Entraînement terminé !",
  markDone: "Marquer comme fait",
  markUndone: "Retirer la marque",
  stats: {
    title: "Tes statistiques",
    streak: "Jours d'affilée",
    workouts: "Entraînements",
    minutes: "Minutes",
    clear: "Effacer l'historique",
  },
  history: {
    title: "Historique des entraînements",
    subtitle: "Tes derniers entraînements",
    clear: "Effacer l'historique des entraînements",
    load: "Voir",
    exercises: "Exercices",
    showDetails: "Afficher les exercices",
    hideDetails: "Masquer les exercices",
  },
  footer: "Workout Roulette — entraîne-toi à la maison sans préparation",
  exercise: "Exercice",
  reroll: "Changer d'exercice",
  restTitle: "Repos",
  restReset: "Réinitialiser le minuteur",
  restDone: "Temps écoulé !",
  sec: "sec",
  reps: "répétitions",
  start: "Démarrer",
  pause: "Pause",
  coachTitle: "Coach IA",
  coachSubtitle: "consignes personnalisées",
  minutes: (n) => `~${n} min`,
  copied: "Copié",
  copyPrompt: "Copier le prompt",
  settingsAria: "Réglages",
  language: "Langue",
  appearance: {
    title: "Apparence et son",
    theme: "Thème de couleur",
    themes: {
      emerald: "Émeraude",
      ocean: "Océan",
      violet: "Violet",
      sunset: "Coucher de soleil",
      rose: "Rose",
    },
    background: "Fond du site",
    backgrounds: {
      aurora: "Aurore",
      midnight: "Minuit",
      sunset: "Coucher de soleil",
      forest: "Forêt",
      graphite: "Graphite",
    },
    sound: "Son du minuteur",
    soundDesc: "Un bip court à la fin du temps",
    music: "Musique pendant l'entraînement",
    musicDesc: "Rythme de fond que tu peux couper à tout moment",
    musicStyles: {
      focus: "Concentration",
      energy: "Énergie",
      calm: "Calme",
      pulse: "Pouls",
      night: "Nuit",
    },
    musicSources: {
      procedural: "Intégrées",
      custom: "Mes pistes",
      spotify: "Spotify",
    },
    uploadTrack: "Importer ta piste",
    addTrack: "Ajouter une piste",
    musicVolume: "Volume de la musique",
    replaceTrack: "Changer de piste",
    removeTrack: "Supprimer la piste",
    trackHint: "MP3, WAV, OGG ou M4A · jusqu'à 30 Mo",
    trackErrors: {
      tooLarge: "Fichier trop volumineux — 30 Mo max",
      unsupported: "Ce n'est pas un fichier audio. Choisis MP3, WAV, OGG ou M4A",
      tooMany: "10 pistes maximum — supprime-en une",
      failed: "Impossible d'enregistrer la piste. Réessaie",
    },
    spotify: {
      title: "Spotify",
      setupTitle: "Connecter Spotify",
      setupDesc:
        "Crée une application sur developer.spotify.com, colle son Client ID et ajoute l'URI de redirection ci-dessous dans les réglages de l'application.",
      clientId: "Client ID",
      clientIdPlaceholder: "Colle le Client ID de l'application",
      save: "Enregistrer",
      redirectUri: "URI de redirection",
      copy: "Copier",
      copied: "Copié",
      connect: "Se connecter avec Spotify",
      disconnect: "Déconnecter",
      connectedAs: (name) => `Connecté : ${name}`,
      search: "Rechercher sur Spotify",
      searchPlaceholder: "Titre, artiste ou playlist",
      searching: "Recherche…",
      noResults: "Aucun résultat",
      tracks: "Titres",
      playlists: "Playlists",
      nowPlaying: "En lecture",
      play: "Lire",
      pause: "Pause",
      next: "Suivant",
      previous: "Précédent",
      premium: "Spotify Premium est requis pour la lecture dans le navigateur.",
      notConfigured: "Enregistre d'abord un Client ID.",
      authError: "Impossible de se connecter à Spotify. Réessaie.",
      playbackError:
        "La lecture a échoué. Vérifie que Spotify n'est pas actif sur un autre appareil.",
      networkError: "Erreur réseau. Vérifie la connexion.",
      noDevice: "Le lecteur n'est pas encore prêt. Patiente quelques secondes.",
      playerStarting: "Préparation du lecteur…",
      hint: "La lecture utilise le Spotify Web Playback SDK officiel.",
    },
    motion: "Réduire les animations",
    motionDesc: "Désactiver les effets et mouvements superflus",
    keepAwake: "Garder l'écran allumé",
    keepAwakeDesc: "L'écran reste allumé pendant l'entraînement",
    reset: "Réinitialiser les réglages",
  },
  side: {
    featuresTitle: "Pourquoi ça marche",
    features: [
      { title: "5 secondes", desc: "de l'idée au plan prêt" },
      { title: "3–5 exercices", desc: "un mini-circuit équilibré" },
      { title: "0 équipement", desc: "juste toi et le sol" },
      { title: "Coach IA", desc: "des conseils personnalisés" },
    ],
    stepsTitle: "Comment ça marche",
    steps: [
      { title: "Choisis un niveau", desc: "débutant, intermédiaire ou pro" },
      { title: "Lance la roulette", desc: "obtiens 3–5 exercices au hasard" },
      { title: "Entraîne-toi", desc: "avec minuteur et consignes" },
    ],
  },
  settings: {
    title: "Réglages",
    subtitle: "Coach, thème, son et accessibilité",
    close: "Fermer",
    coachOn: "Activé · les consignes sont affichées",
    coachOff: "Désactivé · les consignes sont masquées",
    aiModel: "Modèle IA",
    free: "free",
    tone: "Ton du coach",
    toneOptions: {
      encouraging: { label: "Encourageant", desc: "Motiver et soutenir" },
      strict: { label: "Strict", desc: "Te pousse au maximum" },
      calm: { label: "Calme", desc: "Sans stress, à ton rythme" },
    },
    focus: "Focus de l'entraînement",
    focusOptions: {
      technique: { label: "Technique", desc: "La qualité du mouvement avant tout" },
      intensity: { label: "Intensité", desc: "Effort maximal, pauses minimales" },
      recovery: { label: "Récupération", desc: "Respiration et pauses entre les exercices" },
    },
    sections: "Sections des consignes",
    warmup: "Échauffement",
    warmupDesc: "Conseil pour t'échauffer avant de commencer",
    motivation: "Motivation",
    motivationDesc: "Message final d'encouragement",
    enabled: "activé",
    disabled: "désactivé",
    apiKeys: "Clés API",
    apiKeysDesc: "Crée et gère des clés pour les services IA",
    addKeyAria: "Ajouter une clé API",
    otherService: "Autre service",
    keyNamePlaceholder: "Nom de la clé, ex. Production",
    keyValuePlaceholder: "Colle la clé API",
    addKeyButton: "Ajouter la clé",
    keyWarning:
      "N'utilise pas ce mode pour de vrais secrets : la clé ne vit que dans la mémoire de cet onglet.",
    showKey: "Afficher la clé",
    hideKey: "Masquer la clé",
    deleteKey: "Supprimer la clé",
    done: "Terminé",
  },
  exercises: {
    squats: { name: "Squats", cue: "Descends lentement, remonte explosivement" },
    plank: {
      name: "Gainage",
      cue: "Garde le bassin stable, ne creuse pas le dos",
    },
    pushups: { name: "Pompes", cue: "Coudes à 45°" },
    jumpingJacks: {
      name: "Jumping jacks",
      cue: "Atterris doucement sur les pointes",
    },
    lunges: { name: "Fentes", cue: "Le genou ne dépasse pas les orteils" },
    highKnees: {
      name: "Montées de genoux",
      cue: "Genoux vers la poitrine en rythme",
    },
    crunches: { name: "Abdos", cue: "Monte avec les muscles abdominaux" },
    gluteBridge: {
      name: "Pont fessier",
      cue: "Pousse le bassin vers le plafond",
    },
    burpees: { name: "Burpees", cue: "Un mouvement — une seconde" },
    mountainClimbers: {
      name: "Mountain climbers",
      cue: "Gainage sur les avant-bras, garde le rythme",
    },
    abPulses: {
      name: "Pulsations abdominales",
      cue: "Ne décolle pas le bas du dos",
    },
    jumpSquats: { name: "Squats sautés", cue: "Explose en haut" },
    superman: { name: "Superman", cue: "Lève bras et jambes en même temps" },
    climbers: { name: "Grimpeur", cue: "Genoux vers la poitrine en alternance" },
    tPushups: { name: "Pompes en T", cue: "Rotation en haut" },
  },
  coach: {
    intro: (level) => `🎯 Ton entraînement — niveau « ${level} ».`,
    sectionTitles: {
      plan: "Plan",
      warmup: "Échauffement",
      technique: "Technique",
      load: "Charge",
      motivation: "Motivation",
    },
    collapse: "Réduire",
    expand: "Développer",
    warmup: (text) => `\n🟢 Échauffement. ${text}`,
    complex: (names) => `\n📋 Circuit : ${names}.`,
    technique: (tip) => `\n💡 Technique : ${tip}`,
    loadReps: (reps) => `\n📊 Charge : ${reps} répétitions au total.`,
    loadTime: (seconds) =>
      `\n📊 Charge : ${seconds} secondes au total en exercices statiques.`,
    loadBoth: (reps, seconds) =>
      `\n📊 Charge : ${reps} répétitions au total + ${seconds} secondes en exercices statiques.`,
    warmups: [
      "Avant de commencer — 60 secondes de jumping jacks légers pour faire monter le pouls.",
      "5 cercles de bras en avant et en arrière, 10 flexions du buste.",
      "Assouplis tes articulations : genoux vers la poitrine en alternance, puis 10 balanciers de jambes par côté.",
    ],
    pacing: {
      beginner:
        "Rythme tranquille. La technique propre compte plus que la vitesse. Repose-toi 30 à 40 secondes entre les exercices.",
      intermediate:
        "Garde un rythme régulier avec 20 à 30 secondes de repos entre les exercices. Ne te précipite pas sur le premier, garde de l'énergie pour la fin.",
      pro: "Mode haute intensité : 15 secondes de repos maximum entre les exercices. Tu peux enchaîner le circuit 2 à 3 fois.",
    },
    motivation: [
      "Tu as déjà fait le plus important : commencer. La suite est plus facile.",
      "Chaque répétition te rapproche d'une meilleure forme. N'abandonne pas au dernier exercice.",
      "5 minutes aujourd'hui, c'est plus que zéro. On y va.",
      "Ton corps peut plus que ce que ta tête croit. Crois en toi.",
      "Terminer le circuit, ça se respecte. Et ensuite, un autre tour.",
    ],
    toneIntro: {
      encouraging:
        "Tu vas y arriver. L'essentiel, c'est de commencer et de ne pas s'arrêter.",
      strict: "Pas d'excuses. Tu donnes tout ou tu ne commences pas.",
      calm: "Sans stress. Écoute ton corps et bouge à ton rythme.",
    },
    focusTip: {
      technique:
        "Focus technique : la qualité de chaque répétition compte plus que la quantité.",
      intensity:
        "Focus intensité : pousse au maximum, réduis les pauses au minimum.",
      recovery:
        "Focus récupération : fais 1 à 2 respirations profondes entre les exercices.",
    },
  },
};

const DICTIONARIES: Record<Lang, Dict> = { uk, en, pl, de, es, fr };

const STORAGE_KEY = "workout-roulette-lang";

function isLang(value: string | null): value is Lang {
  return !!value && LANGUAGES.some((item) => item.value === value);
}

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "uk";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLang(stored) ? stored : "uk";
  });

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage may be unavailable — language still works for this session
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTIONARIES[lang].documentTitle;
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t: DICTIONARIES[lang] }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return context;
}

export function getDict(lang: Lang): Dict {
  return DICTIONARIES[lang];
}
