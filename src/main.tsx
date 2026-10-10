import { createRoot } from "react-dom/client";
import { MinecraftTitleScreen } from "./components/MinecraftTitleScreen";
import "./styles/gui.css";
import "./styles/pixel-font.css";
import "./styles/title-screen.css";
createRoot(document.getElementById("root")!).render(<MinecraftTitleScreen />);
