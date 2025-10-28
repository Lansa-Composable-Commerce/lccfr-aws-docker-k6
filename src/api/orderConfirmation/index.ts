import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError, AxiosResponse } from "axios";

export async function getOrderConfirmation(cartId: string) {
  try {
    const axios = axiosInstance();

    const response = await axios(`${API.ORDER_CONFIRMATION}${cartId}`);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on getting order confirmation:", error.response);

      return {
        status: error.response?.status,
        data: error.response?.data,
      };
    } else {
      console.error("An error occurred on getting order confirmation:", error);
    }
  }
}
