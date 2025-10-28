import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";

export async function getCart() {
  try {
    const axios = axiosInstance();

    const response = await axios(API.CART_GET);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on getting carts:", {
        status: error.response?.status,
        data: error.response?.data.messages,
      });
    } else {
      console.error("An error occurred on getting carts:", error);
    }
  }
}
