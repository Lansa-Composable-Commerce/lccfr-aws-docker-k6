"use client";

import React from "react";
import { useTranslations } from "next-intl";

import PageTitle from "@/components/ui/PageTitle";

import { useRouter } from "@/i18n/routing";

import { IGetInvoiceResponse } from "@/types";
import { STOREFRONT_ROUTES } from "@/utils/constants";

const InvoiceDetails = ({
  invoiceDetails,
}: {
  invoiceDetails: IGetInvoiceResponse;
}) => {
  const router = useRouter();

  const tInvoices = useTranslations("invoices");

  const shipToData = invoiceDetails?.data?.shipTo;
  const billToData = invoiceDetails?.data?.billTo;
  const invoiceData = invoiceDetails?.data?.invoice;
  const totalsData = invoiceDetails?.data?.totals;

  const goToOrderInquiryDetails = (orderNumber: any) => {
    router.push(`${STOREFRONT_ROUTES.ORDER_INQUIRY}/${orderNumber}`);
  };

  return (
    <>
      <PageTitle
        withTitle
        content={tInvoices("InvoiceDetails")}
        withBackText
        backText={tInvoices("BackToInvoices")}
      />
      <div className="mt-5">
        <div className="lg:mb-5 w-full flex flex-col md:flex-row gap-3 lg:gap-6">
          <div className="border border-dashed w-full bg-slate-100 px-3 py-2.5 lg:px-6 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-[32px] dark:bg-light-dark">
            <p className="text-sm sm:text-base  lg:text-xl mb-2">
              {tInvoices("ShipTo")}
            </p>
            <div className="text-xs lg:text-base tracking-wider">
              <p>{shipToData?.name}</p>
              <p>{shipToData?.company}</p>
              <p>{shipToData?.address1}</p>
              <p>{shipToData?.address2}</p>
              <p>{shipToData?.city}</p>
              <p>{billToData?.state}</p>
              <p>{shipToData?.postalCode}</p>
              <p>{shipToData?.cityStateZip}</p>
              <p>{shipToData?.country}</p>
            </div>
          </div>
          <div className="border border-dashed w-full bg-slate-100 px-3 py-2.5 lg:px-6 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-[32px] dark:bg-light-dark">
            <p className="text-sm sm:text-base lg:text-xl mb-2">
              {tInvoices("BillTo")}
            </p>
            <div className="text-xs lg:text-base tracking-wider">
              <p>{billToData?.name}</p>
              <p>{billToData?.company}</p>
              <p>{billToData?.address1}</p>
              <p>{billToData?.address2}</p>
              <p>{billToData?.city}</p>
              <p>{billToData?.state}</p>
              <p>{billToData?.postalCode}</p>
              <p>{billToData?.cityStateZip}</p>
              <p>{billToData?.country}</p>
            </div>
          </div>
        </div>

        {/*  invoice details*/}
        <div className="px-3 lg:px-6 w-full max-w-3xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-3 text-right">
            <div className="text-left w-full flex flex-col gap-1 p-2">
              <span className="capitalize form-label">
                {tInvoices("AccountNumber")}
              </span>
              <p className="text-base lg:text-xl font-medium">
                {invoiceData?.customerId}
              </p>
            </div>
            <div
              className="text-left w-full flex flex-col gap-1 hover:bg-gray02 cursor-pointer p-2 rounded-lg"
              onClick={() =>
                goToOrderInquiryDetails(invoiceData?.invoiceNumber)
              }
            >
              <span className="capitalize form-label">
                {tInvoices("OrderNumber")}
              </span>
              <p className="text-base lg:text-xl font-medium hover:underline text-brand">
                {invoiceData?.invoiceNumber}
              </p>
            </div>
            <div className="text-left w-full flex flex-col justify-end gap-1 p-2">
              <span className="capitalize form-label">
                {tInvoices("DateOfInvoice")}
              </span>
              <p className="text-base lg:text-xl font-medium">
                {invoiceData?.displayedInvoiceDate}
              </p>
            </div>
            <div className="text-left w-full flex flex-col justify-end gap-1 p-2">
              <span className="capitalize form-label">
                {tInvoices("InvoiceTotal")}
              </span>
              <p className="text-base lg:text-xl font-medium">
                {totalsData?.displayedInvoiceTotal || "- -"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDetails;
