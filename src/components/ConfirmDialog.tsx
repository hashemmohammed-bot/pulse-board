import { useEffect } from "react";

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-scrim px-4">
      <div
        data-testid="confirm-delete"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-2xl bg-surface p-7 shadow-[0_20px_60px_rgba(15,18,32,0.25)]"
      >
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            data-testid="confirm-no"
            onClick={onCancel}
            className="rounded-xl border border-line bg-surface px-5 py-2.5 font-semibold transition hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            type="button"
            data-testid="confirm-yes"
            onClick={onConfirm}
            className="rounded-xl bg-bad px-5 py-2.5 font-semibold text-on-accent transition hover:opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
