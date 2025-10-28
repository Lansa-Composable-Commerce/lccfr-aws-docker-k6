"use server";

import { API } from "@/utils/constants";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { ProductTypes } from "@/types";

export async function getMyProducts() {
  try {
    const axios = axiosInstance();

    let response = await axios(API.MY_PRODUCTS);

    let products = response.data || [];

    if (response?.data?.messages) {
      const messages = response.data.messages;
      const errorMessages = messages
        .filter((message: any) => message.type === "error")
        .map((message: any) => `${message.message}`);

      if (errorMessages.length > 0) {
        return {
          success: false,
          data: [],
          messages: errorMessages.join(", "),
        };
      }
    }

    const newProducts = products.map((product: ProductTypes) => ({
      ...product,
      W_FLAGP: "N",
    }));

    return {
      success: true,
      data: newProducts || [],
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
