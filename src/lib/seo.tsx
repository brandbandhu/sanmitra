import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

const siteUrl = import.meta.env["VITE_SITE_URL"] ?? "https://sanmitra-sunshine-hub.lovable.app";

export function PageMetadata({ title, description }: { title: string; description: string }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const fullTitle = title + " | Sanmitra Solar";
    const canonical = new URL(pathname, siteUrl).href;
    document.title = fullTitle;

    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', fullTitle],
      ['meta[property="og:description"]', description],
      ['meta[property="og:url"]', canonical],
      ['meta[name="twitter:title"]', fullTitle],
      ['meta[name="twitter:description"]', description],
    ] as const) {
      document.head.querySelector(selector)?.setAttribute("content", content);
    }
    document.head.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
  }, [title, description, pathname]);

  return null;
}
