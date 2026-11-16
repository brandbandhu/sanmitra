import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/contact")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    service?: string | undefined;
    bill?: string | undefined;
    estimate?: string | undefined;
  } => ({
    service: typeof search["service"] === "string" ? search["service"] : undefined,
    bill: typeof search["bill"] === "string" ? search["bill"] : undefined,
    estimate:
      typeof search["estimate"] === "string" ? search["estimate"].slice(0, 1000) : undefined,
  }),
  head: () =>
    pageHead(
      "Get a free consultation",
      "Tell Sanmitra Solar about your property and energy needs.",
      "/contact",
    ),
  component: Page,
});
function Page() {
  const search = Route.useSearch();
  return <ContactPage {...search} />;
}
