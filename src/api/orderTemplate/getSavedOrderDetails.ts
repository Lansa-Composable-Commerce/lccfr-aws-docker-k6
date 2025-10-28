import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function getSavedOrderDetails(id: number) {
  try {
    const axios = axiosInstance();

    let response = await axios.get(`${API.SAVED_ORDER}/${id}`);
    return await response.data;
  } catch (error: any) {
    console.log("error", error?.response?.data?.error?.messages.toString());
    return {
      success: false,
      data: null,
      messages: error?.response?.data?.error?.messages.toString(),
    };
  }
}
