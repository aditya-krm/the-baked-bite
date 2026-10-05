# The Baked Bite

A calm, boutique bakery site where customers **pick a cake → make it theirs → choose a time → place the order**.
Orders arrive in your Telegram, and there's no database to look after.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Bun

```bash
bun install
cp .env.example .env.local   # add your Telegram details (see below)
bun dev                      # http://localhost:3000
```

---

## The pages

| Page | What it does |
| --- | --- |
| `/` Home | Hero, "What are we celebrating?", most-loved cakes, how ordering works, a note from the kitchen |
| `/cakes` | The full menu with category tabs and an *Eggless only* switch. `/cakes?for=birthday` filters by occasion. |
| `/cakes/[id]` | Photo gallery, size, eggless upgrade, message on the cake (with a live chocolate-plaque preview) and **Add to box** |
| `/custom-cake` | A guided form with a reference-photo upload that goes straight to Telegram |
| `/about` | The story. ✏️ The copy is placeholder text, so replace it in `src/views/AboutView.tsx`. |

**Your box** follows the customer around: the header button, a bottom bar on phones, and a slide-in drawer.
Step 1 is the box itself (quantities, little extras). Step 2 is pickup or delivery, the day and time (only bookable slots are shown), and the customer's name and phone. Step 3 is the confirmation with an order number.
The box is saved in the browser, so it survives page changes and reloads.

If sending to Telegram ever fails, the customer gets a **"Send on WhatsApp"** button with the whole order already written out, so no order is lost.

---

## ✨ Adding or changing cakes

Everything about the menu lives in **`src/data/menu.ts`**. Changing it updates the menu, the cake pages, the box, prices and the Telegram messages all at once.

### 1. Add a cake

Copy an existing entry inside `menu = [ … ]` and edit it:

```ts
{
  id: "coffee-crush",                 // the URL /cakes/coffee-crush AND the photo folder public/cakes/coffee-crush/
  name: "Coffee Crush",               // the cute name
  real: "Coffee Walnut Cake",         // what it actually is
  category: "floral",                 // floral | drip | message | theme | signature | bento | bakes
  blurb: "Espresso cream, toasted walnuts and a chocolate drip.",
  details: ["Chocolate drip", "Walnut crown", "Gold pearls"],   // chips under "The details"
  diet: "eggless",                    // or "egg" (customers can then pay a little to make it eggless)
  badges: ["new"],                    // optional: bestseller | new | seasonal | chef
  weight: { perLb: 399 },             // ₹ per pound. Every size is worked out from this.
  flavours: true,                     // show the flavour picker
  tint: "#EADBCF",                    // soft colour shown while the photo loads
},
```

**Pound or kilo.** Customers switch with the *Pound / Kilo* toggle; pound is the default.
From `perLb` the site offers **1 / 2 / 3 lb** or **½ / 1 / 1½ kg** and rounds kilo prices to end in 9 (₹399/lb → ½ kg ₹439, 1 kg ₹879).
Use other sizes like this (doll cakes start at 2 lb):

```ts
weight: { perLb: 499, lb: [2, 3, 4], kg: [1, 1.5, 2] },
```

**Fixed-price items** (bento, donuts) use `options` instead of `weight`:

```ts
options: [
  { label: "Box of 3", price: 149 },
  { label: "Box of 6", price: 279 },
],
```

**Flavours and their extra cost** are in the `flavours` list near the top of `menu.ts` (`extraPerLb`: Red Velvet +₹50/lb and so on). Set `defaultFlavour: "chocolate"` on a cake to pre-select one.

**Occasions:** each category already appears under certain occasions (birthday, anniversary, just because). To add one for a single cake, add `occasions: ["anniversary"]`.

### 2. Add photos (the gallery and carousel)

Put the photos in a folder named after the cake's `id`:

```
public/cakes/coffee-crush/1.jpg   ← cover: cards, home page, box
public/cakes/coffee-crush/2.jpg   ← shown when you hover a card, and in the gallery
public/cakes/coffee-crush/3.jpg
```

That's it. They're picked up automatically, in name order. A cake with no photos shows its illustration plus a close-up, so nothing ever looks broken.

**Shot list that makes the menu look like a set:** the whole cake from the front, a cut slice showing the layers, the top up close, the cake in its box, and someone holding it.
Use the same backdrop and window light for every cake. Portrait 4:5 (for example 1200 × 1500), under about 500 KB each.

> Photos are read when the site is built. After adding photos, redeploy, or restart `bun dev`.

### 3. Remove or pause a cake

Delete its entry (or comment it out). Its page disappears and old links show a friendly "This page crumbled" page.

### 4. Change a price

Edit `perLb` (or the numbers in `options`). Prices are always recalculated on the server, so an old box in someone's browser can't order at an old price.

### 5. Categories, notice periods and messages

At the top of `menu.ts`, each category has:

- `leadDays`: notice needed. `0` = same day (a few hours, `site.sameDayHours`), `1` = order by the night before, `2` = two days ahead.
  Cakes are ready from `site.readyFromHour` (1 pm) on that day. Late-night orders (after midnight, before opening) count as the previous night, so a 1 am order for a 1-day cake can still be picked up that afternoon. Closed days don't count as notice days.
- `allowMessage`: whether the "Message on the cake" box appears.
- `note`: the small line under the category title.

### 6. Little extras in the box

The `extras` list in `menu.ts`: candles, a number candle (it asks which number), and a knife with plates. Add, remove or reprice freely.

### 7. Shop details

`src/config/site.ts` holds the name, address, WhatsApp number, opening hours, **closed days**, **pickup and delivery time slots**, how far ahead people can book, the delivery fee note and the payment note.

---

### 8. Offers & festival discounts

Edit **`src/config/offers.ts`**. Each offer has a start and end date, a % off, and optionally which categories or cakes it covers:

```ts
{
  id: "durga-puja",
  title: "Durga Puja special: 15% off floral & message cakes",   // top strip + checkout
  short: "Puja special",                                          // badge
  percent: 15,
  starts: "2026-10-16",
  ends: "2026-10-21",                                             // inclusive, India time
  appliesTo: { categories: ["floral", "message"] },              // leave out = every cake
  banner: true,                                                   // show in the strip on top
},
```

The site switches offers on and off by itself (pages refresh hourly). Prices show crossed out, the box shows "Offer savings", and the Telegram order says which offer applied. Extras such as candles stay full price.

### 9. Phone numbers, hours, theme

- `phones` in `site.ts`: the first one is primary and is used by every WhatsApp button.
- `closedWeekdays: []` means open every day. Put `[1]` to close on Mondays, and update `hoursLabel` to match.
- The site is light by default; visitors can switch to dark with the sun/moon button in the header.

### 10. Logo

The logo lives in `public/brand/` as sharp vector files: `logo.svg` (with "Handcrafted cakes"), `wordmark.svg` (header), each with a `-dark` version for dark mode, plus PNGs for sharing and print. The browser-tab icon is `src/app/icon.svg` and the iPhone home-screen icon is `src/app/apple-icon.png`.

## Search (SEO) & sharing

Already built in:

- Every page has its own title, description and canonical link written for "cake in Malda"-type searches.
- Google gets structured data: a **Bakery** listing (address, both phones, hours, map) and a **Product** for every cake with its ₹ price range.
- `sitemap.xml` and `robots.txt` are generated automatically.
- **Share images**: each cake has its own 1200×630 card (photo, name, price and any offer), generated automatically. The home page has a collage.
- Cake pages have a **Share** button (the phone's share sheet, or WhatsApp / Copy link on desktop).

Do these yourself after going live; they matter most for local search:

1. **Google Business Profile** (business.google.com): add the bakery with the same name, address and phones, category "Cake shop", photos, and the website link. This is what puts you on Google Maps for "cake shop near me" in Malda.
2. **Google Search Console**: add the domain, then submit `https://your-domain/sitemap.xml`.
3. Ask happy customers for Google reviews.
4. Put the website link in the Instagram bio and WhatsApp Business profile.

## 📲 Connect Telegram (2 minutes)

1. In Telegram, open **@BotFather** → `/newbot` → follow the prompts → copy the **token**.
2. Open your new bot and press **Start**. (For a group: add the bot to the group and send any message.)
3. In a browser, visit `https://api.telegram.org/bot<TOKEN>/getUpdates`, then copy `"chat":{"id": … }`. That's your **chat id**. Group ids start with `-`.
4. Put both in `.env.local` (and in your hosting provider's environment variables):

```
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=987654321
```

Until they're set:

- **In development**, orders "succeed" in demo mode and are printed in your terminal.
- **In production**, checkout tells the customer that online ordering isn't on yet and offers WhatsApp instead.

To allow demo orders on a deployed preview, set `ALLOW_DEMO_ORDERS=1`.

An order arrives looking like this:

```
🎂 New order BB-K3F9Q2

• 1 × Red Velvet Crush (1 kg, made eggless) — ₹1,249
   ✍️ Message: "Happy birthday, Riya!"
• Sparkle candles — ₹49

Total: ₹1,298

🛍️ Pickup · Tue, 6 Oct · 11 am – 1 pm
👤 Riya Sharma · 98765 43210
```

## Deploying

**Checklist**

1. Environment variables on the host (Vercel → Project → Settings → Environment Variables):
   `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_SITE_URL` (your live https address, e.g. `https://thebakedbite.in`; it's baked in at build time, so redeploy after changing it). Do **not** set `ALLOW_DEMO_ORDERS` in production.
2. `bun run build` passes locally.
3. Place one real test order on the live site and check it lands in Telegram.
4. Never commit `.env` / `.env.local` (they're git-ignored). `.env.example` is the template.



Deploy to Vercel (or any Node host): `bun run build`, then set the two Telegram variables. Pages are pre-rendered, and only `/api/order` and `/api/custom-cake` run on the server. A hidden honeypot field and a per-IP limit keep out spam bots.

## Project map

```
src/
  config/site.ts        shop details, hours, slots, notes
  data/menu.ts          cakes, categories, extras, prices  ← you'll edit this most
  app/                  routes: /, /cakes, /cakes/[id], /custom-cake, /about, /api/*
  views/                the content of each page
  components/           Header, Footer, ProductCard, Gallery, PurchasePanel, CakeArt (illustrations), box/ (drawer + bar)
  lib/                  order pricing & formatting, schedule (slots), Telegram, photos, box store
public/cakes/<id>/      cake photos
preview/                optional single-file clickable preview (bun run preview:build)
```
