import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/nunito";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import "./globals.css";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `${site.name} · Cake Menu`,
  description: `${site.tagline} Celebration cakes, bento cakes, cheesecakes, jar cakes, cupcakes and brownies in ${site.city}, with prices in ₹.`,
  openGraph: {
    title: `${site.name} · Cake Menu`,
    description: site.tagline,
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#1b100e" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
