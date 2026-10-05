"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { categories, menu, menuStats, occasionLabels, occasionsOf, type CategoryId, type Occasion } from "@/data/menu";
import { ProductCard } from "@/components/ProductCard";
import { CloseIcon, Eyebrow } from "@/components/ui";
import { UnitToggle } from "@/components/UnitToggle";

type Photos = Record<string, string[]>;

export function CakesView({ photos }: { photos: Photos }) {
  const params = useSearchParams();
  const router = useRouter();
  const occasion = params.get("for") as Occasion | null;
  const validOccasion = occasion && occasion in occasionLabels ? occasion : null;
  const [cat, setCat] = useState<"all" | CategoryId>("all");
  const [egglessOnly, setEgglessOnly] = useState(false);

  const visible = menu.filter(
    (m) =>
      (cat === "all" || m.category === cat) &&
      (!egglessOnly || m.diet === "eggless") &&
      (!validOccasion || occasionsOf(m).includes(validOccasion)),
  );
  const groups = categories.map((c) => ({ cat: c, items: visible.filter((m) => m.category === c.id) })).filter((g) => g.items.length);
  const stats = menuStats();
  const countOf = (id: "all" | CategoryId) => (id === "all" ? menu.length : menu.filter((m) => m.category === id).length);
  const tabs: { id: "all" | CategoryId; label: string }[] = [
    { id: "all", label: "All" },
    ...categories.filter((c) => countOf(c.id) > 0).map((c) => ({ id: c.id, label: c.short })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <header className="pt-12 pb-8 md:pt-16">
        <Eyebrow>The menu</Eyebrow>
        <h1 className="font-display mt-4 text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[1.04] tracking-[-0.02em]">
          {validOccasion ? (
            <>
              Cakes for <em className="text-accent">{occasionLabels[validOccasion].toLowerCase()}</em>
            </>
          ) : (
            <>
              Everything we <em className="text-accent">bake</em>
            </>
          )}
        </h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
          Everything is baked to order, eggless. Prices in ₹ incl. taxes, per pound or kilo. Tap a cake to pick a size, flavour and message.
        </p>
        <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-dashed border-line pt-6">
          <div>
            <dt className="text-[12px] font-semibold tracking-[0.14em] text-muted uppercase">On the menu</dt>
            <dd className="font-display mt-1 text-[26px] leading-none">{stats.total} bakes</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold tracking-[0.14em] text-muted uppercase">Types</dt>
            <dd className="mt-1.5 text-[15px]">{stats.byKind.map((k) => k.label).join(" · ")}</dd>
          </div>
          <div>
            <dt className="text-[12px] font-semibold tracking-[0.14em] text-muted uppercase">Flavours</dt>
            <dd className="mt-1.5 text-[15px]">{stats.flavours} to choose from</dd>
          </div>
        </dl>
      </header>

      {/* filters */}
      <div className="sticky top-[calc(env(safe-area-inset-top,0px)+64px)] z-30 -mx-4 border-b border-line bg-ground/90 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="no-scrollbar -mb-px flex min-w-0 flex-1 gap-6 overflow-x-auto" role="tablist" aria-label="Categories">
            {tabs.map((t) => {
              const on = cat === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => {
                    setCat(t.id);
                    window.scrollTo({ top: Math.min(window.scrollY, 260), behavior: "smooth" });
                  }}
                  className={`shrink-0 border-b-2 py-4 text-[15px] whitespace-nowrap transition-colors ${on ? "border-ink font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`}
                >
                  {t.label}
                  <span className="ml-1.5 text-[12px] font-normal text-muted tabular-nums">{countOf(t.id)}</span>
                </button>
              );
            })}
          </div>
          <UnitToggle className="my-2 shrink-0 max-sm:hidden" />
        </div>
      </div>

      {(validOccasion || egglessOnly) && (
        <div className="flex flex-wrap gap-2 pt-6">
          {validOccasion && (
            <button type="button" onClick={() => router.replace("/cakes", { scroll: false })} className="inline-flex items-center gap-1.5 rounded-full bg-blush py-1.5 pr-2.5 pl-3.5 text-[14px]">
              For {occasionLabels[validOccasion].toLowerCase()} <CloseIcon className="size-4" />
            </button>
          )}
          {egglessOnly && (
            <button type="button" onClick={() => setEgglessOnly(false)} className="inline-flex items-center gap-1.5 rounded-full bg-blush py-1.5 pr-2.5 pl-3.5 text-[14px]">
              Eggless only <CloseIcon className="size-4" />
            </button>
          )}
        </div>
      )}
      <div className="mt-5 flex items-center gap-3 sm:hidden">
        <span className="text-[14px] text-muted">Prices per</span>
        <UnitToggle />
      </div>

      <div className="flex flex-col gap-16 pt-10">
        {groups.map(({ cat: c, items }) => (
          <section key={c.id} aria-labelledby={`cat-${c.id}`}>
            {cat === "all" && (
              <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 id={`cat-${c.id}`} className="font-display text-[clamp(1.7rem,3vw,2.3rem)] tracking-[-0.01em]">
                  {c.title}
                </h2>
                <p className="text-[14px] text-muted">{c.note}</p>
              </div>
            )}
            {cat !== "all" && (
              <p id={`cat-${c.id}`} className="mb-7 text-[14px] text-muted">
                {c.note}
              </p>
            )}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
              {items.map((item) => (
                <li key={item.id}>
                  <ProductCard item={item} photos={photos[item.id]} sizes="(min-width: 1024px) 30vw, 50vw" />
                </li>
              ))}
            </ul>
          </section>
        ))}
        {groups.length === 0 && (
          <div className="rounded-[28px] bg-blush px-6 py-14 text-center">
            <p className="font-display text-2xl">Nothing here yet</p>
            <p className="mt-2 text-[15px] text-muted">Try another category, or ask us for a custom cake.</p>
          </div>
        )}
      </div>
    </div>
  );
}
