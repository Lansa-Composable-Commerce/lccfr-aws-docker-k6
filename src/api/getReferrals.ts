import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { API } from "@/utils/constants";
import { Referral } from "@/types";

interface ReferralsResponse {
  Referrals: Referral[];
}

export async function getReferrals() {
  const axios = axiosInstance();

  try {
    const response: AxiosResponse<ReferralsResponse> = await axios.get(
      API.REFERRALS,
    );

    return response.data.Referrals;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on getting referrals:", error.response);
    } else {
      console.error("An error occurred on getting referrals:", error);
    }
  }
}
