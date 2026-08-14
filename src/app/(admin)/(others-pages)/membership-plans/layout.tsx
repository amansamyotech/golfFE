import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Plans | eData Financial Group Golf Club CRM",
  description: "Manage golf club membership plans — create, update, and delete Silver, Gold, Platinum, and custom plans.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
