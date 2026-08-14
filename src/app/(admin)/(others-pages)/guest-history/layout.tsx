import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest History | eData Financial Group Golf Club CRM",
  description: "View complete guest booking history — past visits, booking statuses, and payment records for all guests.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
