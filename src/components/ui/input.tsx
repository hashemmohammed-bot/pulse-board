import type { ComponentProps } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";

const styles = stylex.create({
  input: {
    width: "100%",
    height: "44px",
    paddingInline: "16px",
    fontSize: "16px",
    fontFamily: "inherit",
    color: colors.ink,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: { default: colors.line, ":focus": colors.brand500 },
    outline: "none",
    boxShadow: { default: null, ":focus": `0 0 0 3px ${colors.brand100}` },
  },
  invalid: {
    borderColor: colors.bad,
    boxShadow: `0 0 0 3px ${colors.badSoft}`,
  },
});

export type InputProps = Omit<ComponentProps<"input">, "style" | "className"> & {
  invalid?: boolean;
  sx?: stylex.StyleXStyles;
};

export function Input({ invalid, sx, ...props }: InputProps) {
  return <input {...props} {...stylex.props(styles.input, invalid && styles.invalid, sx)} />;
}
