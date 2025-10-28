import type { Metadata } from "next";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import verifyResetPasswordLink from "@/api/forgotPassword";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { token, user, email } = await searchParams;

  const response = await verifyResetPasswordLink({ token, user, email });

  if (!response) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto px-2 lg:px-4 w-full">
      <div className="flex flex-col items-center justify-center w-full my-20">
        <ResetPasswordForm response={response} />
      </div>
    </main>
  );
}
