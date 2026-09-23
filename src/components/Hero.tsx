import { site, telegramUrl } from "@/config/site";
import { formatINR, fromPrice, menu } from "@/data/menu";
import { CakeArt } from "./CakeArt";
import { PriceTag, Sprinkles, TelegramIcon } from "./ui";

const star = menu.find((m) => m.id === "berry-me-in-love")!;
const sideA = menu.find((m) => m.id === "rose-pistachio-poem")!;
const sideB = menu.find((m) => m.id === "tiramisu-tuck-in")!;
const cheapest = Math.min(...menu.map(fromPrice));

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* soft wash behind */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 70% at 85% 30%, color-mix(in oklab, var(--berry-soft) 90%, transparent), transparent 70%), radial-gradient(40% 50% at 0% 100%, color-mix(in oklab, var(--butter) 55%, transparent), transparent 70%)",
        }}
      />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-14 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pt-16 md:pb-20 lg:px-8">
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-3.5 py-1.5 text-[13px] font-extrabold text-ink-soft ring-1 ring-line">
            <span className="size-2 rounded-full bg-pistachio" />
            Baking today in {site.city} · open till 9:30 pm
          </p>
          <h1 className="font-display mt-6 text-[clamp(2.9rem,7.2vw,5.6rem)] leading-[0.95] font-semibold tracking-[-0.02em]">
            Little cakes,
            <br />
            <span className="relative inline-block italic text-berry">
              big
              <svg viewBox="0 0 120 14" className="absolute -bottom-2 left-0 w-full" aria-hidden preserveAspectRatio="none">
                <path d="M2 9 C 30 2, 60 13, 118 5" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            feelings.
          </h1>
          <p className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft sm:text-lg">
            Every cake here has a silly name and a serious amount of butter. Browse the menu, choose a size, and
            message us. We&rsquo;ll have it boxed and ribboned within {site.leadTime}.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-berry px-6 py-3.5 text-[15px] font-extrabold text-berry-ink shadow-lift transition-transform hover:-translate-y-0.5"
            >
              See the menu
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
                <path d="M8 2v11m0 0-4.5-4.5M8 13l4.5-4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3.5 text-[15px] font-extrabold text-ink ring-1 ring-line transition-transform hover:-translate-y-0.5"
            >
              <TelegramIcon className="size-4 text-[#2AABEE]" />
              Message the baker
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-dashed border-line pt-6">
            {[
              [formatINR(cheapest), "treats start at"],
              [String(menu.length), "bakes on the menu"],
              ["Eggless", "options on every bake"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-2xl font-bold tabular-nums sm:text-[28px]">{v}</dd>
                <dd className="mt-0.5 text-[13px] leading-snug font-bold text-ink-soft">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* showcase */}
        <div className="relative mx-auto aspect-square w-full max-w-[540px]">
          <div className="absolute inset-[6%] rounded-full bg-surface/70 ring-1 ring-line" aria-hidden />
          <div className="absolute inset-[13%] rounded-full border-2 border-dashed border-berry/25" aria-hidden />
          <Sprinkles className="absolute top-[4%] left-[8%] w-24 animate-float" />
          <Sprinkles className="absolute right-[2%] bottom-[10%] w-20 rotate-45 animate-float [animation-delay:-3s]" />

          <CakeArt spec={star.art} id={star.id} variant="hero" title={star.real} className="absolute inset-[10%] drop-shadow-[0_30px_30px_rgba(120,40,60,0.18)]" />

          <div className="absolute top-[4%] right-[6%] w-[30%] animate-float [--r:6deg] [animation-delay:-2s]">
            <div className="rounded-[26px] bg-surface p-2 shadow-lift">
              <div className="tile rounded-[20px]" style={{ ["--tint" as string]: sideA.tint }}>
                <CakeArt spec={sideA.art} id={sideA.id} variant="hero" title={sideA.real} />
              </div>
            </div>
          </div>
          <div className="absolute bottom-[3%] left-[0%] w-[28%] animate-float [--r:-5deg] [animation-delay:-4s]">
            <div className="rounded-[26px] bg-surface p-2 shadow-lift">
              <div className="tile rounded-[20px]" style={{ ["--tint" as string]: sideB.tint }}>
                <CakeArt spec={sideB.art} id={sideB.id} variant="hero" title={sideB.real} />
              </div>
            </div>
          </div>

          <div className="absolute top-[18%] left-[4%] animate-sway">
            <PriceTag caption="from" price={formatINR(fromPrice(star))} />
          </div>
          <p className="font-hand absolute right-[4%] bottom-[30%] max-w-[9rem] rotate-[-6deg] text-right text-[22px] leading-tight text-ink">
            {star.name}
            <svg viewBox="0 0 60 30" className="ml-auto h-6 w-12 text-berry" aria-hidden>
              <path d="M56 4 C 44 24, 20 26, 6 16 M6 16 l8 -1 M6 16 l3 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </p>
        </div>
      </div>
    </section>
  );
}
