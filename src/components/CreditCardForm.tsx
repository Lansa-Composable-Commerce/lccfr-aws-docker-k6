"use client";

import Input from "@/components/globalUI/Input";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectCheckoutState,
  setPlaceOrderPayload,
} from "@/lib/features/checkout/checkoutSlice";
import { SelectOption } from "@/types";
import SelectDropdownWithPlaceholder from "@/components/globalUI/SelectDropdown";
import ErrorMessage from "@/components/ErrorMessage";

export default function CreditCardForm() {
  const tCheckout = useTranslations("Checkout");
  const { placeOrderPayload, creditCards, paymentErrors } =
    useAppSelector(selectCheckoutState);
  const dispatch = useAppDispatch();

  const [expirationDate, setExpirationDate] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [selectedCard, setSelectedCard] = useState<SelectOption>({
    label: "American Express",
    value: "AE",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "cardholderName" | "cardExpiration" | "cvv" | "cardNumber",
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    if (field === "cardExpiration") {
      let formattedValue = value.slice(0, 4);
      if (formattedValue.length >= 3) {
        formattedValue =
          formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
      const [month, year] = formattedValue.split("/");

      const convertedMonth = Number(month);
      const convertedYear = 2000 + Number(year);

      setExpirationDate(formattedValue);
      dispatch(
        setPlaceOrderPayload({
          cardExpiryMonth: convertedMonth,
          cardExpiryYear: convertedYear,
        }),
      );
    } else if (field === "cardNumber") {
      const cardNumber = value.slice(0, 19);
      const formattedValue = cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");

      setCardNumber(formattedValue);
      dispatch(setPlaceOrderPayload({ cardNumber: cardNumber }));
    } else if (field === "cardholderName") {
      dispatch(
        setPlaceOrderPayload({
          cardHolderName: e.target.value,
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(setPlaceOrderPayload({ cardType: selectedCard.value }));
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full mb-2 my-1">
      <div>
        <SelectDropdownWithPlaceholder
          selectName={tCheckout("CreditCardType")}
          options={creditCards}
          useUrl={false}
          selectedOption={selectedCard}
          setSelectedOption={(option: SelectOption) => {
            setSelectedCard(option);
            dispatch(setPlaceOrderPayload({ cardType: option.value }));
          }}
        />
      </div>
      <div className="w-full flex flex-col gap-1">
        <label htmlFor="cardholderName">{tCheckout("CardholderName")}</label>
        <Input
          id="cardholderName"
          type="text"
          value={placeOrderPayload.cardHolderName}
          onChange={(e) => handleChange(e, "cardholderName")}
          placeholder="Enter cardholder name here"
          className="py-3 lg:py-4 text-sm"
          maxLength={25}
        />
        {paymentErrors.cardHolderName && (
          <ErrorMessage message={paymentErrors.cardHolderName} />
        )}
      </div>
      <div className="w-full flex flex-col gap-1">
        <label htmlFor="cardNumber">{tCheckout("CardNumber")}</label>
        <Input
          id="cardNumber"
          type="text"
          value={cardNumber}
          onChange={(e) => handleChange(e, "cardNumber")}
          placeholder="Enter card number here"
          className="py-3 lg:py-4 text-sm"
          maxLength={23}
        />
        {paymentErrors.cardNumber && (
          <ErrorMessage message={paymentErrors.cardNumber} />
        )}
      </div>
      <div className="flex gap-4">
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="cardExpiration">{tCheckout("CardExpiry")}</label>
          <Input
            id="cardExpiration"
            type="text"
            value={expirationDate}
            onChange={(e) => handleChange(e, "cardExpiration")}
            placeholder="MM/YY"
            className="py-3 lg:py-4 text-sm"
            maxLength={5}
          />
          {paymentErrors.cardExpiration && (
            <ErrorMessage message={paymentErrors.cardExpiration} />
          )}
        </div>
      </div>
    </div>
  );
}
