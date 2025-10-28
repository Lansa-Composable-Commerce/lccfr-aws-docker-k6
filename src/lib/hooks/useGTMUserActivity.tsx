"use client";

import Cookies from "js-cookie";
import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";
import { COOKIE_PREFIX, GTM_EVENTS } from "@/utils/constants";

export default function useGTMUserActivity() {
  useEffect(() => {
    const username = Cookies.get(`${COOKIE_PREFIX}customerName`);
    sendGTMEvent({
      event: GTM_EVENTS.USER_ACTIVITY,
      username: username,
    });
  }, []);
}
