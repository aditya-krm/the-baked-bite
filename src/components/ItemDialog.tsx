"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site, telegramUrl } from "@/config/site";
import { categories, formatINR, type MenuItem } from "@/data/menu";
import { CakeArt } from "./CakeArt";
import { BadgePill, DietMark, TelegramIcon } from "./ui";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback for older webviews
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    ta.remove();
    return ok;
  }
}

export function ItemDialog({
  item,
  sizeIndex,
  onSize,
  onClose,
}: {
  item: MenuItem | null;
  sizeIndex: number;
  onSize: (i: number) => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copyState, setCopyState] = useState<{ id: string; status: "ok" | "fail" } | null>(null);
  const copied = item && copyState?.id === item.id ? copyState.status : "idle";

  useEffect(() => {
    if (!item) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [item, onClose]);

  const opt = item ? item.options[sizeIndex] ?? item.options[0] : null;
  const cat = item ? categories.find((c) => c.id === item.category) : null;
  const swatches = item ? [item.art.sponge, item.art.cream, item.art.glaze ?? item.art.accent ?? item.art.cream, item.tint] : [];

  const orderNote =
    item && opt
      ? `Hi ${site.name}! I'd like to order “${item.name}” (${item.real}), ${opt.label}, ${formatINR(opt.price)}. Date & time: ___ · Message on cake: ___`
      : "";

  return (
    <AnimatePresence>
      {item && opt && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgb(40_16_12/0.45)] backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-title"
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-[32px] bg-surface shadow-lift sm:rounded-[32px] md:grid-cols-[1fr_1.05fr] md:overflow-hidden"
            initial={reduce ? { opacity: 0 } : { y: 60, opacity: 0, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-surface/90 text-ink shadow-soft ring-1 ring-line backdrop-blur hover:bg-surface"
              aria-label="Close"
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                <path d="M3.5 3.5l9 9m0-9-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* art */}
            <div className="tile relative flex min-h-[260px] items-end justify-center md:min-h-full md:items-center" style={{ ["--tint" as string]: item.tint }}>
              <CakeArt spec={item.art} id={item.id} variant="lg" title={item.real} className="w-[82%] max-w-[380px]" />
              {item.badges && (
                <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
                  {item.badges.map((b) => (
                    <BadgePill key={b} badge={b} />
                  ))}
                </div>
              )}
              {opt.serves && (
                <p className="font-hand absolute bottom-5 left-6 hidden rotate-[-4deg] text-2xl text-ink md:block">
                  serves {opt.serves} ♥
                </p>
              )}
            </div>

            {/* details */}
            <div className="flex flex-col p-6 sm:p-8 md:max-h-[92dvh] md:overflow-y-auto">
              <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.1em] text-ink-soft uppercase">
                <DietMark diet={item.diet} />
                {cat?.title} · {item.diet === "eggless" ? "Eggless" : "Contains egg"}
              </p>
              <h2 id="item-title" className="font-display mt-2 pr-10 text-[clamp(2rem,4vw,2.6rem)] leading-[1.02] font-semibold tracking-[-0.015em]">
                {item.name}
              </h2>
              <p className="mt-1 text-[15px] font-bold text-berry">{item.real}</p>
              <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">{item.blurb}</p>

              <h3 className="mt-6 text-xs font-extrabold tracking-[0.1em] text-ink-soft uppercase">What&rsquo;s inside</h3>
              <ul className="mt-2.5 flex flex-col gap-1.5">
                {item.layers.map((l, i) => (
                  <li key={l} className="flex items-center gap-3 text-[15px] font-semibold">
                    <span className="h-3 w-7 shrink-0 rounded-full ring-1 ring-ink/10" style={{ background: swatches[i % swatches.length] }} />
                    {l}
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 text-xs font-extrabold tracking-[0.1em] text-ink-soft uppercase">Pick a size</h3>
              <div role="radiogroup" aria-label="Size" className="mt-2.5 grid grid-cols-[repeat(auto-fit,minmax(104px,1fr))] gap-2">
                {item.options.map((o, i) => {
                  const on = i === sizeIndex;
                  return (
                    <button
                      key={o.label}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => onSize(i)}
                      className={`rounded-2xl px-3.5 py-3 text-left transition-all ${
                        on ? "bg-berry-soft ring-2 ring-berry" : "bg-ground-2 ring-1 ring-transparent hover:ring-line"
                      }`}
                    >
                      <span className="block text-[13px] font-extrabold">{o.label}</span>
                      <span className="font-display block text-lg font-bold tabular-nums">{formatINR(o.price)}</span>
                      {o.serves && <span className="block text-[12px] font-bold text-ink-soft">serves {o.serves}</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-dashed border-line pt-6">
                <div className="mr-auto">
                  <p className="text-xs font-extrabold tracking-[0.1em] text-ink-soft uppercase">Total</p>
                  <p className="font-display text-3xl font-bold tabular-nums">{formatINR(opt.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await copyText(orderNote);
                    setCopyState({ id: item.id, status: ok ? "ok" : "fail" });
                  }}
                  className="rounded-full bg-ground-2 px-4 py-3 text-sm font-extrabold ring-1 ring-line transition-colors hover:bg-berry-soft"
                >
                  {copied === "ok" ? "Copied ✓" : "Copy order note"}
                </button>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-berry px-5 py-3 text-sm font-extrabold text-berry-ink shadow-lift transition-transform hover:-translate-y-0.5"
                >
                  <TelegramIcon className="size-4" />
                  Order on Telegram
                </a>
              </div>
              <p aria-live="polite" className="mt-3 text-[13px] leading-relaxed text-ink-soft">
                {copied === "ok"
                  ? "Order note copied. Paste it into your Telegram chat with us and fill in the date."
                  : copied === "fail"
                    ? "Couldn’t reach your clipboard. Select the note below and copy it by hand."
                    : `Prices include taxes. Please order at least ${site.leadTime} ahead${item.diet === "egg" ? ", and ask for eggless for ₹50/kg more" : ""}.`}
              </p>
              {copied === "fail" && (
                <p className="mt-2 rounded-xl bg-ground-2 p-3 text-[13px] select-all">{orderNote}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
