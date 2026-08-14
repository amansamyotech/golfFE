import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Booking Details | eData Financial Group Golf Club CRM",
  description: "View detailed guest booking — slot details, caddy information, payment status, and guest contact records.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
