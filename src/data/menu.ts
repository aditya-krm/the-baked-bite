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

export type SizeOption = {
  label: string;
  price: number;
  serves?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  real: string;
  category: CategoryId;
  blurb: string;
  layers: string[];
  diet: Diet;
  badges?: Badge[];
  options: SizeOption[];
  tint: string;
  art: ArtSpec;
};

export type CategoryId =
  | "celebration"
  | "bento"
  | "cheesecake"
  | "jar"
  | "cupcake"
  | "brownie"
  | "teatime";

export type Category = {
  id: CategoryId;
  title: string;
  /** short label for the filter chips */
  short: string;
  cute: string;
  note: string;
};

export const categories: Category[] = [
  {
    id: "celebration",
    title: "Celebration Cakes",
    short: "Celebration",
    cute: "Party starters",
    note: "Priced by weight. Free message piped on top.",
  },
  {
    id: "bento",
    title: "Bento Cakes",
    short: "Bento",
    cute: "Tiny cakes, loud feelings",
    note: "Serves 1–2 in a lunchbox, with your own little message.",
  },
  {
    id: "cheesecake",
    title: "Cheesecakes",
    short: "Cheesecakes",
    cute: "Creamy little crushes",
    note: "Baked, not set with gelatin. By the slice or a whole 6-inch.",
  },
  {
    id: "jar",
    title: "Jar Cakes",
    short: "Jar cakes",
    cute: "Spoon-first desserts",
    note: "Layered in 250 ml glass jars. Keep chilled.",
  },
  {
    id: "cupcake",
    title: "Cupcakes",
    short: "Cupcakes",
    cute: "Pocket-sized joy",
    note: "Buy one or pick a box of 4 or 6.",
  },
  {
    id: "brownie",
    title: "Brownies & Blondies",
    short: "Brownies",
    cute: "Fudgy best friends",
    note: "Baked every morning, squidgy in the middle.",
  },
  {
    id: "teatime",
    title: "Tea-time Loaves",
    short: "Loaves",
    cute: "Chai's favourite company",
    note: "Whole loaves (about 450 g), sliced on request.",
  },
];

const kg = (half: number, one: number, two?: number): SizeOption[] => [
  { label: "½ kg", price: half, serves: "4–6" },
  { label: "1 kg", price: one, serves: "8–12" },
  ...(two ? [{ label: "2 kg", price: two, serves: "18–24" }] : []),
];

export const menu: MenuItem[] = [
  // ─── Celebration ─────────────────────────────────────────────
  {
    id: "berry-me-in-love",
    name: "Berry Me in Love",
    real: "Fresh Strawberry Cream Cake",
    category: "celebration",
    blurb:
      "Vanilla chiffon, whipped cream and Mahabaleshwar strawberries, piled high and dressed in pink. The cake people ask for by name.",
    layers: ["Vanilla chiffon", "Strawberry compote", "Fresh whipped cream", "Whole strawberries"],
    diet: "eggless",
    badges: ["bestseller"],
    options: kg(549, 999, 1899),
    tint: "#FFD9E0",
    art: {
      kind: "drip",
      sponge: "#F7DDB0",
      cream: "#FFE9EE",
      glaze: "#F0718F",
      accent: "#FFFFFF",
      toppings: ["rosette", "strawberry", "rosette", "strawberry", "rosette"],
    },
  },
  {
    id: "choco-loco-lava",
    name: "Choco Loco Lava",
    real: "Death by Chocolate Drip Cake",
    category: "celebration",
    blurb:
      "Three layers of dark cocoa sponge, whipped ganache and a glossy Belgian drip, finished with shards and truffle pearls.",
    layers: ["Dark cocoa sponge", "Whipped ganache", "54% Belgian drip", "Truffle pearls"],
    diet: "eggless",
    badges: ["bestseller"],
    options: kg(649, 1199, 2299),
    tint: "#EAD6CB",
    art: {
      kind: "drip",
      sponge: "#5A3325",
      cream: "#8A5A44",
      glaze: "#3B1F17",
      accent: "#F3D9C4",
      toppings: ["shards", "choco-ball", "shards", "choco-ball", "gold"],
    },
  },
  {
    id: "red-velvet-crush",
    name: "Red Velvet Crush",
    real: "Red Velvet & Cream Cheese",
    category: "celebration",
    blurb:
      "Buttermilk cocoa sponge with a whisper of vanilla and tangy cream-cheese frosting, crumb-coated and hand-combed.",
    layers: ["Red velvet sponge", "Cream-cheese frosting", "Velvet crumbs"],
    diet: "egg",
    options: kg(649, 1199, 2299),
    tint: "#FBD3D3",
    art: {
      kind: "naked",
      sponge: "#B8323F",
      cream: "#FFF6EE",
      accent: "#FFFFFF",
      toppings: ["rosette", "heart", "rosette", "heart", "rosette"],
    },
  },
  {
    id: "rasmalai-royale",
    name: "Rasmalai Royale",
    real: "Rasmalai Fusion Two-Tier Cake",
    category: "celebration",
    blurb:
      "Saffron milk-soaked sponge layered with rasmalai-studded cream, then crowned with pistachio slivers, rose petals and edible gold.",
    layers: ["Saffron milk-soaked sponge", "Rasmalai cream", "Pistachio & rose", "Edible gold leaf"],
    diet: "eggless",
    badges: ["chef"],
    options: [
      { label: "1 kg", price: 1399, serves: "8–12" },
      { label: "2 kg", price: 2699, serves: "18–24" },
      { label: "3 kg", price: 3899, serves: "28–35" },
    ],
    tint: "#FCEBC7",
    art: {
      kind: "tier",
      sponge: "#F6D98E",
      cream: "#FFF4DC",
      glaze: "#F2C14E",
      accent: "#E8A33D",
      toppings: ["rose", "pistachio", "saffron", "gold", "rose"],
    },
  },
  {
    id: "butterscotch-hugs",
    name: "Butterscotch Hugs",
    real: "Butterscotch Praline Cake",
    category: "celebration",
    blurb:
      "Golden sponge, butterscotch cream and crunchy house-made praline, with caramel poured over the top.",
    layers: ["Golden sponge", "Butterscotch cream", "Cashew praline", "Salted caramel"],
    diet: "eggless",
    options: kg(499, 899, 1699),
    tint: "#FFE7B8",
    art: {
      kind: "drip",
      sponge: "#F2C77A",
      cream: "#FFF1D6",
      glaze: "#D98E2B",
      accent: "#FFFFFF",
      toppings: ["rosette", "caramel", "rosette", "caramel", "rosette"],
    },
  },
  {
    id: "black-forest-fairytale",
    name: "Black Forest Fairytale",
    real: "Classic Black Forest",
    category: "celebration",
    blurb:
      "The one from every childhood birthday, done properly: kirsch-free cherry syrup, soft chocolate sponge, clouds of cream and dark shavings.",
    layers: ["Chocolate sponge", "Cherry syrup", "Whipped cream", "Dark shavings"],
    diet: "eggless",
    options: kg(499, 899, 1699),
    tint: "#E9DCF0",
    art: {
      kind: "frosted",
      sponge: "#4E2A20",
      cream: "#FFF8F2",
      glaze: "#4E2A20",
      accent: "#FFFFFF",
      toppings: ["cherry", "rosette", "cherry", "rosette", "cherry"],
    },
  },
  {
    id: "mango-tango",
    name: "Mango Tango",
    real: "Alphonso Mango Cream Cake",
    category: "celebration",
    blurb:
      "Only in mango season: Ratnagiri Alphonso purée folded into cream, with fresh cubes on a vanilla sponge.",
    layers: ["Vanilla sponge", "Alphonso mousse", "Fresh mango cubes"],
    diet: "eggless",
    badges: ["seasonal"],
    options: kg(599, 1099, 2099),
    tint: "#FFE2A8",
    art: {
      kind: "drip",
      sponge: "#F8D9A0",
      cream: "#FFF0C8",
      glaze: "#F7A928",
      accent: "#FFFFFF",
      toppings: ["mango", "rosette", "mango", "rosette", "mango"],
    },
  },
  {
    id: "pineapple-pout",
    name: "Pineapple Pout",
    real: "Classic Pineapple Cream",
    category: "celebration",
    blurb:
      "Light vanilla sponge soaked in pineapple syrup, with fresh cream and a ring of glazed pineapple and cherries. Nostalgic in the best way.",
    layers: ["Vanilla sponge", "Pineapple syrup", "Fresh cream", "Glazed pineapple"],
    diet: "eggless",
    options: kg(449, 799, 1499),
    tint: "#FFF1B0",
    art: {
      kind: "frosted",
      sponge: "#F9E1A0",
      cream: "#FFFBEA",
      glaze: "#F6D24A",
      accent: "#FFFFFF",
      toppings: ["pineapple", "cherry", "pineapple", "cherry", "pineapple"],
    },
  },

  {
    id: "pista-kulfi-kiss",
    name: "Pista Kulfi Kiss",
    real: "Pistachio Kulfi Cake",
    category: "celebration",
    blurb:
      "Our take on matka kulfi: cardamom sponge, reduced-milk cream and a whole lot of pistachio, with a pale green drip and saffron threads.",
    layers: ["Cardamom sponge", "Rabdi cream", "Pistachio drip", "Saffron threads"],
    diet: "eggless",
    badges: ["new"],
    options: kg(599, 1099, 2099),
    tint: "#DDEFD2",
    art: {
      kind: "drip",
      sponge: "#F3DDA6",
      cream: "#FFF7E4",
      glaze: "#9CC77E",
      accent: "#FFFFFF",
      toppings: ["pistachio", "saffron", "rosette", "macaron", "rosette"],
    },
  },

  // ─── Bento ───────────────────────────────────────────────────
  {
    id: "bento-bae",
    name: "Bento Bae",
    real: "Vanilla Bento with Message",
    category: "bento",
    blurb:
      "A 4-inch vanilla cake in a kraft lunchbox with a tiny wooden spoon. Tell us the message (up to 12 letters) and we'll pipe it.",
    layers: ["Vanilla sponge", "Vanilla bean cream", "Your message"],
    diet: "eggless",
    badges: ["new"],
    options: [{ label: "250 g", price: 449, serves: "1–2" }],
    tint: "#DDEFE7",
    art: {
      kind: "bento",
      sponge: "#F7DDB0",
      cream: "#CDEBDD",
      accent: "#E47A9A",
      message: "love u",
      toppings: ["heart"],
    },
  },
  {
    id: "tiny-tantrum",
    name: "Tiny Tantrum",
    real: "Chocolate Truffle Bento",
    category: "bento",
    blurb:
      "Dense chocolate truffle in lunchbox size, for sorry, for birthdays, or for a Tuesday that needs it.",
    layers: ["Cocoa sponge", "Chocolate truffle", "Cocoa nib crunch"],
    diet: "eggless",
    options: [{ label: "250 g", price: 479, serves: "1–2" }],
    tint: "#EFDFD3",
    art: {
      kind: "bento",
      sponge: "#5A3325",
      cream: "#6B3E2E",
      accent: "#FFE9EE",
      message: "sorry!",
      toppings: ["heart"],
    },
  },
  {
    id: "lil-sunshine",
    name: "Lil’ Sunshine",
    real: "Lemon Bento with Lemon Curd",
    category: "bento",
    blurb: "Zesty lemon sponge and a hidden centre of silky lemon curd, in butter-yellow buttercream.",
    layers: ["Lemon sponge", "Lemon curd centre", "Butter-yellow cream"],
    diet: "egg",
    options: [{ label: "250 g", price: 469, serves: "1–2" }],
    tint: "#FFF3BF",
    art: {
      kind: "bento",
      sponge: "#FBE7A3",
      cream: "#FFE98A",
      accent: "#6E9A57",
      message: "yay you",
      toppings: ["heart"],
    },
  },

  // ─── Cheesecakes ─────────────────────────────────────────────
  {
    id: "blue-moon-kisses",
    name: "Blue Moon Kisses",
    real: "Baked Blueberry Cheesecake",
    category: "cheesecake",
    blurb:
      "New York-style baked cheesecake on a buttery biscuit crust, with blueberry compote swirled on top.",
    layers: ["Butter-biscuit crust", "Baked cream cheese", "Blueberry compote"],
    diet: "egg",
    badges: ["bestseller"],
    options: [
      { label: "Slice", price: 229, serves: "1" },
      { label: "Whole 6″", price: 1249, serves: "6–8" },
    ],
    tint: "#DCE0F7",
    art: {
      kind: "slice",
      sponge: "#C98F55",
      cream: "#FFF3DC",
      glaze: "#4B3B8F",
      toppings: ["blueberry"],
    },
  },
  {
    id: "new-york-nap",
    name: "New York Nap",
    real: "Classic Vanilla Bean Cheesecake",
    category: "cheesecake",
    blurb:
      "Tall and creamy with a caramelised top, lifted by vanilla bean and lemon zest. Simple, and our quiet favourite.",
    layers: ["Graham-style crust", "Vanilla bean cheesecake", "Caramelised top"],
    diet: "egg",
    options: [
      { label: "Slice", price: 209, serves: "1" },
      { label: "Whole 6″", price: 1149, serves: "6–8" },
    ],
    tint: "#FFF0D6",
    art: {
      kind: "slice",
      sponge: "#C98F55",
      cream: "#FFF4DE",
      glaze: "#E0A45A",
      toppings: ["strawberry"],
    },
  },
  {
    id: "hazel-hug",
    name: "Hazel Hug",
    real: "Hazelnut Chocolate Cheesecake",
    category: "cheesecake",
    blurb:
      "Chocolate-hazelnut cheesecake on a cocoa crumb base with a layer of gianduja and roasted hazelnuts on top.",
    layers: ["Cocoa crumb base", "Hazelnut cheesecake", "Gianduja layer", "Roasted hazelnuts"],
    diet: "eggless",
    badges: ["new"],
    options: [
      { label: "Slice", price: 249, serves: "1" },
      { label: "Whole 6″", price: 1349, serves: "6–8" },
    ],
    tint: "#EADBCF",
    art: {
      kind: "slice",
      sponge: "#4A2B20",
      cream: "#C79A78",
      glaze: "#5A3325",
      toppings: ["walnut"],
    },
  },

  // ─── Jar cakes ───────────────────────────────────────────────
  {
    id: "tiramisu-tuck-in",
    name: "Tiramisu Tuck-in",
    real: "Coffee Tiramisu Jar",
    category: "jar",
    blurb:
      "Espresso-soaked sponge, mascarpone cream and a thick dusting of cocoa, in a jar you'll want to keep.",
    layers: ["Espresso-soaked sponge", "Mascarpone cream", "Cocoa dust"],
    diet: "eggless",
    badges: ["bestseller"],
    options: [
      { label: "1 jar", price: 189 },
      { label: "Box of 4", price: 699 },
    ],
    tint: "#EFE0CF",
    art: {
      kind: "jar",
      sponge: "#A0673F",
      cream: "#FFF3E0",
      glaze: "#5A3325",
      toppings: ["choco-ball"],
    },
  },
  {
    id: "cookies-cream-dream",
    name: "Cookies & Cream Dream",
    real: "Cookies & Cream Jar",
    category: "jar",
    blurb: "Chocolate cookie crumble, vanilla cream and cocoa sponge, all the way to the bottom of the jar.",
    layers: ["Cocoa sponge", "Cookie crumble", "Vanilla cream"],
    diet: "eggless",
    options: [
      { label: "1 jar", price: 169 },
      { label: "Box of 4", price: 629 },
    ],
    tint: "#E3E3EA",
    art: {
      kind: "jar",
      sponge: "#3A2622",
      cream: "#FFFFFF",
      glaze: "#3A2622",
      toppings: ["cookie"],
    },
  },
  {
    id: "rasmalai-rendezvous",
    name: "Rasmalai Rendezvous",
    real: "Rasmalai Jar",
    category: "jar",
    blurb: "Saffron-milk sponge, mini rasmalai, pistachio cream and rose petals. A festive sweet, served by the spoon.",
    layers: ["Saffron-milk sponge", "Mini rasmalai", "Pistachio cream", "Rose petals"],
    diet: "eggless",
    badges: ["chef"],
    options: [
      { label: "1 jar", price: 199 },
      { label: "Box of 4", price: 749 },
    ],
    tint: "#FDEBC8",
    art: {
      kind: "jar",
      sponge: "#F2CC7A",
      cream: "#FFF6DD",
      glaze: "#E7B04A",
      toppings: ["pistachio"],
    },
  },

  // ─── Cupcakes ────────────────────────────────────────────────
  {
    id: "vanilla-cloud-nine",
    name: "Vanilla Cloud Nine",
    real: "Vanilla Bean Cupcake",
    category: "cupcake",
    blurb: "Madagascar vanilla sponge with a tall swirl of whipped buttercream and rainbow sprinkles.",
    layers: ["Vanilla bean sponge", "Whipped buttercream", "Rainbow sprinkles"],
    diet: "eggless",
    options: [
      { label: "Single", price: 79 },
      { label: "Box of 4", price: 289 },
      { label: "Box of 6", price: 419 },
    ],
    tint: "#E6E0FA",
    art: {
      kind: "cupcake",
      sponge: "#F5D79E",
      cream: "#FFF6FB",
      accent: "#B9A6EE",
      toppings: ["sprinkles"],
    },
  },
  {
    id: "choco-chip-chirpy",
    name: "Choco Chip Chirpy",
    real: "Double Chocolate Cupcake",
    category: "cupcake",
    blurb: "Chocolate sponge with a molten ganache centre, topped with a cocoa swirl and a cherry.",
    layers: ["Chocolate sponge", "Molten ganache centre", "Cocoa frosting"],
    diet: "eggless",
    badges: ["bestseller"],
    options: [
      { label: "Single", price: 89 },
      { label: "Box of 4", price: 329 },
      { label: "Box of 6", price: 479 },
    ],
    tint: "#EFD9CC",
    art: {
      kind: "cupcake",
      sponge: "#5A3325",
      cream: "#8A5A44",
      accent: "#F1A7B7",
      toppings: ["cherry"],
    },
  },
  {
    id: "rose-pistachio-poem",
    name: "Rose Pistachio Poem",
    real: "Rose & Pistachio Cupcake",
    category: "cupcake",
    blurb: "Cardamom sponge, rose-water buttercream and chopped pistachio. Tastes a little like a wedding.",
    layers: ["Cardamom sponge", "Rose buttercream", "Pistachio"],
    diet: "eggless",
    badges: ["new"],
    options: [
      { label: "Single", price: 99 },
      { label: "Box of 4", price: 369 },
      { label: "Box of 6", price: 539 },
    ],
    tint: "#FADCE4",
    art: {
      kind: "cupcake",
      sponge: "#F2D39A",
      cream: "#F8BFCF",
      accent: "#A8C98F",
      toppings: ["pistachio", "rose"],
    },
  },

  // ─── Brownies ────────────────────────────────────────────────
  {
    id: "fudge-grudge",
    name: "Fudge Grudge",
    real: "Classic Walnut Brownie",
    category: "brownie",
    blurb: "Crackly top, dense fudgy middle, toasted walnuts. It'll take care of any grudge.",
    layers: ["70% dark chocolate", "Brown butter", "Toasted walnuts"],
    diet: "egg",
    badges: ["bestseller"],
    options: [
      { label: "1 piece", price: 109 },
      { label: "Box of 6", price: 599 },
    ],
    tint: "#E9D8CC",
    art: {
      kind: "brownie",
      sponge: "#4A2A1E",
      cream: "#6B3E2E",
      toppings: ["walnut"],
    },
  },
  {
    id: "blondie-bestie",
    name: "Blondie Bestie",
    real: "White Chocolate Blondie",
    category: "brownie",
    blurb: "Brown-sugar blondie studded with white chocolate and salted caramel.",
    layers: ["Brown-sugar batter", "White chocolate", "Salted caramel"],
    diet: "egg",
    options: [
      { label: "1 piece", price: 119 },
      { label: "Box of 6", price: 649 },
    ],
    tint: "#FBE8C4",
    art: {
      kind: "brownie",
      sponge: "#D9A45C",
      cream: "#E9BC77",
      toppings: ["caramel"],
    },
  },
  {
    id: "nutty-buddy",
    name: "Nutty Buddy",
    real: "Eggless Nutella-style Brownie",
    category: "brownie",
    blurb: "Our eggless brownie with a hazelnut-cocoa swirl baked through the top. Gooey, rich and fully veg.",
    layers: ["Eggless cocoa batter", "Hazelnut-cocoa swirl", "Sea salt"],
    diet: "eggless",
    options: [
      { label: "1 piece", price: 119 },
      { label: "Box of 6", price: 649 },
    ],
    tint: "#EADFD6",
    art: {
      kind: "brownie",
      sponge: "#5A3325",
      cream: "#7B4A36",
      toppings: ["shards"],
    },
  },

  // ─── Tea-time ────────────────────────────────────────────────
  {
    id: "banana-bread-buddy",
    name: "Banana Bread Buddy",
    real: "Walnut Banana Bread",
    category: "teatime",
    blurb: "Made with very ripe bananas, brown sugar and walnuts, and a split top that turns caramel-crisp.",
    layers: ["Ripe banana", "Brown sugar", "Walnuts"],
    diet: "eggless",
    options: [{ label: "Loaf", price: 379 }],
    tint: "#F7E6C8",
    art: {
      kind: "loaf",
      sponge: "#C58A4E",
      cream: "#E8BD82",
      glaze: "#8C5A2E",
      toppings: ["walnut"],
    },
  },
  {
    id: "marble-mood",
    name: "Marble Mood",
    real: "Chocolate Vanilla Marble Loaf",
    category: "teatime",
    blurb: "Chocolate and vanilla batters swirled together into one soft, buttery loaf. Made for chai.",
    layers: ["Vanilla batter", "Cocoa batter", "Butter crumb"],
    diet: "eggless",
    options: [{ label: "Loaf", price: 329 }],
    tint: "#F3E4D6",
    art: {
      kind: "loaf",
      sponge: "#F2D29A",
      cream: "#F6DDA9",
      glaze: "#B0773F",
      swirl: "#6B3E2E",
    },
  },
  {
    id: "lemon-drizzle-dazzle",
    name: "Lemon Drizzle Dazzle",
    real: "Lemon Drizzle Loaf",
    category: "teatime",
    blurb: "Lemon-zest sponge, soaked while still warm and finished with a crackly sugar glaze.",
    layers: ["Lemon sponge", "Lemon syrup soak", "Sugar glaze"],
    diet: "egg",
    badges: ["new"],
    options: [{ label: "Loaf", price: 349 }],
    tint: "#FFF4C2",
    art: {
      kind: "loaf",
      sponge: "#F8E08E",
      cream: "#FCEBB0",
      glaze: "#FFFDF4",
      toppings: ["lemon"],
    },
  },
];

export const addOns = [
  { name: "Message on cake", detail: "Up to 25 characters, piped by hand", price: 0 },
  { name: "Sparkle candles", detail: "Pack of 10, gold", price: 49 },
  { name: "Number candle", detail: "Any digit, gold or pink", price: 59 },
  { name: "Photo print top", detail: "Edible photo sheet, ½ kg and up", price: 249 },
  { name: "Fondant topper", detail: "Name or number, hand-cut", price: 349 },
  { name: "Make it eggless", detail: "Anything marked with egg", price: 50, suffix: "/ kg" },
] as const;

export function formatINR(value: number) {
  if (value === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function fromPrice(item: MenuItem) {
  return Math.min(...item.options.map((o) => o.price));
}
