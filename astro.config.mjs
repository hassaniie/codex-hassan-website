import { defineConfig } from "astro/config";
export default defineConfig({
  // The production address; canonical links, the sitemap and share previews
  // are built from it.
  site: "https://uxhassan.vercel.app",
  output: "static",
  devToolbar: { enabled: false },
});
