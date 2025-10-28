"use client";

import React, { useEffect } from "react";
import SkeletonAccounts from "@/components/loading/SkeletonAccounts";
import HTMLServerParser from "@/components/HTMLServerParser";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getContentPrivacyPolicy,
  selectIsContent,
} from "@/lib/features/content/contentSlice";

const PrivacyPolicyWrapper = () => {
  const dispatch = useAppDispatch();
  const { isLoading, privacyPolicyData } = useAppSelector(selectIsContent);

  useEffect(() => {
    dispatch(getContentPrivacyPolicy());
  }, [dispatch]);

  if (!privacyPolicyData) {
    return <>Failed to fetch about us.</>;
  }

  return (
    <>
      {isLoading && (
        <div className="container mx-auto px-4">
          <SkeletonAccounts />
        </div>
      )}
      {privacyPolicyData.LW3CNTSTR && (
        <HTMLServerParser content={privacyPolicyData.LW3CNTSTR} />
      )}
    </>
  );
};

export default PrivacyPolicyWrapper;
