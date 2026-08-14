import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tee-Time Management | eData Financial Group Golf Club CRM",
  description: "Manage tee-time bookings — view, assign slots, assign caddies, and process payments for member bookings.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
