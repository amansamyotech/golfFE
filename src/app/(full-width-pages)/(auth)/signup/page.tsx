import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | eData Financial Group Golf Club CRM",
  description: "Create your eData Financial Group Golf Club CRM account to manage memberships, bookings, and club operations.",
};

export default function SignUp() {
  return <SignUpForm />;
}
