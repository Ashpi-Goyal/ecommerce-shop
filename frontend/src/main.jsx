import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./AuthContext";
import { LanguageProvider } from "./LanguageContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>

/* <LanguageProvider>
<AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
</AuthProvider>
</LanguageProvider> */
);