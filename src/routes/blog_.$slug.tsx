import { createFileRoute } from "@tanstack/react-router";
import { BlogPostPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/blog_/$slug")({
  head: ({ params }) =>
    pageHead(
      params.slug.replaceAll("-", " "),
      "Explore " + params.slug.replaceAll("-", " ") + " with Sanmitra Solar.",
      "/blog/" + params.slug,
    ),
  component: Page,
});
function Page() {
  const { slug } = Route.useParams();
  return <BlogPostPage slug={slug} />;
}
