import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/gallery")({
  head: () =>
    pageHead(
      "Solar gallery",
      "Explore rooftop solar photography and installation ideas.",
      "/gallery",
    ),
  component: GalleryPage,
});
