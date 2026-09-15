import type { ComponentProps } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    borderRadius: radius.full,
    paddingBlock: "4px",
    paddingInline: "12px",
    fontSize: "14px",
    fontWeight: 600,
  },
  neutral: { backgroundColor: colors.canvas, color: colors.muted },
  success: { backgroundColor: colors.goodSoft, color: colors.good },
  warning: { backgroundColor: colors.warnSoft, color: colors.warn },
  danger: { backgroundColor: colors.badSoft, color: colors.bad },
  info: { backgroundColor: colors.brand50, color: colors.brand600 },
});

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

export type BadgeProps = Omit<ComponentProps<"span">, "style" | "className"> & {
  tone?: BadgeTone;
  sx?: stylex.StyleXStyles;
};

export function Badge({ tone = "neutral", sx, ...props }: BadgeProps) {
  return <span {...props} {...stylex.props(styles.base, styles[tone], sx)} />;
}
