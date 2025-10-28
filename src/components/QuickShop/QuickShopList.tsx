"use client";

import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import { SfTooltip } from "@storefront-ui/react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { useDebounce } from "react-use";

// components
import QuickShopAddImportButton from "@/components/QuickShop/QuickShopAddImportButton";
import ProductCardQuantitySelector from "@/components/Products/ProductQuantitySelector";
import { showToast } from "@/components/globalUI/CustomToast";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getQuickShopProduct,
  selectQuickShopData,
  selectSuccessMessages,
  setAlertVisible,
  setNewItemCode,
  setRemoveItem,
  setRemoveQuickShopItems,
  setSuccessMessagesEmpty,
  setUniqueId,
} from "@/lib/features/quickShop/quickShopSlice";

import { SvgBin, SvgChevronDown } from "@/assets/svg";

import { QuickShopProps, QuickShopResponse } from "@/types";

const RenderQuickOrderList = ({
  itemCode,
  quantity,
  productDescription,
  displayedUnitPrice,
  displayedLineTotal,
  availableQuantity,
  id,
  onCollapse = false,
  children,
}: React.PropsWithChildren<QuickShopProps>) => {
  const tQuickShop = useTranslations("quickshop");
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [newQuantity, setNewQuantity] = useState<number>(quantity);
  const [isExpand, setIsExpand] = useState(false);
  const [isLoadingQuantity, setIsLoadingQuantity] = useState(false);

  const handleNewQuantityChange = async (value: number) => {
    let quantity: any = value;

    if (quantity.length > 15) {
      quantity = quantity.slice(0, 15);
    }

    setNewQuantity(quantity);
  };

  const handleRemoveProductItem = () => {
    dispatch(setRemoveItem(id));
    showToast("success", tQuickShop("ItemRemovedSuccessfully"));
  };

  const onSaveEditedQuantity = useCallback(async () => {
    const params = {
      itemCode: itemCode,
      quantity: Number(newQuantity),
    };

    dispatch(setUniqueId(id));
    dispatch(setNewItemCode(itemCode));
    setIsLoadingQuantity(true);
    await dispatch(getQuickShopProduct(params));
    setIsLoadingQuantity(false);
  }, [newQuantity]);

  useDebounce(
    () => {
      if (newQuantity !== quantity) {
        onSaveEditedQuantity();
      }
    },
    1500,
    [newQuantity, quantity, onSaveEditedQuantity],
  );

  return (
    <div
      className={classNames(
        "relative mb-2.5 rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark text-black01",
        {
          "pb-0": !isMobile,
        },
      )}
    >
      <div className="px-2 py-4.5 grid h-auto grid-cols-2 items-center gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-15">
        <div className="px-4 py-2 text-sm lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm text-right md:text-center xl:col-span-2">
          <span className="mb-1 text-xs lg:text-base block text-gray-600 dark:text-gray-400 sm:hidden">
            {tQuickShop("ProductCode")}
          </span>
          {itemCode}
        </div>
        <div className="px-4 md:px-0 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:col-auto xl:col-span-2 text-right">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
            {tQuickShop("Quantity")}
          </span>

          <div className="w-full flex items-center justify-end sm:justify-center">
            <div className="w-full max-w-[8rem] left-auto">
              <ProductCardQuantitySelector
                min={1}
                max={99999}
                value={newQuantity}
                onValueChange={handleNewQuantityChange}
                isLoading={isLoadingQuantity}
              />
            </div>
          </div>
        </div>
        <div className="px-4 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white text-right sm:text-sm md:text-center xl:col-span-4 line-clamp-2">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 sm:hidden">
            {tQuickShop("Description")}
          </span>
          {productDescription || "- -"}
        </div>
        <div className="text-right  px-4 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:px-8 sm:text-sm xl:block lg:text-center xl:col-span-2">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tQuickShop("Availability")}
          </span>
          {availableQuantity || "- -"}
        </div>
        <div className="px-4 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:block text-right xl:col-span-2">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
            {tQuickShop("UnitPrice")}
          </span>
          {displayedUnitPrice || "- -"}
        </div>
        <div className="px-4 text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm lg:block text-right xl:col-span-2">
          <span className="mb-1 block text-gray-600 dark:text-gray-400 xl:hidden">
            {tQuickShop("ExtendedPrice")}
          </span>
          {displayedLineTotal || "- -"}
        </div>
        <div className="hidden sm:text-sm md:block text-center">
          <SfTooltip label={tQuickShop("RmvLine")}>
            <div className="w-full flex items-center justify-center ">
              <SvgBin
                className="size-6 text-black01 cursor-pointer hover:text-red-500"
                onClick={handleRemoveProductItem}
              />
            </div>
          </SfTooltip>
        </div>
      </div>
      <div
        onClick={() => setIsExpand(!isExpand)}
        className="w-full bg-gray-100 flex justify-center md:hidden cursor-pointer"
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
      {onCollapse && (
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
              <div className="border-t border-dashed border-gray-200 py-2 dark:border-gray-700">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const QuickShopList = () => {
  const dispatch = useAppDispatch();
  const tQuickShop: any = useTranslations("quickshop");

  const data = useAppSelector(selectQuickShopData);

  const tValidation = useTranslations("Validation");

  const successMessages = useAppSelector(selectSuccessMessages);

  const handleRemoveProductItem = (id: number) => {
    dispatch(setRemoveItem(id));
    showToast("success", tQuickShop("ItemRemovedSuccessfully"));
  };

  const containerClassName =
    data.length > 10 ? "max-h-[835px] overflow-y-auto" : ""; //

  useEffect(() => {
    dispatch(setRemoveQuickShopItems());
    dispatch(setAlertVisible(false));
    dispatch(setSuccessMessagesEmpty());
  }, []);

  useEffect(() => {
    if (successMessages.length > 0) {
      successMessages.forEach((message: any) => {
        let finalMessage = tValidation(message.code);
        finalMessage = finalMessage.replace(/\\"/g, "");
        if (message.substitutions) {
          const placeholderRegex = /&(\d+)/g;
          finalMessage = finalMessage.replace(
            placeholderRegex,
            (match, placeholderNumber) => {
              const index = parseInt(placeholderNumber, 10) - 1;

              if (Array.isArray(message.substitutions)) {
                return message.substitutions[index] || match;
              } else if (typeof message.substitutions === "string") {
                return message.substitutions || match;
              }
              return match;
            },
          );
        }
        showToast("success", finalMessage);
      });
      dispatch(setSuccessMessagesEmpty());
    }
  }, [successMessages]);

  return (
    <div className="w-full mb-4">
      <div className="mx-auto w-full">
        <div className="px-2 mb-3 hidden grid-cols-3 gap-3 sm:gap-4 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-15 uppercase">
          <span className="px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-center xl:col-span-2 ">
            {tQuickShop("ItemCode")}
          </span>
          <span className="px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 line-clamp-2 text-center xl:col-span-2">
            {tQuickShop("Quantity")}
          </span>
          <span className="px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-center xl:col-span-4">
            {tQuickShop("Description")}
          </span>
          <span className="hidden px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-center  xl:col-span-2">
            {tQuickShop("Availability")}
          </span>
          <span className="hidden px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-right  xl:col-span-2 ">
            {tQuickShop("UnitPrice")}
          </span>
          <span className="hidden px-4 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 xl:block text-right  xl:col-span-2 ">
            {tQuickShop("ExtendedPrice")}
          </span>
          <span className="w-full">&nbsp;</span>
        </div>
      </div>
      <div className={`${containerClassName} scrollbar-thin pb-2 mb-3`}>
        {data.map((item: QuickShopResponse) => (
          <RenderQuickOrderList
            key={item?.id}
            itemCode={item?.productCode}
            quantity={item?.quantity}
            productDescription={item?.productDescription}
            displayedUnitPrice={item?.displayedUnitPrice}
            displayedLineTotal={item?.displayedLineTotal}
            availableQuantity={item?.availableQuantity}
            id={item?.id}
            onCollapse={true}
          >
            <div className="flex items-center justify-center">
              <SfTooltip label={tQuickShop("RmvLine")}>
                <SvgBin
                  onClick={() => handleRemoveProductItem(item?.id)}
                  className="size-6 cursor-pointer"
                />
              </SfTooltip>
            </div>
          </RenderQuickOrderList>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <QuickShopAddImportButton />
      </div>
    </div>
  );
};

export default QuickShopList;
