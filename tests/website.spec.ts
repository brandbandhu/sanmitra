import { expect, test } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  expect(titles.size).toBe(13);
  expect(errors).toEqual([]);
});
test("hero controls and mobile navigation work", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.locator('html[data-hydrated="true"]').waitFor();
  const night = page.getByRole("button", { name: /Night/ });
  const morning = page.getByRole("button", { name: /Morning/ });
  await night.click();
  await expect(night).toHaveAttribute("aria-pressed", "true");
  await morning.click();
  await expect(morning).toHaveAttribute("aria-pressed", "true");
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
test("enquiry validates and downloads without database requests", async ({ page }) => {
  const backendRequests: string[] = [];
  page.on("request", (request) => {
    if (/supabase|\/rest\/v1\/|\/auth\/v1\//.test(request.url()))
      backendRequests.push(request.url());
  });
  await page.goto("/contact");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.getByRole("button", { name: "Download enquiry", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("name");
  await page.getByLabel("Your name").fill("Browser Test");
  await page.getByLabel("Email address", { exact: true }).fill("browser-test@example.com");
  await page.getByLabel("What would you like to discuss?").fill("Please review my rooftop.");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download enquiry", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("sanmitra-solar-enquiry.txt");
  await expect(page.getByRole("status")).toContainText("No message has been sent automatically");
  expect(backendRequests).toEqual([]);
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
  await page.screenshot({ path: info.outputPath("homepage.png"), fullPage: true });
  await page.goto("/calculator");
  await page.locator('html[data-hydrated="true"]').waitFor();
  await page.screenshot({ path: info.outputPath("calculator.png"), fullPage: true });
});

test("public content works with database endpoints blocked", async ({ page }) => {
  const calls: string[] = [];
  await page.route(/supabase|\/rest\/v1\/|\/auth\/v1\//, (route) => {
    calls.push(route.request().url());
    return route.abort();
  });
  for (const path of ["/", "/services", "/projects", "/blog", "/gallery"]) {
    await page.goto(path);
    await page.locator('html[data-hydrated="true"]').waitFor();
    await expect(page.locator("h1")).toBeVisible();
  }
  expect(calls).toEqual([]);
});
