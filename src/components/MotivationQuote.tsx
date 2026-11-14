import { useState } from "react";
import { Quote, RefreshCw } from "lucide-react";
import { useFeatureText } from "@/featuresI18n";

export function MotivationQuote() {
  const f = useFeatureText();
  const quotes = f.quotes.list;
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * quotes.length),
  );

  function nextQuote() {
    if (quotes.length <= 1) return;
    setIndex((current) => {
      let next = current;
      while (next === current) {
        next = Math.floor(Math.random() * quotes.length);
      }
      return next;
    });
  }

  return (
    <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-400/10 blur-3xl" />
      <Quote className="pointer-events-none absolute right-4 top-4 h-10 w-10 text-brand-400/10" />

      <div className="relative flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-brand-300/80">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
        {f.quotes.title}
      </div>

      <p
        key={index}
        className="relative mt-3 pr-6 text-base font-medium leading-relaxed text-slate-200 sm:text-lg"
        style={{ animation: "quoteIn 0.4s ease-out both" }}
      >
        “{quotes[index]}”
      </p>

      <div className="relative mt-4 flex justify-end">
        <button
          onClick={nextQuote}
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-[11px] font-semibold text-slate-300 transition-all hover:border-brand-400/40 hover:text-brand-300 active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" />
          {f.quotes.next}
        </button>
      </div>
    </section>
  );
}
