"use client";

import Input from "@/components/globalUI/Input";
import Button from "@/components/globalUI/Button";
import {
  useAddPromotionsMutation,
  useGetCartQuery,
  useRemovePromotionsMutation,
} from "@/services/cartApi";
import React, { ChangeEvent, Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetPromoCode, selectCartState } from "@/lib/features/cart/cartSlice";
import { showToast } from "@/components/globalUI/CustomToast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Message } from "@/types";
import { SfChip, SfIconCloseSm } from "@storefront-ui/react";
import Spinner from "@/components/loading/Spinner";
import { sendGTMEvent } from "@next/third-parties/google";
import { GTM_EVENTS } from "@/utils/constants";

export default function DiscountForm({
  mode = "default",
}: {
  mode?: "default" | "checkout";
}) {
  const tCart = useTranslations("Cart");
  const tMessages = useTranslations("Messages");
  const tValidation = useTranslations("Validation");

  const { promoCode } = useAppSelector(selectCartState);
  const dispatch = useAppDispatch();

  const [promotions, setPromotions] = useState("");

  const { refetch: refetchCart } = useGetCartQuery({});
  const [addPromotions, { isLoading }] = useAddPromotionsMutation();
  const [removePromotions, { isLoading: isRemovingPromo }] =
    useRemovePromotionsMutation();

  const handleSetPromoCode = (e: ChangeEvent<HTMLInputElement>) => {
    setPromotions(e.target.value);
  };

  const handleAddPromoCode = async () => {
    if (!promotions) {
      return showToast("error", tValidation("MsgInvalidPromoCode"));
    }

    const response = await addPromotions({ promoCode: promotions });

    if (response.error) {
      const error = response.error as FetchBaseQueryError;
      const message = error.data as unknown as Message;

      showToast("error", tValidation(message.code));
    } else {
      const message: Message = response.data.messages[0];
      showToast("success", tMessages(message.code));

      sendGTMEvent({
        event: GTM_EVENTS.APPLIED_PROMO_CODE,
        coupon: promotions,
      });

      refetchCart();
    }

    setPromotions("");
  };

  const handleRemovePromoCode = async () => {
    const response = await removePromotions({});

    if (response.error) {
      const error = response.error as FetchBaseQueryError;
      const message = error.data as unknown as Message;

      showToast("error", tValidation(message.code));
    } else {
      refetchCart();

      const message: Message = response.data.messages[0];
      showToast("success", tMessages(message.code));
      dispatch(resetPromoCode());
    }
  };

  return (
    <div>
      {mode === "default" && (
        <div className="flex flex-col w-full gap-4 mb-1 md:flex-row">
          {promoCode ? (
            <SfChip
              inputProps={{ onClick: () => handleRemovePromoCode() }}
              className="mr-2 hover:bg-primary-50"
              slotSuffix={
                isRemovingPromo ? (
                  <Spinner className="w-4 h-4 fill-primary-700" />
                ) : (
                  <SfIconCloseSm size="lg" />
                )
              }
            >
              {promoCode}
            </SfChip>
          ) : (
            <Fragment>
              <div className="w-full flex flex-col gap-1">
                <Input
                  id="discountCode"
                  type="text"
                  className="w-full text-sm"
                  size="sm"
                  placeholder={tCart("PlhPromotions")}
                  aria-label="Promotions/Discount Code"
                  onChange={handleSetPromoCode}
                />
              </div>
              <Button
                id="apply-promo-code"
                className="min-w-24 px-8 text-dark dark:text-primary-300"
                onClick={() => handleAddPromoCode()}
                variant="secondary"
              >
                {isLoading ? (
                  <Spinner className="w-6 h-6 fill-primary-700" />
                ) : (
                  tCart("Apply")
                )}
              </Button>
            </Fragment>
          )}
        </div>
      )}
      {mode === "checkout" &&
        (promoCode ? (
          <div className="flex">
            <div className="px-4 py-2 border rounded-2xl">{promoCode}</div>
          </div>
        ) : (
          <p>{tCart("NoPromotions")}</p>
        ))}
    </div>
  );
}
