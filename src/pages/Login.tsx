import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
import { verifyCredentials } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANGUAGES } from "@/i18n";
import { colors, radius } from "@/styles/tokens.stylex";

type FieldError = { field: "name" | "password"; message: string } | null;

const styles = stylex.create({
  page: {
    display: "grid",
    placeItems: "center",
    minHeight: "100vh",
    padding: "16px",
    backgroundColor: colors.canvas,
    color: colors.ink,
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.line,
    paddingInline: "32px",
    paddingBlock: "36px",
  },
  top: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" },
  brand: { display: "flex", alignItems: "center", gap: "12px" },
  logo: { height: "36px", width: "36px", borderRadius: radius.md, backgroundColor: colors.brand500 },
  title: { margin: 0, fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em" },
  langGroup: {
    display: "flex",
    alignItems: "center",
    padding: "4px",
    borderRadius: radius.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.line,
  },
  langButton: {
    borderRadius: radius.sm,
    borderWidth: 0,
    borderStyle: "none",
    backgroundColor: "transparent",
    paddingInline: "10px",
    paddingBlock: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    fontWeight: 600,
    cursor: "pointer",
    color: { default: colors.muted, ":hover": colors.ink },
  },
  langActive: { backgroundColor: colors.brand100, color: colors.brand600 },
  heading: { margin: 0, marginTop: "24px", fontSize: "18px", fontWeight: 600 },
  subtitle: { margin: 0, marginTop: "4px", fontSize: "14px", color: colors.muted },
  form: { display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" },
  field: { marginTop: "6px" },
  error: { margin: 0, marginTop: "-8px", fontSize: "14px", color: colors.bad },
  submit: { marginTop: "4px", height: "44px" },
});

export function Login({ onSignedIn }: { onSignedIn: (username: string) => void }) {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // Rendered only after a failed submit, so login-error is absent until then.
  const [error, setError] = useState<FieldError>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError({ field: "name", message: t("auth.errors.name") });
      return;
    }
    if (!password) {
      setError({ field: "password", message: t("auth.errors.password") });
      return;
    }
    if (!verifyCredentials(name, password)) {
      setError({ field: "password", message: t("auth.errors.invalid") });
      return;
    }
    setError(null);
    onSignedIn(name.trim());
  }

  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.card)}>
        <div {...stylex.props(styles.top)}>
          <div {...stylex.props(styles.brand)}>
            <span aria-hidden="true" {...stylex.props(styles.logo)} />
            <h1 {...stylex.props(styles.title)}>PulseBoard</h1>
          </div>
          <div role="group" aria-label={t("language.label")} {...stylex.props(styles.langGroup)}>
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                type="button"
                data-testid={`login-lang-${lng}`}
                onClick={() => void i18n.changeLanguage(lng)}
                aria-pressed={i18n.resolvedLanguage === lng}
                {...stylex.props(
                  styles.langButton,
                  i18n.resolvedLanguage === lng && styles.langActive,
                )}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <p {...stylex.props(styles.heading)}>{t("auth.title")}</p>
        <p {...stylex.props(styles.subtitle)}>{t("auth.subtitle")}</p>

        <form
          data-testid="login-form"
          onSubmit={handleSubmit}
          noValidate
          {...stylex.props(styles.form)}
        >
          <div>
            <Label htmlFor="login-name">{t("auth.name")}</Label>
            <Input
              id="login-name"
              name="name"
              type="text"
              autoComplete="username"
              value={name}
              invalid={error?.field === "name"}
              onChange={(e) => setName(e.target.value)}
              sx={styles.field}
            />
          </div>

          <div>
            <Label htmlFor="login-password">{t("auth.password")}</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              invalid={error?.field === "password"}
              onChange={(e) => setPassword(e.target.value)}
              sx={styles.field}
            />
          </div>

          {error && (
            <p data-testid="login-error" role="alert" {...stylex.props(styles.error)}>
              {error.message}
            </p>
          )}

          <Button type="submit" data-testid="login-submit" sx={styles.submit}>
            {t("auth.submit")}
          </Button>
        </form>
      </div>
    </main>
  );
}
