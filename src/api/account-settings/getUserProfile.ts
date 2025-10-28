"use server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function getUserProfile() {
  try {
    const axios = axiosInstance();
    let response = await axios(API.USER_PROFILE, {});
    let userProfile = response.data || [];

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

    return {
      success: true,
      data: userProfile || [],
      messages: "",
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      messages: "",
    };
  }
}
