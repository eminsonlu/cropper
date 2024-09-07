import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { PositionProvider } from "./store/position-store.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PositionProvider>
      <App />
    </PositionProvider>
  </StrictMode>
);
