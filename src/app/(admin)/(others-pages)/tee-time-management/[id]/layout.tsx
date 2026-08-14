import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Details | eData Financial Group Golf Club CRM",
  description: "View detailed tee-time booking — slot assignment, caddy assignment, booking status, and payment information.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
