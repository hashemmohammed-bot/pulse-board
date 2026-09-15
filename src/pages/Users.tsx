import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { User } from "@/types";
import { formatDate, initials } from "@/format";
import { dateLocale } from "@/i18n";
import { useAppState } from "@/app-context";
import { StatusBadge } from "@/components/StatusBadge";
import { UserForm, type UserDraft } from "@/components/UserForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** null = the form is closed; "new" = creating; a User = editing that user. */
type FormState = null | "new" | User;

const COLUMNS = ["name", "email", "role", "team", "status", "lastLogin", "actions"] as const;

export function Users() {
  const { t, i18n } = useTranslation();
  const { users, setUsers } = useAppState();
  const [form, setForm] = useState<FormState>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const locale = dateLocale(i18n.resolvedLanguage ?? "en");

  function save(draft: UserDraft) {
    if (form && form !== "new") {
      const id = form.id;
      setUsers(users.map((u) => (u.id === id ? { ...u, ...draft } : u)));
    } else {
      setUsers([
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
    if (pendingDelete) setUsers(users.filter((u) => u.id !== pendingDelete.id));
    setPendingDelete(null);
  }

  return (
    <div data-testid="users-page">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">{t("users.title")}</h2>
            <p className="mt-1 text-sm text-muted">{t("users.count", { count: users.length })}</p>
          </div>
          <Button
            type="button"
            data-testid="user-create"
            onClick={() => setForm("new")}
            className="rounded-xl px-5"
          >
            {t("users.new")}
          </Button>
        </div>

        <div className="mt-4">
          <Table data-testid="users-table" className="min-w-[820px] text-left">
            <TableHeader>
              <TableRow className="border-line hover:bg-transparent">
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col}
                    className={`text-sm font-medium text-muted ${
                      col === "actions" ? "text-right" : "pr-4"
                    }`}
                  >
                    {t(`users.columns.${col}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.id}
                  data-testid="user-row"
                  data-user-id={u.id}
                  className={`border-line/70 ${
                    form !== "new" && form?.id === u.id ? "bg-brand-50" : ""
                  }`}
                >
                  <TableCell className="py-3.5 pr-4">
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600"
                      >
                        {initials(u.name)}
                      </span>
                      <span className="font-semibold">{u.name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 pr-4">{u.email}</TableCell>
                  <TableCell className="py-3.5 pr-4">{u.role}</TableCell>
                  <TableCell className="py-3.5 pr-4">{u.team}</TableCell>
                  <TableCell className="py-3.5 pr-4">
                    <StatusBadge label={u.status} />
                  </TableCell>
                  <TableCell className="py-3.5 pr-4 text-muted">
                    {formatDate(u.lastLoginAt, locale)}
                  </TableCell>
                  <TableCell className="py-3.5 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      data-testid="user-edit"
                      onClick={() => setForm(u)}
                      aria-label={t("users.editLabel", { name: u.name })}
                    >
                      {t("users.edit")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      data-testid="user-delete"
                      onClick={() => setPendingDelete(u)}
                      aria-label={t("users.deleteLabel", { name: u.name })}
                      className="ml-2 text-bad hover:bg-bad-soft hover:text-bad"
                    >
                      {t("users.delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
          title={t("users.confirmTitle")}
          message={t("users.confirmMessage", { name: pendingDelete.name })}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
