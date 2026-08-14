export type NavSubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  roles?: string[];
};

export type NavItem = {
  name: string;
  path?: string;
  subItems?: NavSubItem[];
  pro?: boolean;
  roles?: string[];
};

/** Shared route labels for sidebar + header active navigation */
export const navItems: NavItem[] = [
  { name: "Dashboard", path: "/" },
  {
    name: "Course Configuration",
    path: "/course-configuration",
    roles: ["Admin", "SuperAdmin"],
  },
  {
    name: "Time Slot Management",
    path: "/time-slot",
    roles: ["Admin", "SuperAdmin", "Manager"],
  },
  {
    name: "Billing & Payments",
    path: "/payment-management",
    roles: ["Admin", "SuperAdmin", "Manager"],
  },
  {
    name: "Tee Time Management",
    roles: ["Admin", "SuperAdmin", "Manager", "Staff"],
    subItems: [
      { name: "View Tee Sheet", path: "/tee-time-management" },
      { name: "Tee Time Calendar", path: "/calendar" },
    ],
  },
  {
    name: "Member Management",
    roles: ["Admin", "SuperAdmin", "Manager", "Staff"],
    subItems: [
      { name: "Member List", path: "/members-management" },
      {
        name: "Membership Plans",
        path: "/membership-plans",
        roles: ["Admin", "SuperAdmin", "Manager"],
      },
    ],
  },
  {
    name: "Guest Management",
    roles: ["Admin", "SuperAdmin", "Manager", "Staff"],
    subItems: [
      { name: "Guest Bookings", path: "/guest-bookings" },
      { name: "Guest History", path: "/guest-history" },
    ],
  },
  {
    name: "Staff Management",
    roles: ["Admin", "SuperAdmin", "Manager"],
    subItems: [{ name: "Staff List", path: "/staff-management" }],
  },
  {
    name: "Tournament",
    roles: ["Admin", "SuperAdmin", "Manager", "Staff"],
    subItems: [
      { name: "Events", path: "/tournament" },
      { name: "Register Players", path: "/players" },
    ],
  },
  {
    name: "Pro Shop",
    roles: ["Admin", "SuperAdmin", "Manager", "Staff"],
    subItems: [
      { name: "Inventory List", path: "/pro-shop" },
      { name: "Rentals", path: "/pro-shop-rental" },
    ],
  },
  {
    name: "Reports",
    roles: ["Admin", "SuperAdmin", "Manager", "Staff"],
    subItems: [
      { name: "Daily Summary", path: "/daily-report" },
      {
        name: "Sales Reports",
        path: "/rental-sales-report",
        roles: ["Admin", "SuperAdmin", "Manager"],
      },
    ],
  },
  {
    name: "Expiring Memberships",
    path: "/expiring-memberships",
    roles: ["Admin", "SuperAdmin", "Manager"],
  },
  { name: "Profile", path: "/profile" },
];

/** Exact match for `/`; otherwise exact or nested (`/tournament/123`). Avoids `/pro-shop` matching `/pro-shop-rental`. */
export function isPathActive(pathname: string, path: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function resolveActiveNav(pathname: string): {
  parent: string | null;
  label: string;
} {
  let best: { parent: string | null; label: string; score: number } = {
    parent: null,
    label: "Dashboard",
    score: -1,
  };

  for (const item of navItems) {
    if (item.subItems) {
      for (const sub of item.subItems) {
        if (isPathActive(pathname, sub.path) && sub.path.length > best.score) {
          best = {
            parent: item.name,
            label: sub.name,
            score: sub.path.length,
          };
        }
      }
    }
    if (item.path && isPathActive(pathname, item.path) && item.path.length > best.score) {
      best = {
        parent: item.subItems ? item.name : null,
        label: item.name,
        score: item.path.length,
      };
    }
  }

  return { parent: best.parent, label: best.label };
}
