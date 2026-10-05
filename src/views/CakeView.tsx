import Link from "next/link";
import { site } from "@/config/site";
import { getCategory, menu, type MenuItem } from "@/data/menu";
import { Gallery } from "@/components/Gallery";
import { slidesFor } from "@/components/Media";
import { ProductCard } from "@/components/ProductCard";
import { PurchasePanel } from "@/components/PurchasePanel";
import { ShareButton } from "@/components/ShareButton";
import { DietMark } from "@/components/ui";

type Photos = Record<string, string[]>;

export function CakeView({ item, photos }: { item: MenuItem; photos: Photos }) {
  const cat = getCategory(item.category);
  const related = menu.filter((m) => m.category === item.category && m.id !== item.id).slice(0, 3);
  const more = related.length < 3 ? menu.filter((m) => m.badges?.includes("bestseller") && m.id !== item.id && !related.includes(m)).slice(0, 3 - related.length) : [];

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="text-[13.5px] text-muted">
          <Link href="/cakes" className="hover:text-ink">Cakes</Link>
          <span className="mx-2">/</span>
          <span>{cat.title}</span>
        </nav>

        <div className="mt-5 grid gap-10 md:grid-cols-2 lg:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <Gallery item={item} slides={slidesFor(photos[item.id], Boolean(item.art))} />
          </div>

          <div className="md:pt-2">
            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-[13px] font-medium text-muted">
                <DietMark diet={item.diet} />
                {item.real}
              </p>
              <ShareButton
                title={`${item.name} · ${site.name}`}
                text={`Look at this ${item.real.toLowerCase()} from ${site.name}, ${site.city} 🎂`}
                path={`/cakes/${item.id}`}
              />
            </div>
            <h1 className="font-display mt-3 text-[clamp(2.3rem,4.4vw,3.5rem)] leading-[1.05] tracking-[-0.015em]">{item.name}</h1>
            <p className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-muted">{item.blurb}</p>
            <div className="mt-6">
              <PurchasePanel item={item} />
            </div>

            <div className="mt-10 divide-y divide-line border-y border-line">
              <details className="group py-1" open>
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px] font-semibold">
                  The details
                  <span className="text-xl leading-none text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <ul className="flex flex-wrap gap-2 pb-5">
                  {item.details.map((l) => (
                    <li key={l} className="rounded-full bg-blush px-3.5 py-1.5 text-[14px]">{l}</li>
                  ))}
                </ul>
              </details>
              <details className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px] font-semibold">
                  Pickup, delivery &amp; storage
                  <span className="text-xl leading-none text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <ul className="space-y-2 pb-5 text-[14.5px] leading-relaxed text-muted">
                  <li>Pickup is free from our kitchen in {site.city}. Delivery within {site.deliveryRadiusKm} km, {site.deliveryFeeNote}.</li>
                  <li>Cream cakes and cheesecakes keep 2 days in the fridge. Take them out 20 minutes before cutting.</li>
                  <li>Travelling with it? Keep the box flat, in the boot or on a lap, never on a seat.</li>
                </ul>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-10">
        <h2 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] tracking-[-0.01em]">You might also like</h2>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {[...related, ...more].map((m, i) => (
            <li key={m.id} className={i === 2 ? "max-lg:hidden" : ""}>
              <ProductCard item={m} photos={photos[m.id]} sizes="(min-width: 1024px) 30vw, 50vw" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
