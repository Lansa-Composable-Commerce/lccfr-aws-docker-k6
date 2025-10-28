import { AxiosError } from "axios";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function getShippingInformation() {
  const axios = axiosInstance();

  try {
    const response = await axios.get(`${API.CONTENT}/layout/shippnginfo`);

    return response.data as { LW3CNTSTR: string };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Content Axios Error:", error.response);
    } else {
      console.error("Content Error:", error);
    }
  }
}
