import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Shop Rentals | eData Financial Group Golf Club CRM",
  description: "Manage golf equipment rentals — track rented items, return dates, rental payments, and product availability.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
