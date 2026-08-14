import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Time Slot Management | eData Financial Group Golf Club CRM",
  description: "Configure time slots for golf courses — set weekday and weekend opening hours, buffer times, and slot durations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
