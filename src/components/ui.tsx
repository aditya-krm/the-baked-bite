import type { Badge, Diet } from "@/data/menu";

/** FSSAI-style food mark: green dot for eggless (veg), brown triangle when it contains egg */
export function DietMark({ diet, className = "" }: { diet: Diet; className?: string }) {
  const color = diet === "eggless" ? "var(--veg)" : "var(--egg)";
  return (
    <span
      className={`inline-grid size-[15px] shrink-0 place-items-center rounded-[3px] border-[1.5px] ${className}`}
      style={{ borderColor: color }}
      title={diet === "eggless" ? "Eggless" : "Contains egg"}
      aria-label={diet === "eggless" ? "Eggless" : "Contains egg"}
      role="img"
    >
      {diet === "eggless" ? (
        <span className="size-[7px] rounded-full" style={{ background: color }} />
      ) : (
        <svg viewBox="0 0 10 9" className="size-[8px]" aria-hidden>
          <path d="M5 0 L10 9 L0 9 Z" fill={color} />
        </svg>
      )}
    </span>
  );
}

const badgeCopy: Record<Badge, { label: string; cls: string }> = {
  bestseller: { label: "Bestseller", cls: "bg-berry text-berry-ink" },
  new: { label: "New in the oven", cls: "bg-surface text-ink ring-1 ring-line" },
  seasonal: { label: "In season", cls: "bg-[#F7A928] text-[#3a1e18]" },
  chef: { label: "Baker’s pick", cls: "bg-ink text-ground" },
};

export function BadgePill({ badge }: { badge: Badge }) {
  const b = badgeCopy[badge];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide ${b.cls}`}>
      {badge === "bestseller" && (
        <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
          <path d="M6 .8l1.5 3.3 3.6.4-2.7 2.4.8 3.5L6 8.6 2.8 10.4l.8-3.5L.9 4.5l3.6-.4z" fill="currentColor" />
        </svg>
      )}
      {b.label}
    </span>
  );
}

/** Paper price tag on a string, the kind tied to boxes at the counter */
export function PriceTag({ price, caption, className = "" }: { price: string; caption: string; className?: string }) {
  return (
    <div className={`pointer-events-none flex flex-col items-center ${className}`} aria-hidden>
      <span className="h-6 w-px bg-ink/40" />
      <div
        className="relative -mt-1 flex min-w-[76px] flex-col items-center bg-surface px-3 pt-5 pb-2.5 text-center shadow-soft"
        style={{
          clipPath: "polygon(50% 0, 100% 14px, 100% 100%, 0 100%, 0 14px)",
          borderRadius: "0 0 10px 10px",
        }}
      >
        <span className="absolute top-[9px] size-2 rounded-full bg-ground ring-1 ring-ink/25" />
        <span className="font-hand text-[15px] leading-none text-ink-soft">{caption}</span>
        <span className="font-display mt-0.5 text-[19px] leading-none font-bold text-berry tabular-nums">{price}</span>
      </div>
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="20" fill="var(--berry)" />
      <path d="M10 25 L30 25 L29 31 Q20 33 11 31 Z" fill="var(--berry-ink)" opacity="0.95" />
      <path d="M9.5 25 C9 18 14 15 20 15 C26 15 31 18 30.5 25 Z" fill="var(--berry-ink)" />
      <path d="M12 23 c2-2 4 2 6 0 s4 2 6 0 s4 2 5 0" stroke="var(--berry)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="11.5" r="3" fill="var(--berry-ink)" />
    </svg>
  );
}

export function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M21.4 4.2 2.9 11.3c-1.2.5-1.2 1.2 0 1.6l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.7-1.9Zm-3.6 3.6-8.7 7.9-.3 3.6-1.5-4.7 10-6.3c.4-.3.9-.1.5.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** little decorative sprinkle scatter */
export function Sprinkles({ className = "" }: { className?: string }) {
  const s = [
    [8, 12, 20, "#F07A96"],
    [40, 4, -30, "#8FC9F2"],
    [70, 20, 60, "#FFD166"],
    [22, 44, -60, "#9ED9A8"],
    [58, 52, 15, "#B9A6EE"],
    [86, 40, -15, "#FF9F68"],
  ] as const;
  return (
    <svg viewBox="0 0 96 64" className={className} aria-hidden>
      {s.map(([x, y, r, c], i) => (
        <rect key={i} x={x} y={y} width="12" height="4" rx="2" fill={c} transform={`rotate(${r} ${x + 6} ${y + 2})`} />
      ))}
    </svg>
  );
}
