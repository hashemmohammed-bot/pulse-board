import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
import type { User, UserRole } from "@/types";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colors, radius } from "@/styles/tokens.stylex";
import { useDataLabel } from "@/i18n/labels";

const ROLES: UserRole[] = ["Admin", "Manager", "Viewer"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface UserDraft {
  name: string;
  email: string;
  role: UserRole;
  team: string;
}

type FieldError = { field: "name" | "email"; message: string } | null;

const styles = stylex.create({
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { marginTop: "6px" },
  error: { margin: 0, marginTop: "6px", fontSize: "14px", color: colors.bad },
  select: {
    marginTop: "6px",
    width: "100%",
    height: "44px",
    paddingInline: "12px",
    fontSize: "16px",
    fontFamily: "inherit",
    color: colors.ink,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: { default: colors.line, ":focus": colors.brand500 },
    outline: "none",
  },
  actions: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" },
});

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
  const label = useDataLabel();
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
      <p data-testid="form-error" role="alert" {...stylex.props(styles.error)}>
        {error.message}
      </p>
    ) : null;

  return (
    <Modal
      eyebrow={user ? t("userForm.eyebrowEdit") : t("userForm.eyebrowNew")}
      title={user ? user.name : t("userForm.titleNew")}
      onClose={onCancel}
      testId="user-dialog"
    >
      <form data-testid="user-form" onSubmit={handleSubmit} noValidate {...stylex.props(styles.form)}>
        <div>
          <Label htmlFor="user-name">{t("userForm.name")}</Label>
          <Input
            id="user-name"
            name="name"
            value={draft.name}
            invalid={error?.field === "name"}
            onChange={(e) => set({ name: e.target.value })}
            sx={styles.field}
          />
          {errorFor("name")}
        </div>

        <div>
          <Label htmlFor="user-email">{t("userForm.email")}</Label>
          <Input
            id="user-email"
            name="email"
            type="text"
            value={draft.email}
            invalid={error?.field === "email"}
            onChange={(e) => set({ email: e.target.value })}
            sx={styles.field}
          />
          {errorFor("email")}
        </div>

        <div>
          <Label htmlFor="user-role">{t("userForm.role")}</Label>
          {/*
            Deliberately a native <select>: the acceptance test drives it with
            selectOption(), which needs a real <select name="role"> element.
          */}
          <select
            id="user-role"
            name="role"
            value={draft.role}
            onChange={(e) => set({ role: e.target.value as UserRole })}
            {...stylex.props(styles.select)}
          >
            {ROLES.map((role) => (
              // The value stays the dataset spelling; only the text is translated.
              <option key={role} value={role}>
                {label("role", role)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="user-team">{t("userForm.team")}</Label>
          <Input
            id="user-team"
            name="team"
            value={draft.team}
            onChange={(e) => set({ team: e.target.value })}
            sx={styles.field}
          />
        </div>

        <div {...stylex.props(styles.actions)}>
          <Button variant="outline" data-testid="user-cancel" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" data-testid="user-save">
            {user ? t("userForm.save") : t("userForm.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
