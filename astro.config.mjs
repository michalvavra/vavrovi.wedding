// @ts-check

import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],

  adapter: cloudflare({ imageService: "compile" }),
  output: "server",

  fonts: [
    {
      provider: fontProviders.google(),
      name: "Source Sans 3",
      cssVariable: "--font-source-sans",
      subsets: ["latin", "latin-ext"],
      weights: ["200 900"],
    },
    {
      provider: fontProviders.google(),
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      subsets: ["latin", "latin-ext"],
      weights: [400],
    },
  ],
});
