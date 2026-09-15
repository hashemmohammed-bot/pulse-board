import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "./tokens.stylex";

/** Layout pieces repeated across the dashboard and Users pages. */
const shared = stylex.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.line,
    padding: "24px",
  },
  cardTitle: { margin: 0, fontSize: "18px", fontWeight: 700, letterSpacing: "-0.01em" },
  cardSubtitle: { margin: 0, marginTop: "4px", fontSize: "14px", color: colors.muted },
  sectionHead: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "16px",
  },
  stack: { display: "flex", flexDirection: "column", gap: "24px" },
  muted: { color: colors.muted },
  numeric: { textAlign: "right", fontVariantNumeric: "tabular-nums" },
  right: { textAlign: "right" },
  pr: { paddingRight: "16px" },
});

export const {
  card,
  cardTitle,
  cardSubtitle,
  sectionHead,
  stack,
  muted,
  numeric,
  right,
  pr,
} = shared;
