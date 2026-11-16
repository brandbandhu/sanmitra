import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetailPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/services_/$slug")({
  head: ({ params }) =>
    pageHead(
      params.slug.replaceAll("-", " "),
      "Explore " + params.slug.replaceAll("-", " ") + " with Sanmitra Solar.",
      "/services/" + params.slug,
    ),
  component: Page,
});
function Page() {
  const { slug } = Route.useParams();
  return <ServiceDetailPage slug={slug} />;
}
