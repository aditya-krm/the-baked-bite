"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { site, whatsappUrl } from "@/config/site";
import { extras as extraList, formatINR, getFlavour, leadDaysFor } from "@/data/menu";
import { useActiveOffers } from "@/lib/offers-context";
import { box, useBox } from "@/lib/box-store";
import { boxUI, useBoxUI } from "@/lib/box-ui";
import { orderText, priceBox, validateOrder, type OrderPayload } from "@/lib/order";
import { bookableDays, isBookable, noticeLabel, prettyDay, type Day } from "@/lib/schedule";
import { Media, slidesFor } from "../Media";
import { ArrowLeft, BoxIcon, CheckIcon, CloseIcon, MinusIcon, PinIcon, PlusIcon, WhatsAppIcon, btn } from "../ui";

type Step = "box" | "details" | "done";
type Form = {
  name: string;
  phone: string;
  type: "pickup" | "delivery";
  address: string;
  date: string;
  slot: string;
  notes: string;
  company: string; // honeypot
};
const PROFILE_KEY = "tbb-profile-v1";
const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

export function BoxDrawer({ photos }: { photos: Record<string, string[]> }) {
  const reduce = useReducedMotion();
  const { open } = useBoxUI();
  const { lines, extras } = useBox();
  const [step, setStep] = useState<Step>("box");
  const [days, setDays] = useState<Day[]>([]);
  const [form, setForm] = useState<Form>({ name: "", phone: "", type: "pickup", address: "", date: "", slot: "", notes: "", company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; demo: boolean; name: string; when: string; type: Form["type"] } | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  const offerIds = useActiveOffers();
  const { priced, pickedExtras, subtotal, leadDays, savings } = priceBox(lines, extras, offerIds);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const lead = (p: (typeof priced)[number]) => leadDaysFor(p.item);
  const slowest = priced.reduce<(typeof priced)[number] | null>((a, p) => (!a || lead(p) > lead(a) ? p : a), null);
  const desktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

  const close = () => {
    boxUI.close();
    if (step === "done") {
      setStep("box");
      setDone(null);
    }
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && boxUI.close();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panel.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[k];
      return n;
    });
  };

  const toDetails = () => {
    const d = bookableDays(leadDays);
    setDays(d);
    const open = d.filter((x) => x.status === "open");
    let profile: Partial<Form> = {};
    try {
      profile = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "{}");
    } catch {}
    setForm((f) => {
      const dayOk = open.find((x) => x.key === f.date);
      const day = dayOk ?? open[0];
      const slotOk = day?.slots.find((s) => s.id === f.slot && s.available);
      return {
        ...f,
        name: f.name || profile.name || "",
        phone: f.phone || profile.phone || "",
        address: f.address || profile.address || "",
        date: day?.key ?? "",
        slot: slotOk ? f.slot : (day?.slots.find((s) => s.available)?.id ?? ""),
      };
    });
    setFailed(null);
    setStep("details");
    panel.current?.scrollTo({ top: 0 });
    // bring the chosen day into view in the strip
    setTimeout(() => {
      const el = strip.current?.querySelector<HTMLElement>("[data-on]");
      if (el && strip.current) strip.current.scrollTo({ left: el.offsetLeft - strip.current.clientWidth / 2 + el.clientWidth / 2 });
    }, 60);
  };

  const payload = (): OrderPayload => ({
    lines,
    extras,
    customer: { name: form.name.trim(), phone: form.phone.trim() },
    fulfilment: { type: form.type, address: form.type === "delivery" ? form.address.trim() : undefined, date: form.date, slot: form.slot },
    notes: form.notes.trim() || undefined,
  });

  const place = async () => {
    const order = payload();
    const errs = validateOrder(order);
    if (!errs.date && !errs.slot && !isBookable(leadDays, form.date, form.slot)) {
      errs.slot = "That time just passed. Please pick another slot.";
      setDays(bookableDays(leadDays));
    }
    setErrors(errs);
    if (Object.keys(errs).length) {
      panel.current?.querySelector<HTMLElement>(`[data-field="${Object.keys(errs)[0]}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setSending(true);
    setFailed(null);
    try {
      let result: { ok: boolean; orderId?: string; demo?: boolean; error?: string; errors?: Record<string, string> };
      if (DEMO) {
        await new Promise((r) => setTimeout(r, 900));
        result = { ok: true, orderId: `BB-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, demo: true };
      } else {
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...order, company: form.company }),
        });
        result = await res.json().catch(() => ({ ok: false }));
        if (res.status === 422 && result.errors?.slot) {
          // the slot passed while they were filling the form: refresh the calendar
          setDays(bookableDays(leadDays));
          setErrors({ slot: result.errors.slot });
          setSending(false);
          return;
        }
        if (!res.ok || !result.ok) throw new Error(result.error || "We couldn't send your order.");
      }
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: form.name, phone: form.phone, address: form.address }));
      } catch {}
      const slot = site.slots.find((s) => s.id === form.slot)?.label ?? "";
      setDone({ id: result.orderId!, demo: Boolean(result.demo), name: form.name.trim().split(/\s+/)[0], when: `${prettyDay(form.date)}, ${slot}`, type: form.type });
      box.clear();
      setStep("done");
      panel.current?.scrollTo({ top: 0 });
    } catch (e) {
      setFailed(e instanceof Error ? e.message : "We couldn't send your order.");
    } finally {
      setSending(false);
    }
  };

  const day = days.find((d) => d.key === form.date);
  const firstOpen = days.find((d) => d.status === "open");

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="box" className="fixed inset-0 z-60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[rgb(30_18_15/0.42)] backdrop-blur-[3px]" onClick={close} aria-hidden />
          <motion.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your box"
            className="absolute inset-x-0 bottom-0 flex max-h-[94dvh] flex-col overflow-x-hidden overflow-y-auto overscroll-contain rounded-t-[28px] bg-ground outline-none md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-115 md:rounded-none md:rounded-l-[28px]"
            initial={reduce ? { opacity: 0 } : desktop ? { x: "100%" } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0, y: 0 }}
            exit={reduce ? { opacity: 0 } : desktop ? { x: "100%" } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-ground/95 px-5 py-4 backdrop-blur">
              {step === "details" ? (
                <button type="button" onClick={() => setStep("box")} className="-ml-2 grid size-9 place-items-center rounded-full hover:bg-blush" aria-label="Back to your box">
                  <ArrowLeft />
                </button>
              ) : null}
              <h2 className="font-display text-[22px]">{step === "details" ? "When & where" : step === "done" ? "Order placed" : "Your box"}</h2>
              {step !== "done" && (
                <ol className="ml-2 flex items-center gap-1.5" aria-label="Steps">
                  {(["box", "details"] as const).map((s) => (
                    <li key={s} className={`h-1.5 rounded-full transition-all ${step === s ? "w-5 bg-accent" : "w-1.5 bg-line"}`} aria-current={step === s ? "step" : undefined} />
                  ))}
                </ol>
              )}
              <button type="button" onClick={close} className="-mr-2 ml-auto grid size-9 place-items-center rounded-full hover:bg-blush" aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            {/* ─── step 1: the box ─── */}
            {step === "box" &&
              (count === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
                  <span className="grid size-20 place-items-center rounded-full bg-blush text-muted">
                    <BoxIcon className="size-9" />
                  </span>
                  <p className="font-display mt-5 text-2xl">Your box is empty</p>
                  <p className="mt-2 max-w-xs text-[15px] text-muted">Pick a cake, choose a size and add it here. You can add as many as you like.</p>
                  <Link href="/cakes" onClick={close} className={`${btn.primary} mt-6`}>
                    Browse cakes
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-line px-5">
                    {priced.map(({ line, item, option, total, saved }) => (
                      <li key={line.key} className="flex gap-4 py-5">
                        <Link href={`/cakes/${item.id}`} onClick={close} className="relative size-21 shrink-0 overflow-hidden rounded-2xl">
                          <Media item={item} slide={slidesFor(photos[item.id])[0]} variant="box" sizes="84px" className="absolute inset-0" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-display text-[17px] leading-snug">{item.name}</p>
                            <p className="text-right text-[15px] font-semibold tabular-nums">
                              {formatINR(total)}
                              {saved > 0 && <span className="block text-[12.5px] font-normal text-muted line-through">{formatINR(total + saved)}</span>}
                            </p>
                          </div>
                          <p className="mt-0.5 text-[13.5px] text-muted">
                            {option.label}{getFlavour(line.flavour) ? ` · ${getFlavour(line.flavour)!.name}` : ""}{item.diet === "eggless" ? "" : line.eggless ? " · Made eggless" : " · With egg"}
                          </p>
                          {line.message && <p className="mt-0.5 truncate text-[13.5px] text-muted">“{line.message}”</p>}
                          <div className="mt-2.5 flex items-center gap-3">
                            <Stepper value={line.qty} onChange={(q) => box.setQty(line.key, q)} label={item.name} />
                            <button type="button" onClick={() => box.remove(line.key)} className="text-[13px] text-muted underline underline-offset-4 hover:text-ink">
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mx-5 mt-1 rounded-2xl bg-blush/70 p-4">
                    <p className="text-[13px] font-semibold tracking-[0.12em] text-muted uppercase">Little extras</p>
                    <ul className="mt-2 space-y-1">
                      {extraList.map((x) => {
                        const on = extras.find((e) => e.id === x.id);
                        return (
                          <li key={x.id}>
                            <label className="flex cursor-pointer items-center gap-3 py-1.5">
                              <input type="checkbox" checked={Boolean(on)} onChange={() => box.toggleExtra(x.id)} className="size-4.5 accent-accent" id={`extra-${x.id}`} />
                              <span className="flex-1 text-[15px]">
                                {x.name} <span className="text-[13px] text-muted">· {x.detail}</span>
                              </span>
                              <span className="text-[14px] tabular-nums">{formatINR(x.price)}</span>
                            </label>
                            {on && x.ask && (
                              <input
                                id={`extra-note-${x.id}`}
                                value={on.note ?? ""}
                                onChange={(e) => box.setExtraNote(x.id, e.target.value.slice(0, 12))}
                                placeholder={x.ask}
                                className="mb-1 ml-7.5 w-40 rounded-lg bg-paper px-3 py-1.5 text-[14px] ring-1 ring-line outline-none focus:ring-accent"
                              />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <Footer>
                    {savings > 0 && <Row label="Offer savings" value={`−${formatINR(savings)}`} />}
                    <Row label="Subtotal" value={formatINR(subtotal)} strong />
                    <p className="mt-1 text-[13px] text-muted">
                      {slowest && leadDays >= 1 ? `${slowest.item.name} needs ${noticeLabel(leadDays)}. ` : ""}Delivery, if needed: {site.deliveryFeeNote}.
                    </p>
                    <button type="button" onClick={toDetails} className={`${btn.primary} mt-4 w-full`}>
                      Choose day & time
                    </button>
                  </Footer>
                </>
              ))}

            {/* ─── step 2: details ─── */}
            {step === "details" && (
              <form
                className="flex flex-1 flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                  place();
                }}
                noValidate
              >
                <div className="space-y-7 px-5 py-6">
                  <fieldset data-field="type">
                    <legend className="mb-2.5 text-[14px] font-semibold">How would you like it?</legend>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(["pickup", "delivery"] as const).map((t) => (
                        <label
                          key={t}
                          className={`cursor-pointer rounded-2xl p-3.5 ring-1 transition ${form.type === t ? "bg-paper ring-2 ring-ink" : "bg-paper/60 ring-line hover:ring-blush-2"}`}
                        >
                          <input type="radio" name="type" value={t} checked={form.type === t} onChange={() => set("type", t)} className="sr-only" id={`type-${t}`} />
                          <span className="block text-[15px] font-semibold">{t === "pickup" ? "Pickup" : "Delivery"}</span>
                          <span className="mt-0.5 block text-[13px] text-muted">{t === "pickup" ? "Free, from our kitchen" : `Within ${site.deliveryRadiusKm} km`}</span>
                        </label>
                      ))}
                    </div>
                    {form.type === "pickup" ? (
                      <p className="mt-3 flex items-start gap-2 text-[13.5px] text-muted">
                        <PinIcon className="mt-0.5 size-4 shrink-0" /> {site.address}
                      </p>
                    ) : (
                      <div className="mt-3" data-field="address">
                        <textarea
                          id="address"
                          rows={3}
                          value={form.address}
                          onChange={(e) => set("address", e.target.value)}
                          placeholder="Flat, building, street, area and a landmark"
                          className={field(errors.address)}
                          autoComplete="street-address"
                        />
                        <Err msg={errors.address} />
                        <p className="mt-1.5 text-[13px] text-muted">Delivery fee: {site.deliveryFeeNote}.</p>
                      </div>
                    )}
                  </fieldset>

                  <fieldset data-field="date" className="min-w-0">
                    <legend className="mb-2.5 text-[14px] font-semibold">Which day?</legend>
                    {firstOpen && (
                      <p className="-mt-1 mb-3 text-[13px] text-muted">
                        Earliest: <span className="font-semibold text-ink">{firstOpen.label === firstOpen.weekday ? prettyDay(firstOpen.key) : firstOpen.label}, {firstOpen.slots.find((x) => x.available)?.label}</span>
                        {slowest && leadDays >= 1 ? ` · ${slowest.item.name} needs ${noticeLabel(leadDays)}` : ""}
                      </p>
                    )}
                    <div ref={strip} className="no-scrollbar relative -mx-5 flex snap-x gap-2 overflow-x-auto scroll-px-5 px-5 pb-1" role="radiogroup" aria-label="Day">
                      {days.map((d) => {
                        const on = d.key === form.date;
                        const off = d.status !== "open";
                        return (
                          <button
                            key={d.key}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            disabled={off}
                            data-on={on || undefined}
                            aria-label={`${prettyDay(d.key)}${d.status === "closed" ? ", closed" : d.status === "too-soon" ? ", too soon" : ""}`}
                            onClick={() => {
                              set("date", d.key);
                              const keep = d.slots.find((s) => s.id === form.slot && s.available);
                              if (!keep) set("slot", d.slots.find((s) => s.available)?.id ?? "");
                            }}
                            className={`flex w-16 shrink-0 snap-start flex-col items-center rounded-2xl py-2.5 transition ${
                              on ? "bg-ink text-ground" : off ? "cursor-not-allowed bg-transparent opacity-45 ring-1 ring-line ring-dashed" : "bg-paper ring-1 ring-line hover:ring-blush-2"
                            }`}
                          >
                            <span className={`text-[11px] font-semibold uppercase ${on ? "opacity-80" : "text-muted"}`}>{d.label === d.weekday ? d.weekday : d.label === "Tomorrow" ? "Tmrw" : d.label}</span>
                            <span className="font-display text-[22px] leading-tight">{d.dayNum}</span>
                            <span className={`text-[11px] ${on ? "opacity-80" : "text-muted"}`}>{d.status === "closed" ? "Closed" : d.status === "too-soon" ? "Too soon" : d.month}</span>
                          </button>
                        );
                      })}
                    </div>
                    <Err msg={errors.date} />
                  </fieldset>

                  <fieldset data-field="slot">
                    <legend className="mb-2.5 text-[14px] font-semibold">What time?</legend>
                    <div className="grid grid-cols-2 gap-2">
                      {(day?.slots ?? []).map((s) => {
                        const on = s.id === form.slot;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            disabled={!s.available}
                            onClick={() => set("slot", s.id)}
                            aria-pressed={on}
                            className={`rounded-xl px-3 py-3 text-[14px] font-medium transition disabled:cursor-not-allowed disabled:opacity-35 disabled:line-through ${
                              on ? "bg-ink text-ground" : "bg-paper ring-1 ring-line hover:ring-blush-2"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                    <Err msg={errors.slot} />
                  </fieldset>

                  <div className="grid gap-4">
                    <div data-field="name">
                      <label htmlFor="name" className="mb-1.5 block text-[14px] font-semibold">Your name</label>
                      <input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={field(errors.name)} />
                      <Err msg={errors.name} />
                    </div>
                    <div data-field="phone">
                      <label htmlFor="phone" className="mb-1.5 block text-[14px] font-semibold">Mobile number</label>
                      <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[15px] text-muted">+91</span>
                        <input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value.replace(/[^\d ]/g, "").slice(0, 12))}
                          className={`${field(errors.phone)} pl-12`}
                          placeholder="98765 43210"
                        />
                      </div>
                      <Err msg={errors.phone} hint="We'll confirm your order on WhatsApp at this number." />
                    </div>
                    <div>
                      <label htmlFor="notes" className="mb-1.5 block text-[14px] font-semibold">
                        Anything else? <span className="font-normal text-muted">(optional)</span>
                      </label>
                      <textarea
                        id="notes"
                        rows={2}
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value.slice(0, 400))}
                        placeholder="Allergies, colours, a surprise we should know about…"
                        className={field()}
                      />
                    </div>
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                      className="hidden"
                      name="company"
                      id="company"
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                    />
                  </div>
                </div>

                <Footer>
                  {failed && (
                    <div className="mb-4 rounded-2xl bg-accent-soft p-4 text-[14px]">
                      <p className="font-semibold">{failed}</p>
                      <p className="mt-1 text-muted">Nothing is lost. Send the same order on WhatsApp and we&rsquo;ll take it from there.</p>
                      <a
                        href={whatsappUrl(orderText(payload(), "(from website)", false, offerIds))}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 font-semibold text-ink underline underline-offset-4"
                      >
                        <WhatsAppIcon className="size-4 text-veg" /> Send on WhatsApp
                      </a>
                    </div>
                  )}
                  <Row label={`${count} item${count === 1 ? "" : "s"}${pickedExtras.length ? " + extras" : ""}`} value={formatINR(subtotal)} strong />
                  {form.type === "delivery" && <p className="text-[13px] text-muted">+ delivery, confirmed on WhatsApp</p>}
                  <button type="submit" disabled={sending} className={`${btn.primary} mt-4 w-full`}>
                    {sending ? (
                      <>
                        <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> Sending to the baker…
                      </>
                    ) : (
                      <>Place order · {formatINR(subtotal)}</>
                    )}
                  </button>
                  <p className="mt-2.5 text-center text-[12.5px] text-muted">{site.paymentNote}</p>
                </Footer>
              </form>
            )}

            {/* ─── step 3: done ─── */}
            {step === "done" && done && (
              <div className="flex flex-1 flex-col items-center px-7 py-12 text-center">
                <motion.span
                  initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="grid size-20 place-items-center rounded-full bg-accent text-accent-ink"
                >
                  <CheckIcon className="size-9" />
                </motion.span>
                <p className="font-display mt-6 text-[30px] leading-tight">Thank you, {done.name}!</p>
                <p className="mt-3 max-w-sm text-[15.5px] leading-relaxed text-muted">
                  Your order is with the baker. We&rsquo;ll confirm it on WhatsApp within {site.confirmWithin} during opening hours.
                </p>
                <dl className="mt-7 w-full rounded-2xl bg-paper p-5 text-left ring-1 ring-line">
                  <Row label="Order number" value={done.id} strong />
                  <Row label={done.type === "pickup" ? "Pickup" : "Delivery"} value={done.when} />
                </dl>
                {done.demo && (
                  <p className="mt-4 rounded-xl bg-blush px-4 py-2.5 text-[13px] text-muted">
                    Demo mode: Telegram isn&rsquo;t connected yet, so this order wasn&rsquo;t actually sent.
                  </p>
                )}
                <a href={whatsappUrl(`Hi! I just placed order ${done.id} on the website.`)} target="_blank" rel="noreferrer" className={`${btn.ghost} mt-7 w-full`}>
                  <WhatsAppIcon className="size-5 text-veg" /> Message us on WhatsApp
                </a>
                <button type="button" onClick={close} className={`${btn.link} mt-5`}>
                  Keep browsing
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── small pieces ── */

const field = (err?: string) =>
  `w-full rounded-xl bg-paper px-4 py-3 text-[15px] ring-1 outline-none transition placeholder:text-muted/70 focus:ring-2 ${err ? "ring-accent focus:ring-accent" : "ring-line focus:ring-ink"}`;

function Err({ msg, hint }: { msg?: string; hint?: string }) {
  if (msg) return <p className="mt-1.5 text-[13px] font-medium text-accent">{msg}</p>;
  if (hint) return <p className="mt-1.5 text-[13px] text-muted">{hint}</p>;
  return null;
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <dt className="text-[14px] text-muted">{label}</dt>
      <dd className={`tabular-nums ${strong ? "text-[18px] font-semibold" : "text-[15px]"}`}>{value}</dd>
    </div>
  );
}

function Footer({ children }: { children: ReactNode }) {
  return <div className="sticky bottom-0 mt-auto border-t border-line bg-ground/95 px-5 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+18px)] backdrop-blur">{children}</div>;
}

export function Stepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-full ring-1 ring-line">
      <button type="button" onClick={() => onChange(value - 1)} className="grid size-8 place-items-center rounded-full hover:bg-blush" aria-label={`One less ${label}`}>
        <MinusIcon className="size-4" />
      </button>
      <span className="w-6 text-center text-[14px] font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={() => onChange(Math.min(20, value + 1))} className="grid size-8 place-items-center rounded-full hover:bg-blush" aria-label={`One more ${label}`}>
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}

