import "./app/styles/variables.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { init } from "@tma.js/sdk-react";
import { App } from "./app/app";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";

// after test delete
try {
  init();
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
} catch (e) {
  console.warn("App is running outside of Telegram");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
