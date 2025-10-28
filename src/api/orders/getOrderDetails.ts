import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getOrderDetails(id: number) {
  try {
    const axios = axiosInstance();

    let response = await axios.get(`${API.ORDER_DETAILS}/${id}`);

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
