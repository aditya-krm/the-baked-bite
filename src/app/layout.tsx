import type { Metadata, Viewport } from "next";
import "@fontsource-variable/playfair-display/wght.css";
import "@fontsource-variable/playfair-display/wght-italic.css";
import "@fontsource-variable/figtree/wght.css";
import "./globals.css";
import { site } from "@/config/site";
import { Shell } from "@/components/Shell";
import { themeScript } from "@/components/ThemeToggle";
import { bakeryJsonLd, ld, localKeywords } from "@/lib/seo";

/** Re-render pages at most once an hour, so offers switch on and off by date without a redeploy. */
export const revalidate = 3600;

const description = `Eggless birthday, anniversary, theme and custom cakes in ${site.city}, West Bengal. Floral, drip, message and bento cakes baked to order. Order online for pickup or delivery.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Cake Shop in ${site.city} | Eggless Birthday & Custom Cakes`, template: `%s · ${site.name}` },
  description,
  keywords: localKeywords,
  applicationName: site.name,
  category: "food",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_IN",
    title: `${site.name} · Cakes baked to order in ${site.city}`,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f3",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={ld(bakeryJsonLd())} />
      </head>
      <body className="min-h-dvh antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
