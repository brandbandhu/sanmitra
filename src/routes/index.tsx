import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Power Your Home. Brighten Your Future.",
      "Explore thoughtful solar solutions for homes and businesses with Sanmitra Solar.",
      "/",
    ),
  component: HomePage,
});
