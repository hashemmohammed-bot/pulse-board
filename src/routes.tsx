import {
  Link,
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Dashboard } from "@/pages/Dashboard";
import { Users } from "@/pages/Users";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/app-context";
import { LANGUAGES } from "@/i18n";

/**
 * Code-based routing: two routes, declared here rather than generated from the
 * filesystem, which keeps the whole route tree readable in one file.
 */
function Layout() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, session, signOut } = useAppState();

  const navLink = "rounded-xl px-4 py-2 text-lg font-medium transition";

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex flex-wrap items-center gap-6 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-brand-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold tracking-tight">PulseBoard</h1>
        </div>

        <nav aria-label={t("nav.label")} className="flex items-center gap-1">
          <Link
            to="/"
            data-testid="nav-dashboard"
            className={`${navLink} text-muted hover:text-ink`}
            activeProps={{ className: `${navLink} bg-brand-100 text-brand-600` }}
            activeOptions={{ exact: true }}
          >
            {t("nav.dashboard")}
          </Link>
          <Link
            to="/users"
            data-testid="nav-users"
            className={`${navLink} text-muted hover:text-ink`}
            activeProps={{ className: `${navLink} bg-brand-100 text-brand-600` }}
          >
            {t("nav.users")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div
            role="group"
            aria-label={t("language.label")}
            className="flex items-center rounded-xl border border-line bg-surface p-1"
          >
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                type="button"
                data-testid={`lang-${lng}`}
                onClick={() => void i18n.changeLanguage(lng)}
                aria-pressed={i18n.resolvedLanguage === lng}
                className={`rounded-lg px-2.5 py-1 text-sm font-semibold transition ${
                  i18n.resolvedLanguage === lng ? "bg-brand-100 text-brand-600" : "text-muted hover:text-ink"
                }`}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            data-testid="theme-toggle"
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
            title={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
            className="h-10 w-10 rounded-xl text-lg"
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          </Button>

          {session && (
            <>
              <span data-testid="session-user" className="hidden text-sm text-muted sm:inline">
                {t("auth.signedInAs")} <span className="font-semibold text-ink">{session}</span>
              </span>
              <Button
                type="button"
                variant="outline"
                data-testid="logout"
                onClick={signOut}
                className="rounded-xl"
              >
                {t("auth.signOut")}
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="px-6 pb-12 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: Users,
});

const routeTree = rootRoute.addChildren([dashboardRoute, usersRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
