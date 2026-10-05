import type { Metadata } from "next";
import { site } from "@/config/site";
import { photoMap } from "@/lib/photos";
import { AboutView } from "@/views/AboutView";

export const metadata: Metadata = {
  title: `Our Story: Home Bakery in ${site.city}`,
  description: `Meet ${site.name}, a small home bakery in ${site.city} baking eggless cakes to order, one at a time. Visit us near Gour Banga Public Mission.`,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return <AboutView photos={photoMap()} />;
}
