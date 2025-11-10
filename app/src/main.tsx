import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import { registerSW } from "virtual:pwa-register";
import { handleGoogleRedirect } from './firebase/config.ts';

await handleGoogleRedirect();

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
