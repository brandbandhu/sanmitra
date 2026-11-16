export const SITE_URL = "https://sanmitra-sunshine-hub.lovable.app";
export function pageHead(title: string, description: string, path: string) {
  const fullTitle = title + " | Sanmitra Solar";
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: SITE_URL + path },
      ...(path === "/admin" ? [{ name: "robots", content: "noindex, nofollow" }] : []),
    ],
    links: [{ rel: "canonical", href: SITE_URL + path }],
  };
}
