import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Details | eData Financial Group Golf Club CRM",
  description: "View detailed staff profile — job title, department, shift schedule, availability, and employment records.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
