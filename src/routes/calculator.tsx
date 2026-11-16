import { createFileRoute } from "@tanstack/react-router";
import { CalculatorPage } from "@/components/solar-site";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/calculator")({
  head: () =>
    pageHead(
      "Solar savings calculator",
      "Estimate system size, generation, annual savings and environmental impact using transparent assumptions.",
      "/calculator",
    ),
  component: CalculatorPage,
});
