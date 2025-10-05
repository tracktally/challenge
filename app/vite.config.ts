import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    build: {
        // for debugging only
        // sourcemap: true,
        // minify: false,
    },
    plugins: [react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate", // keeps SW fresh
                  workbox: {
                    navigateFallback: '/index.html',
                    navigateFallbackDenylist: [
                    /^\/doc(\/|$)/,
                    ],
                },
            includeAssets: ["favicon.svg", "robots.txt", "icons/*"],
            manifest: {
                name: "Track Tally",
                short_name: "Pushup",
                description: "Daily challenge with friends",
                theme_color: "#2563eb",
                background_color: "#113aaaff",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "/icons/icon-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ]
    ,
     resolve: {
    dedupe: ["react", "react-dom"],
  },
})
