import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { IOrderInquiryListProps } from "@/types";

interface IqueryPayload {
  days?: number | null;
  order?: number | null;
  ponum?: string | null;
}

export interface OrderInquiryListResponse {
  data: IOrderInquiryListProps[];
  success: boolean;
  errors: string;
}

export async function getOrders(queryPayload: IqueryPayload) {
  const filteredQuery = Object.fromEntries(
    Object.entries(queryPayload).filter(([_, value]) => value !== null),
  );

  try {
    const axios = axiosInstance();

    const url = new URL(API.ORDERS);
    const params = new URLSearchParams();

    filteredQuery.days && params.append("days", filteredQuery.days.toString());

    filteredQuery.order &&
      params.append("order", filteredQuery.order.toString());

    filteredQuery.ponum &&
      params.append("ponum", filteredQuery.ponum.toString());

    url.search = params.toString();

    const response = await axios.get(url.toString());

    if (response?.data?.messages) {
      const messages = response.data.messages;
      const errorMessages = messages
        .filter((message: any) => message.type === "error")
        .map((message: any) => `${message.message}`);

      if (errorMessages.length > 0) {
        if (Object.keys(filteredQuery).length === 0) {
          return { data: [], errors: "" };
        }
        return { success: false, data: [], errors: errorMessages };
      }
    } else {
      return { success: true, data: response?.data || [], errors: "" };
    }
  } catch (error: any) {
    console.error("API call failed:", error);
    return {
      success: false,
      data: [],
      errors: "An unknown error occurred",
    };
  }
}
