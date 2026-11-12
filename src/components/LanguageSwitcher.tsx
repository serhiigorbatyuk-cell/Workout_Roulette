import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { LANGUAGES, useI18n } from "@/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const current = LANGUAGES.find((item) => item.value === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-1.5 rounded-2xl border border-white/10 bg-slate-900/80 px-2.5 text-slate-300 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95 sm:h-11 sm:px-3"
        aria-label={t.language}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-5 w-5" />
        <span className="text-xs font-bold tracking-wide">{current.code}</span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t.language}
          className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur"
        >
          {LANGUAGES.map((item) => {
            const active = item.value === lang;
            return (
              <button
                key={item.value}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLang(item.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "bg-brand-400/10 text-brand-300"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base leading-none">{item.flag}</span>
                <span className="flex-1">{item.label}</span>
                {active && <Check className="h-4 w-4 text-brand-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
