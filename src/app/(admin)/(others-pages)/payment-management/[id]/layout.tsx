import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Invoice | eData Financial Group Golf Club CRM",
  description: "View and generate payment invoice — billing details, payment breakdown, and invoice for golf club services.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
