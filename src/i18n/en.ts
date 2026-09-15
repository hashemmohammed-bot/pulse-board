/**
 * English copy. Keys are grouped by the screen they appear on.
 *
 * Only chrome is translated. Values that come from the dataset — account and
 * user status, role, plan, region, names — are rendered as-is, because they are
 * data rather than copy and the acceptance test matches on them literally.
 */
export const en = {
  common: {
    cancel: "Cancel",
    delete: "Delete",
    close: "Close",
    none: "—",
  },
  nav: {
    label: "Main",
    dashboard: "Dashboard",
    users: "Users",
  },
  app: {
    loading: "Loading…",
    loadError: "Could not load the dashboard data: {{message}}",
  },
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
  language: {
    label: "Change language",
    en: "English",
    fr: "Français",
  },
  auth: {
    title: "Sign in",
    subtitle: "Use your PulseBoard account to continue.",
    name: "Name",
    password: "Password",
    submit: "Sign in",
    signOut: "Sign out",
    signedInAs: "Signed in as",
    errors: {
      name: "Enter your name.",
      password: "Enter your password.",
      invalid: "Incorrect name or password.",
    },
  },
  kpi: {
    rowLabel: "Key performance indicators",
    vsLastMonth: "vs last month",
  },
  chart: {
    title: "Revenue vs target",
    subtitle: "Monthly recurring revenue, last 12 months",
    revenue: "Revenue",
    target: "Target",
    ariaLabel: "Revenue versus target, monthly recurring revenue from {{first}} to {{last}}",
  },
  accounts: {
    title: "Accounts",
    count_one: "{{count}} account",
    count_other: "{{count}} accounts",
    filterPlaceholder: "Filter accounts…",
    filterLabel: "Filter accounts by name, owner, plan, region or status",
    empty: "No accounts match “{{query}}”.",
    columns: {
      name: "Account",
      plan: "Plan",
      region: "Region",
      owner: "Owner",
      mrr: "MRR",
      seats: "Seats",
      status: "Status",
      health: "Health",
    },
  },
  account: {
    eyebrow: "Account",
    signedUp: "Signed up",
    lastActive: "Last active",
    owner: "Owner",
    notes: "Notes",
  },
  users: {
    title: "Users",
    count_one: "{{count}} person",
    count_other: "{{count}} people",
    new: "New user",
    edit: "Edit",
    delete: "Delete",
    editLabel: "Edit {{name}}",
    deleteLabel: "Delete {{name}}",
    confirmTitle: "Delete user?",
    confirmMessage: "{{name}} will be removed from PulseBoard. This cannot be undone.",
    columns: {
      name: "Name",
      email: "Email",
      role: "Role",
      team: "Team",
      status: "Status",
      lastLogin: "Last login",
      actions: "Actions",
    },
  },
  userForm: {
    eyebrowEdit: "Edit user",
    eyebrowNew: "New user",
    titleNew: "Invite a teammate",
    name: "Name",
    email: "Email",
    role: "Role",
    team: "Team",
    save: "Save changes",
    create: "Create user",
    errors: {
      name: "Name is required.",
      email: "Enter a valid email address.",
    },
  },
  /**
   * Values that arrive from the dataset but read as UI copy. Free text (names,
   * emails, teams, notes) and region codes are deliberately absent: they pass
   * through untranslated.
   *
   * The English entries must match data.json exactly — the acceptance test runs
   * in English and matches these strings literally.
   */
  data: {
    kpi: {
      mrr: "Monthly recurring revenue",
      "active-accounts": "Active accounts",
      "churn-rate": "Churn rate",
      nps: "Net promoter score",
    },
    status: {
      Active: "Active",
      Trial: "Trial",
      "At risk": "At risk",
      Churned: "Churned",
      Invited: "Invited",
      Suspended: "Suspended",
    },
    plan: {
      Starter: "Starter",
      Growth: "Growth",
      Enterprise: "Enterprise",
    },
    role: {
      Admin: "Admin",
      Manager: "Manager",
      Viewer: "Viewer",
    },
  },
} as const;

/** Same shape as `en`, but every leaf widened to string — the contract fr.ts implements. */
export type Translations = {
  [K in keyof typeof en]: (typeof en)[K] extends string
    ? string
    : {
        [J in keyof (typeof en)[K]]: (typeof en)[K][J] extends string
          ? string
          : Record<string, string>;
      };
};
