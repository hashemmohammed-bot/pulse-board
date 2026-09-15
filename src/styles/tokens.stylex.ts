import * as stylex from "@stylexjs/stylex";

/**
 * The PulseBoard palette, as StyleX variables.
 *
 * Defaults are the light values and the media query supplies dark, so the page
 * is themed before any JavaScript runs. `themes.ts` then applies an explicit
 * theme once the app knows what the visitor chose.
 */
const DARK = "@media (prefers-color-scheme: dark)";

export const colors = stylex.defineVars({
  canvas: { default: "#eceef4", [DARK]: "#0f1117" },
  surface: { default: "#ffffff", [DARK]: "#171a21" },
  line: { default: "#e3e6ef", [DARK]: "#272c37" },
  ink: { default: "#16181d", [DARK]: "#e8eaf0" },
  muted: { default: "#6b7280", [DARK]: "#9aa1ad" },
  /** Text sitting on a filled brand or danger surface. */
  onAccent: { default: "#ffffff", [DARK]: "#0f1117" },
  scrim: { default: "rgba(15,18,32,0.10)", [DARK]: "rgba(0,0,0,0.55)" },

  brand50: { default: "#eeeefc", [DARK]: "#21244a" },
  brand100: { default: "#e0e0fa", [DARK]: "#2c2f5e" },
  brand500: { default: "#5b5bd6", [DARK]: "#8f8ff5" },
  brand600: { default: "#4f46e5", [DARK]: "#a5a5f8" },

  good: { default: "#15803d", [DARK]: "#4ade80" },
  goodSoft: { default: "#dcfce7", [DARK]: "#14301f" },
  bad: { default: "#b91c1c", [DARK]: "#f87171" },
  badSoft: { default: "#fee2e2", [DARK]: "#3a1c1c" },
  warn: { default: "#a16207", [DARK]: "#fbbf24" },
  warnSoft: { default: "#fef3c7", [DARK]: "#3a2e10" },

  chartBar: { default: "#9aa2e8", [DARK]: "#7f86dd" },
  chartTarget: { default: "#c2660d", [DARK]: "#f0932b" },
});

export const radius = stylex.defineVars({
  sm: "8px",
  md: "12px",
  lg: "16px",
  full: "999px",
});

export const font = stylex.defineVars({
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
});
