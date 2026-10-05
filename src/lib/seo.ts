import { site, instagramUrl } from "@/config/site";
import { fromPrice, getCategory, optionsFor, type MenuItem } from "@/data/menu";

/** Words people in Malda actually search for; used in descriptions (not stuffed anywhere). */
export const localKeywords = [
  `cake shop in ${site.city}`,
  `birthday cake ${site.city}`,
  `eggless cake ${site.city}`,
  `custom cake ${site.city}`,
  `anniversary cake ${site.city}`,
  `bento cake ${site.city}`,
  `home bakery ${site.city}`,
  "cake delivery English Bazar",
  "West Bengal cakes",
];

const abs = (p: string) => (p.startsWith("http") ? p : `${site.url}${p}`);

/** schema.org Bakery: tells Google the name, address, phones, hours and area served. */
export function bakeryJsonLd() {
  const open = site.hoursLabel.length ? [`${site.openFrom}:00`, `${Math.floor(site.openTill)}:${site.openTill % 1 ? "30" : "00"}`] : null;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].filter(
    (_, i) => !(site.closedWeekdays as readonly number[]).includes((i + 1) % 7),
  );
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": `${site.url}/#bakery`,
    name: site.name,
    description: `${site.tagline} Eggless floral, drip, message, theme and bento cakes.`,
    url: site.url,
    image: abs("/opengraph-image"),
    logo: abs("/brand/logo.png"),
    telephone: site.phones.map((p) => p.tel),
    priceRange: "₹₹",
    servesCuisine: ["Cakes", "Bakery", "Desserts"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Near Gour Banga Public Mission, Uttar Ramchandrapur Road",
      addressLocality: site.city,
      addressRegion: "West Bengal",
      postalCode: "732101",
      addressCountry: "IN",
    },
    hasMap: site.mapsUrl,
    areaServed: [{ "@type": "City", name: site.city }, { "@type": "City", name: "English Bazar" }],
    openingHoursSpecification: open ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: days, opens: open[0], closes: open[1] }] : undefined,
    sameAs: [instagramUrl],
    acceptsReservations: false,
    hasMenu: abs("/cakes"),
  };
}

/** schema.org Product for a cake page, with its price range in ₹. */
export function cakeJsonLd(item: MenuItem, photos: string[]) {
  const prices = [...optionsFor(item, "lb"), ...optionsFor(item, "kg")].map((o) => o.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.name} (${item.real})`,
    description: item.blurb,
    image: photos.length ? photos.map(abs) : [abs(`/cakes/${item.id}/opengraph-image`)],
    category: getCategory(item.category).title,
    brand: { "@type": "Brand", name: site.name },
    url: abs(`/cakes/${item.id}`),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(fromPrice(item, "lb"), ...prices),
      highPrice: Math.max(...prices),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${site.url}/#bakery` },
      areaServed: site.city,
    },
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: abs(t.path) })),
  };
}

/** Safe <script type="application/ld+json"> payload. */
export const ld = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
