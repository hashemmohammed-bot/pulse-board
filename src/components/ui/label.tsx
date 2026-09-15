import type { ComponentProps } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/styles/tokens.stylex";

const styles = stylex.create({
  label: {
    display: "inline-block",
    fontSize: "14px",
    color: colors.muted,
  },
});

export type LabelProps = Omit<ComponentProps<"label">, "style" | "className"> & {
  sx?: stylex.StyleXStyles;
};

export function Label({ sx, ...props }: LabelProps) {
  // This is the generic primitive; every call site passes htmlFor, which the rule cannot see.
  // oxlint-disable-next-line jsx-a11y/label-has-associated-control
  return <label {...props} {...stylex.props(styles.label, sx)} />;
}
