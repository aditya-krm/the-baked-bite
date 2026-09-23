/**
 * Everything shop-specific lives here — change it once, the whole site follows.
 */
export const site = {
  name: "The Baked Bite",
  tagline: "Small-batch cakes, baked with a whole lot of heart.",
  city: "Pune",
  address: "Shop 4, Lane 7, Koregaon Park, Pune 411001",
  hours: [
    { days: "Tue – Sun", time: "10:00 am – 9:30 pm" },
    { days: "Monday", time: "Oven's resting (closed)" },
  ],
  phone: "+91 98765 43210",
  telegram: "thebakedbite", // t.me/<username>
  instagram: "thebakedbite",
  leadTime: "24 hours",
  deliveryRadiusKm: 8,
} as const;

export const telegramUrl = `https://t.me/${site.telegram}`;
export const instagramUrl = `https://instagram.com/${site.instagram}`;
