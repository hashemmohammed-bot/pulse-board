import { test, expect } from "@playwright/test";

/**
 * Not part of the acceptance contract.
 *
 * The dev server these tests run against has the gate disabled (see
 * playwright.config.ts), so the login screen is requested explicitly with
 * ?login=1. That exercises the same component, credential check and session
 * handling that VITE_REQUIRE_AUTH=true puts in front of the whole app.
 */
test.describe("sign-in", () => {
  test("blocks the dashboard until a valid credential is given", async ({ page }) => {
    await page.goto("/?login=1");

    const form = page.getByTestId("login-form");
    await expect(form).toBeVisible();
    await expect(page.getByTestId("accounts-table")).toBeHidden();
    await expect(page.getByTestId("login-error")).toBeHidden();

    // Empty submit reports the first missing field and signs nobody in.
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("login-error")).toBeVisible();
    await expect(page.getByTestId("accounts-table")).toBeHidden();

    // A wrong password is rejected.
    await form.locator('[name="email"]').fill("root");
    await form.locator('[name="password"]').fill("hunter2");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("login-error")).toContainText("Incorrect");
    await expect(page.getByTestId("accounts-table")).toBeHidden();

    // The demo credential gets in.
    await form.locator('[name="password"]').fill("root");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("accounts-table")).toBeVisible();
    await expect(page.getByTestId("session-user")).toContainText("root");
  });

  test("the session survives a reload, and signing out ends it", async ({ page }) => {
    await page.goto("/?login=1");
    await page.getByTestId("login-form").locator('[name="email"]').fill("root");
    await page.getByTestId("login-form").locator('[name="password"]').fill("root");
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("accounts-table")).toBeVisible();

    await page.reload();
    await expect(page.getByTestId("accounts-table")).toBeVisible();
    await expect(page.getByTestId("login-form")).toBeHidden();

    await page.getByTestId("logout").click();
    await expect(page.getByTestId("login-form")).toBeVisible();
    await expect(page.getByTestId("accounts-table")).toBeHidden();
  });
});
