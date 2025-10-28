import { API } from "@/utils/constants";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getPreferences() {
  try {
    const axios = axiosInstance();

    const response = await axios(`${API.PREFERENCES}`);

    // Check if the response status is within the 2xx range (success)
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      console.error(
        `Error fetching preferences: HTTP status ${response.status}`,
      );
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching preferences:", error);

    if (error.response) {
      console.error(
        "Server responded with:",
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }

    return []; // Return an empty array on any error
  }
}
