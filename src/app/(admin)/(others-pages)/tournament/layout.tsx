import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Management | eData Financial Group Golf Club CRM",
  description: "Create and manage golf tournaments — plan events, assign players, track participants, and update tournament status.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
