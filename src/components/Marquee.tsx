import { menu } from "@/data/menu";

export function Marquee() {
  const names = menu.map((m) => m.name);
  const row = [...names, ...names];
  return (
    <div className="relative overflow-hidden border-y border-ink/10 bg-berry py-3.5 text-berry-ink" aria-hidden>
      <div className="animate-marquee flex w-max items-center gap-7 whitespace-nowrap">
        {row.map((n, i) => (
          <span key={i} className="flex items-center gap-7">
            <span className={`font-display text-xl font-semibold ${i % 2 ? "italic" : ""}`}>{n}</span>
            <svg viewBox="0 0 20 20" className="size-4 opacity-80">
              <path d="M10 1 12 8 19 10 12 12 10 19 8 12 1 10 8 8Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
