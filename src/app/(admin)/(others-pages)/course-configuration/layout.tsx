import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Configuration | eData Financial Group Golf Club CRM",
  description: "Manage and configure golf courses — add, edit, and track course details for eData Financial Group Golf Club CRM.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
