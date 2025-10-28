"use client";

import React, { useEffect } from "react";

import OrderTemplateList from "@/components/orderTemplate/OrderTemplateList";

import { useAppDispatch } from "@/lib/hooks";
import {
  setOrderTemplateData,
  setRemoveMessages,
} from "@/lib/features/orderTemplate/orderTemplateSlice";

import { OrderTemplateWrapperProps } from "@/types";

const OrderTemplateWrapper = ({
  initialSavedOrderData,
}: OrderTemplateWrapperProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setOrderTemplateData(initialSavedOrderData));
  }, [initialSavedOrderData]);

  useEffect(() => {
    dispatch(setRemoveMessages());
  }, []);

  return (
    <section>
      <div className="w-full mb-4">
        <OrderTemplateList savedOrderData={initialSavedOrderData} />
      </div>
    </section>
  );
};

export default OrderTemplateWrapper;
