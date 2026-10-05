/**
 * Everything shop-specific lives here. Change it once and the whole site follows.
 */
export const site = {
  name: "The Baked Bite",
  /** the live address, used for share previews and the sitemap. Set NEXT_PUBLIC_SITE_URL when you deploy. */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
  tagline: "Cakes baked to order in Malda, by one very particular baker.",
  city: "Malda",
  address: "Near Gour Banga Public Mission, Uttar Ramchandrapur Road, Malda, West Bengal 732101",
  mapsUrl: "https://maps.app.goo.gl/KCQqh37WKL8Ne8W9A",
  /** Contact numbers, primary first. `whatsapp`: international format, digits only. */
  phones: [
    { label: "Primary", display: "+91 70294 37116", tel: "+917029437116", whatsapp: "917029437116" },
    { label: "Alternate", display: "+91 79086 62705", tel: "+917908662705", whatsapp: "917908662705" },
  ],
  telegram: "@thebakedbitebot",
  instagram: "thebakedbite_ig",

  /** Opening hours (24h clock, local time) */
  openFrom: 10,
  openTill: 21.5,
  /** 0 = Sunday … 6 = Saturday */
  closedWeekdays: [] as number[], // e.g. [1] to close on Mondays
  hoursLabel: [{ days: "Every day", time: "10 am – 9:30 pm" }],

  /** Pickup / delivery time slots offered at checkout */
  slots: [
    { id: "late-morning", label: "11 am – 1 pm", start: 11 },
    { id: "afternoon", label: "1 – 4 pm", start: 13 },
    { id: "evening", label: "4 – 7 pm", start: 16 },
    { id: "night", label: "7 – 9 pm", start: 19 },
  ],
  /** how many days ahead people can book */
  bookingWindowDays: 21,
  /** shop time zone: IST = UTC+5:30 (all dates and slots are worked out in this) */
  utcOffsetMinutes: 330,
  /** cakes ordered for the next day can be ready from this hour (1 pm) */
  readyFromHour: 13,
  /** same-day items (donuts) need this many hours, counted from opening time at night */
  sameDayHours: 4,

  deliveryRadiusKm: 8,
  deliveryFeeNote: "₹0 | For giving you the sweet taste of our cakes, we're giving you free delivery",
  confirmWithin: "30 minutes",
  /** shown under the "Place order" button */
  paymentNote: "No payment now. We confirm first, then you pay by UPI or at pickup.",
} as const;

/** The number WhatsApp buttons open (the primary one). */
export const primaryPhone = site.phones[0];
export const whatsappUrl = (text?: string, number: string = primaryPhone.whatsapp) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telegramUrl = `https://t.me/${site.telegram}`;
export const instagramUrl = `https://instagram.com/${site.instagram}`;
