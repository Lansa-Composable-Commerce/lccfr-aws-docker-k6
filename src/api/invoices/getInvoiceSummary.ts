import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getInvoiceSummary() {
  try {
    const axios = axiosInstance();

    const response = await axios.get(API.INVOICE_SUMMARY);

    const res = response?.data;

    return await res;
  } catch (error: any) {
    console.error("API call failed:", error);
    return { message: "Something went wrong" };
  }
}
