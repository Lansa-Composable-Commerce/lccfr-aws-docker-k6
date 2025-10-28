"use client";

import { PropsWithChildren, useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import classNames from "classnames";
import { useTranslations } from "next-intl";

// components

import TablePagination from "@/components/ui/TablePagination";
import TableNoResultFound from "@/components/ui/TableNoResultFound";

import {
  INITIAL_PAGE,
  ITEM_PER_PAGE,
  STOREFRONT_ROUTES,
} from "@/utils/constants";

import { useRouter } from "@/i18n/routing";

import { IOrderInquiryListProps, OrderInquiryListTypes } from "@/types";

import { SvgChevronDown } from "@/assets/svg";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getOrderInquiry,
  resetError,
  selectIsLoading,
  selectIsOrderInquiryData,
} from "@/lib/features/orderInquiry/orderInquirySlice";
import SpinnerLoading from "@/components/globalUI/SpinnerLoading";
import { showToast } from "@/components/globalUI/CustomToast";
import useSortData from "@/lib/hooks/useSortData";
import SortSelect from "@/components/SortSelect";

const RenderOrderInquiryList = ({
  orderNumber,
  orderTotal,
  purchaseOrder,
  orderDate,
  shipDate,
  tracking,
  children,
  onCollapse = false,
  onClickRow,
}: PropsWithChildren<OrderInquiryListTypes>) => {
  const tOrderInquiry: any = useTranslations("OrderInq");
  let [isExpand, setIsExpand] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div
      className={classNames("table-list-data-container", {
        "pb-3": !isMobile,
      })}
    >
      <div onClick={!isMobile ? onClickRow : undefined}>
        <div className="relative grid h-auto grid-cols-2 items-center gap-3 py-4 sm:grid-cols-3 sm:gap-6 sm:py-2 lg:py-3 lg:grid-cols-6 lg:cursor-pointer ">
          <div
            className="col-span-2 w-max px-4 text-sm text-brand font-medium uppercase tracking-wider cursor-pointer dark:text-white sm:text-sm sm:col-auto md:w-full md:text-center lg:text-base"
            onClick={isMobile ? onClickRow : undefined}
          >
            <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
              {tOrderInquiry("OrderNumber")}
            </span>
            {orderNumber}
          </div>
          <div className="px-4 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:col-auto md:text-right lg:text-base">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
              {tOrderInquiry("OrderTotal")}
            </span>
            {orderTotal}
          </div>
          <div className="px-4 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm text-left break-words">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
              {tOrderInquiry("PurchaseOrder")}
            </span>
            {purchaseOrder || "- -"}
          </div>
          <div className=" px-4 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm md:text-right lg:block lg:text-base ">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              {tOrderInquiry("OrderDate")}
            </span>
            {orderDate || "- -"}
          </div>
          <div className=" px-4 text-xs font-medium uppercase tracking-wider dark:text-white sm:text-sm md:text-right lg:block lg:text-base ">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              {tOrderInquiry("ShipDate")}
            </span>
            {shipDate || "- -"}
          </div>
          <div className="hidden px-4 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:block text-center">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              {tOrderInquiry("Tracking")}
            </span>
            {tracking || "- -"}
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

const OrderInquiryListTable = ({ queryPayload }: { queryPayload: any }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectIsLoading);
  const orderInquiryData = useAppSelector(selectIsOrderInquiryData);

  const tOrderInquiry: any = useTranslations("OrderInq");
  const tMessages: any = useTranslations("Messages");

  const { sortedData, sortConfig, handleSort } =
    useSortData<IOrderInquiryListProps>(
      orderInquiryData?.data || [],
      "orderNumber",
    );

  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  const startIndex = (currentPage - INITIAL_PAGE) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const currentItems =
    sortedData.length > 0 ? sortedData.slice(startIndex, endIndex) : [];

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const onClickRow = async (value: IOrderInquiryListProps) => {
    router.push(`${STOREFRONT_ROUTES.ORDER_INQUIRY}/${value.orderNumber}`);
  };

  useEffect(() => {
    setCurrentPage(INITIAL_PAGE);
  }, [orderInquiryData]);

  useEffect(() => {
    dispatch(getOrderInquiry(queryPayload));
  }, [queryPayload]);

  useEffect(() => {
    if (orderInquiryData?.success === false) {
      showToast("error", orderInquiryData?.errors[0]?.message);
      dispatch(resetError());
      return;
    }
  }, [dispatch, orderInquiryData]);

  const orderInquiryHeaders = [
    {
      label: tOrderInquiry("OrderNumber"),
      key: "orderNumber",
      align: "center",
    },
    {
      label: tOrderInquiry("OrderTotal"),
      key: "orderTotal",
      align: "right",
    },
    {
      label: tOrderInquiry("PurchaseOrder"),
      key: "purchaseOrderNumber",
      align: "left",
    },
    {
      label: tOrderInquiry("OrderDate"),
      key: "displayedOrderDate",
      align: "right",
    },
    {
      label: tOrderInquiry("ShipDate"),
      key: "displayedShippingDate",
      align: "right",
      showLg: true,
    },
    {
      label: tOrderInquiry("Tracking"),
      key: "trackingNumber",
      align: "center",
    },
  ];

  return (
    <>
      <div className="w-full mb-4">
        <SortSelect<IOrderInquiryListProps>
          header={orderInquiryHeaders}
          sortConfig={sortConfig}
          handleSort={handleSort}
        />

        <div className="mx-auto w-full">
          <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-6 uppercase">
            {orderInquiryHeaders.map(({ label, key, align, showLg }) => (
              <span
                key={key}
                onClick={() => handleSort(key as keyof IOrderInquiryListProps)}
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
            currentItems.map((order: IOrderInquiryListProps) => (
              <RenderOrderInquiryList
                key={order?.orderNumber}
                orderNumber={order?.orderNumber}
                orderTotal={order.displayedOrderTotal}
                purchaseOrder={order?.purchaseOrderNumber}
                orderDate={order?.displayedOrderDate}
                shipDate={order?.displayedShippingDate}
                tracking={order?.trackingNumber}
                onClickRow={() => onClickRow(order)}
                onCollapse={true}
              >
                <div className=" px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm sm:hidden text-center">
                  <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 lg:hidden">
                    {tOrderInquiry("Tracking")}
                  </span>
                  {order?.trackingNumber || "- -"}
                </div>
              </RenderOrderInquiryList>
            ))
          )}
          {!isLoading && orderInquiryData?.data?.length > ITEM_PER_PAGE && (
            <TablePagination
              items={orderInquiryData?.data}
              itemsPerPage={ITEM_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
          {!isLoading && orderInquiryData?.data?.length <= 0 && (
            <TableNoResultFound content={tMessages("RecordsNotFound")} />
          )}
        </div>
      </div>
    </>
  );
};

export default OrderInquiryListTable;
