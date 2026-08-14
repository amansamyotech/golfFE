import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Shop | eData Financial Group Golf Club CRM",
  description: "Manage pro shop inventory — track golf equipment, apparel, accessories, stock levels, and product pricing.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
