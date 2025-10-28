"use server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function getSavedOrder() {
  try {
    const axios = axiosInstance();

    let response = await axios.get(API.SAVED_ORDER);
    if (response.status === 200) {
      if (
        response.data &&
        Array.isArray(response.data.messages) &&
        response.data.messages.some(
          (message: any) => message.code === "MsgSaveOrderNotFound",
        )
      ) {
        return [];
      }

      return response.data;
    }
    return [];
  } catch (error: any) {
    if (
      error?.response?.data &&
      Array.isArray(error?.response?.data?.messages) &&
      error?.response?.data?.messages.some(
        (message: any) => message.code === "MsgSaveOrderNotFound",
      )
    ) {
      return [];
    }
    return [];
  }
}
