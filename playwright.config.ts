import { defineConfig, devices } from "@playwright/test";

/**
 * Acceptance tests run against the Vite dev server.
 * `npm test` starts the server for you (or reuses one already on :5173).
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: /\.spec\.ts$/,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5174",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
  ],
  /**
   * Tests get their own server on their own port.
   *
   * The app requires sign-in by default, but acceptance.spec.ts expects the
   * dashboard immediately on load and must not be edited, so this server runs
   * with the gate off. It deliberately does NOT share port 5173 with
   * `npm run dev`: reusing a dev server started without that variable leaves
   * every test sitting on the login screen.
   */
  webServer: {
    command: "npm run dev -- --port 5174",
    url: "http://localhost:5174",
    reuseExistingServer: false,
    env: { VITE_REQUIRE_AUTH: "false" },
    timeout: 60_000,
  },
});
