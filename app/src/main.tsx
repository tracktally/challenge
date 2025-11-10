import { getRedirectResult, GoogleAuthProvider } from "firebase/auth";

import "./firebase/config.ts";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { auth } from "./firebase/config";

import { registerSW } from "virtual:pwa-register";

async function handleAuthRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Google login success:", result.user.uid);
    }
  } catch (err) {
    console.error("Redirect login error:", err);
  }
}

handleAuthRedirect();


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.error("SW registration failed:", err));
  });
}

registerSW({
  onNeedRefresh() {
    console.log("New version available. Refresh to update.");
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
