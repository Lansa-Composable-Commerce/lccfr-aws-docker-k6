"use client";

import SfRadio from "@/components/globalUI/Radio";
import Input from "@/components/globalUI/Input";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectCheckoutState,
  setPlaceOrderPayload,
  setPaymentOption,
  resetPaymentForm,
  resetFieldErrors,
} from "@/lib/features/checkout/checkoutSlice";
import React, { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { PaymentType } from "@/types";
import CreditCardForm from "@/components/CreditCardForm";
import ErrorMessage from "@/components/ErrorMessage";

export default function PaymentOptions() {
  const tCheckout = useTranslations("Checkout");
  const { placeOrderPayload, paymentErrors } =
    useAppSelector(selectCheckoutState);
  const dispatch = useAppDispatch();

  const handleSetOrderNumber = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPlaceOrderPayload({ poNumber: e.target.value }));
  };

  const handleChange = (value: PaymentType) => {
    dispatch(setPaymentOption(value));
    dispatch(resetPaymentForm());
    dispatch(resetFieldErrors());
  };

  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-sm p-6 shadow-md">
      <fieldset>
        <legend className="font-medium">{tCheckout("PaymentOptions")}</legend>
        <label
          className="flex items-center gap-2 p-4 bg-gray-200 rounded-md my-2 cursor-pointer"
          onClick={() => handleChange("PO")}
        >
          <SfRadio
            name={"paymentOption"}
            value="PO"
            checked={placeOrderPayload.paymentType === "PO"}
          />
          <span className="text-sm">{tCheckout("PaymentOrderNumber")}</span>
        </label>
      </fieldset>
      {placeOrderPayload.paymentType === "PO" && (
        <div className="w-full flex flex-col gap-1 my-1">
          <label htmlFor="orderNumber">
            {tCheckout("PurchaseOrderNumber")}
          </label>
          <Input
            id="orderNumber"
            type="text"
            className="py-3 lg:py-4 text-sm"
            placeholder={tCheckout("PlhOrderNumber")}
            onChange={handleSetOrderNumber}
          />
          {paymentErrors.poNumber && (
            <ErrorMessage message={paymentErrors.poNumber} />
          )}
        </div>
      )}
      <label
        className="flex items-center gap-2 p-4 bg-gray-200 rounded-md my-2 cursor-pointer"
        onClick={() => handleChange("CD")}
      >
        <SfRadio
          name={"paymentOption"}
          value="CD"
          checked={placeOrderPayload.paymentType === "CD"}
        />
        <span className="text-sm">{tCheckout("PaymentCards")}</span>
      </label>
      {placeOrderPayload.paymentType === "CD" && <CreditCardForm />}
    </div>
  );
}
