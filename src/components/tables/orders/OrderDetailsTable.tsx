"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";

import TablePagination from "@/components/ui/TablePagination";
import TableNoResultFound from "@/components/ui/TableNoResultFound";

import { ITEM_PER_PAGE } from "@/utils/constants";

import { IOrderDetailsResponse, OrderDetailsListTypes } from "@/types";

const RenderOrderDetailsList = ({
  productCode,
  productDescription,
  unitPrice,
  unitOfMeasure,
  lineQuantity,
  shippingDate,
  displayedLineTotal,
  onClickRow,
  tOrderInquiryDetails,
}: React.PropsWithChildren<OrderDetailsListTypes>) => {
  return (
    <div
      className={classNames(
        "relative py-3 px-3 mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark text-black01 min-h-[70px] w-full",
      )}
      onClick={onClickRow}
    >
      <div className="relative grid h-auto grid-cols-2 items-center gap-3 sm:grid-cols-3 sm:gap-6 sm:py-0 lg:py-3 lg:grid-cols-8  overflow-auto">
        <div className="col-span-2 text-sm lg:text-base font-medium uppercase tracking-wider dark:text-white  sm:col-auto text-left md:text-center">
          {productCode}
        </div>
        <div className="col-span-2 w-full px-4 text-xs  font-medium tracking-wider dark:text-white sm:text-sm lg:text-base text-left">
          {productDescription}
        </div>
        <div className="px-3 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:text-base text-right lg:text-right lg:px-3">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tOrderInquiryDetails("UnitPrice")}
          </span>
          {unitPrice} <span className="lg:hidden">{unitOfMeasure}</span>
        </div>
        <div className="hidden text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:text-base lg:block text-right sm:text-center lg:px-3">
          {unitOfMeasure || "- -"}
        </div>
        <div className="px-3 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:text-base lg:block text-right lg:px-3">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tOrderInquiryDetails("LineQuantity")}
          </span>
          {lineQuantity}
        </div>
        <div className="px-3 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:text-base lg:block text-right">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tOrderInquiryDetails("Total")}
          </span>
          {displayedLineTotal}
        </div>
        <div className="px-3 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:text-base lg:block text-right">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tOrderInquiryDetails("ShipDate")}
          </span>
          {shippingDate}
        </div>
      </div>
    </div>
  );
};

const OrderDetailsTable = ({
  ordersDetails,
}: {
  ordersDetails: IOrderDetailsResponse;
}) => {
  const tOrderInquiryDetails: any = useTranslations("OrdrDtails");
  const tMessages: any = useTranslations("Messages");

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const currentItems = ordersDetails.product.slice(startIndex, endIndex);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="w-full my-5">
      <div className="mx-auto w-full">
        <div className="px-3 mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-8 uppercase">
          <span className="px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-center">
            {tOrderInquiryDetails("ItemCode")}
          </span>
          <span className="col-span-2 px-4  py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 line-clamp-2 text-center">
            {tOrderInquiryDetails("Description")}
          </span>
          <span className="px-3 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-right">
            {tOrderInquiryDetails("UnitPrice")}
          </span>
          <span className="hidden px-3 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-right sm:text-center">
            {tOrderInquiryDetails("Unit")}
          </span>
          <span className="hidden px-3 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-right">
            {tOrderInquiryDetails("Quantity")}
          </span>
          <span className="hidden px-3 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-right">
            {tOrderInquiryDetails("ExtendedPrice")}
          </span>
          <span className="hidden px-3 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-right">
            {tOrderInquiryDetails("ShipDate")}
          </span>
        </div>

        {currentItems.map((item: any) => (
          <RenderOrderDetailsList
            key={item.productCode}
            productCode={item?.productCode}
            productDescription={item?.productDescription}
            unitPrice={item?.displayedUnitPrice}
            unitOfMeasure={item?.unitOfMeasure}
            lineQuantity={item?.lineQuantity}
            shippingDate={item?.displayedShippingDate}
            displayedLineTotal={item?.displayedLineTotal}
            tOrderInquiryDetails={tOrderInquiryDetails}
          />
        ))}
        {ordersDetails?.product.length > ITEM_PER_PAGE && (
          <TablePagination
            items={ordersDetails?.product}
            itemsPerPage={ITEM_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
        {ordersDetails?.product.length <= 0 && (
          <TableNoResultFound content={tMessages("RecordsNotFound")} />
        )}
      </div>
    </div>
  );
};

export default OrderDetailsTable;
