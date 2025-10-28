import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError } from "axios";

export const getTranslatedData = async (locale: string) => {
  const axios = axiosInstance();

  try {
    const response = await axios.get(`/CNSMLVAR/multilinguals/${locale}`);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "Error occurred in getting translated data:",
        error.response?.data,
      );
    } else {
      console.error("An error occurred on getting translated data:", error);
    }
  }
};
