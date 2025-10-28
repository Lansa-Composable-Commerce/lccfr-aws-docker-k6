"use client";

import React, { useEffect } from "react";
import SkeletonAccounts from "@/components/loading/SkeletonAccounts";
import HTMLServerParser from "@/components/HTMLServerParser";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getContentOrdersAndPayment,
  selectIsContent,
} from "@/lib/features/content/contentSlice";

const OrdersPaymentWrapper = () => {
  const dispatch = useAppDispatch();
  const { isLoading, ordersPaymentData } = useAppSelector(selectIsContent);

  useEffect(() => {
    dispatch(getContentOrdersAndPayment());
  }, [dispatch]);

  if (!ordersPaymentData) {
    return <>Failed to fetch about us.</>;
  }

  return (
    <>
      {isLoading && (
        <div className="container mx-auto px-4">
          <SkeletonAccounts />
        </div>
      )}
      {ordersPaymentData.LW3CNTSTR && (
        <HTMLServerParser content={ordersPaymentData.LW3CNTSTR} />
      )}
    </>
  );
};

export default OrdersPaymentWrapper;
