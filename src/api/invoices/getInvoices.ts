import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

interface IqueryPayload {
  days?: number | null;
  id?: number | null;
  ponum?: string | null;
}

export async function getInvoices(queryPayload: IqueryPayload) {
  const filteredQuery = Object.fromEntries(
    Object.entries(queryPayload).filter(([_, value]) => value !== null),
  );

  try {
    const axios = axiosInstance();

    const url = new URL(API.INVOICES);
    const params = new URLSearchParams();

    if (filteredQuery.days) {
      params.append("days", filteredQuery.days);
    }
    if (filteredQuery.id) {
      params.append("id", filteredQuery.id);
    }
    if (filteredQuery.ponum) {
      params.append("ponum", filteredQuery.ponum);
    }
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
      return { success: true, data: response?.data };
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
