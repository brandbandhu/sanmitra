import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/about")({
  head: () =>
    pageHead(
      "Our story",
      "A thoughtful approach to solar energy, shaped around your property.",
      "/about",
    ),
  component: AboutPage,
});
