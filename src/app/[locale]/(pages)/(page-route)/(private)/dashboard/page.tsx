import React, { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import PageTitle from "@/components/ui/PageTitle";

import { LocalePropsType } from "@/types";
import Spinner from "@/components/loading/Spinner";
import { DashboardMain } from "@/components/dashboard/DashboardMain";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const tDashboard = await getTranslations({ locale, namespace: "Dashboard" });

  return {
    title: `${tDashboard("Dashboard")}`,
    description: `${tDashboard("Dashboard")}`,
  };
}

export default async function DashboardPage() {
  const tDashboard = await getTranslations("Dashboard");

  return (
    <div className="page">
      <PageTitle withTitle content={tDashboard("Dashboard")} />
      <Suspense fallback={<Spinner />}>
        <DashboardMain />
      </Suspense>
    </div>
  );
}
