"use client";

import React from "react";

import Switch from "@/components/ui/Switch";

import {
  getPaymentOptionsState,
  removeMessageState,
  selectPaymentOption,
  updateProfilePayOpt,
} from "@/lib/features/accountSettings/accountSettingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { getUserProfile } from "@/api/account-settings/getUserProfile";

const PaymentOptionForm = () => {
  const dispatch = useAppDispatch();
  const payOpt: any = useAppSelector(selectPaymentOption);

  const displayOptions = {
    payByPONumDesc: "Purchase Order Number",
    payByCCDirectDesc: "Credit Card Direct",
    payByCCSavedDesc: "Credit Card Saved",
    payByAnyDesc: "Any of the above",
  };

  const handleCheckboxChange = async (key: string, checked: boolean) => {
    const updatedPayOpt = {
      payByPONumFlag: payOpt.payByPONumFlag,
      payByCCDirectFlag: payOpt.payByCCDirectFlag,
      payByCCSavedFlag: payOpt.payByCCSavedFlag,
      payByAnyFlag: payOpt.payByAnyFlag,
    };

    if (key === "payByPONumFlag") {
      updatedPayOpt.payByPONumFlag = checked ? "Y" : "";
    } else if (key === "payByCCDirectFlag") {
      updatedPayOpt.payByCCDirectFlag = checked ? "Y" : "";
    } else if (key === "payByCCSavedFlag") {
      updatedPayOpt.payByCCSavedFlag = checked ? "Y" : "";
    } else if (key === "payByAnyFlag") {
      updatedPayOpt.payByAnyFlag = checked ? "Y" : "";
    }

    await dispatch(updateProfilePayOpt(updatedPayOpt));

    await getUserProfile().then((res) => {
      /*    console.log({
        payByPONumFlag: res.data?.payOpt.payByPONumFlag,
        payByCCDirectFlag: res.data?.payOpt.payByCCDirectFlag,
        payByCCSavedFlag: res.data?.payOpt.payByCCSavedFlag,
        payByAnyFlag: res.data?.payOpt.payByAnyFlag,
      });*/
      const r = {
        payByPONumFlag: res.data?.payOpt.payByPONumFlag,
        payByCCDirectFlag: res.data?.payOpt.payByCCDirectFlag,
        payByCCSavedFlag: res.data?.payOpt.payByCCSavedFlag,
        payByAnyFlag: res.data?.payOpt.payByAnyFlag,
      };
      dispatch(getPaymentOptionsState(r));
    });
    await dispatch(removeMessageState());
  };

  return (
    <div className="mt-7 grid grid-cols-2 gap-3">
      {Object.entries(displayOptions).map(([key, label]) => (
        <label key={key} className="flex items-center gap-2 cursor-pointer">
          <Switch
            checked={payOpt[key.replace("Desc", "Flag")]}
            onChange={(e) =>
              handleCheckboxChange(
                key.replace("Desc", "Flag"),
                e.target.checked,
              )
            }
          />
          <span className="hover:font-medium text-sm lg:text-base">
            {label}
          </span>
        </label>
      ))}
    </div>
  );
};

export default PaymentOptionForm;
