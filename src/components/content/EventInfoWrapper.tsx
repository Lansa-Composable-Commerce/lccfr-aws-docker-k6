"use client";

import React, { useEffect } from "react";
import SkeletonAccounts from "@/components/loading/SkeletonAccounts";
import HTMLServerParser from "@/components/HTMLServerParser";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getContentEventInfo,
  selectIsContent,
} from "@/lib/features/content/contentSlice";

const EventInfoWrapper = () => {
  const dispatch = useAppDispatch();
  const { isLoading, eventInfoData } = useAppSelector(selectIsContent);

  useEffect(() => {
    dispatch(getContentEventInfo());
  }, [dispatch]);

  if (!eventInfoData) {
    return <>Failed to fetch event information.</>;
  }

  return (
    <>
      {isLoading && (
        <div className="container mx-auto px-4">
          <SkeletonAccounts />
        </div>
      )}
      {eventInfoData.LW3CNTSTR && (
        <HTMLServerParser content={eventInfoData.LW3CNTSTR} />
      )}
    </>
  );
};

export default EventInfoWrapper;
