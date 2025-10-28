"use server";

import { API } from "@/utils/constants";

import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getMyProductSearch(searchValue: string) {
  try {
    const axios = axiosInstance();

    let response = await axios(`${API.MY_PRODUCTS}/search/${searchValue}`);

    if (response?.data?.messages) {
      const messages = response.data.messages;
      const errorMessages = messages
        .filter((message: any) => message.type === "error")
        .map((message: any) => `${message.message}`);

      if (errorMessages.length > 0) {
        return {
          success: false,
          data: null,
          messages: errorMessages.join(", "),
        };
      }
    }
    return {
      success: true,
      data: response?.data,
      messages: "",
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      messages: error?.response?.data?.error?.messages.toString(),
    };
  }
}
