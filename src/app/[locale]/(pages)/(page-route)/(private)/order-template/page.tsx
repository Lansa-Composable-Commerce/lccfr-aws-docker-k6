import React, { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import OrderTemplateWrapper from "@/components/orderTemplate/OrderTemplateWrapper";
import RenderSpinner from "@/components/ui/RenderSpinner";

import { getSavedOrder } from "@/api/orderTemplate/getSavedOrder";

import { LocalePropsType, SavedOrderResponseTypes } from "@/types";
import PageTitle from "@/components/ui/PageTitle";
import { useTranslations } from "next-intl";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const tOrderTemplate = await getTranslations({
    locale,
    namespace: "OrdrTmplte",
  });

  return {
    title: `${tOrderTemplate("OrderTemplate")}`,
    description: `${tOrderTemplate("OrderTemplate")}`,
  };
}

async function OrderTemplate() {
  const savedOrderData: SavedOrderResponseTypes[] = await getSavedOrder();

  return <OrderTemplateWrapper initialSavedOrderData={savedOrderData} />;
}

export default function OrderTemplatePage() {
  const t = useTranslations("OrdrTmplte");

  return (
    <div className="page">
      <PageTitle withTitle content={t("OrderTemplate")} />
      <Suspense fallback={<RenderSpinner />}>
        <OrderTemplate />
      </Suspense>
    </div>
  );
}
