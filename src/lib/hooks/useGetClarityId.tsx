"use client";

import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";

import { useAppSelector } from "@/lib/hooks";
import { selectStorefrontState } from "@/lib/features/storefront/storefrontSlice";

export default function useGetClarityId() {
  const { msClarityId: clarityId } = useAppSelector(selectStorefrontState);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      clarityId &&
      process.env.NODE_ENV === "production"
    ) {
      clarity.init(clarityId);
      console.log("Clarity initialized with ID:", clarityId);
    }
  }, [clarityId]);
}
