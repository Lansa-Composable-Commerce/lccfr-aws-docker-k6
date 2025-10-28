"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import { useTranslations } from "next-intl";

import {
  SavedOrderDetailsListTypes,
  SavedOrderDetailsResponseTypes,
} from "@/types";
import { INITIAL_PAGE, ITEM_PER_PAGE } from "@/utils/constants";
import TablePagination from "@/components/ui/TablePagination";

const RenderSaveOrderList = ({
  productCode,
  quantity,
  description,
  displayedUnitPrice,
  displayedExtendedPrice,
}: React.PropsWithChildren<SavedOrderDetailsListTypes>) => {
  const t: any = useTranslations("OrdrTmplte");

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div
      className={classNames("order-template-container", {
        "pb-3": !isMobile,
      })}
    >
      <div className="uppercase text-xs md:text-sm lg:text-base tracking-wider font-medium grid h-auto grid-cols-2 items-center gap-3 py-4 sm:grid-cols-6 sm:gap-6 sm:py-2 lg:py-3 dark:text-white">
        <div className="px-4 sm:col-auto text-left sm:text-center">
          {/* <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
            Item Code
          </span>*/}
          <span className="text-sm lg:text-base">{productCode}</span>
        </div>
        <div className="px-4 py-2 lg:py-0 col-span-2 text-center">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
            {t("Description")}
          </span>
          {description}
        </div>
        <div className="px-4  sm:col-auto text-center md:text-right">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
            {t("UnitPrice")}
          </span>
          {displayedUnitPrice}
        </div>
        <div className="px-4  sm:col-auto text-center md:text-right">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
            {t("Quantity")}
          </span>
          {quantity}
        </div>
        <div className="col-span-2 px-4 sm:col-auto text-center md:text-right">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
            {t("ExtendedPrice")}
          </span>
          {displayedExtendedPrice}
        </div>
      </div>
    </div>
  );
};

const SaveOrderDetailsList = ({
  savedOrderDetailsData,
}: {
  savedOrderDetailsData: SavedOrderDetailsResponseTypes;
}) => {
  const t: any = useTranslations("OrdrTmplte");

  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  // pagination
  const startIndex = (currentPage - INITIAL_PAGE) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const currentItems =
    savedOrderDetailsData &&
    savedOrderDetailsData?.orderItems.slice(startIndex, endIndex);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="mx-auto w-full">
      <div className="mb-3 hidden grid-cols-4 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid sm:grid-cols-6 uppercase">
        <span className="order-template-list-header text-center">
          {t("ItemCode")}
        </span>

        <span className="col-auto sm:col-span-2 line-clamp-2 order-template-list-header text-center">
          {t("Description")}
        </span>
        <span className="order-template-list-header text-right">
          {t("UnitPrice")}
        </span>
        <span className="order-template-list-header text-right">
          {t("Quantity")}
        </span>
        <span className="order-template-list-header text-right">
          {t("ExtendedPrice")}
        </span>
      </div>
      {currentItems &&
        currentItems.map((item) => (
          <RenderSaveOrderList key={item.productCode} {...item} />
        ))}
      {savedOrderDetailsData?.orderItems.length > ITEM_PER_PAGE && (
        <TablePagination
          items={savedOrderDetailsData?.orderItems}
          itemsPerPage={ITEM_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SaveOrderDetailsList;
