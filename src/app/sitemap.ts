import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { menu } from "@/data/menu";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/cakes", "/custom-cake", "/about"].map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly" as const }));
  return [...pages, ...menu.map((m) => ({ url: `${site.url}/cakes/${m.id}`, changeFrequency: "monthly" as const }))];
}
