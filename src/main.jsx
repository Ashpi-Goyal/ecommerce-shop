import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/CartContext.jsx";
import { LanguageProvider } from "./LanguageContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <CartProvider>
      <App />
    </CartProvider> */}
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>
);