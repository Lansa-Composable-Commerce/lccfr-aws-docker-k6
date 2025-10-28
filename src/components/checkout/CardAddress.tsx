"use client";

import classNames from "classnames";
import { useTranslations } from "next-intl";
import { SvgPencilSquare } from "@/assets/svg";

type CardAddressType = {
  title: string;
  contactName: string;
  address1: string;
  address2?: string;
  regionInformation: string;
  country: string;
  change?: () => void;
};

export default function CardAddress({
  title,
  contactName,
  address1,
  address2,
  regionInformation,
  country,
  change,
}: CardAddressType) {
  const tCheckout = useTranslations("Checkout");

  return (
    <section className="relative flex flex-col w-full gap-2 border border-gray-200 rounded-sm p-4 shadow-md">
      <div className="font-medium">{title}</div>
      <span className="text-sm">{contactName}</span>
      <span className="text-sm">{address1}</span>
      {address2 && <span className="text-sm">{address2}</span>}
      <span className="text-sm">{regionInformation}</span>
      <span className="text-sm">{country}</span>
      {change && (
        <div
          className={classNames(
            "flex items-center justify-center gap-1 absolute top-0.5 right-0 p-4",
            "text-primary-700 hover:text-primary-500 cursor-pointer",
          )}
          onClick={change}
        >
          <SvgPencilSquare className="w-5 h-5" />
          <span className={classNames("text-sm font-medium")}>
            {tCheckout("Change")}
          </span>
        </div>
      )}
    </section>
  );
}
