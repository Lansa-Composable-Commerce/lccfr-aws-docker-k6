import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getInvoice(id: number) {
  try {
    const axios = axiosInstance();

    let response = await axios.get(`${API.INVOICE}/${id}`);

    if (response?.data?.messages) {
      const messages = response.data.messages;
      const errorMessages = messages
        .filter((message: any) => message.type === "error")
        .map((message: any) => `${message.message}`);

      if (errorMessages.length > 0) {
        return {
          success: false,
          data: null,
          messages: errorMessages.join(", "),
        };
      }
    }

    return {
      success: true,
      data: response?.data,
      messages: "",
    };
  } catch (error: any) {
    console.log("error", error?.response?.data?.error?.messages.toString());
    return {
      success: false,
      data: null,
      messages: error?.response?.data?.error?.messages.toString(),
    };
  }
}
