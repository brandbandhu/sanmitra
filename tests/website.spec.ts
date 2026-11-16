import { expect, test } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/rest/v1/**", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: [] });
    return route.continue();
  });
});
test("public routes render unique titles with no horizontal overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const titles = new Set<string>();
  for (const path of [
    "/",
    "/about",
    "/services",
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
    "/admin",
  ]) {
    await page.goto(path);
    await page.locator('html[data-hydrated="true"]').waitFor();
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      path,
    ).toBeTruthy();
    expect(await page.title()).toContain("Sanmitra Solar");
    titles.add(await page.title());
  }
  expect(titles.size).toBe(14);
  expect(errors).toEqual([]);
});
test("hero controls and mobile navigation work", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.getByRole("button", { name: "Show slide 2: Commercial solar" }).click();
  await expect(page.locator("h1")).toContainText("Smarter Energy");
  await page.getByRole("button", { name: "Next slide", exact: true }).click();
  await expect(page.locator("h1")).toContainText("Future Runs");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Savings estimate" })
      .click();
    await expect(page).toHaveURL(/calculator/);
  }
});
test("calculator roof limit and quote handoff preserve requirements", async ({ page }) => {
  await page.goto("/calculator");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.getByLabel("Monthly electricity bill", { exact: false }).first().fill("10000");
  await page.getByLabel("Usable rooftop area").fill("100");
  await page.getByLabel("Location", { exact: false }).fill("Pune");
  await expect(page.locator(".estimate-panel")).toContainText("1.0");
  await page.getByRole("link", { name: "Get a personalized assessment" }).click();
  await expect(page.getByLabel("Monthly electricity bill")).toHaveValue("10000");
  await expect(page.getByLabel("What would you like to discuss?")).toContainText("Pune");
  await expect(page.getByLabel("What would you like to discuss?")).toContainText(
    '"systemSizeKw":1',
  );
});
test("enquiry validates and handles backend failure then success", async ({ page }) => {
  await page.goto("/contact");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.getByRole("button", { name: "Send your enquiry" }).click();
  await expect(page.getByRole("alert")).toContainText("name");
  await page.getByLabel("Your name").fill("Browser Test");
  await page.getByLabel("Email address", { exact: true }).fill("browser-test@example.com");
  await page
    .getByLabel("What would you like to discuss?")
    .fill("Automated test: please do not persist.");
  await page.route("**/rest/v1/contact_requests", (route) =>
    route.fulfill({ status: 503, json: { message: "Unavailable" } }),
  );
  await page.getByRole("button", { name: "Send your enquiry" }).click();
  await expect(page.getByRole("alert")).toContainText("try again");
  let payload: Record<string, unknown> = {};
  await page.route("**/rest/v1/contact_requests", (route) => {
    payload = route.request().postDataJSON();
    return route.fulfill({ status: 201, body: "" });
  });
  await page.getByRole("button", { name: "Send your enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Thank you, Browser Test." })).toBeVisible();
  expect(payload.name).toBe("Browser Test");
});
test("project filters and article content work", async ({ page }) => {
  await page.goto("/projects");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.getByRole("button", { name: "Industrial", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.locator(".project-card").click();
  await expect(page.locator("h1")).toContainText("bigger ambition");
  await page.goto("/blog");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.getByRole("link", { name: /A good solar decision starts/ }).click();
  await expect(page.getByRole("heading", { name: "Ask for a structural review" })).toBeVisible();
});
test("gallery dialog closes with Escape and returns focus", async ({ page }) => {
  await page.goto("/gallery");
  await page.locator('html[data-hydrated="true"]').waitFor();
  const trigger = page.getByRole("button", { name: "Enlarge A home with a brighter outlook" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("captures homepage and calculator", async ({ page }, info) => {
  await page.goto("/");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.getByRole("button", { name: "Pause slideshow" }).click();
  await page.screenshot({ path: info.outputPath("homepage.png"), fullPage: true });
  await page.goto("/calculator");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.screenshot({ path: info.outputPath("calculator.png"), fullPage: true });
});

test("administrator editor creates, edits and deletes published services with an authorized API session", async ({
  page,
}) => {
  const user = {
    id: "00000000-0000-4000-8000-000000000001",
    aud: "authenticated",
    role: "authenticated",
    email: "admin@example.com",
    app_metadata: { provider: "email" },
    user_metadata: {},
    created_at: "2026-01-01T00:00:00Z",
  };
  await page.route("**/auth/v1/token**", (route) =>
    route.fulfill({
      json: {
        access_token: "test-access-token",
        refresh_token: "test-refresh-token",
        expires_in: 3600,
        token_type: "bearer",
        user,
      },
    }),
  );
  await page.route("**/auth/v1/user", (route) => route.fulfill({ json: user }));
  const services: Record<string, unknown>[] = [];
  await page.route("**/rest/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname.endsWith("/rpc/has_role")) return route.fulfill({ json: true });
    if (url.pathname.endsWith("/services")) {
      if (request.method() === "POST")
        services.push({ ...request.postDataJSON(), id: "service-test" });
      if (request.method() === "PATCH") Object.assign(services[0]!, request.postDataJSON());
      if (request.method() === "DELETE") services.splice(0);
      return route.fulfill({
        status: request.method() === "POST" ? 201 : 200,
        json: services,
        headers: { "content-range": `0-${Math.max(0, services.length - 1)}/${services.length}` },
      });
    }
    return route.fulfill({ json: [], headers: { "content-range": "0-0/0" } });
  });
  await page.goto("/admin");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.getByLabel("Email address", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("test-password-not-real");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("button", { name: "Services", exact: true }).click();
  await page.getByLabel("Service title").fill("Test rooftop assessment");
  await page.getByLabel("URL slug").fill("test-rooftop-assessment");
  await page.getByLabel("Summary").fill("Test service content, stored only in the browser test.");
  await page.getByLabel("Publish on website").check();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(
    page.getByRole("heading", { name: "Test rooftop assessment", exact: true }),
  ).toBeVisible();
  expect(services[0]?.["published"]).toBe(true);
  await page.getByRole("button", { name: "Edit Test rooftop assessment" }).click();
  await page.getByLabel("Service title").fill("Updated rooftop assessment");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(
    page.getByRole("heading", { name: "Updated rooftop assessment", exact: true }),
  ).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete content", exact: true }).click();
  await expect(page.getByText("No records yet.", { exact: true })).toBeVisible();
  expect(services).toHaveLength(0);
});
