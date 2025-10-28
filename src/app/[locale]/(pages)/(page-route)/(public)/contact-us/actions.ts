"use server";

import { ContactUsInformation } from "@/types/ContactUs";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError } from "axios";
import { API } from "@/utils/constants";

const requiredFields: (keyof ContactUsInformation)[] = [
  "customerFirstName",
  "customerLastName",
  "customerEmailAddress",
  "customerContactNumber",
  "topicEmailName",
  "topicEmailAddress",
  "emailBody",
];

export async function contactUs(payload: ContactUsInformation) {
  const missingFields = requiredFields.filter(
    (field) => !payload[field] || payload[field]?.trim() === "",
  );

  if (missingFields.length > 0) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  try {
    const axios = axiosInstance();

    const response = await axios.post(API.CONTACT_US_SEND, { ...payload });

    return {
      statusCode: response.status,
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on sending a contact form:", error.response?.data);

      return {
        statusCode: error.response?.status,
        data: error.response?.data,
      };
    } else {
      console.error("An error occurred when sending a contact form:", error);
    }
  }
}
