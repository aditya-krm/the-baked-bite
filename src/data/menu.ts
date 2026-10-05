export type Topping =
  | "cherry"
  | "strawberry"
  | "blueberry"
  | "rosette"
  | "candle"
  | "sprinkles"
  | "shards"
  | "pistachio"
  | "macaron"
  | "mango"
  | "rose"
  | "cookie"
  | "gold"
  | "saffron"
  | "pineapple"
  | "walnut"
  | "lemon"
  | "heart"
  | "caramel"
  | "choco-ball";

export type ArtKind =
  | "drip"
  | "frosted"
  | "naked"
  | "tier"
  | "slice"
  | "jar"
  | "cupcake"
  | "brownie"
  | "loaf"
  | "bento";

export type ArtSpec = {
  kind: ArtKind;
  /** sponge / crumb colour */
  sponge: string;
  /** cream, frosting or cheese colour */
  cream: string;
  /** drip, top glaze or sauce colour */
  glaze?: string;
  /** decorative accent (piping, liner, box) */
  accent?: string;
  toppings?: Topping[];
  /** bento cakes carry a tiny piped message */
  message?: string;
  /** loaves: a swirl through the crumb */
  swirl?: string;
};

export type Diet = "eggless" | "egg";
export type Badge = "bestseller" | "new" | "seasonal" | "chef";
export type Occasion = "birthday" | "anniversary" | "just-because";
export type Unit = "lb" | "kg";

export type SizeOption = {
  label: string;
  price: number;
  serves?: string;
  /** weight in kg, used to price flavour and eggless upgrades */
  kg?: number;
};

/**
 * Cakes sold by weight: give a price per pound and the site works out every size,
 * in pounds or kilos, depending on the toggle.
 */
export type WeightPricing = {
  perLb: number;
  /** sizes offered in pounds (default 1, 2, 3 lb) */
  lb?: number[];
  /** sizes offered in kilos (default ½, 1, 1½ kg) */
  kg?: number[];
};

export type CategoryId = "floral" | "drip" | "message" | "theme" | "signature" | "bento" | "bakes";

export type Kind = "Cake" | "Bento cake" | "Donut box";

export type Category = {
  id: CategoryId;
  /** what kind of product this is, for the "what's on the menu" counts */
  kind: Kind;
  title: string;
  /** short label for the filter tabs */
  short: string;
  cute: string;
  note: string;
  /**
   * Notice needed: 0 = same day (a few hours, see site.sameDayHours),
   * 1 = order by the night before, 2 = two days ahead…
   */
  leadDays: number;
  /** can we pipe a message on it? */
  allowMessage: boolean;
  occasions: Occasion[];
};

export type MenuItem = {
  /** the URL (/cakes/<id>) and the photo folder (public/cakes/<id>/) */
  id: string;
  name: string;
  real: string;
  category: CategoryId;
  blurb: string;
  /** "The details" chips on the cake page */
  details: string[];
  diet: Diet;
  badges?: Badge[];
  /** priced by weight (lb / kg toggle)… */
  weight?: WeightPricing;
  /** …or fixed options (bento, donuts) */
  options?: SizeOption[];
  /** flavour picker: true = the full list, false = none */
  flavours?: boolean;
  defaultFlavour?: string;
  /** background shown while a photo loads, and behind illustrations */
  tint: string;
  /** illustration used only if the cake has no photos yet */
  art?: ArtSpec;
  occasions?: Occasion[];
  /** Optional. Photos are picked up automatically from /public/cakes/<id>/ */
  photos?: string[];
};

/* ───────────────────────── categories ───────────────────────── */

export const categories: Category[] = [
  {
    id: "floral",
    kind: "Cake",
    title: "Floral Cakes",
    short: "Floral",
    cute: "Piped by hand",
    note: "Buttercream roses and rosettes, finished by hand.",
    leadDays: 1,
    allowMessage: true,
    occasions: ["birthday", "anniversary", "just-because"],
  },
  {
    id: "drip",
    kind: "Cake",
    title: "Drip Cakes",
    short: "Drip",
    cute: "Glossy & dramatic",
    note: "Chocolate ganache drip with piped toppings.",
    leadDays: 1,
    allowMessage: true,
    occasions: ["birthday", "just-because"],
  },
  {
    id: "message",
    kind: "Cake",
    title: "Message Cakes",
    short: "Message",
    cute: "Say it in frosting",
    note: "Your words piped on top. Names, numbers and inside jokes welcome.",
    leadDays: 1,
    allowMessage: true,
    occasions: ["birthday", "anniversary", "just-because"],
  },
  {
    id: "theme",
    kind: "Cake",
    title: "Kids & Theme Cakes",
    short: "Kids & theme",
    cute: "For the little ones",
    note: "Doll and character cakes. They start at 2 lb. Please order 2 days ahead.",
    leadDays: 2,
    allowMessage: true,
    occasions: ["birthday"],
  },
  {
    id: "signature",
    kind: "Cake",
    title: "Signature Cakes",
    short: "Signature",
    cute: "Show-stoppers",
    note: "Heart-shaped and mirror-glazed specials.",
    leadDays: 2,
    allowMessage: true,
    occasions: ["anniversary", "birthday"],
  },
  {
    id: "bento",
    kind: "Bento cake",
    title: "Bento Cakes",
    short: "Bento",
    cute: "Tiny cakes, loud feelings",
    note: "A 4-inch cake in a lunchbox, with your message on top.",
    leadDays: 1,
    allowMessage: true,
    occasions: ["birthday", "anniversary", "just-because"],
  },
  {
    id: "bakes",
    kind: "Donut box",
    title: "Donuts & Bakes",
    short: "Donuts",
    cute: "Little treats",
    note: "Baked fresh, best eaten the same day.",
    leadDays: 0,
    allowMessage: false,
    occasions: ["just-because"],
  },
];

/* ───────────────────────── flavours ───────────────────────── */

/** Sponge + cream combinations for cakes sold by weight. `extraPerLb` is added per pound. */
export const flavours = [
  { id: "vanilla", name: "Vanilla", extraPerLb: 0 },
  { id: "pineapple", name: "Pineapple", extraPerLb: 0 },
  { id: "strawberry", name: "Strawberry", extraPerLb: 0 },
  { id: "butterscotch", name: "Butterscotch", extraPerLb: 0 },
  { id: "chocolate", name: "Chocolate", extraPerLb: 0 },
  { id: "black-forest", name: "Black Forest", extraPerLb: 0 },
  { id: "chocolate-truffle", name: "Chocolate Truffle", extraPerLb: 50 },
  { id: "red-velvet", name: "Red Velvet", extraPerLb: 50 },
  { id: "rasmalai", name: "Rasmalai", extraPerLb: 80 },
] as const;
export type FlavourId = (typeof flavours)[number]["id"];


/* ───────────────────────── the menu ───────────────────────── */

export const menu: MenuItem[] = [
  // ─── Floral ──────────────────────────────────────────────────
  {
    id: "rose-garden",
    name: "Rose Garden",
    real: "All-over Rosette Cake",
    category: "floral",
    blurb: "Covered edge to edge in hand-piped roses in pink, lilac and cream, with gold pearls tucked between the petals.",
    details: ["Hand-piped roses all over", "Pink, lilac & cream", "Gold pearls", "Message on the board"],
    diet: "eggless",
    badges: ["bestseller"],
    weight: { perLb: 399 },
    flavours: true,
    tint: "#F6D3DC",
  },
  {
    id: "morning-bloom",
    name: "Morning Bloom",
    real: "Watercolour Rose Cake",
    category: "floral",
    blurb: "A soft buttery-yellow watercolour top, two big piped roses in pink and white, and a few flakes of gold leaf.",
    details: ["Watercolour cream finish", "Two piped roses", "Gold leaf", "Combed sides"],
    diet: "eggless",
    weight: { perLb: 349 },
    flavours: true,
    tint: "#F7EBC4",
  },
  {
    id: "blush-crescent",
    name: "Blush Crescent",
    real: "Pink Rosette Crescent Cake",
    category: "floral",
    blurb: "Clean white cream with a crescent of pink rosettes and gold pearls curving around the top. Simple and very pretty.",
    details: ["Crescent of pink rosettes", "Gold & white pearls", "Blush brushed top"],
    diet: "eggless",
    weight: { perLb: 349 },
    flavours: true,
    tint: "#F8DCE0",
  },
  {
    id: "sunlit-swirl",
    name: "Sunlit Swirl",
    real: "Pastel Swirl Cake",
    category: "floral",
    blurb: "A pale yellow watercolour cake topped with blue-and-white swirls, gold balls and little cream kisses.",
    details: ["Two-tone swirl piping", "Gold balls", "Watercolour finish", "Beaded border"],
    diet: "eggless",
    weight: { perLb: 349 },
    flavours: true,
    tint: "#F3EBC8",
  },
  {
    id: "spring-sky",
    name: "Spring Sky",
    real: "Pastel Floral Crescent Cake",
    category: "floral",
    blurb: "A sky-blue top with a spring bouquet of yellow and peach rosettes piped along one side.",
    details: ["Sky-blue watercolour top", "Yellow & peach rosettes", "Gold sprinkles"],
    diet: "eggless",
    weight: { perLb: 349 },
    flavours: true,
    tint: "#DCEAF2",
  },

  // ─── Drip ────────────────────────────────────────────────────
  {
    id: "midnight-garden",
    name: "Midnight Garden",
    real: "Chocolate Drip Pastel Cake",
    category: "drip",
    blurb: "Dark chocolate ganache dripping over pastel pink-and-blue stripes, crowned with white roses and bright little blooms.",
    details: ["Chocolate ganache drip", "Pastel striped sides", "White roses & yellow blooms", "Gold pearls"],
    diet: "eggless",
    badges: ["bestseller"],
    weight: { perLb: 499 },
    flavours: true,
    defaultFlavour: "chocolate",
    tint: "#E3DCEB",
  },
  {
    id: "lavender-lava",
    name: "Lavender Lava",
    real: "Chocolate Drip Lilac Rosette Cake",
    category: "drip",
    blurb: "A ring of lilac rosettes around a glossy chocolate top, with ganache drips down combed cream sides.",
    details: ["Lilac rosette crown", "Chocolate ganache top & drip", "Pearl sprinkles"],
    diet: "eggless",
    weight: { perLb: 499 },
    flavours: true,
    defaultFlavour: "chocolate",
    tint: "#E8DDEE",
  },
  {
    id: "rosy-ganache",
    name: "Rosy Ganache",
    real: "Chocolate Drip Pink Rose Cake",
    category: "drip",
    blurb: "Pink two-tone roses and tiny flowers on a chocolate ganache top, with a pink-tipped piped border.",
    details: ["Two-tone pink roses", "Chocolate ganache drip", "Gold pearls"],
    diet: "eggless",
    weight: { perLb: 499 },
    flavours: true,
    defaultFlavour: "chocolate",
    tint: "#F3D6DE",
  },

  // ─── Message ─────────────────────────────────────────────────
  {
    id: "bows-and-pearls",
    name: "Bows & Pearls",
    real: "Vintage Ribbon Number Cake",
    category: "message",
    blurb: "Vintage-style piping in soft pink, satin bows all around and gold pearls, with a big number (or name) on top.",
    details: ["Vintage piped borders", "Red satin bows", "Gold & white pearls", "Number or name on top"],
    diet: "eggless",
    badges: ["bestseller"],
    weight: { perLb: 349 },
    flavours: true,
    tint: "#F6D9E0",
  },
  {
    id: "love-note",
    name: "Love Note",
    real: "Pink Doodle Message Cake",
    category: "message",
    blurb: "Blush pink with a cute little doodle, piped flowers and your message across the top. Made for your person.",
    details: ["Hand-drawn doodle", "Piped flowers", "Your message on top"],
    diet: "eggless",
    occasions: ["anniversary"],
    weight: { perLb: 349 },
    flavours: true,
    tint: "#F8DDE2",
  },
  {
    id: "golden-note",
    name: "Golden Note",
    real: "Minimal Gold-Rim Message Cake",
    category: "message",
    blurb: "Crisp white cream, a hand-painted gold rim and scattered pearls, with your message written in red. Perfect for thank-yous and farewells.",
    details: ["Gold painted rim", "Pearl scatter", "Your message on top"],
    diet: "eggless",
    weight: { perLb: 349 },
    flavours: true,
    tint: "#F3ECE0",
  },
  {
    id: "halfway-hello",
    name: "Halfway Hello",
    real: "Half & Half Birthday Cake",
    category: "message",
    blurb: "Half lemon-yellow, half lilac: “Bye 18” on one side and “Hello 19” on the other. Pick your two colours and two lines.",
    details: ["Two colours, two halves", "Shell-piped borders", "A line on each side"],
    diet: "eggless",
    badges: ["new"],
    weight: { perLb: 349 },
    flavours: true,
    tint: "#ECE3F3",
  },
  {
    id: "sweet-promise",
    name: "Sweet Promise",
    real: "Anniversary Sheet Cake",
    category: "message",
    blurb: "A rectangular cake with a soft pink marbled finish, a cluster of yellow roses and “Happy Anniversary” piped in red.",
    details: ["Rectangular sheet cake", "Yellow piped roses", "Pink marble finish", "Message on top"],
    diet: "eggless",
    occasions: ["anniversary"],
    weight: { perLb: 349, lb: [2, 3, 4], kg: [1, 1.5, 2] },
    flavours: true,
    tint: "#F7E2E2",
  },

  // ─── Kids & theme ────────────────────────────────────────────
  {
    id: "princess-twirl",
    name: "Princess Twirl",
    real: "Doll Gown Cake",
    category: "theme",
    blurb: "The doll's whole gown is cake, covered in piped pink rosettes. Every little girl's favourite birthday moment.",
    details: ["Doll topper included", "Gown of piped rosettes", "Choose the gown colour"],
    diet: "eggless",
    badges: ["bestseller"],
    weight: { perLb: 349, lb: [2, 3, 4], kg: [1, 1.5, 2] },
    flavours: true,
    tint: "#F8D9E1",
  },
  {
    id: "little-princess",
    name: "Little Princess",
    real: "Doll Topper Ombré Cake",
    category: "theme",
    blurb: "A pink ombré cake with a little doll sitting among fresh-looking flowers on top.",
    details: ["Doll topper included", "Pink ombré sides", "Flower arrangement"],
    diet: "eggless",
    weight: { perLb: 399, lb: [2, 3, 4], kg: [1, 1.5, 2] },
    flavours: true,
    tint: "#F5DCE6",
  },
  {
    id: "little-kanha",
    name: "Little Kanha",
    real: "Krishna Theme Cake",
    category: "theme",
    blurb: "Baby Krishna toppers, a tipping matki of makhan and a peacock feather on a sky-blue cake. Made for Janmashtami and naming days.",
    details: ["Krishna toppers", "Matki with makhan", "Peacock feather", "Name on the board"],
    diet: "eggless",
    badges: ["seasonal"],
    weight: { perLb: 399, lb: [2, 3, 4], kg: [1, 1.5, 2] },
    flavours: true,
    tint: "#D9E8F2",
  },

  // ─── Signature ───────────────────────────────────────────────
  {
    id: "heartstrings",
    name: "Heartstrings",
    real: "Heart-shaped Floral Cake",
    category: "signature",
    blurb: "A heart-shaped cake in soft cream with pink and red flowers, gold pearls and a red ribbon bow. For anniversaries and big “I love you”s.",
    details: ["Heart-shaped", "Pink & red flowers", "Ribbon bow", "Gold pearls"],
    diet: "eggless",
    occasions: ["anniversary"],
    weight: { perLb: 399, lb: [2, 3, 4], kg: [1, 1.5, 2] },
    flavours: true,
    tint: "#F6E6D3",
  },
  {
    id: "sunset-mirror",
    name: "Sunset Mirror",
    real: "Mirror Glaze Cake",
    category: "signature",
    blurb: "A glass-smooth mirror glaze marbled in raspberry pink, mango yellow and white. It shines like a sunset.",
    details: ["Mirror glaze", "Marbled pink & yellow", "Smooth mousse finish"],
    diet: "eggless",
    badges: ["new"],
    weight: { perLb: 549 },
    flavours: true,
    tint: "#F8D6DD",
  },

  // ─── Bento ───────────────────────────────────────────────────
  {
    id: "pastel-dream-bento",
    name: "Pastel Dream",
    real: "Marble Bento Cake",
    category: "bento",
    blurb: "A lilac-and-blue marbled bento in a lunchbox, with your message piped in purple and a scatter of pearls.",
    details: ["4-inch cake", "Lilac & blue marble", "Lunchbox + wooden spoon"],
    diet: "eggless",
    badges: ["new"],
    options: [{ label: "Bento · 4″", price: 199, serves: "1–2", kg: 0.25 }],
    flavours: true,
    tint: "#E6E0F3",
  },
  {
    id: "cloud-nine-bento",
    name: "Cloud Nine",
    real: "Doodle Bento Cake",
    category: "bento",
    blurb: "White cream, a happy little party-hat cloud doodle and your message in blue. Small cake, big smile.",
    details: ["4-inch cake", "Hand-drawn doodle", "Lunchbox + wooden spoon"],
    diet: "eggless",
    options: [{ label: "Bento · 4″", price: 199, serves: "1–2", kg: 0.25 }],
    flavours: true,
    tint: "#DCEAF5",
  },

  // ─── Bakes ───────────────────────────────────────────────────
  {
    id: "sprinkle-party-donuts",
    name: "Sprinkle Party",
    real: "Glazed Donuts",
    category: "bakes",
    blurb: "Soft baked donuts dipped in white chocolate, drizzled in pink and showered with rainbow sprinkles.",
    details: ["White chocolate glaze", "Pink drizzle", "Rainbow sprinkles"],
    diet: "eggless",
    options: [
      { label: "Box of 3", price: 99 },
      { label: "Box of 6", price: 149 },
    ],
    flavours: false,
    tint: "#F6E3EA",
  },
];

/* ───────────────────────── extras ───────────────────────── */

/** Little extras the customer can tick in their box */
export type Extra = { id: string; name: string; detail: string; price: number; ask?: string };
export const extras: Extra[] = [
  { id: "candles", name: "Sparkle candles", detail: "Pack of 10, gold", price: 39 },
  { id: "number-candle", name: "Number candle", detail: "Gold, any digit", price: 49, ask: "Which number?" },
  { id: "knife", name: "Cake knife & plates", detail: "Knife, 6 paper plates", price: 29 },
];

/* ───────────────────────── helpers ───────────────────────── */

export function formatINR(value: number) {
  if (value === 0) return "Free";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

const LB_IN_KG = 0.45359;
/** round to a friendly price ending in 9 */
const nice = (x: number) => (x < 100 ? Math.round(x) : Math.round(x / 10) * 10 - 1);
const kgLabel = (k: number) => (k === 0.5 ? "½ kg" : k === 1.5 ? "1½ kg" : `${k} kg`);
const servesFor = (lb: number) => `${Math.round(lb * 4)}–${Math.round(lb * 5)}`;

/** The sizes on offer for a cake, in pounds or kilos. */
export function optionsFor(item: MenuItem, unit: Unit): SizeOption[] {
  if (!item.weight) return item.options ?? [];
  const { perLb } = item.weight;
  if (unit === "kg") {
    return (item.weight.kg ?? [0.5, 1, 1.5]).map((k) => {
      const lb = k / LB_IN_KG;
      return { label: kgLabel(k), price: nice(perLb * lb), serves: servesFor(lb), kg: k };
    });
  }
  return (item.weight.lb ?? [1, 2, 3]).map((lb) => ({
    label: `${lb} lb`,
    price: lb === 1 ? perLb : nice(perLb * lb),
    serves: servesFor(lb),
    kg: lb * LB_IN_KG,
  }));
}

export const isByWeight = (item: MenuItem) => Boolean(item.weight);

/** Price per pound or per kilo for cakes sold by weight (what the cards show). */
export function ratePer(item: MenuItem, unit: Unit) {
  if (!item.weight) return fromPrice(item, unit);
  return unit === "lb" ? item.weight.perLb : nice(item.weight.perLb / LB_IN_KG);
}

export function fromPrice(item: MenuItem, unit: Unit = "lb") {
  return Math.min(...optionsFor(item, unit).map((o) => o.price));
}

export const getItem = (id: string) => menu.find((m) => m.id === id);
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const getFlavour = (id?: string) => flavours.find((f) => f.id === id);

export function occasionsOf(item: MenuItem): Occasion[] {
  return Array.from(new Set([...getCategory(item.category).occasions, ...(item.occasions ?? [])]));
}

export const occasionLabels: Record<Occasion, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  "just-because": "Just because",
};

/** Eggless upgrade for items made with egg: ₹ per kg, or a flat amount for small bakes. */
export const EGGLESS_PER_KG = 50;
export const EGGLESS_FLAT = 20;
export function egglessExtra(item: MenuItem, option: SizeOption) {
  if (item.diet === "eggless") return 0;
  return option.kg ? Math.round(EGGLESS_PER_KG * Math.max(option.kg, 0.5)) : EGGLESS_FLAT;
}

/** Premium flavour surcharge for one cake of this size. */
export function flavourExtra(option: SizeOption, flavourId?: string) {
  const f = getFlavour(flavourId);
  if (!f || !f.extraPerLb || !option.kg) return 0;
  return Math.round((f.extraPerLb * option.kg) / LB_IN_KG / 10) * 10;
}

export type PriceOpts = { eggless?: boolean; flavour?: string };

/** Price of one cake before any offer. */
export function unitPrice(item: MenuItem, unit: Unit, sizeIndex: number, opts: PriceOpts = {}) {
  const options = optionsFor(item, unit);
  const option = options[sizeIndex] ?? options[0];
  return (
    option.price +
    (opts.eggless ? egglessExtra(item, option) : 0) +
    (item.flavours ? flavourExtra(option, opts.flavour) : 0)
  );
}

/** Notice (in days) for a cake. */
export function leadDaysFor(item: MenuItem) {
  return getCategory(item.category).leadDays;
}

/** What's on the menu, for the counts shown on the site. */
export function menuStats() {
  const byKind = new Map<Kind, number>();
  for (const m of menu) {
    const k = getCategory(m.category).kind;
    byKind.set(k, (byKind.get(k) ?? 0) + 1);
  }
  return {
    total: menu.length,
    categories: categories.filter((c) => menu.some((m) => m.category === c.id)).length,
    flavours: flavours.length,
    byKind: [...byKind.entries()].map(([kind, count]) => ({ kind, count, label: `${count} ${kind.toLowerCase()}${count === 1 ? "" : "s"}` })),
  };
}
