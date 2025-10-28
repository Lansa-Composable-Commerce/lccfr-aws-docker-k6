"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import PageTitle from "@/components/ui/PageTitle";
import Button from "@/components/globalUI/Button";

import { IinvoiceSummaryProps } from "@/types";
import {
  getInvoicesSummary,
  selectIsInvoiceSummaryData,
  selectIsLoading,
} from "@/lib/features/invoices/invoicesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const InvoiceAccountSummary = () => {
  const dispatch = useAppDispatch();
  const invoiceSummary: IinvoiceSummaryProps = useAppSelector(
    selectIsInvoiceSummaryData,
  );
  const isLoading = useAppSelector(selectIsLoading);
  const tInvoices: any = useTranslations("invoices");

  const [isAccountSummaryVisible, setIsAccountSummaryVisible] = useState(false);

  const onDisplayAccountSummary = () => {
    setIsAccountSummaryVisible(!isAccountSummaryVisible);
  };

  useEffect(() => {
    dispatch(getInvoicesSummary());
  }, []);

  return (
    <>
      <PageTitle withTitle content={tInvoices("Invoices")} />
      <div className="mb-5 w-full">
        <div className="mb-2.5 flex items-center justify-end">
          <Button
            variant="secondary"
            className="px-4 py-2"
            onClick={onDisplayAccountSummary}
          >
            <p className="text-right text-xs md:text-base lg:block lg:text-lg font-medium text-brand/80 dark:text-white ">
              {tInvoices("AccountSummary")}
            </p>
          </Button>
        </div>
        {isAccountSummaryVisible && (
          <div className="px-3 py-2.5 lg:px-6 lg:py-5 border border-dashed border-slate-200 rounded-lg sm:rounded-xl lg:rounded-[32px]">
            <div className="w-full flex flex-col sm:flex-row items-start justify-between gap-3">
              <div>
                <p className="text-sm sm:text-base lg:text-xl mb-2">
                  {tInvoices("Address")}
                </p>
                <div className="text-xs lg:text-base tracking-wider">
                  <p>{invoiceSummary?.customer?.name}</p>
                  <p>{invoiceSummary?.customer?.address1}</p>
                  <p>{invoiceSummary?.customer?.address2}</p>
                  <p>{invoiceSummary?.customer?.city}</p>
                  <p>{invoiceSummary?.customer?.state}</p>
                  <p>{invoiceSummary?.customer?.postalCode}</p>
                  <p>{invoiceSummary?.customer?.country}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm sm:text-base  lg:text-xl mb-2">
                  {tInvoices("Summary")}
                </p>
                <div className="text-xs lg:text-base tracking-wider">
                  <p>
                    {tInvoices("Currency")}:{" "}
                    <span className="font-medium">
                      {invoiceSummary?.summary?.currencyCode}
                    </span>
                  </p>
                  <p>
                    {tInvoices("AcctRcvBal")}:{" "}
                    <span className="font-medium">
                      {invoiceSummary?.summary?.displayedOpenAR}
                    </span>
                  </p>
                  <p>
                    {tInvoices("OpenOrderAmount")}:{" "}
                    <span className="font-medium">
                      {invoiceSummary?.summary?.displayedOpenAmount}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InvoiceAccountSummary;
