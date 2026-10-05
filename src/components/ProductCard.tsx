import Link from "next/link";
import { optionsFor, ratePer, type MenuItem } from "@/data/menu";
import { FromPrice, OfferBadge } from "./UnitToggle";
import { Media, slidesFor } from "./Media";
import { DietMark } from "./ui";

export function ProductCard({
  item,
  photos,
  sizes,
  priority,
}: {
  item: MenuItem;
  photos?: string[];
  sizes?: string;
  priority?: boolean;
}) {
  const slides = slidesFor(photos, Boolean(item.art));
  const multi = optionsFor(item, "lb").length > 1;
  return (
    <Link href={`/cakes/${item.id}`} className="group block rounded-3xl focus-visible:outline-offset-4">
      <div className="relative aspect-4/5 overflow-hidden rounded-[22px]">
        <Media item={item} slide={slides[0]} sizes={sizes} priority={priority} className="absolute inset-0 transition-transform duration-900 ease-soft group-hover:scale-[1.03]" />
        {slides[1] && (
          <Media
            item={item}
            slide={slides[1]}
            sizes={sizes}
            className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-soft group-hover:opacity-100 max-md:hidden"
          />
        )}
        <OfferBadge itemId={item.id} className="absolute top-3 right-3" />
        {item.badges?.includes("bestseller") && (
          <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink backdrop-blur">
            Bestseller
          </span>
        )}
        {item.badges?.includes("seasonal") && (
          <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-ink backdrop-blur">
            In season
          </span>
        )}
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-3 px-0.5">
        <h3 className="font-display text-[18px] leading-snug sm:text-[21px]">{item.name}</h3>
        <p className="shrink-0 pt-1 text-[14px] text-muted tabular-nums sm:text-[15px]">
          <FromPrice itemId={item.id} multi={multi && !item.weight} perUnit={Boolean(item.weight)} prices={{ lb: ratePer(item, "lb"), kg: ratePer(item, "kg") }} />
        </p>
      </div>
      <p className="mt-1 flex items-center gap-1.5 px-0.5 text-[13px] text-muted sm:text-[14px]">
        <DietMark diet={item.diet} />
        <span className="truncate">{item.real}</span>
      </p>
    </Link>
  );
}
