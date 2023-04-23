import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import { astroImageTools } from "astro-imagetools";
import { VitePWA } from "vite-plugin-pwa";
import { manifest } from './manifest';
import compress from "astro-compress";
import prefetch from "@astrojs/prefetch";

import critters from "astro-critters";

// https://astro.build/config
export default defineConfig({
  site: 'https://nalabdou.com',
  integrations: [mdx(), sitemap({
    serialize(item) {
      console.log(item);
      if (/blog/.test(item.url)) {
        item.changefreq = 'daily';
        item.lastmod = new Date();
        item.priority = 1.0;
      } else if (/Etiquette/.test(item.url)) {
        item.changefreq = 'weekly';
        item.lastmod = new Date();
        item.priority = 0.9;
      } else {
        item.changefreq = 'weekly';
        item.lastmod = new Date();
        item.priority = 0.8;
      }
      return item;
    }
  }), tailwind(), astroImageTools, compress(), prefetch(), critters(
    {
      critters: true,
    }
  )],
  vite: {
    plugins: [VitePWA({
      registerType: "prompt",
      manifest,
      workbox: {
        globDirectory: 'dist',
        globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}'],
        navigateFallback: null
      }
    })]
  }
});
