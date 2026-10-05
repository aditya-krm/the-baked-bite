import type { Metadata } from "next";
import { site } from "@/config/site";
import { CustomCakeView } from "@/views/CustomCakeView";

export const metadata: Metadata = {
  title: `Custom Cakes in ${site.city}: Theme, Photo & Designer Cakes`,
  description: `Design your own cake in ${site.city}: theme cakes, tiers, photo cakes and anything you can imagine. Share an idea and a reference photo, and get a quote on WhatsApp within a day.`,
  alternates: { canonical: "/custom-cake" },
  openGraph: { url: "/custom-cake" },
};

export default function CustomCakePage() {
  return <CustomCakeView />;
}
