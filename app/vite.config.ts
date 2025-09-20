import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate", // keeps SW fresh
            includeAssets: ["favicon.svg", "robots.txt", "icons/*"],
            manifest: {
                name: "Pushup Challenge",
                short_name: "Pushup",
                description: "Daily pushup challenge with friends",
                theme_color: "#2563eb",
                background_color: "#ffffff",
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
})
