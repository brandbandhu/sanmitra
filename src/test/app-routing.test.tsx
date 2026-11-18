import { matchRoutes } from "react-router";
import { describe, expect, it } from "vitest";

import { routes } from "@/router";

describe("App routing", () => {
  it.each([
    "/",
    "/about",
    "/services",
    "/services/residential",
    "/solutions/residential",
    "/solutions/commercial",
    "/solutions/industrial",
    "/projects",
    "/projects/concept-courtyard-home",
    "/gallery",
    "/blog",
    "/blog/prepare-your-roof-for-solar",
    "/calculator",
    "/contact",
  ])("matches %s to a content route", (path) => {
    const match = matchRoutes(routes, path)?.at(-1);
    expect(match?.route.path).toBeDefined();
    expect(match?.route.path).not.toBe("*");
  });
});
