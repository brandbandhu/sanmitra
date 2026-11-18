import type { ComponentType } from "react";
import { useParams, useSearchParams, type RouteObject } from "react-router";
import { AppLayout, NotFoundPage } from "./app";
import {
  AboutPage,
  BlogPage,
  BlogPostPage,
  CalculatorPage,
  ContactPage,
  GalleryPage,
  HomePage,
  ProjectDetailPage,
  ProjectsPage,
  ServiceDetailPage,
  ServicesPage,
} from "@/components/solar-site";
import { PageMetadata } from "@/lib/seo";

function contentRoute(
  path: string,
  Page: ComponentType,
  title: string,
  description: string,
): RouteObject {
  return {
    path,
    element: (
      <>
        <PageMetadata title={title} description={description} />
        <Page />
      </>
    ),
  };
}

function DetailRoute({ Page }: { Page: ComponentType<{ slug: string }> }) {
  const { slug = "" } = useParams();
  const title = slug.replaceAll("-", " ");

  return (
    <>
      <PageMetadata title={title} description={`Explore ${title} with Sanmitra Solar.`} />
      <Page slug={slug} />
    </>
  );
}

function ContactRoute() {
  const [search] = useSearchParams();
  return (
    <ContactPage
      service={search.get("service") ?? undefined}
      bill={search.get("bill") ?? undefined}
      estimate={search.get("estimate")?.slice(0, 1000)}
    />
  );
}

export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      contentRoute(
        "/",
        HomePage,
        "Power Your Home. Brighten Your Future.",
        "Explore thoughtful solar solutions for homes and businesses with Sanmitra Solar.",
      ),
      contentRoute(
        "/about",
        AboutPage,
        "Our story",
        "A thoughtful approach to solar energy, shaped around your property.",
      ),
      contentRoute(
        "/services",
        ServicesPage,
        "Solar solutions",
        "Explore solar pathways for residential, commercial and industrial properties.",
      ),
      { path: "/services/:slug", element: <DetailRoute Page={ServiceDetailPage} /> },
      { path: "/solutions/:slug", element: <DetailRoute Page={ServiceDetailPage} /> },
      contentRoute(
        "/projects",
        ProjectsPage,
        "Our projects",
        "Explore Sanmitra Solar project stories and clearly labelled design concepts.",
      ),
      { path: "/projects/:slug", element: <DetailRoute Page={ProjectDetailPage} /> },
      contentRoute(
        "/gallery",
        GalleryPage,
        "Solar gallery",
        "Explore rooftop solar photography and installation ideas.",
      ),
      contentRoute(
        "/blog",
        BlogPage,
        "Solar insights",
        "Practical guidance to help you prepare for a considered solar decision.",
      ),
      { path: "/blog/:slug", element: <DetailRoute Page={BlogPostPage} /> },
      contentRoute(
        "/calculator",
        CalculatorPage,
        "Solar savings calculator",
        "Estimate system size, generation, annual savings and environmental impact using transparent assumptions.",
      ),
      contentRoute(
        "/contact",
        ContactRoute,
        "Get a free consultation",
        "Tell Sanmitra Solar about your property and energy needs.",
      ),
      contentRoute("*", NotFoundPage, "Page not found", "This page could not be found."),
    ],
  },
];
