import Image from "next/image";
import type { ArtKind, MenuItem } from "@/data/menu";
import { CakeArt } from "./CakeArt";

export type Slide = { kind: "photo"; src: string } | { kind: "art" } | { kind: "art-close" };

/** Photos if the cake has any; otherwise the illustration plus a close-up of it. */
export function slidesFor(photos: string[] | undefined, hasArt = true): Slide[] {
  if (photos?.length) return photos.map((src) => ({ kind: "photo", src }));
  return hasArt ? [{ kind: "art" }, { kind: "art-close" }] : [{ kind: "art" }];
}

const CLOSE_UP: Record<ArtKind, string> = {
  drip: "38 52 124 96",
  frosted: "38 52 124 96",
  naked: "38 52 124 96",
  tier: "44 40 112 84",
  slice: "30 64 150 112",
  jar: "52 34 96 96",
  cupcake: "46 28 108 108",
  brownie: "40 66 132 99",
  loaf: "22 74 168 126",
  bento: "40 66 120 90",
};

export function Media({
  item,
  slide,
  sizes = "(min-width: 1024px) 33vw, 50vw",
  priority = false,
  className = "",
  artClassName = "",
  variant = "card",
}: {
  item: MenuItem;
  slide: Slide;
  sizes?: string;
  priority?: boolean;
  className?: string;
  artClassName?: string;
  variant?: string;
}) {
  const pos = /(^|\s)absolute(\s|$)/.test(className) ? "" : "relative";
  if (slide.kind === "photo") {
    return (
      <div className={`${pos} overflow-hidden bg-blush ${className}`}>
        <Image src={slide.src} alt={`${item.name}, ${item.real}`} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  const close = slide.kind === "art-close";
  if (!item.art) {
    return (
      <div className={`tile ${pos} grid place-items-center overflow-hidden ${className}`} style={{ ["--tint" as string]: item.tint }}>
        <span className="font-display px-4 text-center text-[clamp(1rem,3vw,1.6rem)] text-ink/60 italic">{item.name}</span>
      </div>
    );
  }
  return (
    <div className={`tile ${pos} grid place-items-center overflow-hidden ${className}`} style={{ ["--tint" as string]: item.tint }}>
      <CakeArt
        spec={item.art}
        id={item.id}
        variant={`${variant}-${slide.kind}`}
        title={`${item.name}, ${item.real}${close ? " (close-up)" : ""}`}
        crop={close ? CLOSE_UP[item.art.kind] : undefined}
        className={close ? `h-full w-full ${artClassName}` : `h-[86%] w-[86%] ${artClassName}`}
      />
    </div>
  );
}
