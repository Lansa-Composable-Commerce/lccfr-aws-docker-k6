import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  OrderTemplateItem,
  OrderTemplateListTypes,
  SavedOrderResponseTypes,
} from "@/types";
import { useMediaQuery } from "react-responsive";
import classNames from "classnames";
import { SfTooltip } from "@storefront-ui/react";

import SaveOrderRemoveModal from "@/components/orderTemplate/SaveOrderRemoveModal";
import TablePagination from "@/components/ui/TablePagination";
import { showToast } from "@/components/globalUI/CustomToast";

import {
  GTM_EVENTS,
  INITIAL_PAGE,
  ITEM_PER_PAGE,
  STOREFRONT_ROUTES,
} from "@/utils/constants";
import { useRouter } from "@/i18n/routing";
import { useAppDispatch } from "@/lib/hooks";
import {
  addToCartSavedOrder,
  getSavedOrderNumber,
  setRemoveModalVisible,
} from "@/lib/features/orderTemplate/orderTemplateSlice";

import { useGetCartQuery } from "@/services/cartApi";

import { SvgBin, SvgCart, SvgSpinner } from "@/assets/svg";
import { sendGTMEvent } from "@next/third-parties/google";

const RenderOrderTemplateList = ({
  savedOrderNumber,
  savedOrderDescription,
  displayedCreatedAt,
  onClickRow,
  onClickAddToCart,
  onClickRemove,
}: React.PropsWithChildren<OrderTemplateListTypes>) => {
  const t: any = useTranslations("OrdrTmplte");
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const handleAddToCartClick = async (e: any) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    if (onClickAddToCart) {
      await onClickAddToCart();
    }
    setIsAddingToCart(false);
  };

  return (
    <div
      className={classNames("order-template-container cursor-pointer", {
        "pb-3": !isMobile,
      })}
      onClick={onClickRow}
    >
      <div>
        <div className="text-xs md:text-sm lg:text-base tracking-wider font-medium grid h-auto grid-cols-2 items-center gap-3 py-4 sm:grid-cols-5 sm:gap-6 sm:py-2 md:grid-cols-5 lg:py-3 lg:grid-cols-5 dark:text-white">
          <div className="px-4 sm:col-auto text-left sm:text-center text-brand">
            <span className="text-sm lg:text-base dark:text-primary-300">
              {savedOrderNumber}
            </span>
          </div>
          <div className="uppercase px-4 py-2 lg:py-0  col-span-2 text-center">
            <span className=" mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
              {t("SavedOrderDesc")}
            </span>
            {savedOrderDescription}
          </div>
          <div className="px-4  sm:col-auto text-center md:text-right">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
              {t("DateSaved")}
            </span>
            {displayedCreatedAt}
          </div>
          <div className=" px-4 sm:col-auto text-left md:text-center">
            <div className="w-full h-full flex items-center justify-center  gap-x-2 lg:gap-x-5 text-black01">
              <SfTooltip
                label={isAddingToCart ? `${t("Adding")}...` : t("AddToCart")}
              >
                <button
                  type="button"
                  onClick={(e) => handleAddToCartClick(e)}
                  className="translate-05 h-full pt-1.5"
                  disabled={isAddingToCart}
                  aria-label="add to cart"
                >
                  {isAddingToCart ? (
                    <SvgSpinner className="size-6 lg:size-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary-500" />
                  ) : (
                    <SvgCart className="size-6 lg:size-8 dark:text-gray-200 hover:dark:text-gray-50" />
                  )}
                </button>
              </SfTooltip>

              <SfTooltip label={t("RmvSavedOrder")}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClickRemove) {
                      onClickRemove();
                    }
                  }}
                  className="translate-05 h-full pt-1.5"
                  aria-label="remove"
                >
                  <SvgBin className="size-6 lg:size-7 dark:text-gray-200 hover:text-red-500 dark:hover:text-red-500" />
                </button>
              </SfTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderTemplateList = ({
  savedOrderData,
}: {
  savedOrderData: SavedOrderResponseTypes[];
}) => {
  const dispatch = useAppDispatch();

  const tMessages = useTranslations("Messages");
  const t: any = useTranslations("OrdrTmplte");

  const router = useRouter();

  const { refetch: refetchCart } = useGetCartQuery({});

  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  const startIndex = (currentPage - INITIAL_PAGE) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const currentItems =
    savedOrderData && savedOrderData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const handleRowClick = async (item: OrderTemplateItem) => {
    router.push(`${STOREFRONT_ROUTES.ORDER_TEMPLATE}/${item.savedOrderNumber}`);
  };
  const handleAddToCart = async (item: OrderTemplateItem) => {
    const response = await dispatch(
      addToCartSavedOrder({ order: item?.savedOrderNumber }),
    );

    if (response.meta.requestStatus === "fulfilled") {
      showToast("success", tMessages(response.payload.data.messages[0].code));

      // add to cart
      sendGTMEvent({
        event: GTM_EVENTS.ADD_TO_CART,
        currency: "USD",
        items: response?.payload?.data?.products.map((item: any) => {
          return {
            item_name: item?.productDesc,
            item_id: item?.productCode,
            item_category: item?.categoryName,
            quantity: Number(item.quantity),
            price: item?.lineTotal,
          };
        }),
      });

      await refetchCart();
    }
  };

  const handleRemoveModal = async (item: OrderTemplateItem) => {
    dispatch(setRemoveModalVisible());
    dispatch(getSavedOrderNumber(item.savedOrderNumber));
  };

  return (
    <>
      <div className="mx-auto w-full">
        <div className="mb-3 hidden grid-cols-4 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid sm:grid-cols-5 uppercase">
          <span className="order-template-list-header text-center">
            {t("SavedOrderNumber")}
          </span>
          <span className="col-auto sm:col-span-2 line-clamp-2 order-template-list-header text-center">
            {t("SavedOrderDesc")}
          </span>
          <span className="order-template-list-header text-right">
            {t("DateSaved")}
          </span>
          <span className="order-template-list-header text-right">&nbsp;</span>
        </div>
        {currentItems &&
          currentItems.map((item) => (
            <RenderOrderTemplateList
              key={item.savedOrderNumber}
              savedOrderNumber={item.savedOrderNumber}
              savedOrderDescription={item.savedOrderDescription}
              displayedCreatedAt={item.displayedCreatedAt}
              onClickRow={() => handleRowClick(item)}
              onClickAddToCart={() => handleAddToCart(item)}
              onClickRemove={() => handleRemoveModal(item)}
            />
          ))}
        {savedOrderData.length > ITEM_PER_PAGE && (
          <TablePagination
            items={savedOrderData}
            itemsPerPage={ITEM_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <SaveOrderRemoveModal />
    </>
  );
};

export default OrderTemplateList;
