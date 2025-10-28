"use client";

import { GoogleAnalytics } from "@next/third-parties/google";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getLogo } from "@/lib/features/global/globalSlice";
import { useEffect } from "react";
import { selectStorefrontState } from "@/lib/features/storefront/storefrontSlice";

const GoogleAnalyticsWrapper = () => {
  const dispatch = useAppDispatch();

  const { analyticsFlag, analyticsAccount } = useAppSelector(
    selectStorefrontState,
  );

  useEffect(() => {
    (async () => {
      await dispatch(getLogo());
    })();
  }, []);

  if (analyticsFlag === "Y") {
    return <GoogleAnalytics gaId={analyticsAccount} />;
  }

  return null;
};

export default GoogleAnalyticsWrapper;
