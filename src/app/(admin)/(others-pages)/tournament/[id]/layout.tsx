import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Details | eData Financial Group Golf Club CRM",
  description: "View detailed tournament information — event schedule, registered players, scoring, and tournament status.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
