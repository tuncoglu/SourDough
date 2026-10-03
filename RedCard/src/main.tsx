import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LiveMonitor } from "./components/live-monitor";
import "./styles.css";

createRoot(document.getElementById("root")!).render(<StrictMode><LiveMonitor /></StrictMode>);
