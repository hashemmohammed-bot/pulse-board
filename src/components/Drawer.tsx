import { useEffect, type ReactNode } from "react";

interface DrawerProps {
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
 * Right-hand slide-in panel. The caller renders it only while it is open, so a
 * closed drawer is absent from the DOM. Escape always closes it.
 */
export function Drawer({ eyebrow, title, onClose, testId, closeTestId, children }: DrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-scrim"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        data-testid={testId}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col overflow-y-auto bg-surface px-8 py-7 shadow-[0_0_40px_rgba(15,18,32,0.18)]"
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
      </aside>
    </>
  );
}
