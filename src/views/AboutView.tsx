import Link from "next/link";
import { site, whatsappUrl } from "@/config/site";
import { getItem } from "@/data/menu";
import { Media, slidesFor } from "@/components/Media";
import { ArrowRight, ClockIcon, Eyebrow, LeafIcon, SparkIcon, Wash, WhatsAppIcon, btn } from "@/components/ui";

type Photos = Record<string, string[]>;

/** ✏️ The story below is placeholder copy, written to be replaced with the baker's own words. */
export function AboutView({ photos }: { photos: Photos }) {
  const a = getItem("morning-bloom")!;
  const b = getItem("golden-note")!;
  return (
    <>
      <section className="relative mx-auto max-w-4xl px-4 pt-16 text-center sm:px-6 md:pt-24">
        <Wash id="about" seed={11} className="wash pointer-events-none absolute top-0 left-1/2 h-72 w-136 -translate-x-1/2 opacity-70" colors={["#F3CDD3", "#F8E2CD"]} />
        <Eyebrow className="relative">Our story</Eyebrow>
        <h1 className="font-display relative mt-5 text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.04] tracking-[-0.02em]">
          A small kitchen with <em className="text-accent">very</em> big standards.
        </h1>
      </section>

      <section className="mx-auto mt-14 grid max-w-6xl gap-4 px-4 sm:grid-cols-[1.3fr_1fr] sm:px-6">
        <Media item={a} slide={slidesFor(photos[a.id])[0]} variant="about-a" sizes="(min-width: 640px) 55vw, 100vw" className="aspect-4/5 rounded-[28px] sm:aspect-4/3" />
        <Media item={b} slide={slidesFor(photos[b.id])[0]} variant="about-b" sizes="(min-width: 640px) 40vw, 100vw" className="aspect-4/5 rounded-[28px] sm:aspect-auto" />
      </section>

      <section className="mx-auto max-w-2xl px-4 pt-16 text-[17.5px] leading-[1.8] text-muted sm:px-6">
        <p className="font-display text-[clamp(1.5rem,2.6vw,1.9rem)] leading-snug text-ink italic">
          {site.name} started the way most good things do: with a birthday, a oven and a cake that disappeared in ten minutes.
        </p>
        <p className="mt-7">
          Friends asked for one. Then friends of friends. Today we bake every order by hand in a small kitchen in {site.city}, one cake at a time,
          with real butter, fresh cream and fruit from the market that morning.
        </p>
        <p className="mt-5">
          We keep the menu short on purpose. Each recipe has been baked dozens of times until it was exactly right, and most of them are
          eggless by default because we want everyone at the table to have a slice.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <ul className="grid gap-4 md:grid-cols-3">
          {[
            [LeafIcon, "Eggless, without the compromise", "Most of our menu is eggless as standard. The rest can be, for a small extra."],
            [ClockIcon, "Baked for your order", "Nothing sits in a display case. Your cake is baked for you, the day it leaves."],
            [SparkIcon, "Made fresh, finished by hand", "Fresh cream, hand-piped flowers and messages, and a cake that tastes as good as it looks."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof LeafIcon;
            return (
              <li key={t as string} className="rounded-3xl bg-blush/70 p-7">
                <I className="size-6" />
                <h2 className="font-display mt-5 text-[22px] leading-snug">{t as string}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{d as string}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-20 text-center sm:px-6">
        <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight">Come hungry.</h2>
        <p className="mt-3 text-[16px] text-muted">{site.address}</p>
        <p className="mt-1 text-[16px] text-muted">{site.hoursLabel.map((h) => `${h.days}: ${h.time}`).join(" · ")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/cakes" className={btn.primary}>
            See the cakes <ArrowRight className="size-4.5" />
          </Link>
          <a href={whatsappUrl("Hi!")} target="_blank" rel="noreferrer" className={btn.ghost}>
            <WhatsAppIcon className="size-5 text-veg" /> Say hello
          </a>
        </div>
      </section>
    </>
  );
}
