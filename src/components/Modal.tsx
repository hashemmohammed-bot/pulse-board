import { useEffect, type ReactNode } from "react";

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
 * Centred modal card. The caller renders it only while it is open, so a closed
 * modal is absent from the DOM. Escape and a backdrop click both close it.
 */
export function Modal({ eyebrow, title, onClose, testId, closeTestId, children }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-scrim p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        data-testid={testId}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        // The backdrop closes on click; the card must not pass its own clicks up.
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-line bg-surface px-8 py-7 shadow-[0_24px_70px_rgba(15,18,32,0.28)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            data-testid={closeTestId}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-xl leading-none text-ink transition hover:bg-canvas focus-visible:outline-2 focus-visible:outline-brand-600"
          >
            &#10005;
          </button>
        </div>
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}
