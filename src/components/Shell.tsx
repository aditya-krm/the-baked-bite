import type { ReactNode } from "react";
import { activeOfferIds, bannerOffer } from "@/lib/offers";
import { OffersProvider } from "@/lib/offers-context";
import { photoMap } from "@/lib/photos";
import { BoxBar } from "./box/BoxBar";
import { BoxDrawer } from "./box/BoxDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { OfferBar } from "./OfferBar";

/** Site chrome shared by every page: offer strip, header, footer and the order box. */
export function Shell({
  children,
  photos = photoMap(),
  offerIds = activeOfferIds(),
}: {
  children: ReactNode;
  photos?: Record<string, string[]>;
  offerIds?: string[];
}) {
  const banner = bannerOffer(offerIds);
  return (
    <OffersProvider ids={offerIds}>
      {banner && <OfferBar title={banner.title} ends={banner.ends} />}
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <BoxBar />
      <BoxDrawer photos={photos} />
    </OffersProvider>
  );
}
