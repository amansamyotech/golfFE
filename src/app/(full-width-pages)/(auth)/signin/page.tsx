import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | eData Financial Group Golf Club CRM",
  description: "Sign in to eData Financial Group Golf Club CRM – Smart and easy way to manage your golf club and members.",
};

export default function SignIn() {
  return <SignInForm />;
}
