import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expiring Memberships | eData Financial Group Golf Club CRM",
  description: "View members with expired or soon-to-expire memberships — take action to renew or follow up with members.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
