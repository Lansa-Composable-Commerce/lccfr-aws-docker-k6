import React, { useState } from "react";
import { useTranslations } from "next-intl";

import Button from "@/components/globalUI/Button";
import { showToast } from "@/components/globalUI/CustomToast";

import { useAddToCartMutation } from "@/services/cartApi";

import { SavedOrderDetailsResponseTypes } from "@/types";
import { sendGTMEvent } from "@next/third-parties/google";
import { GTM_EVENTS } from "@/utils/constants";

const SaveOrderDetails = ({
  savedOrderDetailsData,
}: {
  savedOrderDetailsData: SavedOrderDetailsResponseTypes;
}) => {
  const t: any = useTranslations("OrdrTmplte");
  const tMessages = useTranslations("Messages");

  const [addToCart] = useAddToCartMutation();

  const [addToCartLoading, setIsAddToCartLoading] = useState(false);

  async function handleAddToCart() {
    const payload = savedOrderDetailsData?.orderItems.map(
      (item: { productCode: string; quantity: number }) => {
        return {
          productCode: item.productCode,
          quantity: item.quantity,
        };
      },
    );
    setIsAddToCartLoading(true);
    const response = await addToCart(payload);
    if (response && response.data) {
      const { messages } = response.data;
      showToast("success", tMessages(messages[0].code));

      // add to cart
      sendGTMEvent({
        event: GTM_EVENTS.ADD_TO_CART,
        currency: "USD",
        items: savedOrderDetailsData?.orderItems.map((item: any) => {
          return {
            item_name: item?.description,
            item_id: item?.productCode,
            item_category: item?.categoryName || "",
            quantity: item?.quantity,
            price: item?.unitPrice,
          };
        }),
      });

      setIsAddToCartLoading(false);
    }
  }

  return (
    <div className="my-5 mx-3 lg:mx-6">
      <div className="w-full md:w-5/6 lg:w-3/5 flex flex-col md:flex-row sm:flex-no-wrap items-center gap-2 md:gap-6">
        <div className="w-full flex flex-col lg:flex-row gap-3 md:gap-6">
          <div className="w-full flex flex-col gap-1">
            <span className="capitalize form-label">{t("SavedOrderDesc")}</span>
            <span className="text-base lg:text-xl font-medium">
              {savedOrderDetailsData?.saveOrderHeader?.savedOrderDescription}
            </span>
          </div>
          <div className="w-full flex flex-col gap-1">
            <span className="capitalize form-label">{t("DateCreated")}</span>
            <span className="text-base lg:text-xl font-medium">
              {" "}
              {savedOrderDetailsData?.saveOrderHeader?.displayedCreatedAt}
            </span>
          </div>
          <div className="w-full">
            <Button
              size="lg"
              className="w-full lg:py-3 md:w-44 translate-05"
              onClick={handleAddToCart}
              disabled={addToCartLoading}
              aria-label="add to cart"
            >
              <span className="text-lg">
                {addToCartLoading ? `${t("Adding")}...` : t("AddToCart")}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveOrderDetails;
