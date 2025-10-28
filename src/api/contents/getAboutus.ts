import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError } from "axios";

export async function getAboutUs() {
  const axios = axiosInstance();

  try {
    const response = await axios.get("/CNSCNTAST/content/layout/aboutus");

    return response.data as { LW3CNTSTR: string };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Content Axios Error:", error.response);
    } else {
      console.error("Content Error:", error);
    }
  }
}
