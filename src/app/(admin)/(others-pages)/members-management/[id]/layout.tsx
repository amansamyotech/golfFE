import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Details | eData Financial Group Golf Club CRM",
  description: "View detailed member profile — booking history, membership plan, contact information, and activity records.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
