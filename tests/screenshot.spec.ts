import { test } from "@playwright/test";

/**
 * Not an acceptance test. `npm run screenshot` captures the current UI at the
 * viewports the design was drawn for, so you can compare against design/.
 */
const viewports = [
  { name: "desktop-1280x800", width: 1280, height: 800 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "mobile-375x812", width: 375, height: 812 },
];

for (const vp of viewports) {
  test(`screenshot ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `screenshots/${vp.name}.png`, fullPage: true });
  });
}

test("screenshot login-1280x800", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  // The gate is disabled for tests, so ask for the screen explicitly.
  await page.goto("/?login=1");
  await page.getByTestId("login-form").waitFor();
  await page.screenshot({ path: "screenshots/login-1280x800.png" });
});

test("screenshot desktop-dialog-1280x800", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.locator('[data-account-id="acc-007"]').click();
  await page.getByTestId("detail-drawer").waitFor();
  await page.screenshot({ path: "screenshots/desktop-dialog-1280x800.png" });
});

test("screenshot users-1280x800", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByTestId("nav-users").click();
  await page.getByTestId("users-page").waitFor();
  await page.screenshot({ path: "screenshots/users-1280x800.png", fullPage: true });
});

test("screenshot users-edit-1280x800", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByTestId("nav-users").click();
  await page.locator('[data-user-id="usr-006"]').getByTestId("user-edit").click();
  const form = page.getByTestId("user-form");
  await form.locator('[name="email"]').fill("amara.okafor@pulseboard");
  await page.getByTestId("user-save").click();
  await page.getByTestId("form-error").waitFor();
  await page.screenshot({ path: "screenshots/users-edit-1280x800.png" });
});

test("screenshot dark-desktop-1280x800", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.locator('[data-account-id="acc-007"]').click();
  await page.getByTestId("detail-drawer").waitFor();
  // Clicking the row scrolls it into view; go back up so the KPI row and chart show.
  await page.evaluate(() => window.scrollTo(0, 0));
  // Let the chart's entry animation finish before capturing.
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "screenshots/dark-desktop-1280x800.png" });
});

test("screenshot dark-users-1280x800", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByTestId("nav-users").click();
  await page.getByTestId("users-page").waitFor();
  await page.screenshot({ path: "screenshots/dark-users-1280x800.png" });
});

test("screenshot users-mobile-375x812", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByTestId("nav-users").click();
  await page.getByTestId("users-page").waitFor();
  await page.screenshot({ path: "screenshots/users-mobile-375x812.png", fullPage: true });
});
