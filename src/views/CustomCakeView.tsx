"use client";

/* eslint-disable @next/next/no-img-element -- previews of a local file the customer picked */
import { useRef, useState, type ReactNode } from "react";
import { whatsappUrl } from "@/config/site";
import { flavours } from "@/data/menu";
import { CheckIcon, CloseIcon, Eyebrow, UploadIcon, Wash, WhatsAppIcon, btn } from "@/components/ui";

const OCCASIONS = ["Birthday", "Anniversary", "Baby shower", "Wedding", "Corporate", "Something else"];
const SIZES = ["1 lb", "2 lb", "3 lb", "4 lb", "5 lb or more"];
const FLAVOURS = [...flavours.map((f) => f.name), "Not sure, suggest one"];
const BUDGETS = ["Under ₹800", "₹800 – 1,500", "₹1,500 – 2,500", "₹2,500+"];
const MAX_MB = 8;
const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

type State = {
  occasion: string;
  size: string;
  flavour: string;
  eggless: boolean;
  idea: string;
  message: string;
  date: string;
  budget: string;
  name: string;
  phone: string;
  company: string;
};

export function CustomCakeView() {
  const [s, setS] = useState<State>({
    occasion: "Birthday",
    size: "2 lb",
    flavour: FLAVOURS[0],
    eggless: true,
    idea: "",
    message: "",
    date: "",
    budget: BUDGETS[1],
    name: "",
    phone: "",
    company: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; demo: boolean } | null>(null);
  const [minDate, setMinDate] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof State>(k: K, v: State[K]) => {
    setS((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErrors((e) => ({ ...e, photo: "Please choose an image (JPG, PNG, WebP or HEIC)." }));
    if (f.size > MAX_MB * 1024 * 1024) return setErrors((e) => ({ ...e, photo: `That photo is over ${MAX_MB} MB. Try a smaller one.` }));
    setErrors((e) => ({ ...e, photo: "" }));
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    setFile(f);
  };

  const summary = () =>
    [
      `Custom cake request`,
      `Occasion: ${s.occasion}`,
      `Size: ${s.size}`,
      `Flavour: ${s.flavour}`,
      `Eggless: ${s.eggless ? "Yes" : "No"}`,
      `Date: ${s.date}`,
      `Budget: ${s.budget}`,
      s.message && `Message: ${s.message}`,
      `Idea: ${s.idea}`,
      `Name: ${s.name} · ${s.phone}`,
    ]
      .filter(Boolean)
      .join("\n");

  const submit = async () => {
    const errs: Record<string, string> = {};
    if (s.idea.trim().length < 10) errs.idea = "Tell us a little about the design: colours, theme, anything you have in mind.";
    if (!s.date) errs.date = "When do you need it?";
    if (s.name.trim().length < 2) errs.name = "Please tell us your name.";
    if (!/^[6-9]\d{9}$/.test(s.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, ""))) errs.phone = "Enter a 10-digit mobile number.";
    setErrors(errs);
    const first = Object.keys(errs).find((k) => errs[k]);
    if (first) {
      document.querySelector(`[data-field="${first}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setSending(true);
    setFailed(null);
    try {
      if (DEMO) {
        await new Promise((r) => setTimeout(r, 900));
        setDone({ id: `BB-C${Math.random().toString(36).slice(2, 6).toUpperCase()}`, demo: true });
      } else {
        const body = new FormData();
        Object.entries(s).forEach(([k, v]) => body.set(k, String(v)));
        if (file) body.set("photo", file);
        const res = await fetch("/api/custom-cake", { method: "POST", body });
        const data = await res.json().catch(() => ({ ok: false }));
        if (!res.ok || !data.ok) throw new Error(data.error || "We couldn't send your request.");
        setDone({ id: data.requestId, demo: Boolean(data.demo) });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setFailed(e instanceof Error ? e.message : "We couldn't send your request.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 pt-20 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-accent text-accent-ink">
          <CheckIcon className="size-9" />
        </span>
        <h1 className="font-display mt-7 text-[clamp(2.2rem,5vw,3rem)] leading-tight">We&rsquo;ve got your idea</h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-muted">
          Request <span className="font-semibold text-ink">{done.id}</span> is with the baker. Expect a WhatsApp message with a quote and a few
          questions within a day.
        </p>
        {done.demo && <p className="mt-4 rounded-xl bg-blush px-4 py-2.5 text-[13px] text-muted">Demo mode: Telegram isn&rsquo;t connected yet, so nothing was sent.</p>}
        <a href={whatsappUrl(`Hi! I just sent custom cake request ${done.id}.`)} target="_blank" rel="noreferrer" className={`${btn.ghost} mt-8`}>
          <WhatsAppIcon className="size-5 text-veg" /> Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-12 sm:px-6 md:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
      {/* intro */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative">
          <Wash id="custom" seed={5} className="wash pointer-events-none absolute -top-16 -left-20 h-72 w-120 opacity-80" colors={["#F3CFD5", "#F8E1CC"]} />
          <Eyebrow className="relative">Custom cakes</Eyebrow>
          <h1 className="font-display relative mt-4 text-[clamp(2.6rem,5.5vw,4.2rem)] leading-[1.04] tracking-[-0.02em]">
            Dream it up. <em className="text-accent">We&rsquo;ll bake it.</em>
          </h1>
        </div>
        <p className="mt-5 max-w-md text-[16.5px] leading-relaxed text-muted">
          Themes, tiers, photo cakes, a cake shaped like your dog. Tell us the idea and share a picture if you have one.
        </p>
        <ol className="mt-10 space-y-6">
          {[
            ["Share your idea", "Fill in the form. A reference photo helps a lot."],
            ["Get a quote", "We reply on WhatsApp within a day with a price and a few questions."],
            ["Lock it in", "Confirm with a small advance and we'll reserve the oven for you."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="font-display grid size-9 shrink-0 place-items-center rounded-full bg-blush text-[16px] italic">{i + 1}</span>
              <div>
                <p className="font-semibold">{t}</p>
                <p className="mt-0.5 text-[14.5px] text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-[14px] text-muted">Custom cakes need at least 3 days&rsquo; notice. Weddings and tiered cakes, 2 weeks.</p>
      </div>

      {/* form */}
      <form
        className="rounded-[28px] bg-paper p-5 shadow-soft ring-1 ring-line sm:p-9"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        noValidate
      >
        <Group label="What's the occasion?">
          <Chips options={OCCASIONS} value={s.occasion} onChange={(v) => set("occasion", v)} name="occasion" />
        </Group>
        <Group label="How big?" hint="1 lb serves 4–5 · 2 lb serves 8–10">
          <Chips options={SIZES} value={s.size} onChange={(v) => set("size", v)} name="size" />
        </Group>
        <div className="grid gap-6 sm:grid-cols-2">
          <Group label="Flavour">
            <select id="flavour" value={s.flavour} onChange={(e) => set("flavour", e.target.value)} className={input()}>
              {FLAVOURS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </Group>
          <Group label="Needed on" field="date" error={errors.date}>
            <input
              id="date"
              type="date"
              value={s.date}
              min={minDate}
              onFocus={() => {
                if (!minDate) {
                  const d = new Date(Date.now() + 3 * 86400_000);
                  setMinDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
                }
              }}
              onChange={(e) => set("date", e.target.value)}
              className={input(errors.date)}
            />
          </Group>
        </div>
        <label className="mb-7 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-blush/70 px-4 py-3.5 text-[15px]">
          <span>
            <span className="font-semibold">Eggless</span> <span className="text-muted">· recommended if you&rsquo;re unsure</span>
          </span>
          <input type="checkbox" id="eggless-custom" checked={s.eggless} onChange={(e) => set("eggless", e.target.checked)} className="peer sr-only" />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-veg peer-focus-visible:outline-2 peer-focus-visible:outline-accent after:absolute after:top-0.75 after:left-0.75 after:size-4.5 after:rounded-full after:bg-paper after:shadow after:transition-all peer-checked:after:left-5.75" />
        </label>

        <Group label="Describe your cake" field="idea" error={errors.idea}>
          <textarea
            id="idea"
            rows={4}
            value={s.idea}
            onChange={(e) => set("idea", e.target.value.slice(0, 800))}
            placeholder="Pastel blue, two tiers, little gold stars and a moon on top…"
            className={input(errors.idea)}
          />
        </Group>

        <Group label="Reference photo" hint="Optional · a screenshot from Instagram or Pinterest is perfect" error={errors.photo} field="photo">
          {preview ? (
            <div className="flex items-center gap-4 rounded-2xl bg-blush/60 p-3">
              <img src={preview} alt="Your reference" className="size-20 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold">{file?.name}</p>
                <p className="text-[13px] text-muted">{file ? (file.size / 1024 / 1024).toFixed(1) : 0} MB</p>
              </div>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-full hover:bg-paper"
                aria-label="Remove photo"
                onClick={() => {
                  if (preview) URL.revokeObjectURL(preview);
                  setFile(null);
                  setPreview(null);
                  if (fileInput.current) fileInput.current.value = "";
                }}
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="photo"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                pick(e.dataTransfer.files[0]);
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-blush-2 px-6 py-8 text-center transition-colors hover:bg-blush/50"
            >
              <UploadIcon className="size-6 text-muted" />
              <span className="text-[15px] font-semibold">Add a photo</span>
              <span className="text-[13px] text-muted">Tap to choose, or drop it here · up to {MAX_MB} MB</span>
            </label>
          )}
          <input ref={fileInput} id="photo" type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </Group>

        <Group label="Message on the cake" hint="Optional">
          <input id="custom-message" value={s.message} maxLength={40} onChange={(e) => set("message", e.target.value)} className={input()} placeholder="Happy 30th, Kabir" />
        </Group>
        <Group label="Rough budget">
          <Chips options={BUDGETS} value={s.budget} onChange={(v) => set("budget", v)} name="budget" />
        </Group>

        <div className="rule my-8" />

        <div className="grid gap-6 sm:grid-cols-2">
          <Group label="Your name" field="name" error={errors.name}>
            <input id="custom-name" autoComplete="name" value={s.name} onChange={(e) => set("name", e.target.value)} className={input(errors.name)} />
          </Group>
          <Group label="Mobile number" field="phone" error={errors.phone}>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[15px] text-muted">+91</span>
              <input
                id="custom-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={s.phone}
                onChange={(e) => set("phone", e.target.value.replace(/[^\d ]/g, "").slice(0, 12))}
                className={`${input(errors.phone)} pl-12`}
              />
            </div>
          </Group>
        </div>
        <input tabIndex={-1} aria-hidden autoComplete="off" className="hidden" id="custom-company" value={s.company} onChange={(e) => set("company", e.target.value)} />

        {failed && (
          <div className="mb-5 rounded-2xl bg-accent-soft p-4 text-[14px]">
            <p className="font-semibold">{failed}</p>
            <a href={whatsappUrl(summary())} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 font-semibold underline underline-offset-4">
              <WhatsAppIcon className="size-4 text-veg" /> Send it on WhatsApp instead
            </a>
          </div>
        )}
        <button type="submit" disabled={sending} className={`${btn.primary} w-full`}>
          {sending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> Sending…
            </>
          ) : (
            "Send my idea to the baker"
          )}
        </button>
        <p className="mt-3 text-center text-[13px] text-muted">No payment now. We reply on WhatsApp within a day.</p>
      </form>
    </div>
  );
}

const input = (err?: string) =>
  `w-full rounded-xl bg-ground px-4 py-3 text-[15px] ring-1 outline-none transition placeholder:text-muted/60 focus:ring-2 ${err ? "ring-accent focus:ring-accent" : "ring-line focus:ring-ink"}`;

function Group({ label, hint, error, field, children }: { label: string; hint?: string; error?: string; field?: string; children: ReactNode }) {
  return (
    <div className="mb-7" data-field={field}>
      <p className="mb-2.5 flex flex-wrap items-baseline justify-between gap-x-3 text-[14px] font-semibold">
        {label}
        {hint && <span className="text-[13px] font-normal text-muted">{hint}</span>}
      </p>
      {children}
      {error && <p className="mt-1.5 text-[13px] font-medium text-accent">{error}</p>}
    </div>
  );
}

function Chips({ options, value, onChange, name }: { options: string[]; value: string; onChange: (v: string) => void; name: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((o) => {
        const on = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={`rounded-full px-4 py-2 text-[14px] transition ${on ? "bg-ink text-ground" : "bg-ground ring-1 ring-line hover:ring-blush-2"}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
