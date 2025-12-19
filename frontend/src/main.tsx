import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.documentElement;
const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const shouldDark = storedTheme ? storedTheme === "dark" : prefersDark;
rootElement.classList.toggle("dark", shouldDark);

createRoot(document.getElementById("root")!).render(<App />);
