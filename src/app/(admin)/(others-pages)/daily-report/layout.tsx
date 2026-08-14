import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Sales Report | eData Financial Group Golf Club CRM",
  description: "View daily sales reports — track total sales, discounts, and transaction counts across all golf club services.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
