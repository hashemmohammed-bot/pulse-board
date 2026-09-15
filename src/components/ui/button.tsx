import type { ComponentProps } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
    fontWeight: 600,
    borderRadius: radius.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    cursor: "pointer",
    transitionProperty: "background-color, color, border-color",
    transitionDuration: "150ms",
    outline: {
      default: "none",
      ":focus-visible": `2px solid ${colors.brand500}`,
    },
    outlineOffset: "2px",
  },
  default: {
    backgroundColor: { default: colors.brand600, ":hover": colors.brand500 },
    color: colors.onAccent,
  },
  outline: {
    backgroundColor: { default: colors.surface, ":hover": colors.canvas },
    color: colors.ink,
    borderColor: colors.line,
  },
  destructive: {
    backgroundColor: colors.bad,
    color: colors.onAccent,
    opacity: { default: 1, ":hover": 0.9 },
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover": colors.canvas },
    color: colors.muted,
  },
  md: { paddingBlock: "10px", paddingInline: "20px", fontSize: "16px" },
  sm: { paddingBlock: "6px", paddingInline: "12px", fontSize: "14px" },
  icon: { height: "40px", width: "40px", padding: 0, fontSize: "18px", flexShrink: 0 },
});

export type ButtonVariant = "default" | "outline" | "destructive" | "ghost";
export type ButtonSize = "md" | "sm" | "icon";

export type ButtonProps = Omit<ComponentProps<"button">, "style" | "className"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Extra StyleX styles from the call site. */
  sx?: stylex.StyleXStyles;
};

export function Button({
  variant = "default",
  size = "md",
  sx,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      {...stylex.props(styles.base, styles[variant], styles[size], sx)}
    />
  );
}
