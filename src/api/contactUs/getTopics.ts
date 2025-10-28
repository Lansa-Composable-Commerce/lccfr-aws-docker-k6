import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError, AxiosResponse } from "axios";
import { Topic } from "@/types/ContactUs";
import { COOKIE_ACCESS_TOKEN, getDecryptedCookie } from "@/lib/auth/session";

interface ContactUsInitResponse {
  topic: Topic[];
  customerWorkPhoneNumber: string;
}

export async function getTopics() {
  const accessToken = getDecryptedCookie(
    COOKIE_ACCESS_TOKEN.name,
    process.env.SECRET_KEY_ACCESS_TOKEN,
  );

  const headers = { Authorization: accessToken ? accessToken : "Bearer none" };

  try {
    const axios = axiosInstance();

    const response: AxiosResponse<ContactUsInitResponse> = await axios.get(
      API.CONTACT_US_INIT,
      {
        headers,
      },
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed on initializing contact us:", error.response);
    } else {
      console.error("An error occurred on contact us initialization:", error);
    }
  }
}
