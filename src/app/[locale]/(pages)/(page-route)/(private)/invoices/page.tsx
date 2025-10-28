import React from "react";
import { Metadata } from "next";

// components
import InvoicesInquiryListTable from "@/components/tables/invoices/InvoicesInquiryListTable";
import InvoiceAccountSummary from "@/components/Invoice/InvoiceAccountSummary";
import InvoiceSearchCriteria from "@/components/Invoice/InvoiceSearchCriteria";

import { LocalePropsType } from "@/types";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: LocalePropsType): Promise<Metadata> {
  const locale = params.locale;

  const tInvoice = await getTranslations({ locale, namespace: "invoices" });

  return {
    title: `${tInvoice("Invoices")}`,
    description: `${tInvoice("Invoices")}`,
  };
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: { days: number; id: string; ponum: string };
}) {
  const queryDays = searchParams?.days;
  const queryId = searchParams?.id;
  const queryPONum = searchParams?.ponum;

  const queryPayload = {
    days: queryDays || "",
    id: queryId || "",
    ponum: queryPONum || "",
  };

  return (
    <div className="page">
      <InvoiceAccountSummary />
      <InvoiceSearchCriteria />
      <InvoicesInquiryListTable queryPayload={queryPayload} />
    </div>
  );
}
