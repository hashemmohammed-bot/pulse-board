import { useState } from "react";
import { verifyCredentials } from "../auth";

type FieldError = { field: "name" | "password"; message: string } | null;

const FIELD =
  "mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export function Login({ onSignedIn }: { onSignedIn: (username: string) => void }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // Rendered only after a failed submit, so login-error is absent until then.
  const [error, setError] = useState<FieldError>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError({ field: "name", message: "Enter your name." });
      return;
    }
    if (!password) {
      setError({ field: "password", message: "Enter your password." });
      return;
    }
    if (!verifyCredentials(name, password)) {
      setError({ field: "password", message: "Incorrect name or password." });
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
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-brand-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold tracking-tight">PulseBoard</h1>
        </div>
        <p className="mt-6 text-lg font-semibold">Sign in</p>
        <p className="mt-1 text-sm text-muted">Use your PulseBoard account to continue.</p>

        <form data-testid="login-form" onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <div>
            <label htmlFor="login-name" className="text-sm text-muted">
              Name
            </label>
            <input
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
            <label htmlFor="login-password" className="text-sm text-muted">
              Password
            </label>
            <input
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

          <button
            type="submit"
            data-testid="login-submit"
            className="mt-1 rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-on-accent transition hover:bg-brand-500"
          >
            Sign in
          </button>
        </form>

      </div>
    </main>
  );
}
