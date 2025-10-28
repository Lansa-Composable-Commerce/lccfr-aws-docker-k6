import { AxiosError } from "axios";

import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getRecommendedAndBestSellers() {
  try {
    const axios = axiosInstance();

    const response = await axios.get(API.STOREFRONT_FEATURED);
    const { bestsellers, recommended } = response.data;

    return { bestsellers, recommended };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on getting menus:", error.response);
    } else {
      console.error("An error occurred on getting menus:", error);
    }
  }
}
