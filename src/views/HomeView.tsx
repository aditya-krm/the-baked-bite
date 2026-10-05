import Link from "next/link";
import { site, whatsappUrl } from "@/config/site";
import { formatINR, getItem, menuStats, occasionLabels, ratePer, type MenuItem, type Occasion } from "@/data/menu";
import { Media, slidesFor } from "@/components/Media";
import { ProductCard } from "@/components/ProductCard";
import { FromPrice } from "@/components/UnitToggle";
import { ArrowRight, ClockIcon, Eyebrow, SparkIcon, LeafIcon, PinIcon, WhatsAppIcon, Wash, btn } from "@/components/ui";

type Photos = Record<string, string[]>;

const signature = getItem("rose-garden")!;
const loved = ["midnight-garden", "bows-and-pearls", "princess-twirl", "love-note"].map((id) => getItem(id)!);
const occasionCards: { key: Occasion | "custom"; title: string; line: string; item: MenuItem; href: string }[] = [
  { key: "birthday", title: occasionLabels.birthday, line: "Candles, cake, a wish", item: getItem("halfway-hello")!, href: "/cakes?for=birthday" },
  { key: "anniversary", title: occasionLabels.anniversary, line: "For the two of you", item: getItem("heartstrings")!, href: "/cakes?for=anniversary" },
  { key: "just-because", title: occasionLabels["just-because"], line: "Tuesday deserves cake", item: getItem("blush-crescent")!, href: "/cakes?for=just-because" },
  { key: "custom", title: "Something custom", line: "Your idea, our oven", item: getItem("little-kanha")!, href: "/custom-cake" },
];

export function HomeView({ photos }: { photos: Photos }) {
  const stats = menuStats();
  return (
    <>
      {/* ── hero ── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pt-16 md:pb-24 lg:gap-20 lg:px-10">
          <div className="animate-rise">
            <Eyebrow>Home bakery · {site.city}</Eyebrow>
            <h1 className="font-display mt-5 text-[clamp(2.7rem,6vw,4.9rem)] leading-[1.02] tracking-[-0.02em]">
              Cakes baked to order, <em className="text-accent">for the days you&rsquo;ll remember.</em>
            </h1>
            <p className="mt-6 max-w-120 text-[17px] leading-relaxed text-muted">
              Eggless birthday, anniversary and custom cakes, baked to order in Malda. Choose a cake, make it yours, and pick a time for pickup or delivery.
            </p>
            <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/cakes" className={btn.primary}>
                Choose a cake <ArrowRight className="size-4.5" />
              </Link>
              <Link href="/custom-cake" className={btn.ghost}>
                Design a custom cake
              </Link>
            </div>
            <ul className="mt-9 flex max-w-lg flex-wrap gap-x-6 gap-y-3 text-[14px] text-muted sm:mt-11">
              <li className="flex items-center gap-2.5">
                <SparkIcon className="size-4.5 shrink-0 text-ink" /> {stats.total} bakes, {stats.flavours} flavours
              </li>
              <li className="flex items-center gap-2.5">
                <ClockIcon className="size-4.5 shrink-0 text-ink" /> Order by the night before
              </li>
              <li className="flex items-center gap-2.5">
                <LeafIcon className="size-4.5 shrink-0 text-ink" /> 100% eggless
              </li>
              <li className="flex items-center gap-2.5">
                <PinIcon className="size-4.5 shrink-0 text-ink" /> Pickup or delivery
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-130 animate-rise [animation-delay:120ms]">
            <Wash id="hero" className="wash absolute inset-x-[-14%] inset-y-[-10%] h-[120%] w-[128%]" colors={["#F0C3CB", "#F7D9C3"]} />
            <Link href={`/cakes/${signature.id}`} className="group relative block overflow-hidden rounded-t-full rounded-b-4xl shadow-lift" aria-label={`${signature.name}, ${formatINR(ratePer(signature, "lb"))} per pound`}>
              <Media item={signature} slide={slidesFor(photos[signature.id])[0]} variant="hero" priority sizes="(min-width: 768px) 45vw, 100vw" className="aspect-4/5 transition-transform duration-1200 ease-soft group-hover:scale-[1.03]" />
            </Link>
            <Link
              href={`/cakes/${signature.id}`}
              className="absolute -bottom-5 left-4 flex items-center gap-4 rounded-2xl bg-paper/95 py-3.5 pr-4 pl-5 shadow-lift backdrop-blur transition-transform hover:-translate-y-0.5 sm:-left-6"
            >
              <span>
                <span className="block text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Most loved</span>
                <span className="font-display block text-[19px] leading-tight">{signature.name}</span>
              </span>
              <FromPrice itemId={signature.id} className="text-[14px] text-muted" multi={false} perUnit prices={{ lb: ratePer(signature, "lb"), kg: ratePer(signature, "kg") }} />
              <ArrowRight className="size-4.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── occasions ── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-10">
        <h2 className="font-display text-[clamp(2rem,3.6vw,2.9rem)] leading-tight tracking-[-0.01em]">What are we celebrating?</h2>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {occasionCards.map((o) => (
            <Link key={o.key} href={o.href} className="group relative overflow-hidden rounded-3xl">
              <Media item={o.item} slide={slidesFor(photos[o.item.id])[0]} variant={`occ-${o.key}`} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-4/5 transition-transform duration-900 ease-soft group-hover:scale-[1.04]" />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[rgb(30_18_15/0.62)] via-[rgb(30_18_15/0.18)] to-transparent p-4 pt-16 text-white sm:p-5 sm:pt-20">
                <p className="font-display text-[21px] leading-tight sm:text-[25px]">{o.title}</p>
                <p className="mt-0.5 flex items-center justify-between gap-2 text-[13px] opacity-90 sm:text-[14px]">
                  {o.line}
                  <ArrowRight className="size-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── most loved ── */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>Most loved</Eyebrow>
            <h2 className="font-display mt-3 text-[clamp(2rem,3.6vw,2.9rem)] leading-tight tracking-[-0.01em]">The ones people come back for</h2>
          </div>
          <Link href="/cakes" className={`${btn.link} shrink-0 max-sm:hidden`}>
            See all cakes <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {loved.map((item) => (
            <div key={item.id} className="w-[68%] shrink-0 snap-start sm:w-auto">
              <ProductCard item={item} photos={photos[item.id]} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 70vw" />
            </div>
          ))}
        </div>
        <Link href="/cakes" className={`${btn.ghost} mt-8 w-full sm:hidden`}>
          See all cakes
        </Link>
      </section>

      {/* ── how ordering works ── */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-4xl bg-blush px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <Wash id="how" seed={8} className="wash pointer-events-none absolute -top-28 -right-28 h-80 w-md" colors={["#F4D3D9"]} />
          <Eyebrow>Ordering is simple</Eyebrow>
          <h2 className="font-display relative mt-3 text-[clamp(2rem,3.6vw,2.9rem)] leading-tight tracking-[-0.01em]">Three steps, no phone calls</h2>
          <ol className="relative mt-11 grid gap-10 md:grid-cols-3 md:gap-8">
            {[
              ["Pick your cake", "Browse the menu and choose a size. Every price is right there, in rupees."],
              ["Make it yours", "Pick a flavour, add a message on top or some candles, then add it to your box."],
              ["Choose a time", `Pickup or delivery, any open day. We confirm on WhatsApp within ${site.confirmWithin}.`],
            ].map(([t, d], i) => (
              <li key={t} className="relative">
                <span className="font-display grid size-11 place-items-center rounded-full bg-paper text-[19px] italic shadow-soft">{i + 1}</span>
                <h3 className="font-display mt-5 text-[23px]">{t}</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <Link href="/cakes" className={`${btn.dark} relative mt-11`}>
            Start with a cake <ArrowRight className="size-4.5" />
          </Link>
        </div>
      </section>

      {/* ── baker's note ── */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-24 sm:px-6 md:grid-cols-2 lg:gap-20 lg:px-10">
        <div className="relative">
          <Media item={getItem("spring-sky")!} slide={slidesFor(photos["spring-sky"])[0]} variant="note" sizes="(min-width: 768px) 45vw, 100vw" className="aspect-4/5 max-h-160 w-full rounded-[28px]" />
        </div>
        <div>
          <Eyebrow>From the kitchen</Eyebrow>
          <blockquote className="font-display mt-5 text-[clamp(1.6rem,2.8vw,2.3rem)] leading-[1.3] italic">
            &ldquo;Every cake is baked for one order, on the day it leaves the kitchen. Real fresh cream, careful hands, and never a cake I
            wouldn&rsquo;t serve at home.&rdquo;
          </blockquote>
          <p className="mt-5 text-[15px] text-muted">The baker, {site.name}</p>
          <Link href="/about" className={`${btn.link} mt-8`}>
            Read our story <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── visit ── */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10">
        <div className="rule" />
        <div className="grid gap-8 pt-12 md:grid-cols-3">
          <div>
            <Eyebrow>Find us</Eyebrow>
            <p className="mt-3 text-[16px] leading-relaxed">{site.address}</p>
          </div>
          <div>
            <Eyebrow>Open</Eyebrow>
            {site.hoursLabel.map((h) => (
              <p key={h.days} className="mt-3 text-[16px]">
                <span className="text-muted">{h.days}</span> · {h.time}
              </p>
            ))}
          </div>
          <div>
            <Eyebrow>Questions?</Eyebrow>
            <a href={whatsappUrl("Hi! I have a question about a cake.")} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-[16px] font-semibold hover:text-accent">
              <WhatsAppIcon className="size-5 text-veg" /> Chat on WhatsApp
            </a>
            <ul className="mt-2 space-y-1 text-[15px]">
              {site.phones.map((ph) => (
                <li key={ph.tel}>
                  <a href={`tel:${ph.tel}`} className="tabular-nums hover:text-accent">
                    {ph.display}
                  </a>
                  <span className="ml-2 text-[13px] text-muted">{ph.label.toLowerCase()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
