import { useEffect, useState } from "react";
import type { DashboardData, User } from "./types";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";

type Page = "dashboard" | "users";

/** Bumped whenever the stored shape changes, so old entries are ignored. */
const STORAGE_KEY = "pulseboard.users.v1";

/** Storage can be blocked (private windows, disabled site data) or hold junk. */
function readStoredUsers(): User[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as User[]) : null;
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

const NAV: { id: Page; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Users" },
];

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  // Users state lives here, above the page switch, so edits survive navigation.
  const [users, setUsers] = useState<User[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState<Page>("dashboard");

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

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex flex-wrap items-center gap-6 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-9 w-9 rounded-xl bg-brand-500" aria-hidden="true" />
          <h1 className="text-2xl font-bold tracking-tight">PulseBoard</h1>
        </div>
        <nav aria-label="Main" className="flex items-center gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              data-testid={`nav-${item.id}`}
              aria-current={page === item.id ? "page" : undefined}
              onClick={() => setPage(item.id)}
              className={`rounded-xl px-4 py-2 text-lg font-medium transition ${
                page === item.id ? "bg-brand-100 text-brand-600" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="px-6 pb-12 sm:px-8">
        {loadError && (
          <p role="alert" className="rounded-2xl border border-line bg-surface p-6 text-bad">
            Could not load the dashboard data: {loadError}
          </p>
        )}
        {!data && !loadError && <p className="p-6 text-muted">Loading…</p>}
        {data && page === "dashboard" && <Dashboard data={data} />}
        {data && page === "users" && (
          <Users
            users={users}
            onChange={(next) => {
              setUsers(next);
              writeStoredUsers(next);
            }}
          />
        )}
      </main>
    </div>
  );
}
