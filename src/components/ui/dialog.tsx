import type { ComponentProps, ReactNode } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";

/**
 * Thin StyleX skin over the Radix dialog. Radix supplies role="dialog", the
 * focus trap, Escape and the backdrop click; this file only styles them.
 */
const styles = stylex.create({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    backgroundColor: colors.scrim,
  },
  content: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 50,
    width: "calc(100% - 32px)",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflowY: "auto",
    backgroundColor: colors.surface,
    color: colors.ink,
    borderRadius: radius.lg,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.line,
    paddingInline: "32px",
    paddingBlock: "28px",
    boxShadow: "0 24px 70px rgba(15,18,32,0.28)",
  },
  narrow: { maxWidth: "448px" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" },
  eyebrow: { margin: 0, fontSize: "14px", color: colors.muted },
  title: { margin: 0, marginTop: "4px", fontSize: "24px", fontWeight: 700, letterSpacing: "-0.01em" },
  body: { marginTop: "28px" },
});

export const Dialog = DialogPrimitive.Root;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  children,
  narrow,
  ...props
}: Omit<ComponentProps<typeof DialogPrimitive.Content>, "style" | "className"> & {
  narrow?: boolean;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay {...stylex.props(styles.overlay)} />
      <DialogPrimitive.Content {...props} {...stylex.props(styles.content, narrow && styles.narrow)}>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.header)}>{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <DialogPrimitive.Title {...stylex.props(styles.title)}>{children}</DialogPrimitive.Title>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return (
    <DialogPrimitive.Description {...stylex.props(styles.eyebrow)}>
      {children}
    </DialogPrimitive.Description>
  );
}

export function DialogBody({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.body)}>{children}</div>;
}
