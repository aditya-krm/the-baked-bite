import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/config/site";
import { photoMap } from "@/lib/photos";
import { CakesView } from "@/views/CakesView";

export const metadata: Metadata = {
  title: `Cakes in ${site.city}: Birthday, Anniversary & Eggless Cakes Menu`,
  description: `See every cake we bake in ${site.city}: floral, drip, message, kids' theme, bento cakes and donuts. Prices in ₹ per pound or kilo, all eggless. Order online.`,
  alternates: { canonical: "/cakes" },
  openGraph: { url: "/cakes" },
};

export default function CakesPage() {
  return (
    <Suspense>
      <CakesView photos={photoMap()} />
    </Suspense>
  );
}
