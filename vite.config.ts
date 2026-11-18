import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const siteUrl = new URL(
    loadEnv(mode, process.cwd())["VITE_SITE_URL"] ||
      (process.env["VERCEL_PROJECT_PRODUCTION_URL"]
        ? "https://" + process.env["VERCEL_PROJECT_PRODUCTION_URL"]
        : "https://sanmitra-sunshine-hub.lovable.app"),
  ).origin;

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "site-url",
        transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
      },
    ],
    define: { "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl) },
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  };
});
