import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { User, UserRole } from "@/types";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLES: UserRole[] = ["Admin", "Manager", "Viewer"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UserDraft {
  name: string;
  email: string;
  role: UserRole;
  team: string;
}

type FieldError = { field: "name" | "email"; message: string } | null;

const FIELD = "mt-1.5 h-11 w-full rounded-xl bg-surface text-base";

export function UserForm({
  user,
  onSave,
  onCancel,
}: {
  /** null when creating. */
  user: User | null;
  onSave: (draft: UserDraft) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState<UserDraft>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "Viewer",
    team: user?.team ?? "",
  });
  // Rendered only after a failed submit, so `form-error` is absent until then.
  const [error, setError] = useState<FieldError>(null);

  const set = (patch: Partial<UserDraft>) => setDraft((d) => ({ ...d, ...patch }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) {
      setError({ field: "name", message: t("userForm.errors.name") });
      return;
    }
    if (!EMAIL.test(draft.email.trim())) {
      setError({ field: "email", message: t("userForm.errors.email") });
      return;
    }
    setError(null);
    onSave({
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim(),
      team: draft.team.trim(),
    });
  }

  const errorFor = (field: "name" | "email") =>
    error?.field === field ? (
      <p data-testid="form-error" role="alert" className="mt-1.5 text-sm text-bad">
        {error.message}
      </p>
    ) : null;

  const ring = (field: "name" | "email") =>
    error?.field === field ? " border-bad ring-2 ring-bad-soft" : "";

  return (
    <Modal
      eyebrow={user ? t("userForm.eyebrowEdit") : t("userForm.eyebrowNew")}
      title={user ? user.name : t("userForm.titleNew")}
      onClose={onCancel}
      testId="user-dialog"
    >
      <form data-testid="user-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div>
          <Label htmlFor="user-name" className="text-sm text-muted">
            {t("userForm.name")}
          </Label>
          <Input
            id="user-name"
            name="name"
            value={draft.name}
            onChange={(e) => set({ name: e.target.value })}
            className={FIELD + ring("name")}
          />
          {errorFor("name")}
        </div>

        <div>
          <Label htmlFor="user-email" className="text-sm text-muted">
            {t("userForm.email")}
          </Label>
          <Input
            id="user-email"
            name="email"
            type="text"
            value={draft.email}
            onChange={(e) => set({ email: e.target.value })}
            className={FIELD + ring("email")}
          />
          {errorFor("email")}
        </div>

        <div>
          <Label htmlFor="user-role" className="text-sm text-muted">
            {t("userForm.role")}
          </Label>
          {/*
            Deliberately a native <select>: the acceptance test drives it with
            selectOption(), which needs a real <select name="role"> element and
            would fail against the Radix-based shadcn Select.
          */}
          <select
            id="user-role"
            name="role"
            value={draft.role}
            onChange={(e) => set({ role: e.target.value as UserRole })}
            className="mt-1.5 h-11 w-full rounded-xl border border-input bg-surface px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="user-team" className="text-sm text-muted">
            {t("userForm.team")}
          </Label>
          <Input
            id="user-team"
            name="team"
            value={draft.team}
            onChange={(e) => set({ team: e.target.value })}
            className={FIELD}
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            data-testid="user-cancel"
            onClick={onCancel}
            className="rounded-xl px-5"
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" data-testid="user-save" className="rounded-xl px-5">
            {user ? t("userForm.save") : t("userForm.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
