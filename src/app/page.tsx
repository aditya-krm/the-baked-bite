import { photoMap } from "@/lib/photos";
import { HomeView } from "@/views/HomeView";

export default function Home() {
  return <HomeView photos={photoMap()} />;
}
