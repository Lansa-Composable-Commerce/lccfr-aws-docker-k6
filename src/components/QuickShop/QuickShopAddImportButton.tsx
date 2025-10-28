"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

import Button from "@/components/globalUI/Button";

import {
  openQuickShopAddItemModal,
  openQuickShopImportDataModal,
  selectQuickShopData,
} from "@/lib/features/quickShop/quickShopSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { showToast } from "@/components/globalUI/CustomToast";
import { useAddToCartMutation } from "@/services/cartApi";
import { sendGTMEvent } from "@next/third-parties/google";
import { GTM_EVENTS } from "@/utils/constants";

const QuickShopAddImportButton = () => {
  const tMessages = useTranslations("Messages");
  const tQuickShop: any = useTranslations("quickshop");
  const tMyProducts = useTranslations("MyProducts");
  const dispatch = useAppDispatch();

  const [addToCart] = useAddToCartMutation();

  const haveProduct = useAppSelector(selectQuickShopData);
  const data = useAppSelector(selectQuickShopData);

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenAddItemModal = () => {
    dispatch(openQuickShopAddItemModal());
  };

  const handleOpenImportDataModal = () => {
    dispatch(openQuickShopImportDataModal(true));
  };

  async function handleAddToCart() {
    setIsLoading(true);
    const payload = data.map((item: any) => {
      return {
        productCode: item.productCode,
        quantity: Number(item.quantity),
      };
    });
    const res = await addToCart(payload);
    if (res?.error) {
      showToast("error", "Something went wrong");
      setIsLoading(false);
      return;
    }
    const { messages } = res.data;
    showToast("success", tMessages(messages[0].code));

    // add to cart
    sendGTMEvent({
      event: GTM_EVENTS.ADD_TO_CART,
      currency: "USD",
      items: data.map((item) => {
        return {
          item_name: item?.productDescription,
          item_id: item.productCode,
          item_category: item?.categoryName,
          quantity: Number(item.quantity),
          price: item?.productPrice,
        };
      }),
    });

    setIsLoading(false);
  }

  return (
    <div className="w-full md:max-w-xl lg:max-w-2xl flex flex-col md:flex-row items-center justify-end gap-1.5 sm:gap-3 lg:gap-5">
      <Button
        variant="secondary"
        className="sm:h-[50px] lg:h-[60px]  uppercase w-full"
        onClick={handleOpenAddItemModal}
      >
        <p className="text-sm lg:text-lg dark:text-neutral-200">
          {tQuickShop("AddProduct")}
        </p>
      </Button>
      <Button
        variant="secondary"
        className="sm:h-[50px] lg:h-[60px]  uppercase w-full"
        onClick={handleOpenImportDataModal}
      >
        <p className="text-sm lg:text-lg dark:text-neutral-200">
          {tQuickShop("ImportData")}
        </p>
      </Button>
      <Button
        size="lg"
        className="lg:py-4  uppercase w-full"
        onClick={handleAddToCart}
        disabled={(isLoading || !haveProduct.length) ?? 0}
      >
        <p className="text-sm lg:text-lg">
          {isLoading ? `${tMyProducts("Adding")}...` : tQuickShop("AddToCart")}
        </p>
      </Button>
    </div>
  );
};

export default QuickShopAddImportButton;
