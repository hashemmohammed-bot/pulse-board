import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
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
import { colors, radius } from "@/styles/tokens.stylex";
import { card, cardSubtitle, cardTitle, muted, pr, right, sectionHead } from "@/styles/shared";
import { useDataLabel } from "@/i18n/labels";
import { newId } from "@/id";

/** null = the form is closed; "new" = creating; a User = editing that user. */
type FormState = null | "new" | User;

const COLUMNS = ["name", "email", "role", "team", "status", "lastLogin", "actions"] as const;

const styles = stylex.create({
  tableWrap: { marginTop: "16px" },
  table: { minWidth: "820px" },
  editing: { backgroundColor: colors.brand50 },
  nameCell: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: {
    display: "grid",
    placeItems: "center",
    height: "36px",
    width: "36px",
    flexShrink: 0,
    borderRadius: radius.full,
    backgroundColor: colors.brand50,
    color: colors.brand600,
    fontSize: "14px",
    fontWeight: 600,
  },
  name: { fontWeight: 600 },
  actions: { textAlign: "right", whiteSpace: "nowrap" },
  deleteButton: { marginLeft: "8px", color: colors.bad },
});

export function Users() {
  const { t, i18n } = useTranslation();
  const { users, setUsers } = useAppState();
  const label = useDataLabel();
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
          id: newId("usr"),
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
      <section {...stylex.props(card)}>
        <div {...stylex.props(sectionHead)}>
          <div>
            <h2 {...stylex.props(cardTitle)}>{t("users.title")}</h2>
            <p {...stylex.props(cardSubtitle)}>{t("users.count", { count: users.length })}</p>
          </div>
          <Button data-testid="user-create" onClick={() => setForm("new")}>
            {t("users.new")}
          </Button>
        </div>

        <div {...stylex.props(styles.tableWrap)}>
          <Table data-testid="users-table" sx={styles.table}>
            <TableHeader>
              <TableRow head>
                {COLUMNS.map((col) => (
                  <TableHead key={col} sx={col === "actions" ? right : pr}>
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
                  sx={form !== "new" && form?.id === u.id ? styles.editing : null}
                >
                  <TableCell sx={pr}>
                    <span {...stylex.props(styles.nameCell)}>
                      <span aria-hidden="true" {...stylex.props(styles.avatar)}>
                        {initials(u.name)}
                      </span>
                      <span {...stylex.props(styles.name)}>{u.name}</span>
                    </span>
                  </TableCell>
                  <TableCell sx={pr}>{u.email}</TableCell>
                  <TableCell sx={pr}>{label("role", u.role)}</TableCell>
                  <TableCell sx={pr}>{u.team}</TableCell>
                  <TableCell sx={pr}>
                    <StatusBadge status={u.status} />
                  </TableCell>
                  <TableCell sx={[pr, muted]}>{formatDate(u.lastLoginAt, locale)}</TableCell>
                  <TableCell sx={styles.actions}>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="user-edit"
                      onClick={() => setForm(u)}
                      aria-label={t("users.editLabel", { name: u.name })}
                    >
                      {t("users.edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid="user-delete"
                      onClick={() => setPendingDelete(u)}
                      aria-label={t("users.deleteLabel", { name: u.name })}
                      sx={styles.deleteButton}
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
