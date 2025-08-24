// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import "./lib/i18n";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const VITE_RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey={VITE_RECAPTCHA_SITE_KEY}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleReCaptchaProvider>
  </StrictMode>
);