"use server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";
import { headers } from "next/headers";

export async function resetPassword(payload: {
  password: string;
  confirmPassword: string;
}) {
  if (!payload.password || !payload.confirmPassword) {
    return {
      success: false,
      message: "Please enter the required fields",
    };
  }

  if (payload.password !== payload.confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match.",
    };
  }

  const url = new URL(headers().get("referer") || "");
  const email = url.searchParams.get("email");
  const user = url.searchParams.get("user");
  const token = url.searchParams.get("token")?.replace(/ /g, "+");

  try {
    const axios = axiosInstance();

    const response = await axios.post(API.RESET_PASSWORD, {
      email,
      user,
      token,
      newPassword: payload.password,
      verifyPassword: payload.confirmPassword,
    });

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on resetting of password:", error.response?.data);

      return {
        status: error.response?.status,
        data: error.response?.data,
      };
    } else {
      console.error("An error occurred on resetting of password:", error);
    }
  }
}
