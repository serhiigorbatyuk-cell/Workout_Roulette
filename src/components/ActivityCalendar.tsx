import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  Timer,
} from "lucide-react";
import { dayKey, type HistoryEntry } from "@/history";
import { useI18n, type Lang } from "@/i18n";
import { useFeatureText } from "@/featuresI18n";

const LOCALES: Record<Lang, string> = {
  uk: "uk-UA",
  en: "en-GB",
  pl: "pl-PL",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
};

interface DayInfo {
  count: number;
  minutes: number;
}

function parseDay(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - offset);
  return copy;
}

export function ActivityCalendar({ entries }: { entries: HistoryEntry[] }) {
  const { lang } = useI18n();
  const f = useFeatureText();

  const today = useMemo(() => new Date(), []);
  const todayKey = dayKey(today);

  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selected, setSelected] = useState<string | null>(todayKey);

  const byDay = useMemo(() => {
    const map = new Map<string, DayInfo>();
    entries.forEach((entry) => {
      const current = map.get(entry.date) ?? { count: 0, minutes: 0 };
      current.count += 1;
      current.minutes += entry.minutes;
      map.set(entry.date, current);
    });
    return map;
  }, [entries]);

  const weekStats = useMemo(() => {
    const start = startOfWeek(today);
    const keys = new Set<string>();
    for (let i = 0; i < 7; i += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      keys.add(dayKey(day));
    }
    return entries.reduce(
      (acc, entry) => {
        if (keys.has(entry.date)) {
          acc.count += 1;
          acc.minutes += entry.minutes;
        }
        return acc;
      },
      { count: 0, minutes: 0 },
    );
  }, [entries, today]);

  const monthStats = useMemo(() => {
    const prefix = `${cursor.getFullYear()}-${String(
      cursor.getMonth() + 1,
    ).padStart(2, "0")}`;
    return entries.reduce(
      (acc, entry) => {
        if (entry.date.startsWith(prefix)) {
          acc.count += 1;
          acc.minutes += entry.minutes;
        }
        return acc;
      },
      { count: 0, minutes: 0 },
    );
  }, [entries, cursor]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: firstOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(LOCALES[lang], { weekday: "short" }).format(
          new Date(2024, 0, 1 + index),
        ),
      ),
    [lang],
  );

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(LOCALES[lang], {
        month: "long",
        year: "numeric",
      }).format(cursor),
    [lang, cursor],
  );

  const selectedInfo = selected ? byDay.get(selected) ?? null : null;
  const selectedLabel = selected
    ? new Intl.DateTimeFormat(LOCALES[lang], {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(parseDay(selected))
    : "";

  function changeMonth(delta: number) {
    setCursor(new Date(year, month + delta, 1));
    setSelected(null);
  }

  function goToday() {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(todayKey);
  }

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-400/15 text-brand-300 ring-1 ring-brand-400/20">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-200">
              {f.calendar.title}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {f.calendar.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeMonth(-1)}
            aria-label={f.calendar.prev}
            title={f.calendar.prev}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            aria-label={f.calendar.next}
            title={f.calendar.next}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-white/5 bg-slate-950/50 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
            {f.calendar.week}
          </p>
          <p className="mt-1 text-sm font-bold text-white">
            {weekStats.count}{" "}
            <span className="text-[10px] font-medium text-slate-500">
              {f.calendar.workouts}
            </span>
          </p>
          <p className="text-[10px] text-slate-400">
            {weekStats.minutes} {f.calendar.minutes}
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-slate-950/50 px-3 py-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
            {f.calendar.month}
          </p>
          <p className="mt-1 text-sm font-bold text-white">
            {monthStats.count}{" "}
            <span className="text-[10px] font-medium text-slate-500">
              {f.calendar.workouts}
            </span>
          </p>
          <p className="text-[10px] text-slate-400">
            {monthStats.minutes} {f.calendar.minutes}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold capitalize text-white">
          {monthLabel}
        </p>
        <button
          onClick={goToday}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-400 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
        >
          {f.calendar.today}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {weekdays.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className="py-1 text-center text-[9px] font-semibold uppercase tracking-wide text-slate-600"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <span key={`empty-${index}`} aria-hidden="true" />;
          }

          const key = dayKey(new Date(year, month, day));
          const info = byDay.get(key);
          const isToday = key === todayKey;
          const isSelected = key === selected;

          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              aria-pressed={isSelected}
              aria-label={key}
              className={`relative flex h-9 items-center justify-center rounded-lg text-[11px] font-semibold transition-all active:scale-95 sm:h-10 sm:text-xs ${
                info
                  ? "bg-brand-400/15 text-brand-200 hover:bg-brand-400/25"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              } ${isSelected ? "ring-2 ring-brand-400" : ""} ${
                isToday && !isSelected ? "ring-1 ring-white/20" : ""
              }`}
            >
              {day}
              {info && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-brand-300" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 rounded-2xl border border-white/5 bg-slate-950/50 px-3 py-2.5">
        {selected ? (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              {selectedLabel}
            </p>
            {selectedInfo ? (
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                <span className="flex items-center gap-1 font-semibold text-brand-300">
                  <Flame className="h-3 w-3" />
                  {selectedInfo.count} {f.calendar.workouts}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Timer className="h-3 w-3" />
                  {selectedInfo.minutes} {f.calendar.minutes}
                </span>
              </div>
            ) : (
              <p className="mt-1 text-[11px] text-slate-500">
                {f.calendar.emptyDay}
              </p>
            )}
          </>
        ) : (
          <p className="text-[11px] text-slate-500">{f.calendar.dayDetails}</p>
        )}
      </div>

      {entries.length === 0 && (
        <p className="mt-2 text-center text-[10px] text-slate-600">
          {f.calendar.noData}
        </p>
      )}
    </section>
  );
}
