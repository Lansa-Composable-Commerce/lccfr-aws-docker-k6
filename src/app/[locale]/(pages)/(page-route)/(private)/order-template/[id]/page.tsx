import React, { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import SaveOrderDetailsWrapper from "@/components/orderTemplate/SaveOrderDetailsWrapper";
import RenderSpinner from "@/components/ui/RenderSpinner";

import { getSavedOrderDetails } from "@/api/orderTemplate/getSavedOrderDetails";

import { SavedOrderDetailsResponseTypes } from "@/types";
import PageTitle from "@/components/ui/PageTitle";
import { useTranslations } from "next-intl";

type Props = {
  params: { locale: string; id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const locale = params.locale;

  const tOrderTemplate = await getTranslations({
    locale,
    namespace: "OrdrTmplte",
  });

  return {
    title: `${tOrderTemplate("OrderTemplate")}  ${id}`,
    description: `${tOrderTemplate("OrderTemplate")}`,
  };
}

async function OrderDetails({ savedOrderId }: { savedOrderId: number }) {
  const savedOrderDetailsData: SavedOrderDetailsResponseTypes =
    await getSavedOrderDetails(savedOrderId);
  return (
    <SaveOrderDetailsWrapper savedOrderDetailsData={savedOrderDetailsData} />
  );
}

export default function SaveOrderDetailsPage({ params }: Props) {
  const savedOrderId = params.id;

  const tGlobal: any = useTranslations("Global");
  const t: any = useTranslations("OrdrTmplte");

  return (
    <div className="page">
      <PageTitle
        withTitle
        content={t("SavedOrderDetails")}
        withBackText
        backText={tGlobal("Back")}
      />
      <Suspense fallback={<RenderSpinner />}>
        <OrderDetails savedOrderId={savedOrderId} />
      </Suspense>
    </div>
  );
}
