import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Players | eData Financial Group Golf Club CRM",
  description: "Manage registered golf players — view player profiles, contact details, age, status, and tournament enrollment.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
