import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { init } from "@tma.js/sdk-react";
import { App } from "./app/app";
import { BrowserRouter } from "react-router-dom";

init();

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
