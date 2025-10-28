"use client";

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Toaster } from "react-hot-toast";

// components
import TablePagination from "@/components/ui/TablePagination";
import TableNoResultFound from "@/components/ui/TableNoResultFound";

import { useRouter } from "@/i18n/routing";
import {
  INITIAL_PAGE,
  ITEM_PER_PAGE,
  STOREFRONT_ROUTES,
} from "@/utils/constants";
import { Iinvoices, InvoicesListTypes } from "@/types";

import { SvgChevronDown } from "@/assets/svg";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getInvoicesInquiry,
  resetError,
  selectIsInvoiceInquiryData,
  selectIsLoading,
} from "@/lib/features/invoices/invoicesSlice";
import SpinnerLoading from "@/components/globalUI/SpinnerLoading";
import { showToast } from "@/components/globalUI/CustomToast";
import useSortData from "@/lib/hooks/useSortData";
import SortSelect from "@/components/SortSelect";

const RenderInvoicesList = ({
  invoiceNumber,
  invoiceTotal,
  balanceOwing,
  purchaseOrder,
  invoiceDate,
  invoiceCloseDate,
  onCollapse = false,
  onClickRow,
  children,
}: React.PropsWithChildren<InvoicesListTypes>) => {
  const tInvoices: any = useTranslations("invoices");

  let [isExpand, setIsExpand] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div
      className={classNames("table-list-data-container", {
        "pb-3": !isMobile,
      })}
    >
      <div onClick={!isMobile ? onClickRow : undefined}>
        <div className="relative grid h-auto grid-cols-2 items-center gap-3 py-4 sm:grid-cols-3 sm:gap-6 sm:py-2 lg:py-3 lg:grid-cols-6 lg:cursor-pointer">
          <div
            className="col-span-2 w-max px-4 text-sm text-brand font-medium uppercase tracking-wider cursor-pointer dark:text-white sm:text-sm sm:col-auto sm:px-8 md:text-center md:w-full lg:text-base"
            onClick={isMobile ? onClickRow : undefined}
          >
            <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
              {tInvoices("InvoiceNumber")}
            </span>
            {invoiceNumber}
          </div>
          <div className="px-4 text-xs text-left font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:col-auto md:text-right lg:text-base">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
              {tInvoices("InvoiceTotal")}
            </span>
            {invoiceTotal}
          </div>
          <div className="px-4 text-xs text-left  font-medium uppercase tracking-wider dark:text-white sm:text-sm md:text-right lg:text-base">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
              {tInvoices("BalanceOwing")}
            </span>
            {balanceOwing}
          </div>
          <div className=" px-4 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:px-8 sm:text-sm lg:block text-left break-words">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              {tInvoices("PurchaseOrder")}
            </span>
            {purchaseOrder || "- -"}
          </div>
          <div className="px-4 text-xs text-left font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:block md:text-right lg:text-base">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              {tInvoices("DateOfInvoice")}
            </span>
            {invoiceDate}
          </div>
          <div className="hidden px-4 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:block text-right">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              {tInvoices("CloseDate")}
            </span>
            {invoiceCloseDate || "- -"}
          </div>
        </div>
      </div>
      <div
        onClick={() => setIsExpand(!isExpand)}
        className="w-full bg-gray-100 flex justify-center sm:hidden "
      >
        <SvgChevronDown
          className={classNames(
            "size-6 text-gray-500 transition-transform ease-in-out duration-300",
            {
              "rotate-180": isExpand,
            },
          )}
        />
      </div>
      {onCollapse && isMobile && (
        <AnimatePresence initial={false}>
          {isExpand && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="border-t border-dashed border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-8 sm:py-6">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const InvoicesInquiryListTable = ({ queryPayload }: any) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const invoiceDataInquiry = useAppSelector(selectIsInvoiceInquiryData);

  const tMessages: any = useTranslations("Messages");
  const tInvoices: any = useTranslations("invoices");

  const router = useRouter();

  const { sortedData, sortConfig, handleSort } = useSortData<Iinvoices>(
    invoiceDataInquiry?.data || [],
    "invoiceNumber",
  );

  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  const startIndex = (currentPage - INITIAL_PAGE) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const currentItems = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const onClickRow = async (value: { invoiceNumber: string }) => {
    router.push(`${STOREFRONT_ROUTES.INVOICES}/${value.invoiceNumber}`);
  };

  useEffect(() => {
    setCurrentPage(INITIAL_PAGE);
  }, [invoiceDataInquiry]);

  useEffect(() => {
    dispatch(getInvoicesInquiry(queryPayload));
  }, [queryPayload]);

  useEffect(() => {
    if (invoiceDataInquiry?.success === false) {
      showToast("error", invoiceDataInquiry?.errors[0]?.message);
      dispatch(resetError());
      return;
    }
  }, [dispatch, invoiceDataInquiry]);

  const invoiceHeaders = [
    {
      label: tInvoices("InvoiceNumber"),
      key: "invoiceNumber",
      align: "center",
    },
    {
      label: tInvoices("InvoiceTotal"),
      key: "invoiceTotal",
      align: "right",
    },
    {
      label: tInvoices("BalanceOwing"),
      key: "balanceOwing",
      align: "right",
    },
    {
      label: tInvoices("PurchaseOrder"),
      key: "invoicePO",
      align: "left",
      showLg: true,
    },
    {
      label: tInvoices("DateOfInvoice"),
      key: "displayedInvoiceDate",
      align: "right",
      showLg: true,
    },
    {
      label: tInvoices("CloseDate"),
      key: "displayedInvoiceCloseDate",
      align: "right",
      showLg: true,
    },
  ];

  return (
    <div className="w-full mb-4">
      <SortSelect<Iinvoices>
        header={invoiceHeaders}
        sortConfig={sortConfig}
        handleSort={handleSort}
      />

      <div className="mx-auto w-full">
        <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-6 uppercase">
          {invoiceHeaders.map(({ label, key, align, showLg }) => (
            <span
              key={key}
              onClick={() => handleSort(key as keyof Iinvoices)}
              className={classNames(
                "px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 cursor-pointer flex items-center gap-1",
                {
                  "justify-end text-right": align === "right",
                  "justify-center text-center": align === "center",
                  "justify-start text-left": align === "left",
                  "hidden lg:flex": showLg,
                  "sm:flex": !showLg,
                },
              )}
            >
              {label}
              {sortConfig?.key === key && (
                <SvgChevronDown
                  className={classNames("transition-transform size-4", {
                    "rotate-180": sortConfig.direction === "asc",
                  })}
                />
              )}
            </span>
          ))}
        </div>
        {isLoading ? (
          <div className="my-10">
            <SpinnerLoading />
          </div>
        ) : (
          currentItems &&
          currentItems.map((invoice: Iinvoices) => (
            <RenderInvoicesList
              key={invoice.invoiceNumber}
              invoiceNumber={invoice.invoiceNumber}
              invoiceTotal={invoice.displayedInvoiceTotal}
              balanceOwing={invoice.displayedBalanceOwing}
              purchaseOrder={invoice.invoicePO}
              invoiceDate={invoice.displayedInvoiceDate}
              invoiceCloseDate={invoice.displayedInvoiceCloseDate}
              onCollapse={true}
              onClickRow={() => onClickRow(invoice)}
            >
              <div className=" px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm sm:hidden text-center">
                <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 lg:hidden">
                  {tInvoices("CloseDate")}
                </span>
                {invoice.displayedInvoiceCloseDate}
              </div>
            </RenderInvoicesList>
          ))
        )}
        {!isLoading && invoiceDataInquiry?.data?.length > ITEM_PER_PAGE && (
          <TablePagination
            items={invoiceDataInquiry?.data}
            itemsPerPage={ITEM_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
        {!isLoading && invoiceDataInquiry?.data?.length <= 0 && (
          <TableNoResultFound content={tMessages("RecordsNotFound")} />
        )}
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default InvoicesInquiryListTable;
