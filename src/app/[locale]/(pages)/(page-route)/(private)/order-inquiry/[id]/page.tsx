import React from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

// components
import OrderDetailsTable from "@/components/tables/orders/OrderDetailsTable";
import OrderDetailsDescription from "@/components/OrderDetailsDescription";

// api
import { getOrderDetails } from "@/api/orders/getOrderDetails";
import OrderDetailsSubTotalSection from "@/components/OrderDetailsSubTotalSection";
import PageTitle from "@/components/ui/PageTitle";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";

type Props = {
  params: { locale: string; id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const locale = params.locale;

  const tOrderInquiry = await getTranslations({
    locale,
    namespace: "OrderInq",
  });

  return {
    title: `${tOrderInquiry("Order")} ${id}`,
    description: `${tOrderInquiry("Order")}`,
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const tOrderInquiryDetails = await getTranslations("OrdrDtails");
  const tGlobal = await getTranslations("Global");
  const orderId = params.id;
  const orderDetails = await getOrderDetails(orderId);

  return (
    <section className="container mx-auto px-4 pb-10">
      {orderDetails && orderDetails.product ? (
        <>
          <OrderDetailsDescription orderDetails={orderDetails} />
          <OrderDetailsTable ordersDetails={orderDetails} />
          <OrderDetailsSubTotalSection orderDetails={orderDetails} />
        </>
      ) : (
        <>
          <PageTitle
            withTitle
            content={tOrderInquiryDetails("OrderDetails")}
            withBackText
            backText={tGlobal("Back")}
          />
          <EmptyPlaceholder>
            <p className="text-sm lg:text-2xl text-center font-medium text-gray-600 tracking-wide">
              {tOrderInquiryDetails("OrderNotFound")}
            </p>
          </EmptyPlaceholder>
        </>
      )}
    </section>
  );
}
