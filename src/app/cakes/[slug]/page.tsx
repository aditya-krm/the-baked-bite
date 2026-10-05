import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { formatINR, getCategory, getItem, menu, ratePer } from "@/data/menu";
import { photoMap } from "@/lib/photos";
import { breadcrumbJsonLd, cakeJsonLd, ld } from "@/lib/seo";
import { CakeView } from "@/views/CakeView";

export const dynamicParams = false;

export function generateStaticParams() {
  return menu.map((m) => ({ slug: m.id }));
}

export async function generateMetadata(props: PageProps<"/cakes/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const item = getItem(slug);
  if (!item) return {};
  const price = item.weight ? `${formatINR(ratePer(item, "lb"))}/lb` : formatINR(ratePer(item, "lb"));
  const title = `${item.name}: ${item.real} in ${site.city}`;
  const description = `${item.blurb} Eggless, from ${price}. Order online from ${site.name}, ${site.city} for pickup or delivery.`;
  return {
    title,
    description,
    alternates: { canonical: `/cakes/${item.id}` },
    openGraph: { title: `${item.name} · ${site.name}`, description, url: `/cakes/${item.id}`, type: "website" },
    twitter: { card: "summary_large_image", title: `${item.name} · ${site.name}`, description },
  };
}

export default async function CakePage(props: PageProps<"/cakes/[slug]">) {
  const { slug } = await props.params;
  const item = getItem(slug);
  if (!item) notFound();
  const photos = photoMap();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(cakeJsonLd(item, photos[item.id] ?? []))} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ld(
          breadcrumbJsonLd([
            { name: "Cakes", path: "/cakes" },
            { name: getCategory(item.category).title, path: "/cakes" },
            { name: item.name, path: `/cakes/${item.id}` },
          ]),
        )}
      />
      <CakeView item={item} photos={photos} />
    </>
  );
}
