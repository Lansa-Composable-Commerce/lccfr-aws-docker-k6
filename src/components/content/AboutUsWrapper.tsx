"use client";

import React, { useEffect } from "react";

import SkeletonAccounts from "@/components/loading/SkeletonAccounts";
import HTMLServerParser from "@/components/HTMLServerParser";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getContentAboutUs,
  selectIsContent,
} from "@/lib/features/content/contentSlice";

const AboutUsWrapper = () => {
  const dispatch = useAppDispatch();
  const { isLoading, aboutUsData } = useAppSelector(selectIsContent);

  useEffect(() => {
    dispatch(getContentAboutUs());
  }, [dispatch]);

  if (!aboutUsData) {
    return <>Failed to fetch about us.</>;
  }

  return (
    <>
      {isLoading && (
        <div className="container mx-auto px-4">
          <SkeletonAccounts />
        </div>
      )}
      {aboutUsData.LW3CNTSTR && (
        <HTMLServerParser content={aboutUsData.LW3CNTSTR} />
      )}
    </>
  );
};

export default AboutUsWrapper;
