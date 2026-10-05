import fs from "node:fs";
import path from "node:path";
import { menu, type MenuItem } from "@/data/menu";

const DIR = path.join(process.cwd(), "public", "cakes");
const IMG = /\.(jpe?g|png|webp|avif)$/i;

/**
 * Photos for a cake: everything inside /public/cakes/<cake-id>/, in name order
 * (1.jpg, 2.jpg, … or a.jpg, b.jpg …). The first one is the cover.
 */
export function photosFor(item: MenuItem): string[] {
  if (item.photos?.length) return item.photos;
  try {
    return fs
      .readdirSync(path.join(DIR, item.id))
      .filter((f) => IMG.test(f) && !f.startsWith("."))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/cakes/${item.id}/${f}`);
  } catch {
    return [];
  }
}

export type PhotoMap = Record<string, string[]>;
export function photoMap(): PhotoMap {
  return Object.fromEntries(menu.map((m) => [m.id, photosFor(m)]));
}
