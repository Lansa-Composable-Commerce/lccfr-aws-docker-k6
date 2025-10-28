import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";
import { CheckoutInitResponse } from "@/types/Checkout";

export async function getCheckoutDetails() {
  try {
    const axios = axiosInstance();

    const response = await axios.get(API.CHECKOUT_DETAILS);

    return response.data as CheckoutInitResponse;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on getting checkout details:", error.response);
    } else {
      console.error("An error occurred on getting checkout details:", error);
    }
  }
}
