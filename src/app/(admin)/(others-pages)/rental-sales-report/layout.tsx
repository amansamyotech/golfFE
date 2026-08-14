import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Sales Report | eData Financial Group Golf Club CRM",
  description: "View daily and monthly rental product sales reports — track revenue, quantities, and net earnings from pro shop rentals.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
