import { test, expect } from "@playwright/test";

test("html lang follows the language switch", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("accounts-table").waitFor();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByTestId("lang-fr").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("a corrupt user store falls back to the shipped dataset", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("pulseboard.users.v1", JSON.stringify([{ id: "usr-x" }]));
  });
  await page.goto("/");
  await page.getByTestId("nav-users").click();
  await expect(page.getByTestId("user-row")).toHaveCount(10);
});

test("creating a user works without crypto.randomUUID", async ({ page }) => {
  // Simulates a plain-http LAN address, where randomUUID is not available.
  await page.addInitScript(() => {
    // @ts-expect-error deliberately removing the API for the test
    delete window.crypto.randomUUID;
  });
  await page.goto("/");
  await page.getByTestId("nav-users").click();
  await page.getByTestId("user-create").click();
  await page.getByTestId("user-form").locator('[name="name"]').fill("Nadia Haddad");
  await page.getByTestId("user-form").locator('[name="email"]').fill("nadia@pulseboard.dev");
  await page.getByTestId("user-save").click();
  await expect(page.getByTestId("user-row")).toHaveCount(11);
});
