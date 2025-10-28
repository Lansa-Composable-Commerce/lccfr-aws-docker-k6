import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { FilterOrders } from "@/types";

export async function getOrderInit(): Promise<
  FilterOrders[] | { success: boolean; data: null; messages: string }
> {
  const axios = axiosInstance();

  try {
    const response = await axios.get<FilterOrders[]>(API.ORDERS_DROPDOWN);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching order initialization data:", error);

    return {
      success: false,
      data: null,
      messages: "Something went wrong",
    };
  }
}
