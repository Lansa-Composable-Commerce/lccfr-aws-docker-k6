import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError } from "axios";

export async function getContactUs() {
  const axios = axiosInstance();

  try {
    const response = await axios.get(
      "/CNSCNTAST/content/contactus/main-content",
    );

    return response.data as { LW3CNTSTR: string };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "Failed on getting the content of the Contact Us:",
        error.response,
      );
    } else {
      console.error(
        "An error occurred while fetching the content of Contact Us",
        error,
      );
    }
  }
}
