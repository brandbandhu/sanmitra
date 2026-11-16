import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/projects")({
  head: () =>
    pageHead(
      "Our projects",
      "Explore Sanmitra Solar project stories and clearly labelled design concepts.",
      "/projects",
    ),
  component: ProjectsPage,
});
