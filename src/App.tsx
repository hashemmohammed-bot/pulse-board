import { useEffect, useState, type ReactNode } from "react";
import { RouterProvider } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { useTranslation } from "react-i18next";
import type { DashboardData, User } from "./types";
import { Login } from "./pages/Login";
import { router } from "./routes";
import { AppStateProvider } from "./app-context";
import { applyTheme, storedTheme, systemTheme, type Theme } from "./theme";
import { AUTH_REQUIRED, endSession, readSession, startSession } from "./auth";
import { darkTheme, lightTheme } from "./styles/themes";
import { colors } from "./styles/tokens.stylex";

const styles = stylex.create({
  root: { minHeight: "100vh", backgroundColor: colors.canvas, color: colors.ink },
  message: { padding: "24px" },
  error: { color: colors.bad },
});

/** Bumped whenever the stored shape changes, so old entries are ignored. */
const STORAGE_KEY = "pulseboard.users.v1";

/**
 * Every field the Users page renders. A stored entry missing any of them would
 * blow up mid-render with no way out but devtools, so a half-written or
 * hand-edited store is discarded in favour of the shipped dataset.
 */
function isStoredUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const u = value as Record<string, unknown>;
  return (
    typeof u.id === "string" &&
    typeof u.name === "string" &&
    typeof u.email === "string" &&
    typeof u.role === "string" &&
    typeof u.team === "string" &&
    typeof u.status === "string" &&
    (typeof u.lastLoginAt === "string" || u.lastLoginAt === null)
  );
}

/** Storage can be blocked (private windows, disabled site data) or hold junk. */
function readStoredUsers(): User[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isStoredUser)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Persistence is a bonus; losing it must never break the page.
  }
}

/**
 * The gate is off in the acceptance run, so `?login=1` forces the screen to
 * render anyway — that is how the login screenshot is captured.
 */
function loginForced() {
  return new URLSearchParams(window.location.search).has("login");
}

/**
 * Owns everything that must outlive a route change: the dataset, the Users
 * edits, the theme and the session. The router renders beneath it.
 */
export default function App() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => storedTheme() ?? systemTheme());
  const [session, setSession] = useState<string | null>(() => readSession());

  useEffect(() => {
    let alive = true;
    fetch("/data.json")
      .then((res) => {
        if (!res.ok) throw new Error(`data.json responded ${res.status}`);
        return res.json() as Promise<DashboardData>;
      })
      .then((loaded) => {
        if (!alive) return;
        setData(loaded);
        setUsers(readStoredUsers() ?? loaded.users);
      })
      .catch((err: Error) => {
        if (alive) setLoadError(err.message);
      });
    return () => {
      alive = false;
    };
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  // The theme variables are applied here, above everything else, so the login
  // screen, the router and every portalled dialog resolve the same palette.
  const themed = (children: ReactNode) => (
    <div {...stylex.props(theme === "dark" ? darkTheme : lightTheme, styles.root)}>{children}</div>
  );

  if (!session && (AUTH_REQUIRED || loginForced())) {
    return themed(
      <Login
        onSignedIn={(username) => {
          startSession(username);
          setSession(username);
        }}
      />,
    );
  }

  if (loadError) {
    return themed(
      <main {...stylex.props(styles.message)}>
        <p role="alert" {...stylex.props(styles.error)}>
          {t("app.loadError", { message: loadError })}
        </p>
      </main>,
    );
  }

  if (!data) {
    return themed(
      <main {...stylex.props(styles.message)}>
        <p>{t("app.loading")}</p>
      </main>,
    );
  }

  return themed(
    <AppStateProvider
      value={{
        data,
        users,
        setUsers: (next) => {
          setUsers(next);
          writeStoredUsers(next);
        },
        theme,
        toggleTheme,
        session,
        signOut: () => {
          endSession();
          setSession(null);
        },
      }}
    >
      <RouterProvider router={router} />
    </AppStateProvider>,
  );
}
