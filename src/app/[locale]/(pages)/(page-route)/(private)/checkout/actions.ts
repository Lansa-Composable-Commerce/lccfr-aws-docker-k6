"use server";

import { PlaceOrderRequest } from "@/types/Checkout";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { createCookieSession } from "@/lib/auth/session";

export async function placeOrder(request: PlaceOrderRequest) {
  if (!request) return;

  try {
    const axios = axiosInstance();

    const response = await axios.post(API.PLACE_ORDER, request);

    await createCookieSession(response.data.LW3ACSTKN, response.data.LW3RFSTKN);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data);

      return {
        statusCode: error.response?.status,
        data: error.response?.data,
      };
    } else {
      console.error("An unknown error occurred!", error);
    }
  }
}
