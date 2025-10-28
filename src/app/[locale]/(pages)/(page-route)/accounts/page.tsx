import React, { Suspense } from "react";
import { Metadata } from "next";

// components
import SelectAccountTable from "@/components/SelectAccountTable";

// api
import { getAccounts } from "@/api/accounts";
import SkeletonAccounts from "@/components/loading/SkeletonAccounts";
import AccountTitle from "@/components/accounts/AccountTitle";
import { getTranslations } from "next-intl/server";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale;
  const tAccount = await getTranslations({ locale, namespace: "Account" });

  return {
    title: `${tAccount("Accounts")}`,
    description: `${tAccount("Accounts")}`,
  };
}

async function Accounts() {
  const accounts = await getAccounts();

  return <SelectAccountTable accounts={accounts} />;
}

export default async function AccountsPage() {
  return (
    <section className="page">
      <AccountTitle />
      <Suspense fallback={<SkeletonAccounts />}>
        <Accounts />
      </Suspense>
    </section>
  );
}
