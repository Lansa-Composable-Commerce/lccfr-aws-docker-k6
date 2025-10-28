import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

interface DashboardResponse {
  LW3CNTSTR?: string | undefined;
  messages?: {
    code: string;
    message: string;
    type: string;
    detail: string;
  }[];
}

export async function getDashboardMain(): Promise<{
  data: string;
  error?: string;
}> {
  const axios = axiosInstance();

  try {
    const response = await axios.get<DashboardResponse>(
      `${API.CONTENT}/dashboard/main`,
    );
    const { LW3CNTSTR, messages } = response.data;

    if (messages?.length && messages[0].type === "error") {
      return { data: "", error: messages[0].detail || "An error occurred." };
    }

    return { data: LW3CNTSTR ?? "" };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Content Axios Error:", error.response);
    } else {
      console.error("Content Error:", error);
    }
    return { data: "", error: "An unexpected error occurred." };
  }
}
