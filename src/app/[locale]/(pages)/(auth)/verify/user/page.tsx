import type { Metadata } from "next";
import verifyAccount from "@/api/verify-account";
import { VerifyAccount } from "@/components/VerifyAccount";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify User",
  description: "",
};

export default async function VerifyAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { token, email } = await searchParams;

  const response = await verifyAccount({ token, email });

  if (!response) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto px-2 lg:px-4 w-full">
      <div className="flex flex-col items-center justify-center w-full my-20">
        <VerifyAccount response={response} />
      </div>
    </main>
  );
}
