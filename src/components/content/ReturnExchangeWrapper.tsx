"use client";

import React, { useEffect } from "react";
import SkeletonAccounts from "@/components/loading/SkeletonAccounts";
import HTMLServerParser from "@/components/HTMLServerParser";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getContentReturnExchange,
  selectIsContent,
} from "@/lib/features/content/contentSlice";

const ReturnExchangeWrapper = () => {
  const dispatch = useAppDispatch();
  const { isLoading, returnExchangeData } = useAppSelector(selectIsContent);

  useEffect(() => {
    dispatch(getContentReturnExchange());
  }, [dispatch]);

  if (!returnExchangeData) {
    return <>Failed to fetch about us.</>;
  }
  return (
    <>
      {isLoading && (
        <div className="container mx-auto px-4">
          <SkeletonAccounts />
        </div>
      )}
      {returnExchangeData.LW3CNTSTR && (
        <HTMLServerParser content={returnExchangeData.LW3CNTSTR} />
      )}
    </>
  );
};

export default ReturnExchangeWrapper;
