import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// components
import OrderInquiryListTable from "@/components/tables/orders/OrderInquiryListTable";
import { SearchCriteria } from "@/components/OrderInquiry/SearchCriteria";
import OrderInquiryTitle from "@/components/OrderInquiry/OrderInquiryTitle";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale;

  const tOrderInquiry = await getTranslations({
    locale,
    namespace: "OrderInq",
  });

  return {
    title: `${tOrderInquiry("OrderInquiry")}`,
    description: `${tOrderInquiry("OrderInquiry")}`,
  };
}

export default async function OrderInquiryPage({
  searchParams,
}: {
  searchParams: { days: any; order: string; ponum: string };
}) {
  const queryDays = searchParams?.days;
  const queryOrder = searchParams?.order;
  const queryPONum = searchParams?.ponum;

  const queryPayload = {
    days: queryDays || "",
    order: queryOrder || "",
    ponum: queryPONum || "",
  };
  return (
    <div className="page">
      <OrderInquiryTitle />
      <div className="w-full flex items-center justify-between mb-4 lg:mb-7">
        <div className="w-full lg:w-1/2">
          <SearchCriteria />
        </div>
      </div>
      <OrderInquiryListTable queryPayload={queryPayload} />
    </div>
  );
}
