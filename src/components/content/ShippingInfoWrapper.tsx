"use client";

import React, { useEffect } from "react";
import SkeletonAccounts from "@/components/loading/SkeletonAccounts";
import HTMLServerParser from "@/components/HTMLServerParser";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getContentShippingInfo,
  selectIsContent,
} from "@/lib/features/content/contentSlice";

const ShippingInfoWrapper = () => {
  const dispatch = useAppDispatch();
  const { isLoading, shippingInfoData } = useAppSelector(selectIsContent);

  useEffect(() => {
    dispatch(getContentShippingInfo());
  }, [dispatch]);

  if (!shippingInfoData) {
    return <>Failed to fetch about us.</>;
  }

  return (
    <>
      {isLoading && (
        <div className="container mx-auto px-4">
          <SkeletonAccounts />
        </div>
      )}
      {shippingInfoData.LW3CNTSTR && (
        <HTMLServerParser content={shippingInfoData.LW3CNTSTR} />
      )}
    </>
  );
};

export default ShippingInfoWrapper;
