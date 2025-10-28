import { AxiosError } from "axios";

import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getAccounts() {
  try {
    const axios = axiosInstance();

    const response = await axios.get(API.ACCOUNTS);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on getting accounts:", error.response);
    } else {
      console.error("An error occurred on getting accounts:", error);
    }
  }
}
