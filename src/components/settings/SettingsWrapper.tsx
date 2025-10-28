"use client";

import React from "react";
import { SfSwitch } from "@storefront-ui/react";

import PageTitle from "@/components/ui/PageTitle";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectIsOnB2B,
  setOnB2B,
} from "@/lib/features/accountSettings/accountSettingsSlice";

const SettingsWrapper = () => {
  const dispatch = useAppDispatch();
  const selectIsSwitchToB2B = useAppSelector(selectIsOnB2B);

  return (
    <>
      <PageTitle withTitle content="Settings" />
      <div>
        <div>
          <hr className="my-4 border-gray-200" />
          <label className="flex items-center">
            <SfSwitch
              checked={selectIsSwitchToB2B}
              value="value-1"
              onChange={(event) => {
                dispatch(setOnB2B(event.target.checked));
              }}
            />
            <span className="text-base ml-[10px] text-gray-900 cursor-pointer font-body">
              B2B
            </span>
          </label>
        </div>
      </div>
    </>
  );
};

export default SettingsWrapper;
