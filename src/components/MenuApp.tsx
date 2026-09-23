import { Header } from "./Header";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { Menu } from "./Menu";
import { AddOns, Footer, GoodToKnow, Visit } from "./Sections";

/** The whole page. Shared by the Next.js route and the standalone preview build. */
export function MenuApp() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Menu />
        <AddOns />
        <GoodToKnow />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
