"use server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";

export async function forgotPassword(payload: { email: string }) {
  if (!payload.email) {
    return {
      success: false,
      message: "Please enter your email address.",
    };
  }

  try {
    const axios = axiosInstance();

    const response = await axios.post(API.FORGOT_PASSWORD, { ...payload });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on forgot password:", error.response?.data);

      return {
        status: error.response?.status,
        data: error.response?.data,
      };
    } else {
      console.error("An error occurred on forgot password.", error);
    }
  }
}
