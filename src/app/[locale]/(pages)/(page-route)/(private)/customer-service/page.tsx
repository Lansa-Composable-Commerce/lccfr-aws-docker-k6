import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import PageTitle from "@/components/ui/PageTitle";
import CustomerServiceContainer from "@/components/customerService/CustomerServiceContainer";

import { LocalePropsType } from "@/types";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const t = await getTranslations({ locale, namespace: "CstmSrvc" });

  return {
    title: `${t("CustomerService")}`,
    description: `${t("CustomerService")}`,
  };
}

export default async function CustomerServicePage() {
  const t = await getTranslations("CstmSrvc");

  return (
    <div className="page">
      <section className="relative w-full h-full top-0">
        <PageTitle content={t("CustomerService")} withTitle />
        <CustomerServiceContainer />
      </section>
    </div>
  );
}
