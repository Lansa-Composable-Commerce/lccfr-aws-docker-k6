import { Suspense } from "react";
import type { Metadata } from "next";
import { getCountries } from "@/api/getCountries";
import { getReferrals } from "@/api/getReferrals";

import { useTranslations } from "next-intl";
import SkeletonRegisterForm from "@/components/loading/SkeletonRegisterForm";
import RegisterForm from "@/components/RegisterForm";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account to access application features and content.",
};

async function Register() {
  const [referrals, countries] = await Promise.all([
    getReferrals(),
    getCountries(),
  ]);

  const transformReferrals = referrals?.map((referral) => {
    return {
      label: referral.LW3CDES,
      value: referral.LW3CODE,
    };
  });

  const transformCountries = countries?.map((country) => {
    return {
      label: country.LW3CTRYD,
      value: country.LW3CTRY,
    };
  });

  return (
    <RegisterForm
      referrals={transformReferrals || []}
      countries={transformCountries || []}
    />
  );
}

export default function RegisterPage() {
  const tRegister = useTranslations("Register");

  return (
    <section className="container mx-auto px-2 lg:px-4 w-full">
      <div className="flex items-center justify-center w-full my-20">
        <div className="border border-white02 rounded-4xl px-4 lg:px-20 py-6 w-full">
          <div className="flex justify-center items-center w-full">
            <Logo />
          </div>
          <div className="text-center mb-9">
            <h1 className="main-title">{tRegister("MsgCreateAnAccount")}</h1>
          </div>
          <Suspense fallback={<SkeletonRegisterForm />}>
            <Register />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
