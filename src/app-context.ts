import { createContext, useContext } from "react";
import type { DashboardData, User } from "./types";
import type { Theme } from "./theme";

/**
 * Shared app state. It lives above the router so that Users edits, the theme
 * and the session survive navigation between routes.
 */
export interface AppState {
  data: DashboardData;
  users: User[];
  setUsers: (next: User[]) => void;
  theme: Theme;
  toggleTheme: () => void;
  session: string | null;
  signOut: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

export const AppStateProvider = AppStateContext.Provider;

export function useAppState(): AppState {
  const state = useContext(AppStateContext);
  if (!state) throw new Error("useAppState must be used inside AppStateProvider");
  return state;
}
