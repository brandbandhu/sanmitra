import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/projects_/$slug")({
  head: ({ params }) =>
    pageHead(
      params.slug.replaceAll("-", " "),
      "Explore " + params.slug.replaceAll("-", " ") + " with Sanmitra Solar.",
      "/projects/" + params.slug,
    ),
  component: Page,
});
function Page() {
  const { slug } = Route.useParams();
  return <ProjectDetailPage slug={slug} />;
}
