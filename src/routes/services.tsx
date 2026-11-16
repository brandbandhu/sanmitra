import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/services")({
  head: () =>
    pageHead(
      "Solar solutions",
      "Explore solar pathways for residential, commercial and industrial properties.",
      "/services",
    ),
  component: ServicesPage,
});
