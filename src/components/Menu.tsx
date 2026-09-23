"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCallback, useDeferredValue, useMemo, useRef, useState } from "react";
import { categories, menu, type CategoryId, type MenuItem } from "@/data/menu";
import { ItemDialog } from "./ItemDialog";
import { MenuCard } from "./MenuCard";
import { DietMark } from "./ui";

type Filter = "all" | CategoryId;

function matches(item: MenuItem, q: string) {
  if (!q) return true;
  const hay = `${item.name} ${item.real} ${item.blurb} ${item.layers.join(" ")}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

export function Menu() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim());
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // when the list is swapped while scrolled deep, bring the new results into view
  const choose = (f: Filter) => {
    setFilter(f);
    const el = resultsRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  };

  const visible = useMemo(
    () => menu.filter((m) => (filter === "all" || m.category === filter) && (!egglessOnly || m.diet === "eggless") && matches(m, q)),
    [filter, egglessOnly, q],
  );
  const groups = categories
    .map((c) => ({ cat: c, items: visible.filter((m) => m.category === c.id) }))
    .filter((g) => g.items.length > 0);

  const counts = useMemo(() => {
    const base = menu.filter((m) => (!egglessOnly || m.diet === "eggless") && matches(m, q));
    const out: Record<string, number> = { all: base.length };
    for (const m of base) out[m.category] = (out[m.category] ?? 0) + 1;
    return out;
  }, [egglessOnly, q]);

  const setSize = useCallback((id: string, i: number) => setSizes((s) => ({ ...s, [id]: i })), []);
  const close = useCallback(() => setOpenId(null), []);
  const openItem = openId ? menu.find((m) => m.id === openId) ?? null : null;
  const reset = () => {
    setFilter("all");
    setQuery("");
    setEgglessOnly(false);
  };

  const chips: { id: Filter; label: string }[] = [{ id: "all", label: "Everything" }, ...categories.map((c) => ({ id: c.id, label: c.short }))];

  return (
    <section id="menu" className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 md:pt-24 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-hand text-2xl text-berry">today&rsquo;s counter</p>
          <h2 className="font-display mt-1 text-[clamp(2.4rem,5vw,3.8rem)] leading-none font-semibold tracking-[-0.02em]">The Menu</h2>
        </div>
        <p className="max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
          All prices in Indian Rupees and inclusive of taxes. <DietMark diet="eggless" className="mx-0.5 align-[-2px]" /> means eggless,{" "}
          <DietMark diet="egg" className="mx-0.5 align-[-2px]" /> means it contains egg.
        </p>
      </div>

      {/* toolbar */}
      <div className="relative z-30 md:sticky md:top-[calc(env(safe-area-inset-top,0px)+68px)] -mx-4 mt-8 border-b border-line/70 bg-ground/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="no-scrollbar -mx-1 flex min-w-0 gap-1 overflow-x-auto px-1 py-0.5" role="tablist" aria-label="Menu categories">
            {chips.map((c) => {
              const on = filter === c.id;
              const n = counts[c.id] ?? 0;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => choose(c.id)}
                  className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-extrabold whitespace-nowrap transition-colors ${
                    on ? "text-berry-ink" : "text-ink-soft hover:text-ink"
                  } ${n === 0 && !on ? "opacity-45" : ""}`}
                >
                  {on && (
                    <motion.span
                      layoutId="chip"
                      className="absolute inset-0 rounded-full bg-berry"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  <span className="relative">{c.label}</span>
                  <span className={`relative text-[11px] tabular-nums ${on ? "opacity-80" : "opacity-60"}`}>{n}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 lg:ml-auto">
            <label className="relative flex-1 lg:w-52 lg:flex-none">
              <span className="sr-only">Search the menu</span>
              <svg viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" aria-hidden>
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="m14 14 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “mango” or “jar”"
                className="w-full rounded-full bg-surface py-2.5 pr-4 pl-10 text-[14px] font-semibold ring-1 ring-line outline-none placeholder:text-ink-soft/70 focus:ring-2 focus:ring-berry"
              />
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={egglessOnly}
              onClick={() => setEgglessOnly((v) => !v)}
              className={`flex shrink-0 items-center gap-2 rounded-full py-2 pr-3 pl-2 text-[13.5px] font-extrabold ring-1 transition-colors ${
                egglessOnly ? "bg-[color-mix(in_oklab,var(--veg)_14%,var(--surface))] text-ink ring-veg" : "bg-surface text-ink-soft ring-line"
              }`}
            >
              <span className={`relative h-5 w-9 rounded-full transition-colors ${egglessOnly ? "bg-veg" : "bg-line"}`}>
                <span className={`absolute top-0.5 size-4 rounded-full bg-surface shadow transition-all ${egglessOnly ? "left-[18px]" : "left-0.5"}`} />
              </span>
              Eggless only
            </button>
          </div>
        </div>
      </div>

      {/* groups */}
      <LayoutGroup>
        <div ref={resultsRef} className="mt-10 flex scroll-mt-44 flex-col gap-16">
          <AnimatePresence mode="popLayout" initial={false}>
            {groups.map(({ cat, items }) => (
              <motion.section
                key={cat.id}
                layout={!reduce}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                aria-labelledby={`cat-${cat.id}`}
              >
                <header className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-dashed border-line pb-4">
                  <h3 id={`cat-${cat.id}`} className="font-display text-[clamp(1.7rem,3vw,2.2rem)] leading-tight font-semibold tracking-[-0.01em]">
                    {cat.title}
                  </h3>
                  <span className="font-hand text-[22px] leading-none text-berry">{cat.cute}</span>
                  <p className="w-full text-[14px] font-semibold text-ink-soft sm:ml-auto sm:w-auto">{cat.note}</p>
                </header>
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout={!reduce}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25 }}
                      >
                        <MenuCard
                          item={item}
                          sizeIndex={sizes[item.id] ?? 0}
                          onSize={(i) => setSize(item.id, i)}
                          onOpen={() => setOpenId(item.id)}
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {groups.length === 0 && (
        <div className="mx-auto mt-6 flex max-w-md flex-col items-center rounded-[28px] bg-surface p-10 text-center ring-1 ring-line">
          <p className="font-hand text-3xl text-berry">oh crumbs!</p>
          <p className="mt-2 text-[15px] font-semibold text-ink-soft">
            Nothing matches {query ? <>&ldquo;{query}&rdquo;</> : "those filters"} yet. We&rsquo;re happy to bake something custom, just ask.
          </p>
          <button type="button" onClick={reset} className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-extrabold text-ground">
            Show the whole menu
          </button>
        </div>
      )}

      <ItemDialog
        item={openItem}
        sizeIndex={openItem ? sizes[openItem.id] ?? 0 : 0}
        onSize={(i) => openItem && setSize(openItem.id, i)}
        onClose={close}
      />
    </section>
  );
}
