"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// components
import TablePagination from "@/components/ui/TablePagination";
import TableNoResultFound from "@/components/ui/TableNoResultFound";

import {
  INITIAL_PAGE,
  ITEM_PER_PAGE,
  STOREFRONT_ROUTES,
} from "@/utils/constants";

import { IGetInvoiceResponse, Iinvoice, InvoiceListTypes } from "@/types";

const RenderInvoiceDetailsList = ({
  productCode,
  productDescription,
  productSize,
  productColor,
  displayedUnitPrice,
  unitOfMeasure,
  displayedLineTotal,
}: React.PropsWithChildren<InvoiceListTypes>) => {
  const tInvoices = useTranslations("invoices");

  return (
    <div
      className={classNames(
        "relative py-3 px-3 mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark text-black01 min-h-[70px] w-full",
      )}
    >
      <div className="relative grid h-auto grid-cols-2 items-center gap-3 sm:grid-cols-3 sm:gap-6 sm:py-0 lg:py-3 lg:grid-cols-6 overflow-auto">
        <div className="flex md:justify-center items-center px-3 lg:px-0 h-full  text-sm lg:text-base font-medium uppercase tracking-wider dark:text-brand sm:col-auto text-left sm:text-center">
          {productCode}
        </div>
        <div className="px-3 col-span-2 font-medium uppercase tracking-wider dark:text-white text-xs sm:text-sm lg:text-base text-left flex flex-col">
          {productDescription}
          <span className=" text-xs sm:text-sm">
            <span className="capitalize">size:</span> {productSize}
          </span>
          <span className=" text-xs sm:text-sm">
            <span className="capitalize">color:</span> {productColor}
          </span>
        </div>
        <div className="px-3 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:text-base text-right">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tInvoices("UnitPrice")}
          </span>
          {displayedUnitPrice}
          <span className="sm:hidden">{unitOfMeasure}</span>
        </div>
        <div className="hidden text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:text-base sm:block text-center">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tInvoices("Unit")}
          </span>
          {unitOfMeasure || "- -"}
        </div>
        <div className="px-3 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:text-base sm:block text-right">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tInvoices("Total")}
          </span>
          {displayedLineTotal || "- -"}
        </div>
      </div>
    </div>
  );
};

const InvoiceDetailsListTable = ({
  invoiceData,
}:
  | {
      invoiceData: IGetInvoiceResponse;
    }
  | any) => {
  const tMessages = useTranslations("Messages");
  const tInvoices = useTranslations("invoices");
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  const startIndex = (currentPage - INITIAL_PAGE) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const currentItems = invoiceData?.data?.products.slice(startIndex, endIndex);

  const myInvoiceNumber = invoiceData?.data?.invoice?.invoiceNumber;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const goToOrderDetails = () => {
    router.push(`${STOREFRONT_ROUTES.ORDER_INQUIRY}/${myInvoiceNumber}`);
  };

  useEffect(() => {
    if (!invoiceData.success) {
      toast.error(invoiceData.messages);
      return;
    }
  }, [invoiceData]);

  return (
    <div className="w-full mt-2.5 lg:my-5">
      <div className="mx-auto w-full">
        <div className="px-3 mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-6 uppercase">
          <span className="px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-center">
            {tInvoices("ItemCode")}
          </span>
          <span className="lg:col-span-2 px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-center">
            {tInvoices("Description")}
          </span>
          <span className="hidden px-3 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-right">
            {tInvoices("UnitPrice")}
          </span>
          <span className="hidden px-3 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-center">
            {tInvoices("Unit")}
          </span>{" "}
          <span className="hidden px-3 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-right">
            {tInvoices("ExtendedPrice")}
          </span>
        </div>

        {currentItems.map((item: Iinvoice) => (
          <RenderInvoiceDetailsList
            key={item.productCode}
            productCode={item.productCode}
            lineNumber={item.lineNumber}
            productDescription={item.productDescription}
            productColor={item.productColor}
            productSize={item.productSize}
            unitOfMeasure={item.unitOfMeasure}
            displayedUnitPrice={item.displayedUnitPrice}
            displayedLineTotal={item.displayedLineTotal}
          />
        ))}
        {invoiceData?.data?.products.length > ITEM_PER_PAGE && (
          <TablePagination
            items={invoiceData?.data?.products}
            itemsPerPage={ITEM_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
        {invoiceData?.data?.products.length <= 0 && (
          <TableNoResultFound content={tMessages("RecordsNotFound")} />
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default InvoiceDetailsListTable;
