import { createFileRoute } from "@tanstack/react-router";
import { BlogPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/blog")({
  head: () =>
    pageHead(
      "Solar insights",
      "Practical guidance to help you prepare for a considered solar decision.",
      "/blog",
    ),
  component: BlogPage,
});
