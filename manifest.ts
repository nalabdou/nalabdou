import type { ManifestOptions } from "vite-plugin-pwa"

export const manifest: Partial<ManifestOptions> = {
    name: "Nadim - Développeur Web Symfony",
    short_name: "Nadim",
    description:
        "Je suis un développeur Symfony travaillant chez @Actimage à Strasbourg",
    theme_color: "#d1c1d7",
    background_color: "#ffffff",
    display: "standalone",
    lang: "fr",
    orientation: "any",
    icons: [
        {
            "src": "/favicon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
        },
        {
            "src": "/favicon-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
        },
        {
            "src": "/favicon-384x384.png",
            "sizes": "384x384",
            "type": "image/png",
            "purpose": "any maskable"
        },
        {
            "src": "/favicon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
