import * as stylex from "@stylexjs/stylex";
import { colors } from "./tokens.stylex";

/**
 * Explicit themes, applied to the app root once the visitor's choice is known.
 * The variable defaults in tokens.stylex.ts already follow prefers-color-scheme,
 * so these only matter when someone overrides the system setting.
 */
export const lightTheme = stylex.createTheme(colors, {
  canvas: "#eceef4",
  surface: "#ffffff",
  line: "#e3e6ef",
  ink: "#16181d",
  muted: "#6b7280",
  onAccent: "#ffffff",
  scrim: "rgba(15,18,32,0.10)",

  brand50: "#eeeefc",
  brand100: "#e0e0fa",
  brand500: "#5b5bd6",
  brand600: "#4f46e5",

  good: "#15803d",
  goodSoft: "#dcfce7",
  bad: "#b91c1c",
  badSoft: "#fee2e2",
  warn: "#a16207",
  warnSoft: "#fef3c7",

  chartBar: "#9aa2e8",
  chartTarget: "#c2660d",
});

export const darkTheme = stylex.createTheme(colors, {
  canvas: "#0f1117",
  surface: "#171a21",
  line: "#272c37",
  ink: "#e8eaf0",
  muted: "#9aa1ad",
  onAccent: "#0f1117",
  scrim: "rgba(0,0,0,0.55)",

  brand50: "#21244a",
  brand100: "#2c2f5e",
  brand500: "#8f8ff5",
  brand600: "#a5a5f8",

  good: "#4ade80",
  goodSoft: "#14301f",
  bad: "#f87171",
  badSoft: "#3a1c1c",
  warn: "#fbbf24",
  warnSoft: "#3a2e10",

  chartBar: "#7f86dd",
  chartTarget: "#f0932b",
});
