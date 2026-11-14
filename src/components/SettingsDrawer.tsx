import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  Bot,
  X,
  Zap,
  Smile,
  Leaf,
  Dumbbell,
  HeartPulse,
  Sparkles,
  Flame,
  KeyRound,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  Volume2,
  Music,
  MonitorSmartphone,
  RotateCcw,
  Check,
  Upload,
  FileMusic,
  Loader2,
  Search,
  LogIn,
  LogOut,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Copy,
} from "lucide-react";
import { COACH_MODELS, type CoachSettings } from "@/data/aiCoach";
import {
  BACKGROUNDS,
  MUSIC_SOURCES,
  MUSIC_STYLES,
  THEMES,
  type Preferences,
} from "@/preferences";
import type { CustomTrackError, CustomTrackMeta } from "@/customTrack";
import type { SpotifyController, SpotifyItem } from "@/spotify";
import { useI18n } from "@/i18n";

interface SettingsDrawerProps {
  open: boolean;
  settings: CoachSettings;
  onChange: (settings: CoachSettings) => void;
  onClose: () => void;
  prefs: Preferences;
  onPrefsChange: (patch: Partial<Preferences>) => void;
  onReset: () => void;
  customTracks: CustomTrackMeta[];
  activeTrackId: string | null;
  customTrackError: CustomTrackError | null;
  customTrackBusy: boolean;
  onAddTrack: (file: File) => void | Promise<void>;
  onSelectTrack: (id: string) => void;
  onRemoveTrack: (id: string) => void | Promise<void>;
  onClearTrackError: () => void;
  spotify: SpotifyController;
}

interface ApiKey {
  id: number;
  provider: string;
  label: string;
  value: string;
}

const TONE_OPTIONS: {
  value: CoachSettings["tone"];
  icon: typeof Smile;
}[] = [
  { value: "encouraging", icon: Smile },
  { value: "strict", icon: Zap },
  { value: "calm", icon: Leaf },
];

const FOCUS_OPTIONS: {
  value: CoachSettings["focus"];
  icon: typeof Dumbbell;
}[] = [
  { value: "technique", icon: Dumbbell },
  { value: "intensity", icon: Flame },
  { value: "recovery", icon: HeartPulse },
];

export function SettingsDrawer({
  open,
  settings,
  onChange,
  onClose,
  prefs,
  onPrefsChange,
  onReset,
  customTracks,
  activeTrackId,
  customTrackError,
  customTrackBusy,
  onAddTrack,
  onSelectTrack,
  onRemoveTrack,
  onClearTrackError,
  spotify,
}: SettingsDrawerProps) {
  const { t } = useI18n();
  const s = t.settings;
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [provider, setProvider] = useState("OpenAI");
  const [keyLabel, setKeyLabel] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [visibleKeyId, setVisibleKeyId] = useState<number | null>(null);
  const [trackDragActive, setTrackDragActive] = useState(false);
  const trackInputRef = useRef<HTMLInputElement>(null);

  async function handleTrackFile(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    for (const file of files) {
      await onAddTrack(file);
    }
  }

  function handleTrackDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setTrackDragActive(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length === 0) return;
    void (async () => {
      for (const file of files) {
        await onAddTrack(file);
      }
    })();
  }

  function addApiKey() {
    const trimmedValue = keyValue.trim();
    if (!trimmedValue) return;

    setApiKeys((current) => [
      ...current,
      {
        id: Date.now(),
        provider,
        label: keyLabel.trim() || `${provider} key`,
        value: trimmedValue,
      },
    ]);
    setKeyLabel("");
    setKeyValue("");
    setShowKeyForm(false);
  }

  function removeApiKey(id: number) {
    setApiKeys((current) => current.filter((key) => key.id !== id));
    if (visibleKeyId === id) setVisibleKeyId(null);
  }

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-slate-900/95 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br sm:h-10 sm:w-10 from-brand-400 to-brand2-600 text-slate-950 shadow-lg shadow-brand-500/20">
              <Bot className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <p className="truncate text-sm font-bold text-white">{s.title}</p>
              <p className="text-xs text-slate-500">{s.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white active:scale-95"
            aria-label={s.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {/* appearance & sound */}
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Palette className="h-3.5 w-3.5" />
            {t.appearance.title}
          </p>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-300">{t.appearance.theme}</p>
              <p className="text-xs font-medium text-brand-300">
                {t.appearance.themes[prefs.theme]}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {THEMES.map((theme) => {
                const active = prefs.theme === theme.value;
                return (
                  <button
                    key={theme.value}
                    onClick={() => onPrefsChange({ theme: theme.value })}
                    aria-label={t.appearance.themes[theme.value]}
                    aria-pressed={active}
                    title={t.appearance.themes[theme.value]}
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full ring-2 transition-all active:scale-90 ${
                      active
                        ? "ring-brand-400 shadow-lg shadow-brand-500/30"
                        : "ring-white/10 hover:ring-white/30"
                    }`}
                    style={{ background: theme.swatch }}
                  >
                    {active && (
                      <Check className="h-4 w-4 text-slate-950" strokeWidth={3.5} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-300">
                  {t.appearance.background}
                </p>
                <p className="text-xs font-medium text-brand-300">
                  {t.appearance.backgrounds[prefs.background]}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {BACKGROUNDS.map((background) => {
                  const active = prefs.background === background.value;
                  const label = t.appearance.backgrounds[background.value];
                  return (
                    <button
                      key={background.value}
                      onClick={() => onPrefsChange({ background: background.value })}
                      aria-label={`${t.appearance.background}: ${label}`}
                      aria-pressed={active}
                      title={label}
                      className={`relative h-9 overflow-hidden rounded-xl ring-2 transition-all active:scale-90 ${
                        active
                          ? "ring-brand-400 shadow-lg shadow-brand-500/30"
                          : "ring-white/10 hover:ring-white/30"
                      }`}
                    >
                      <span
                        className="absolute inset-0"
                        style={{ background: background.swatch }}
                      />
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className="h-4 w-4 text-white drop-shadow"
                            strokeWidth={3.5}
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <ToggleRow
                icon={Volume2}
                label={t.appearance.sound}
                desc={t.appearance.soundDesc}
                checked={prefs.sound}
                enabledText={s.enabled}
                disabledText={s.disabled}
                onToggle={() => onPrefsChange({ sound: !prefs.sound })}
              />
              <ToggleRow
                icon={Music}
                label={t.appearance.music}
                desc={t.appearance.musicDesc}
                checked={prefs.music}
                enabledText={s.enabled}
                disabledText={s.disabled}
                onToggle={() => onPrefsChange({ music: !prefs.music })}
              />
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!trackDragActive) setTrackDragActive(true);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                    setTrackDragActive(false);
                  }
                }}
                onDrop={handleTrackDrop}
                className={`rounded-xl bg-slate-950/70 p-1 transition-colors ${
                  trackDragActive
                    ? "ring-2 ring-brand-400/60"
                    : "ring-1 ring-white/5"
                }`}
              >
                  <div className="flex gap-1">
                    {MUSIC_SOURCES.map((source) => {
                      const active = prefs.musicSource === source;
                      return (
                        <button
                          key={source}
                          onClick={() => {
                            onClearTrackError();
                            onPrefsChange({ musicSource: source });
                          }}
                          aria-pressed={active}
                          className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                            active
                              ? "bg-brand-400/20 text-brand-300 ring-1 ring-brand-400/30"
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {t.appearance.musicSources[source]}
                        </button>
                      );
                    })}
                  </div>

                  {prefs.musicSource === "procedural" ? (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {MUSIC_STYLES.map((style) => {
                        const active = prefs.musicStyle === style;
                        return (
                          <button
                            key={style}
                            onClick={() => onPrefsChange({ musicStyle: style })}
                            aria-pressed={active}
                            className={`flex-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                              active
                                ? "bg-brand-400/20 text-brand-300 ring-1 ring-brand-400/30"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {t.appearance.musicStyles[style]}
                          </button>
                        );
                      })}
                    </div>
                  ) : prefs.musicSource === "custom" ? (
                    <div className="px-0.5 pb-0.5 pt-1.5">
                      {customTracks.length > 0 ? (
                        <ul className="space-y-1">
                          {customTracks.map((track) => {
                            const active = track.id === activeTrackId;
                            return (
                              <li
                                key={track.id}
                                className={`flex items-center gap-1.5 rounded-lg border px-1.5 py-1.5 transition-colors ${
                                  active
                                    ? "border-brand-400/40 bg-brand-400/10"
                                    : "border-white/10 bg-slate-900/70"
                                }`}
                              >
                                <button
                                  onClick={() => onSelectTrack(track.id)}
                                  aria-pressed={active}
                                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                >
                                  <span
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                      active
                                        ? "bg-brand-400/20 text-brand-300"
                                        : "bg-white/5 text-slate-400"
                                    }`}
                                  >
                                    <FileMusic className="h-3.5 w-3.5" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span
                                      className={`block truncate text-[11px] font-semibold ${
                                        active ? "text-white" : "text-slate-200"
                                      }`}
                                    >
                                      {track.name}
                                    </span>
                                    <span className="block text-[10px] text-slate-500">
                                      {formatTrackSize(track.size)}
                                    </span>
                                  </span>
                                  {active && (
                                    <Check
                                      className="h-3.5 w-3.5 shrink-0 text-brand-300"
                                      strokeWidth={3}
                                    />
                                  )}
                                </button>
                                <button
                                  onClick={() => void onRemoveTrack(track.id)}
                                  disabled={customTrackBusy}
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400 disabled:opacity-40"
                                  aria-label={t.appearance.removeTrack}
                                  title={t.appearance.removeTrack}
                                >
                                  {customTrackBusy ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <button
                          onClick={() => trackInputRef.current?.click()}
                          disabled={customTrackBusy}
                          className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-3 py-3 text-center transition-all hover:border-brand-400/40 hover:bg-brand-400/5 active:scale-[0.99] disabled:opacity-50"
                        >
                          {customTrackBusy ? (
                            <Loader2 className="h-4 w-4 animate-spin text-brand-300" />
                          ) : (
                            <Upload className="h-4 w-4 text-brand-300" />
                          )}
                          <span className="text-[11px] font-semibold text-slate-200">
                            {t.appearance.uploadTrack}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {t.appearance.trackHint}
                          </span>
                        </button>
                      )}

                      {customTracks.length > 0 && (
                        <button
                          onClick={() => trackInputRef.current?.click()}
                          disabled={customTrackBusy}
                          className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 px-3 py-2 text-[11px] font-semibold text-slate-300 transition-all hover:border-brand-400/40 hover:bg-brand-400/5 hover:text-brand-300 active:scale-[0.99] disabled:opacity-50"
                        >
                          {customTrackBusy ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Plus className="h-3.5 w-3.5" />
                          )}
                          {t.appearance.addTrack}
                        </button>
                      )}

                      <p className="mt-1.5 px-0.5 text-[10px] text-slate-500">
                        {t.appearance.trackHint}
                      </p>

                      {customTrackError && (
                        <p className="mt-1.5 px-0.5 text-[10px] leading-snug text-red-300">
                          {t.appearance.trackErrors[customTrackError]}
                        </p>
                      )}

                      <input
                        ref={trackInputRef}
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.opus"
                        multiple
                        className="hidden"
                        onChange={handleTrackFile}
                      />
                    </div>
                  ) : (
                    <SpotifyPanel
                      spotify={spotify}
                      onEnableMusic={() => onPrefsChange({ music: true })}
                    />
                  )}

                  <div className="mt-1.5 flex items-center gap-2.5 rounded-lg border border-white/5 bg-slate-900/50 px-2.5 py-1.5">
                    <Volume2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round(prefs.musicVolume * 100)}
                      onChange={(event) =>
                        onPrefsChange({
                          musicVolume: Number(event.target.value) / 100,
                        })
                      }
                      aria-label={t.appearance.musicVolume}
                      title={t.appearance.musicVolume}
                      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10"
                      style={{ accentColor: "rgb(var(--brand-400))" }}
                    />
                    <span className="w-8 shrink-0 text-right text-[10px] font-semibold tabular-nums text-slate-400">
                      {Math.round(prefs.musicVolume * 100)}%
                    </span>
                  </div>
                </div>
              <ToggleRow
                icon={Sparkles}
                label={t.appearance.motion}
                desc={t.appearance.motionDesc}
                checked={prefs.reduceMotion}
                enabledText={s.enabled}
                disabledText={s.disabled}
                onToggle={() => onPrefsChange({ reduceMotion: !prefs.reduceMotion })}
              />
              <ToggleRow
                icon={MonitorSmartphone}
                label={t.appearance.keepAwake}
                desc={t.appearance.keepAwakeDesc}
                checked={prefs.keepAwake}
                enabledText={s.enabled}
                disabledText={s.disabled}
                onToggle={() => onPrefsChange({ keepAwake: !prefs.keepAwake })}
              />
            </div>

            <button
              onClick={onReset}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2.5 text-xs font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-[0.99]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t.appearance.reset}
            </button>
          </div>

          {/* enable toggle */}
          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-3.5 py-3.5 sm:px-4">
            <div>
              <p className="text-sm font-semibold text-white">{t.coachTitle}</p>
              <p className={`text-xs ${settings.enabled ? "text-brand-300" : "text-slate-500"}`}>
                {settings.enabled ? s.coachOn : s.coachOff}
              </p>
            </div>
            <button
              onClick={() => onChange({ ...settings, enabled: !settings.enabled })}
              className={`relative h-7 w-12 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                settings.enabled ? "bg-brand-500" : "bg-slate-700"
              }`}
              role="switch"
              aria-checked={settings.enabled}
            >
              <span
                className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  settings.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* AI model */}
          <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {s.aiModel}
          </p>
          <div className="space-y-2.5">
            {COACH_MODELS.map((model) => {
              const active = settings.model === model.value;
              return (
                <button
                  key={model.value}
                  onClick={() => onChange({ ...settings, model: model.value })}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                    active
                      ? "border-brand-400/50 bg-brand-400/10 ring-1 ring-brand-400/30"
                      : "border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-slate-950/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bot className={`h-5 w-5 shrink-0 ${active ? "text-brand-400" : "text-slate-400"}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm font-medium ${active ? "text-white" : "text-slate-300"}`}>
                        {model.label}
                      </p>
                      <p className="text-xs text-slate-500">{model.provider} · {s.free}</p>
                    </div>
                    {active && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-400 shadow shadow-brand-400/50" />}
                  </div>
                  <p className="mt-2 truncate pl-8 font-mono text-[10px] text-slate-600">{model.value}</p>
                </button>
              );
            })}
          </div>

          {/* tone */}
          <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {s.tone}
          </p>
          <div className="space-y-2.5">
            {TONE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = settings.tone === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange({ ...settings, tone: opt.value })}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                    active
                      ? "border-brand-400/50 bg-brand-400/10 ring-1 ring-brand-400/30"
                      : "border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-slate-950/70"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${active ? "text-brand-400" : "text-slate-400"}`}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${active ? "text-white" : "text-slate-300"}`}>
                      {s.toneOptions[opt.value].label}
                    </p>
                    <p className="text-xs text-slate-500">{s.toneOptions[opt.value].desc}</p>
                  </div>
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-brand-400 shadow shadow-brand-400/50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* focus */}
          <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {s.focus}
          </p>
          <div className="space-y-2.5">
            {FOCUS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = settings.focus === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange({ ...settings, focus: opt.value })}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                    active
                      ? "border-brand-400/50 bg-brand-400/10 ring-1 ring-brand-400/30"
                      : "border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-slate-950/70"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${active ? "text-brand-400" : "text-slate-400"}`}
                  />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${active ? "text-white" : "text-slate-300"}`}>
                      {s.focusOptions[opt.value].label}
                    </p>
                    <p className="text-xs text-slate-500">{s.focusOptions[opt.value].desc}</p>
                  </div>
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-brand-400 shadow shadow-brand-400/50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* toggles */}
          <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {s.sections}
          </p>
          <div className="space-y-2.5">
            <ToggleRow
              icon={Sparkles}
              label={s.warmup}
              desc={s.warmupDesc}
              checked={settings.includeWarmup}
              enabledText={s.enabled}
              disabledText={s.disabled}
              onToggle={() =>
                onChange({ ...settings, includeWarmup: !settings.includeWarmup })
              }
            />
            <ToggleRow
              icon={Flame}
              label={s.motivation}
              desc={s.motivationDesc}
              checked={settings.includeMotivation}
              enabledText={s.enabled}
              disabledText={s.disabled}
              onToggle={() =>
                onChange({ ...settings, includeMotivation: !settings.includeMotivation })
              }
            />
          </div>

          {/* API keys */}
          <div className="mt-6 border-t border-white/5 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <KeyRound className="h-4 w-4 text-brand-400" />
                  {s.apiKeys}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {s.apiKeysDesc}
                </p>
              </div>
              <button
                onClick={() => setShowKeyForm((current) => !current)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-400/10 text-brand-300 ring-1 ring-brand-400/20 transition-all hover:bg-brand-400/20 active:scale-95"
                aria-label={s.addKeyAria}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {showKeyForm && (
              <div className="mt-4 space-y-3 rounded-2xl border border-brand-400/20 bg-slate-950/60 p-3">
                <select
                  value={provider}
                  onChange={(event) => setProvider(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-400/50"
                >
                  <option>OpenAI</option>
                  <option>Google Gemini</option>
                  <option>Anthropic Claude</option>
                  <option>{s.otherService}</option>
                </select>
                <input
                  value={keyLabel}
                  onChange={(event) => setKeyLabel(event.target.value)}
                  placeholder={s.keyNamePlaceholder}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-brand-400/50"
                />
                <input
                  value={keyValue}
                  onChange={(event) => setKeyValue(event.target.value)}
                  type="password"
                  placeholder={s.keyValuePlaceholder}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-brand-400/50"
                />
                <button
                  onClick={addApiKey}
                  disabled={!keyValue.trim()}
                  className="w-full rounded-xl bg-brand-400 px-3 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {s.addKeyButton}
                </button>
                <p className="text-[11px] leading-relaxed text-amber-300/80">
                  {s.keyWarning}
                </p>
              </div>
            )}

            {apiKeys.length > 0 && (
              <div className="mt-3 space-y-2">
                {apiKeys.map((key) => {
                  const visible = visibleKeyId === key.id;
                  return (
                    <div
                      key={key.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2.5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-200">{key.label}</p>
                        <p className="truncate font-mono text-[11px] text-slate-500">
                          {visible ? key.value : "••••••••••••••••"}
                        </p>
                      </div>
                      <button
                        onClick={() => setVisibleKeyId(visible ? null : key.id)}
                        className="text-slate-500 transition-colors hover:text-slate-200"
                        aria-label={visible ? s.hideKey : s.showKey}
                      >
                        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => removeApiKey(key.id)}
                        className="text-slate-500 transition-colors hover:text-red-400"
                        aria-label={s.deleteKey}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <div className="border-t border-white/5 px-4 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:px-5 sm:py-4">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-gradient-to-r from-brand-400 to-brand2-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-brand-500/20 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            {s.done}
          </button>
        </div>
      </aside>
    </>
  );
}

function SpotifyPanel({
  spotify,
  onEnableMusic,
}: {
  spotify: SpotifyController;
  onEnableMusic: () => void;
}) {
  const { t } = useI18n();
  const s = t.appearance.spotify;
  const { search } = spotify;
  const [clientId, setClientId] = useState(spotify.clientId);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setClientId(spotify.clientId);
  }, [spotify.clientId]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    let active = true;
    setSearching(true);
    const timer = window.setTimeout(() => {
      void search(trimmed).then((items) => {
        if (!active) return;
        setResults(items);
        setSearching(false);
      });
    }, 400);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, search]);

  async function copyRedirect() {
    try {
      await navigator.clipboard.writeText(spotify.redirectUri);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard may be unavailable
    }
  }

  const errorText =
    spotify.error === "premium"
      ? s.premium
      : spotify.error === "notConfigured"
        ? s.notConfigured
        : spotify.error === "auth"
          ? s.authError
          : spotify.error === "network"
            ? s.networkError
            : spotify.error === "noDevice"
              ? s.noDevice
              : spotify.error === "playback"
                ? s.playbackError
                : null;

  if (spotify.status !== "connected") {
    return (
      <div className="px-0.5 pb-0.5 pt-1.5">
        <p className="text-[11px] font-semibold text-slate-200">{s.setupTitle}</p>
        <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{s.setupDesc}</p>

        <input
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
          placeholder={s.clientIdPlaceholder}
          aria-label={s.clientId}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-slate-900 px-2.5 py-1.5 text-[11px] text-white outline-none placeholder:text-slate-600 focus:border-brand-400/50"
        />
        <button
          onClick={() => spotify.saveClientId(clientId)}
          disabled={!clientId.trim()}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-200 transition-all hover:bg-white/10 active:scale-[0.99] disabled:opacity-40"
        >
          {s.save}
        </button>

        <div className="mt-1.5 rounded-lg border border-white/10 bg-slate-950/70 px-2 py-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
            {s.redirectUri}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <code className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-300">
              {spotify.redirectUri}
            </code>
            <button
              onClick={() => void copyRedirect()}
              aria-label={s.copy}
              title={s.copy}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/5 hover:text-brand-300"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-brand-300" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={() => void spotify.login()}
          disabled={!spotify.clientId || spotify.status === "connecting"}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-400 px-3 py-2 text-[11px] font-bold text-slate-950 transition-all hover:bg-brand-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {spotify.status === "connecting" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogIn className="h-3.5 w-3.5" />
          )}
          {s.connect}
        </button>

        {errorText && (
          <p className="mt-1.5 text-[10px] leading-snug text-red-300">
            {errorText}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="px-0.5 pb-0.5 pt-1.5">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-1.5 py-1.5">
        {spotify.profile?.image ? (
          <img
            src={spotify.profile.image}
            alt=""
            className="h-7 w-7 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-400/15 text-brand-300">
            <Music className="h-3.5 w-3.5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold text-white">
            {spotify.profile?.name ?? s.title}
          </p>
          <p className="truncate text-[10px] text-brand-300">
            {spotify.profile?.product === "premium"
              ? "Spotify Premium"
              : "Spotify"}
          </p>
        </div>
        <button
          onClick={spotify.logout}
          aria-label={s.disconnect}
          title={s.disconnect}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-red-400"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/70 px-2 py-1.5">
        <Search className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={s.searchPlaceholder}
          aria-label={s.search}
          className="min-w-0 flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-slate-600"
        />
        {searching && (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-brand-300" />
        )}
      </div>

      {results.length > 0 && (
        <ul className="mt-1.5 max-h-40 space-y-1 overflow-y-auto pr-0.5">
          {results.map((item) => (
            <li key={`${item.kind}:${item.uri}`}>
              <button
                onClick={() => {
                  onEnableMusic();
                  spotify.select(item);
                }}
                className="flex w-full items-center gap-2 rounded-lg border border-white/5 bg-slate-950/60 px-1.5 py-1.5 text-left transition-colors hover:border-brand-400/30 hover:bg-brand-400/5"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="h-7 w-7 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-slate-400">
                    <Music className="h-3.5 w-3.5" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold text-slate-200">
                    {item.name}
                  </span>
                  <span className="block truncate text-[10px] text-slate-500">
                    {item.subtitle}
                  </span>
                </span>
                <span className="shrink-0 rounded bg-white/5 px-1 py-0.5 text-[8px] uppercase tracking-wide text-slate-400">
                  {item.kind === "track" ? s.tracks : s.playlists}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {query.trim().length >= 2 && !searching && results.length === 0 && (
        <p className="mt-1.5 px-0.5 text-[10px] text-slate-500">
          {s.noResults}
        </p>
      )}

      {spotify.playback && (
        <div className="mt-1.5 rounded-lg border border-brand-400/25 bg-brand-400/10 px-2 py-1.5">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-brand-300/80">
            {s.nowPlaying}
          </p>
          <div className="mt-1 flex items-center gap-2">
            {spotify.playback.image ? (
              <img
                src={spotify.playback.image}
                alt=""
                className="h-7 w-7 shrink-0 rounded-md object-cover"
              />
            ) : (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-400/15 text-brand-300">
                <Music className="h-3.5 w-3.5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-white">
                {spotify.playback.name}
              </p>
              <p className="truncate text-[10px] text-slate-400">
                {spotify.playback.artists}
              </p>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-3">
            <button
              onClick={() => void spotify.previous()}
              aria-label={s.previous}
              title={s.previous}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                onEnableMusic();
                void spotify.toggle();
              }}
              aria-label={spotify.playback.paused ? s.play : s.pause}
              title={spotify.playback.paused ? s.play : s.pause}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-400 text-slate-950 shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-300 active:scale-95"
            >
              {spotify.playback.paused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => void spotify.next()}
              aria-label={s.next}
              title={s.next}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {spotify.initializing && (
        <p className="mt-1.5 flex items-center gap-1.5 px-0.5 text-[10px] text-slate-500">
          <Loader2 className="h-3 w-3 animate-spin" />
          {s.playerStarting}
        </p>
      )}

      {errorText && (
        <p className="mt-1.5 px-0.5 text-[10px] leading-snug text-red-300">
          {errorText}
        </p>
      )}

      <p className="mt-1.5 px-0.5 text-[10px] leading-snug text-slate-500">
        {s.hint}
      </p>
    </div>
  );
}

function formatTrackSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  checked,
  enabledText,
  disabledText,
  onToggle,
}: {
  icon: typeof Sparkles;
  label: string;
  desc: string;
  checked: boolean;
  enabledText: string;
  disabledText: string;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-3.5 py-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="h-5 w-5 shrink-0 text-slate-400" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <p className={`text-xs leading-snug ${checked ? "text-brand-300" : "text-slate-500"}`}>
            {desc} · {checked ? enabledText : disabledText}
          </p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          checked ? "bg-brand-500" : "bg-slate-700"
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
