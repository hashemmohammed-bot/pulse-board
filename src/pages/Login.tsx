import { useState } from "react";
import { useTranslation } from "react-i18next";
import { verifyCredentials } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANGUAGES } from "@/i18n";

type FieldError = { field: "name" | "password"; message: string } | null;

const FIELD = "mt-1.5 h-11 w-full rounded-xl bg-surface text-base";

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

  const ring = (field: "name" | "password") =>
    error?.field === field ? " border-bad ring-2 ring-bad-soft" : "";

  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-4">
      <div className="w-full max-w-[420px] rounded-2xl border border-line bg-surface px-8 py-9">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-xl bg-brand-500" aria-hidden="true" />
            <h1 className="text-2xl font-bold tracking-tight">PulseBoard</h1>
          </div>
          <div
            role="group"
            aria-label={t("language.label")}
            className="flex items-center rounded-xl border border-line p-1"
          >
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                type="button"
                data-testid={`login-lang-${lng}`}
                onClick={() => void i18n.changeLanguage(lng)}
                aria-pressed={i18n.resolvedLanguage === lng}
                className={`rounded-lg px-2.5 py-1 text-sm font-semibold transition ${
                  i18n.resolvedLanguage === lng
                    ? "bg-brand-100 text-brand-600"
                    : "text-muted hover:text-ink"
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-lg font-semibold">{t("auth.title")}</p>
        <p className="mt-1 text-sm text-muted">{t("auth.subtitle")}</p>

        <form
          data-testid="login-form"
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col gap-5"
        >
          <div>
            <Label htmlFor="login-name" className="text-sm text-muted">
              {t("auth.name")}
            </Label>
            <Input
              id="login-name"
              name="name"
              type="text"
              autoComplete="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={FIELD + ring("name")}
            />
          </div>

          <div>
            <Label htmlFor="login-password" className="text-sm text-muted">
              {t("auth.password")}
            </Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={FIELD + ring("password")}
            />
          </div>

          {error && (
            <p data-testid="login-error" role="alert" className="-mt-2 text-sm text-bad">
              {error.message}
            </p>
          )}

          <Button type="submit" data-testid="login-submit" className="mt-1 h-11 rounded-xl">
            {t("auth.submit")}
          </Button>
        </form>
      </div>
    </main>
  );
}
