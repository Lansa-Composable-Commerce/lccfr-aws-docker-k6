import React from "react";
import { Metadata } from "next";

// components
import InvoiceDetailsListTable from "@/components/tables/invoices/InvoiceDetailsListTable";
import InvoiceDetails from "@/components/Invoice/InvoiceDetails";

// api
import { getInvoice } from "@/api/invoices/getInvoice";
import { getTranslations } from "next-intl/server";
import { IGetInvoiceResponse } from "@/types";
import PageTitle from "@/components/ui/PageTitle";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";

type Props = {
  params: { locale: string; id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const locale = params.locale;

  const tInvoice = await getTranslations({ locale, namespace: "invoices" });

  return {
    title: `${tInvoice("invoice")} ${id}`,
    description: `${tInvoice("invoice")} details page`,
  };
}

export default async function InvoiceDetailsPage({ params }: Props) {
  const tInvoices = await getTranslations("invoices");
  const invoiceId = params.id;
  const invoiceDataResponse: IGetInvoiceResponse = await getInvoice(invoiceId);

  return (
    <div className="page">
      {invoiceDataResponse.success ? (
        <>
          <InvoiceDetails invoiceDetails={invoiceDataResponse} />
          <InvoiceDetailsListTable invoiceData={invoiceDataResponse} />
        </>
      ) : (
        <>
          <PageTitle
            withTitle
            content={tInvoices("InvoiceDetails")}
            withBackText
            backText={tInvoices("BackToInvoices")}
          />
          <EmptyPlaceholder>
            <p className="text-sm lg:text-2xl text-center font-medium text-gray-600 tracking-wide">
              {tInvoices("InvoiceNotFound")}
            </p>
          </EmptyPlaceholder>
        </>
      )}
    </div>
  );
}
