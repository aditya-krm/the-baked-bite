import { site } from "@/config/site";
import { homeOgImage, ogSize, photoData } from "@/lib/og";
import { photoMap } from "@/lib/photos";

export const alt = `${site.name}: cakes baked to order in ${site.city}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const p = photoMap();
  const pick = ["rose-garden", "bows-and-pearls", "midnight-garden"].map((id) => p[id]?.[0]);
  return homeOgImage(await Promise.all(pick.map(photoData)));
}
