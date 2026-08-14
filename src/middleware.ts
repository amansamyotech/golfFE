import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/signin", "/signup"];

// Routes restricted by role — anyone not in the allowed list is redirected to /
// Matches the exact permissions from the client requirements document:
//
// SuperAdmin/Admin  → Full access
// Manager          → All except Course Configuration (critical system-level config)
// Staff            → Day-to-day: Tee Time, Member List, Guest, Tournament, Pro Shop, Reports (view)
//                    NO: Course Config, Time Slot Config, Billing, Staff Mgmt, Membership Plans
// Member           → Dashboard only
const ROLE_RESTRICTED_ROUTES: { path: string; roles: string[] }[] = [
  // ── SuperAdmin / Admin only ──────────────────────────────────────────────
  { path: "/course-configuration", roles: ["Admin", "SuperAdmin"] },

  // ── Admin + SuperAdmin + Manager only ───────────────────────────────────
  { path: "/time-slot",            roles: ["Admin", "SuperAdmin", "Manager"] },
  { path: "/payment-management",   roles: ["Admin", "SuperAdmin", "Manager"] },
  { path: "/staff-management",     roles: ["Admin", "SuperAdmin", "Manager"] },
  { path: "/membership-plans",     roles: ["Admin", "SuperAdmin", "Manager"] },
  { path: "/expiring-memberships", roles: ["Admin", "SuperAdmin", "Manager"] },
  { path: "/daily-report",         roles: ["Admin", "SuperAdmin", "Manager", "Staff"] }, // Staff: view relevant reports
  { path: "/rental-sales-report",  roles: ["Admin", "SuperAdmin", "Manager"] },

  // ── Admin + SuperAdmin + Manager + Staff ────────────────────────────────
  { path: "/tee-time-management",  roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
  { path: "/calendar",             roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
  { path: "/members-management",   roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
  { path: "/guest-bookings",       roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
  { path: "/guest-history",        roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
  { path: "/tournament",           roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
  { path: "/players",              roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
  { path: "/pro-shop",             roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
  { path: "/pro-shop-rental",      roles: ["Admin", "SuperAdmin", "Manager", "Staff"] },
];

function getRoleFromCookie(request: NextRequest): string | null {
  const userCookie = request.cookies.get("auth-user")?.value;
  if (!userCookie) return null;
  try {
    const user = JSON.parse(decodeURIComponent(userCookie));
    return user?.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth-token")?.value;

  // Not logged in → redirect to signin
  if (!token) {
    const signinUrl = request.nextUrl.clone();
    signinUrl.pathname = "/signin";
    return NextResponse.redirect(signinUrl);
  }

  // Check role-based route restrictions
  const role = getRoleFromCookie(request);
  if (role) {
    const matchedRoute = ROLE_RESTRICTED_ROUTES.find((r) =>
      pathname.startsWith(r.path)
    );
    if (matchedRoute && !matchedRoute.roles.includes(role)) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
