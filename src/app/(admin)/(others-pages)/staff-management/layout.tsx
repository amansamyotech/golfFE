import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management | eData Financial Group Golf Club CRM",
  description: "Manage golf club staff — add employees, assign shifts, track availability, and update staff records.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
