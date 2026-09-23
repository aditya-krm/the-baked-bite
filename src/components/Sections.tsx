import type { ReactNode } from "react";
import { instagramUrl, site, telegramUrl } from "@/config/site";
import { addOns, formatINR, menu } from "@/data/menu";
import { CakeArt } from "./CakeArt";
import { Logo, Sprinkles, TelegramIcon } from "./ui";

export function AddOns() {
  const bento = menu.find((m) => m.id === "bento-bae")!;
  return (
    <section id="extras" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="grid items-center gap-10 rounded-[36px] bg-ground-2 p-6 sm:p-10 md:grid-cols-[1fr_1.1fr] lg:p-14">
        <div className="relative">
          <p className="font-hand text-2xl text-berry">the finishing touch</p>
          <h2 className="font-display mt-1 text-[clamp(2.2rem,4.5vw,3.4rem)] leading-[1] font-semibold tracking-[-0.02em]">
            Make it <em className="text-berry">extra</em>.
          </h2>
          <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-ink-soft">
            Add these when you order and we&rsquo;ll pack them with your cake. The message on top is always free, so write
            something that makes them smile.
          </p>
          <div className="relative mt-6 hidden w-56 md:block">
            <Sprinkles className="absolute -top-4 -left-6 w-20" />
            <div className="tile rotate-[-4deg] rounded-[28px] shadow-soft" style={{ ["--tint" as string]: bento.tint }}>
              <CakeArt spec={bento.art} id={bento.id} variant="extras" title={bento.real} />
            </div>
          </div>
        </div>

        {/* paper price list */}
        <div className="relative rotate-[0.6deg] rounded-[6px] bg-surface p-6 shadow-lift sm:p-9">
          <div
            aria-hidden
            className="absolute inset-x-0 -top-2 h-3"
            style={{ background: "radial-gradient(circle at 8px -2px, transparent 7px, var(--surface) 7.5px) 0 0 / 16px 12px repeat-x" }}
          />
          <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
            <h3 className="font-display text-2xl font-semibold">Add-ons</h3>
            <span className="text-[12px] font-extrabold tracking-[0.12em] text-ink-soft uppercase">₹ · incl. taxes</span>
          </div>
          <ul className="mt-2 divide-y divide-dashed divide-line">
            {addOns.map((a) => (
              <li key={a.name} className="py-3.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[16px] font-extrabold">{a.name}</span>
                  <span className="leader" />
                  <span className={`font-display text-lg font-bold tabular-nums ${a.price === 0 ? "text-pistachio" : ""}`}>
                    {a.price === 0 ? "Free" : `+${formatINR(a.price)}`}
                    {"suffix" in a && <span className="ml-1 text-[13px] font-semibold text-ink-soft">{a.suffix}</span>}
                  </span>
                </div>
                <p className="mt-0.5 text-[13.5px] font-semibold text-ink-soft">{a.detail}</p>
              </li>
            ))}
          </ul>
          <p className="font-hand mt-4 text-right text-xl text-ink-soft">thank you, come again ♥</p>
        </div>
      </div>
    </section>
  );
}

const icons: Record<string, ReactNode> = {
  clock: (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <circle cx="16" cy="17" r="11" fill="var(--butter)" />
      <circle cx="16" cy="17" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16 11v6l4 3" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M12 3h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <rect x="4" y="4" width="24" height="24" rx="4" fill="none" stroke="var(--veg)" strokeWidth="2.4" />
      <circle cx="16" cy="16" r="6.5" fill="var(--veg)" />
    </svg>
  ),
  scooter: (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <rect x="15" y="8" width="11" height="9" rx="2" fill="var(--berry-soft)" stroke="currentColor" strokeWidth="2" />
      <path d="M5 22h14l3-5h4M9 22l2-8H7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="24" r="3" fill="var(--surface)" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="24" r="3" fill="var(--surface)" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  snow: (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <circle cx="16" cy="16" r="12" fill="#D8ECF7" />
      <path d="M16 6v20M7.3 11l17.4 10M7.3 21l17.4-10M13 7.5l3 2.5 3-2.5M13 24.5l3-2.5 3 2.5" stroke="#3E7BA6" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
};

export function GoodToKnow() {
  const notes = [
    {
      icon: "clock",
      title: `Order ${site.leadTime} ahead`,
      body: "Celebration and tier cakes need a day. Brownies, jars and cupcakes are often ready the same day, so just ask.",
    },
    {
      icon: "leaf",
      title: "Eggless, always an option",
      body: "Most of the menu is eggless already. Anything marked with egg can be made without it for ₹50/kg more.",
    },
    {
      icon: "scooter",
      title: `Delivery within ${site.deliveryRadiusKm} km`,
      body: "₹60 to ₹150 depending on distance, or pick up from the shop for free. Cakes travel flat, in the boot or on a lap.",
    },
    {
      icon: "snow",
      title: "Keep it chilled",
      body: "Cream cakes and cheesecakes keep 2 days in the fridge. Take them out 20 minutes before you cut.",
    },
  ];
  return (
    <section id="good-to-know" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-none font-semibold tracking-[-0.02em]">Good to know</h2>
        <p className="font-hand text-2xl text-berry">before you order</p>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((n) => (
          <li key={n.title} className="rounded-[24px] border border-line bg-surface/60 p-6">
            <span className="grid size-12 place-items-center rounded-2xl bg-ground-2 text-ink">{icons[n.icon]}</span>
            <h3 className="mt-4 text-[17px] font-extrabold">{n.title}</h3>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{n.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Visit() {
  return (
    <section id="visit" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[36px] bg-ink p-7 text-ground sm:p-12 lg:p-16">
        <Sprinkles className="absolute top-6 right-8 w-28 opacity-90" />
        <p className="font-hand text-2xl text-[color-mix(in_oklab,var(--berry)_70%,var(--ground))]">come say hi</p>
        <h2 className="font-display mt-1 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] leading-[0.98] font-semibold tracking-[-0.02em]">
          The oven&rsquo;s on and the kettle&rsquo;s warm.
        </h2>
        <div className="mt-10 grid gap-8 border-t border-ground/15 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-xs font-extrabold tracking-[0.14em] uppercase opacity-60">Find us</h3>
            <p className="mt-2 text-[16px] leading-relaxed font-semibold">{site.address}</p>
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-[0.14em] uppercase opacity-60">Hours</h3>
            <dl className="mt-2 flex flex-col gap-1 text-[16px] font-semibold">
              {site.hours.map((h) => (
                <div key={h.days} className="flex gap-3">
                  <dt className="w-24 shrink-0 opacity-70">{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-[0.14em] uppercase opacity-60">Talk to the baker</h3>
            <p className="mt-2 text-[16px] font-semibold tabular-nums select-all">{site.phone}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-berry px-4 py-2.5 text-sm font-extrabold text-berry-ink"
              >
                <TelegramIcon className="size-4" /> @{site.telegram}
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold ring-1 ring-ground/30 hover:bg-ground/10"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 pt-6 pb-10 text-[13.5px] font-semibold text-ink-soft sm:px-6 lg:px-8">
      <span className="flex items-center gap-2">
        <Logo className="size-6" />
        © {new Date().getFullYear()} {site.name}. Baked with butter and a little bit of love.
      </span>
      <span>Prices in ₹ (INR), inclusive of taxes. Menu may change with the seasons.</span>
    </footer>
  );
}
