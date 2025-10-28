import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getInvoiceInit() {
  const axios = axiosInstance();
  try {
    const response = await axios.get(API.INVOICES_INIT);

    const res = response?.data;
    return await res;
  } catch (error: any) {
    console.error("API call failed:", error);
    return { message: "Something went wrong" };
  }
}
