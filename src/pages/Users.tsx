import { useState } from "react";
import type { User } from "../types";
import { formatDate, initials } from "../format";
import { Badge } from "../components/Badge";
import { UserForm, type UserDraft } from "../components/UserForm";
import { ConfirmDialog } from "../components/ConfirmDialog";

/** null = the form is closed; "new" = creating; a User = editing that user. */
type FormState = null | "new" | User;

export function Users({ users, onChange }: { users: User[]; onChange: (next: User[]) => void }) {
  const [form, setForm] = useState<FormState>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);

  function save(draft: UserDraft) {
    if (form && form !== "new") {
      const id = form.id;
      onChange(users.map((u) => (u.id === id ? { ...u, ...draft } : u)));
    } else {
      onChange([
        ...users,
        {
          id: `usr-${crypto.randomUUID().slice(0, 8)}`,
          ...draft,
          status: "Invited",
          createdAt: new Date().toISOString().slice(0, 10),
          lastLoginAt: null,
        },
      ]);
    }
    setForm(null);
  }

  function confirmDelete() {
    if (pendingDelete) onChange(users.filter((u) => u.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  return (
    <div data-testid="users-page">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Users</h2>
            <p className="mt-1 text-sm text-muted">
              {users.length} {users.length === 1 ? "person" : "people"}
            </p>
          </div>
          <button
            type="button"
            data-testid="user-create"
            onClick={() => setForm("new")}
            className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-on-accent transition hover:bg-brand-500"
          >
            New user
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table data-testid="users-table" className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-sm font-medium text-muted">
                <th scope="col" className="py-3 pr-4">Name</th>
                <th scope="col" className="py-3 pr-4">Email</th>
                <th scope="col" className="py-3 pr-4">Role</th>
                <th scope="col" className="py-3 pr-4">Team</th>
                <th scope="col" className="py-3 pr-4">Status</th>
                <th scope="col" className="py-3 pr-4">Last login</th>
                <th scope="col" className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  data-testid="user-row"
                  data-user-id={u.id}
                  className={`border-b border-line/70 last:border-0 ${
                    form !== "new" && form?.id === u.id ? "bg-brand-50" : ""
                  }`}
                >
                  <td className="py-3.5 pr-4">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600"
                      >
                        {initials(u.name)}
                      </span>
                      <span className="font-semibold">{u.name}</span>
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">{u.email}</td>
                  <td className="py-3.5 pr-4">{u.role}</td>
                  <td className="py-3.5 pr-4">{u.team}</td>
                  <td className="py-3.5 pr-4">
                    <Badge label={u.status} />
                  </td>
                  <td className="py-3.5 pr-4 text-muted">{formatDate(u.lastLoginAt)}</td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      data-testid="user-edit"
                      onClick={() => setForm(u)}
                      aria-label={`Edit ${u.name}`}
                      className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold transition hover:bg-canvas"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      data-testid="user-delete"
                      onClick={() => setPendingDelete(u)}
                      aria-label={`Delete ${u.name}`}
                      className="ml-2 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-bad transition hover:bg-bad-soft"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {form && (
        <UserForm
          // Remount when the target changes so the fields re-prefill.
          key={form === "new" ? "new" : form.id}
          user={form === "new" ? null : form}
          onSave={save}
          onCancel={() => setForm(null)}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete user?"
          message={`${pendingDelete.name} will be removed from PulseBoard. This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
