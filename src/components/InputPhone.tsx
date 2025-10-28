"use client";

import { CountryData, PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useFocusVisible } from "@storefront-ui/react";
import classNames from "classnames";
import { PhoneMeta } from "@/types";

interface InputPhonePropType {
  id?: string;
  phoneNumber?: string;
  defaultCountry?: string;
  countries?: CountryData[];
  invalid?: boolean;
  hideDropdown?: boolean;
  onChange(phone: string, meta: PhoneMeta): void;
}

export default function InputPhone({
  id,
  phoneNumber,
  defaultCountry,
  countries,
  invalid,
  hideDropdown,
  onChange,
}: InputPhonePropType) {
  const { isFocusVisible } = useFocusVisible({ isTextInput: true });

  return (
    <div
      className={classNames([
        "h-full bg-white flex items-center gap-2 rounded-lg lg:rounded-large ring-2 text-black01 text-base hover:ring-primary-700 focus-within:caret-primary-700 active:caret-primary-700 active:ring-primary-700 active:ring-2 focus-within:ring-primary-700 focus-within:ring-2 dark:bg-dark",
        {
          "ring-2 ring-negative-700": invalid,
          "ring-1 ring-neutral-300": !invalid,
          "focus-within:outline focus-within:outline-offset": isFocusVisible,
        },
      ])}
    >
      <PhoneInput
        inputProps={{ id }}
        value={phoneNumber}
        defaultCountry={defaultCountry || "us"}
        countries={countries}
        hideDropdown={hideDropdown}
        inputStyle={{ width: "100%" }}
        countrySelectorStyleProps={{
          style: { marginLeft: "10px" },
          dropdownStyleProps: { style: { backgroundColor: "whitesmoke" } },
        }}
        className={classNames([
          "pl-2 rounded-large h-[50px] lg:h-[60px] dark:bg-transparent min-w-[80px] w-full text-black01 disabled:cursor-not-allowed disabled:bg-gray-200 read-only:bg-transparent dark:text-gray-300 dark:placeholder-gray-600",
        ])}
        onChange={(phone, meta) => onChange(phone, meta)}
      />
    </div>
  );
}
