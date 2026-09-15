export type Theme = "light" | "dark";

const STORAGE_KEY = "pulseboard.theme.v1";

/** What the OS asks for, used until the visitor picks a side themselves. */
export function systemTheme(): Theme {
  return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** The visitor's stored choice, or null if they have not made one. */
export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

/**
 * `data-theme` is also written by an inline script in index.html so the first
 * paint is already themed; this keeps the attribute in sync afterwards.
 */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // A remembered theme is a nicety, not a requirement.
  }
}
