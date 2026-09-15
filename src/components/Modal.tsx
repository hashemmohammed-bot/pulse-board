import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const styles = stylex.create({
  close: { fontSize: "20px", lineHeight: 1 },
});

interface ModalProps {
  /** Small label above the title, e.g. "Account". */
  eyebrow: string;
  title: string;
  onClose: () => void;
  testId: string;
  /** Set only where the acceptance test clicks the X itself. */
  closeTestId?: string;
  children: ReactNode;
}

/**
 * Centred modal. The caller renders it only while it is open, hence `open`
 * with onClose wired to Radix's dismiss events.
 */
export function Modal({ eyebrow, title, onClose, testId, closeTestId, children }: ModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent data-testid={testId} aria-label={title}>
        <DialogHeader>
          <div>
            <DialogDescription>{eyebrow}</DialogDescription>
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogClose asChild>
            <Button
              variant="outline"
              size="icon"
              data-testid={closeTestId}
              aria-label={t("common.close")}
              sx={styles.close}
            >
              <span aria-hidden="true">&#10005;</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}
