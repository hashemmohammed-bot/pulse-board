import type { ComponentProps } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors } from "@/styles/tokens.stylex";

const styles = stylex.create({
  scroller: { width: "100%", overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "16px",
    color: colors.ink,
  },
  headRow: { borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: colors.line },
  row: {
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  head: { paddingBlock: "12px", fontSize: "14px", fontWeight: 500, color: colors.muted },
  cell: { paddingBlock: "14px" },
});

type Sx = { sx?: stylex.StyleXStyles };
type Clean<T extends keyof React.JSX.IntrinsicElements> = Omit<
  ComponentProps<T>,
  "style" | "className"
> &
  Sx;

/** The scroll container is a wrapper; the testid goes on the <table> itself. */
export function Table({ sx, ...props }: Clean<"table">) {
  return (
    <div {...stylex.props(styles.scroller)}>
      <table {...props} {...stylex.props(styles.table, sx)} />
    </div>
  );
}

export function TableHeader({ sx, ...props }: Clean<"thead">) {
  return <thead {...props} {...stylex.props(sx)} />;
}

export function TableBody({ sx, ...props }: Clean<"tbody">) {
  return <tbody {...props} {...stylex.props(sx)} />;
}

export function TableRow({ sx, head, ...props }: Clean<"tr"> & { head?: boolean }) {
  return <tr {...props} {...stylex.props(head ? styles.headRow : styles.row, sx)} />;
}

export function TableHead({ sx, ...props }: Clean<"th">) {
  return <th scope="col" {...props} {...stylex.props(styles.head, sx)} />;
}

export function TableCell({ sx, ...props }: Clean<"td">) {
  return <td {...props} {...stylex.props(styles.cell, sx)} />;
}
