import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "",
};

export default function ForgotPasswordPage() {
  return (
    <main className="container mx-auto px-2 lg:px-4 w-full">
      <div className="flex flex-col items-center justify-center w-full my-20">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
