import { hydrateRoot } from "react-dom/client";
import { MenuApp } from "@/components/MenuApp";

hydrateRoot(document.getElementById("root")!, <MenuApp />);
