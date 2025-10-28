import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError } from "axios";

export async function getHeroCarousel() {
  try {
    const axios = axiosInstance();

    const response = await axios.get("/CNSCNTAST/content/homepage/banner");

    return response.data as { LW3CNTSTR: string };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Content Axios Error Hero Carousel:", error.response);
    } else {
      console.error("Content Error Hero Carousel:", error);
    }
  }
}
