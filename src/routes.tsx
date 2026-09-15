import { Link, Outlet, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import * as stylex from "@stylexjs/stylex";
import { Dashboard } from "@/pages/Dashboard";
import { Users } from "@/pages/Users";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/app-context";
import { LANGUAGES } from "@/i18n";
import { colors, radius } from "@/styles/tokens.stylex";

const styles = stylex.create({
  shell: { minHeight: "100vh", backgroundColor: colors.canvas, color: colors.ink },
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "24px",
    paddingInline: { default: "24px", "@media (min-width: 640px)": "32px" },
    paddingBlock: "20px",
  },
  brand: { display: "flex", alignItems: "center", gap: "12px" },
  logo: { height: "36px", width: "36px", borderRadius: radius.md, backgroundColor: colors.brand500 },
  title: { margin: 0, fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em" },
  nav: { display: "flex", alignItems: "center", gap: "4px" },
  navLink: {
    borderRadius: radius.md,
    paddingInline: "16px",
    paddingBlock: "8px",
    fontSize: "18px",
    fontWeight: 500,
    textDecoration: "none",
    color: { default: colors.muted, ":hover": colors.ink },
  },
  navActive: { backgroundColor: colors.brand100, color: colors.brand600 },
  tools: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" },
  langGroup: {
    display: "flex",
    alignItems: "center",
    padding: "4px",
    borderRadius: radius.md,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.line,
    backgroundColor: colors.surface,
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
  session: {
    display: { default: "none", "@media (min-width: 640px)": "inline" },
    fontSize: "14px",
    color: colors.muted,
  },
  sessionName: { fontWeight: 600, color: colors.ink },
  main: {
    paddingInline: { default: "24px", "@media (min-width: 640px)": "32px" },
    paddingBottom: "48px",
  },
});

/**
 * Code-based routing: two routes, declared here rather than generated from the
 * filesystem, which keeps the whole route tree readable in one file.
 */
function Layout() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, session, signOut } = useAppState();

  return (
    <div {...stylex.props(styles.shell)}>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.brand)}>
          <span aria-hidden="true" {...stylex.props(styles.logo)} />
          <h1 {...stylex.props(styles.title)}>PulseBoard</h1>
        </div>

        <nav aria-label={t("nav.label")} {...stylex.props(styles.nav)}>
          <Link
            to="/"
            data-testid="nav-dashboard"
            activeOptions={{ exact: true }}
            {...stylex.props(styles.navLink)}
            activeProps={stylex.props(styles.navLink, styles.navActive)}
          >
            {t("nav.dashboard")}
          </Link>
          <Link
            to="/users"
            data-testid="nav-users"
            {...stylex.props(styles.navLink)}
            activeProps={stylex.props(styles.navLink, styles.navActive)}
          >
            {t("nav.users")}
          </Link>
        </nav>

        <div {...stylex.props(styles.tools)}>
          <div role="group" aria-label={t("language.label")} {...stylex.props(styles.langGroup)}>
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                type="button"
                data-testid={`lang-${lng}`}
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

          <Button
            variant="outline"
            size="icon"
            data-testid="theme-toggle"
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
            title={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          </Button>

          {session && (
            <>
              <span data-testid="session-user" {...stylex.props(styles.session)}>
                {t("auth.signedInAs")}{" "}
                <span {...stylex.props(styles.sessionName)}>{session}</span>
              </span>
              <Button variant="outline" data-testid="logout" onClick={signOut}>
                {t("auth.signOut")}
              </Button>
            </>
          )}
        </div>
      </header>

      <main {...stylex.props(styles.main)}>
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
