import { useState } from "react";
import type { User, UserRole } from "../types";
import { Drawer } from "./Drawer";

const ROLES: UserRole[] = ["Admin", "Manager", "Viewer"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UserDraft {
  name: string;
  email: string;
  role: UserRole;
  team: string;
}

type FieldError = { field: "name" | "email"; message: string } | null;

const FIELD =
  "mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

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
      setError({ field: "name", message: "Name is required." });
      return;
    }
    if (!EMAIL.test(draft.email.trim())) {
      setError({ field: "email", message: "Enter a valid email address." });
      return;
    }
    setError(null);
    onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim(), team: draft.team.trim() });
  }

  const errorFor = (field: "name" | "email") =>
    error?.field === field ? (
      <p data-testid="form-error" role="alert" className="mt-1.5 text-sm text-bad">
        {error.message}
      </p>
    ) : null;

  const ring = (field: "name" | "email") => (error?.field === field ? " border-bad ring-2 ring-bad-soft" : "");

  return (
    <Drawer
      eyebrow={user ? "Edit user" : "New user"}
      title={user ? user.name : "Invite a teammate"}
      onClose={onCancel}
      testId="user-drawer"
    >
      <form data-testid="user-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div>
          <label htmlFor="user-name" className="text-sm text-muted">
            Name
          </label>
          <input
            id="user-name"
            name="name"
            value={draft.name}
            onChange={(e) => set({ name: e.target.value })}
            className={FIELD + ring("name")}
          />
          {errorFor("name")}
        </div>

        <div>
          <label htmlFor="user-email" className="text-sm text-muted">
            Email
          </label>
          <input
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
          <label htmlFor="user-role" className="text-sm text-muted">
            Role
          </label>
          <select
            id="user-role"
            name="role"
            value={draft.role}
            onChange={(e) => set({ role: e.target.value as UserRole })}
            className={FIELD}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="user-team" className="text-sm text-muted">
            Team
          </label>
          <input
            id="user-team"
            name="team"
            value={draft.team}
            onChange={(e) => set({ team: e.target.value })}
            className={FIELD}
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            data-testid="user-cancel"
            onClick={onCancel}
            className="rounded-xl border border-line bg-surface px-5 py-2.5 font-semibold transition hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="user-save"
            className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white transition hover:bg-brand-500"
          >
            {user ? "Save changes" : "Create user"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
