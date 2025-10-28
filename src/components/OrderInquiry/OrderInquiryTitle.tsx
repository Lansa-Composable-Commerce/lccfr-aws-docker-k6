import React from "react";
import PageTitle from "@/components/ui/PageTitle";
import { useTranslations } from "next-intl";

const OrderInquiryTitle = () => {
  const tOrderInquiry: any = useTranslations("OrderInq");

  return <PageTitle withTitle content={tOrderInquiry("OrderInquiry")} />;
};

export default OrderInquiryTitle;
