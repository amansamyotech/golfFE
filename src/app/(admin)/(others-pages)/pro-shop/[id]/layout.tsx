import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details | eData Financial Group Golf Club CRM",
  description: "View detailed pro shop product — stock levels, pricing, rental rate, category, and product description.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
