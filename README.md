# The Baked Bite — Cake Menu

A menu-only bakery site: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, run with Bun.

## Run it

```bash
bun install
bun dev            # http://localhost:3000
bun run build      # production build (fully static)
bun run preview:build   # optional: one self-contained HTML file → preview/dist/index.html
```

## Where to change things

| What | File |
| --- | --- |
| Shop name, city, address, hours, phone, Telegram and Instagram handles | `src/config/site.ts` |
| Cakes, prices (₹), sizes, categories, add-ons | `src/data/menu.ts` |
| Colours (light and dark) and fonts | `src/app/globals.css` |

### Adding a cake

Copy any entry in `menu` and change the fields. The `art` block draws the illustration, so there are no image files to manage:

```ts
art: {
  kind: "drip",            // drip | frosted | naked | tier | slice | jar | cupcake | brownie | loaf | bento
  sponge: "#F7DDB0",       // crumb colour
  cream: "#FFE9EE",        // frosting / cheese colour
  glaze: "#F0718F",        // drip, sauce or top colour
  toppings: ["rosette", "strawberry", "rosette"],
}
```

Toppings: `cherry strawberry blueberry rosette candle sprinkles shards pistachio macaron mango rose cookie gold saffron pineapple walnut lemon heart caramel choco-ball`.
Bento cakes also take a `message` (the piped text).

To use real photos later, swap `<CakeArt />` in `MenuCard.tsx` and `ItemDialog.tsx` for `next/image`.

## What's on the page

- A hero with an illustrated cake on a stand and a hanging price tag
- A scrolling ribbon of every cake's name
- The menu, grouped by category, with category chips, search and an **Eggless only** switch. Each card shows the Indian veg/egg mark, and the price tag updates when you pick a size.
- A detail sheet for each cake: what's inside, sizes with how many it serves, **Order on Telegram**, and **Copy order note**, which copies a ready-to-paste order message
- The add-ons price list, a "Good to know" section, and visiting details
- Light and dark themes (follows the system), a phone-first layout, and reduced-motion support

## Structure

```
src/
  app/            layout.tsx (fonts, metadata), page.tsx, globals.css, icon.svg
  components/     MenuApp (page) · Header · Hero · Marquee · Menu · MenuCard · ItemDialog · Sections · CakeArt · ui
  config/site.ts
  data/menu.ts
preview/          standalone single-file build (not part of the Next app)
```

Fonts (Fraunces, Nunito, Caveat) are self-hosted through `@fontsource`, so the build never needs Google Fonts.
