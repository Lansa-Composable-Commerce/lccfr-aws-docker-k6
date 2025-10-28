"use client";

import React, { type ChangeEvent, useState } from "react";
import { useTranslations } from "next-intl";

// components
import PageTitle from "@/components/ui/PageTitle";
import Switch from "@/components/ui/Switch";
import QuickShopAddImportButton from "@/components/QuickShop/QuickShopAddImportButton";
import QuickShopAlert from "@/components/QuickShop/QuickShopAlert";

// redux
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectErrorMessages,
  setToggleItemNumber,
} from "@/lib/features/quickShop/quickShopSlice";

const QuickShopTitle = () => {
  const dispatch = useAppDispatch();
  const tQuickShop: any = useTranslations("quickshop");

  const errorMessages: any = useAppSelector(selectErrorMessages);

  const [checkedState, setCheckedState] = useState(true);

  const handleToggleCustomer = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setCheckedState(checked);
    // @ts-ignore
    dispatch(setToggleItemNumber());
  };

  const RenderQuickShopErrorAlert = () => {
    if (errorMessages.length > 0) {
      return <QuickShopAlert />;
    }
  };

  return (
    <>
      <PageTitle withTitle content={tQuickShop("QuickShop")} />
      <RenderQuickShopErrorAlert />
      <div className="my-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <label className="flex justify-start items-center">
          <Switch
            checked={checkedState}
            value="value-1"
            onChange={handleToggleCustomer}
          />
          <p className="text-xs sm:text-sm lg:text-base ml-[10px]  cursor-pointer font-body">
            {checkedState
              ? tQuickShop("ItemNumber")
              : tQuickShop("CustomerItemNumber")}
          </p>
        </label>

        <QuickShopAddImportButton />
      </div>
    </>
  );
};

export default QuickShopTitle;
