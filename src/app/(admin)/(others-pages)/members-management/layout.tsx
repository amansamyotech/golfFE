import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Management | eData Financial Group Golf Club CRM",
  description: "View and manage golf club members — add new members, track membership plans, and update member profiles.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
