import { createRoot } from "react-dom/client";
import { StartupApplication } from "./components/StartupApplication";
import "./styles/gui.css";
import "./styles/pixel-font.css";
import "./styles/title-screen.css";
createRoot(document.getElementById("root")!).render(<StartupApplication />);
