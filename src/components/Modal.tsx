import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
 * Centred modal built on the shadcn Dialog. Radix supplies role="dialog", the
 * focus trap, Escape and the backdrop click, so this only adds the header
 * layout and the testids the acceptance suite looks for.
 *
 * The caller renders it only while it is open, hence open={true} with onClose
 * wired to Radix's dismiss events.
 */
export function Modal({ eyebrow, title, onClose, testId, closeTestId, children }: ModalProps) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-testid={testId}
        showCloseButton={false}
        className="max-h-[90vh] gap-0 overflow-y-auto rounded-2xl border-line bg-surface px-8 py-7 sm:max-w-[560px]"
      >
        <DialogHeader className="flex-row items-start justify-between gap-4 space-y-0 text-left">
          <div>
            <DialogDescription className="text-sm text-muted">{eyebrow}</DialogDescription>
            <DialogTitle className="mt-1 text-2xl font-bold tracking-tight">{title}</DialogTitle>
          </div>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              data-testid={closeTestId}
              aria-label="Close"
              className="h-10 w-10 shrink-0 rounded-xl text-xl leading-none"
            >
              <span aria-hidden="true">&#10005;</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="mt-7">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
