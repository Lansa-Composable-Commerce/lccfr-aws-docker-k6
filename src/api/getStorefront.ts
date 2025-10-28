import { AxiosError } from "axios";

import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

let storefrontCache: any = null;

export async function getStorefront() {
  if (storefrontCache) {
    return storefrontCache;
  }

  try {
    const axios = axiosInstance();

    const response = await axios.get(API.STOREFRONT_INIT);

    storefrontCache = response.data;

    return storefrontCache;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const messages = error.response?.data.messages;
      console.error("Failed on getting storefront details:", messages);
      return {
        status: error.response?.status,
        data: messages,
      };
    } else {
      console.error("An error occurred on getting storefront details:", error);
      return {
        status: 500,
        data: error,
      };
    }
  }
}
