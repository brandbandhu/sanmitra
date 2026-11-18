import solarPreview from "@/assets/sanmitra-home-solar.jpg";

export const SITE_URL = "https://sanmitra-sunshine-hub.lovable.app";
const previewUrl = new URL(solarPreview, SITE_URL).href;

export function pageHead(title: string, description: string, path: string) {
  const fullTitle = title + " | Sanmitra Solar";
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: SITE_URL + path },
      { property: "og:site_name", content: "Sanmitra Solar" },
      { property: "og:image", content: previewUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: previewUrl },
      ...(path === "/admin" ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    links: [{ rel: "canonical", href: SITE_URL + path }],
  };
}
