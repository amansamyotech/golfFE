import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Bookings | eData Financial Group Golf Club CRM",
  description: "Manage guest tee-time bookings — assign slots, assign caddies, track booking status, and process guest payments.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
