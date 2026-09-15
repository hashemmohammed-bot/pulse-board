/**
 * Mock sign-in for the workshop build.
 *
 * There is no backend: the credential below is compared in the browser and the
 * resulting "session" is a string in localStorage. This demonstrates the flow
 * and provides NO security whatsoever — anyone can read the credential from the
 * bundle or set the storage key by hand. Do not model a real login on this.
 */

const SESSION_KEY = "pulseboard.session.v1";

const DEMO_USERNAME = "root";
const DEMO_PASSWORD = "root";

/** Shown on the login screen so the workshop audience can get in. */
export const DEMO_HINT = `${DEMO_USERNAME} / ${DEMO_PASSWORD}`;

/**
 * The gate is on by default. `playwright.config.ts` starts its dev server with
 * VITE_REQUIRE_AUTH=false, because the acceptance suite expects the dashboard
 * immediately on load and that file cannot be edited.
 */
export const AUTH_REQUIRED = import.meta.env.VITE_REQUIRE_AUTH !== "false";

export function verifyCredentials(username: string, password: string): boolean {
  return username.trim().toLowerCase() === DEMO_USERNAME && password === DEMO_PASSWORD;
}

export function readSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function startSession(username: string) {
  try {
    localStorage.setItem(SESSION_KEY, username.trim());
  } catch {
    // Storage can be blocked; the session then lasts only for this page view.
  }
}

export function endSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clean up if storage was never writable.
  }
}
