"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { sendGTMEvent } from "@next/third-parties/google";

// components
import PageTitle from "@/components/ui/PageTitle";
import Button from "@/components/globalUI/Button";
import { showToast } from "@/components/globalUI/CustomToast";

import { IOrderDetailsResponse } from "@/types";

import { useAddToCartMutation } from "@/services/cartApi";
import { GTM_EVENTS } from "@/utils/constants";

const OrderDetailsDescription = ({
  orderDetails,
}: {
  orderDetails: IOrderDetailsResponse;
}) => {
  const tMessages = useTranslations("Messages");
  const tMyProducts = useTranslations("MyProducts");
  const tOrderInquiryDetails: any = useTranslations("OrdrDtails");
  const tGlobal: any = useTranslations("Global");

  const [addToCart] = useAddToCartMutation();

  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);

  async function handleAddToCart() {
    const payload = orderDetails?.product.map(
      (item: { productCode: string; lineQuantity: number }) => {
        return {
          productCode: item.productCode,
          quantity: Number(item.lineQuantity),
        };
      },
    );
    setIsAddToCartLoading(true);
    const response = await addToCart(payload);
    if (response && response.data) {
      const { messages } = response.data;
      showToast("success", tMessages(messages[0].code));

      console.log("orderDetails?.product", orderDetails?.product);
      // add to cart
      sendGTMEvent({
        event: GTM_EVENTS.ADD_TO_CART,
        currency: "USD",
        items: orderDetails?.product.map((item: any) => {
          return {
            item_name: item?.productDescription,
            item_id: item?.productCode,
            item_category: item?.categoryName || "",
            quantity: item?.lineQuantity,
            price: item?.productPrice,
          };
        }),
      });

      setIsAddToCartLoading(false);
    }
  }

  return (
    <>
      <PageTitle
        withTitle
        content={tOrderInquiryDetails("OrderDetails")}
        withBackText
        backText={tGlobal("Back")}
      />
      <div className="mt-5">
        <div className="w-full flex flex-col md:flex-row gap-3 lg:gap-6">
          <div className="border border-dashed w-full bg-slate-100 px-3 py-2.5 lg:px-6 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-[32px] dark:bg-light-dark">
            <div className="text-sm sm:text-base  lg:text-xl mb-2">
              {tOrderInquiryDetails("ShipTo")}
            </div>
            <div className="text-xs lg:text-base tracking-wider">
              <p>{orderDetails?.shipTo?.name}</p>
              <p>{orderDetails?.shipTo?.company}</p>
              <p>{orderDetails?.shipTo?.address1}</p>
              <p>{orderDetails?.shipTo?.address2}</p>
              <p>{orderDetails?.shipTo?.city}</p>
              <p>{orderDetails?.shipTo?.state}</p>
              <p>{orderDetails?.shipTo?.postalCode}</p>
              <p>{orderDetails?.shipTo?.country}</p>
            </div>
          </div>
          <div className="border border-dashed w-full bg-slate-100 px-3 py-2.5 lg:px-6 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-[32px] dark:bg-light-dark">
            <div className="text-sm sm:text-base lg:text-xl mb-2">
              {tOrderInquiryDetails("BillTo")}
            </div>
            <div className="text-xs lg:text-base tracking-wider">
              <p>{orderDetails?.billTo?.name}</p>
              <p>{orderDetails?.billTo?.company}</p>
              <p>{orderDetails?.billTo?.address1}</p>
              <p>{orderDetails?.billTo?.address2}</p>
              <p>{orderDetails?.billTo?.city}</p>
              <p>{orderDetails?.billTo?.state}</p>
              <p>{orderDetails?.billTo?.postalCode}</p>
              <p>{orderDetails?.billTo?.cityStateZip}</p>
              <p>{orderDetails?.billTo?.country}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 mx-3 lg:mx-6">
          <div className="w-full md:w-5/6 lg:w-3/5 flex flex-col md:flex-row sm:flex-no-wrap items-center gap-2 md:gap-6">
            <div className="w-full flex flex-row gap-2 md:gap-6">
              <div className="w-full flex flex-col gap-1">
                <span className="capitalize form-label">
                  {tOrderInquiryDetails("AccountNumber")}
                </span>
                <span className="text-base lg:text-xl font-medium">
                  {orderDetails?.order?.customerId}
                </span>
              </div>
              <div className="w-full flex flex-col gap-1">
                <span className="capitalize form-label">
                  {tOrderInquiryDetails("OrderNumber")}
                </span>
                <span className="text-base lg:text-xl font-medium">
                  {orderDetails?.order?.orderNumber}
                </span>
              </div>
            </div>
            <div className="w-full">
              <Button
                size="lg"
                className="w-full lg:py-3 md:w-44 translate-05"
                onClick={handleAddToCart}
              >
                <span className="text-lg">
                  {isAddToCartLoading
                    ? `${tMyProducts("Adding")}...`
                    : tOrderInquiryDetails("AddToCart")}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsDescription;
