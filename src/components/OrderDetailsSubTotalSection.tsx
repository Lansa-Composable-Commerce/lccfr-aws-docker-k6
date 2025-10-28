"use client";

import React from "react";
import { IOrderDetailsResponse } from "@/types";
import { useTranslations } from "next-intl";

const OrderDetailsSubTotalSection = ({
  orderDetails,
}: {
  orderDetails: IOrderDetailsResponse;
}) => {
  const tOrderInquiryDetails: any = useTranslations("OrdrDtails");
  const tCart: any = useTranslations("Cart");

  return (
    <section className="w-full flex justify-end">
      <div className="w-full lg:w-1/3 border border-white02 px-3 py-2.5 lg:px-6 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-[32px] text-base">
        <div className="flex flex-col gap-3 lg:gap-4 font-black01">
          <div className="flex items-center justify-between border-b py-1 lg:py-2 text-sm lg:text-base">
            <span>{tCart("Subtotal")}:</span>
            <span className="font-semibold">
              {orderDetails?.totals?.displayedOrderTotal}
            </span>
          </div>
          <div className="flex items-center justify-between border-b py-1 lg:py-2 text-sm lg:text-base">
            <span>{tOrderInquiryDetails("OrderCharges")}:</span>
            <span className="font-semibold">
              {orderDetails?.totals?.displayedTotalCharge}
            </span>
          </div>
          <div className="flex items-center justify-between border-b py-1 lg:py-2 text-sm lg:text-base">
            <span>{tOrderInquiryDetails("OrderDiscount")}:</span>
            <span className="font-semibold">
              {orderDetails?.totals?.displayedAmount}
            </span>
          </div>
          <div className="flex items-center justify-between text-lg lg:text-2xl">
            <span>{tOrderInquiryDetails("OrderTotal")}:</span>
            <span className="font-semibold text-brand">
              {orderDetails?.totals?.displayedTotal}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetailsSubTotalSection;
