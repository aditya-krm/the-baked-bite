import { formatINR, getItem, menu, optionsFor, ratePer } from "@/data/menu";
import { activeOfferIds, discounted, offerFor } from "@/lib/offers";
import { cakeOgImage, ogSize, photoData } from "@/lib/og";
import { photosFor } from "@/lib/photos";

export const alt = "A cake from The Baked Bite";
export const size = ogSize;
export const contentType = "image/png";
export const revalidate = 3600; // picks up offers as they start and end

export function generateStaticParams() {
  return menu.map((m) => ({ slug: m.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = getItem((await params).slug)!;
  const offer = offerFor(item, activeOfferIds());
  const price = item.weight
    ? `${formatINR(discounted(ratePer(item, "lb"), offer))} per lb`
    : `from ${formatINR(discounted(Math.min(...optionsFor(item, "lb").map((o) => o.price)), offer))}`;
  return cakeOgImage({
    photo: await photoData(photosFor(item)[0]),
    name: item.name,
    real: item.real,
    price,
    badge: offer ? `${offer.short} · ${offer.percent}% off` : undefined,
  });
}
