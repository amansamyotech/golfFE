import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing & Payments | eData Financial Group Golf Club CRM",
  description: "Manage all billing and payment records — track paid, pending, and partial payments for members and guests.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
