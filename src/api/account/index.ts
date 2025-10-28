import { API } from "@/utils/constants";
import { COOKIE_REFRESH_TOKEN, getDecryptedCookie } from "@/lib/auth/session";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

export async function getAccount(id: any) {
  const refreshToken = getDecryptedCookie(
    COOKIE_REFRESH_TOKEN.name,
    process.env.SECRET_KEY_REFRESH_TOKEN,
  );

  try {
    const axios = axiosInstance();

    const config = {
      headers: {
        Cookie: `ce_rf_token=${refreshToken}`,
      },
    };

    const url = `${API.ACCOUNTS}/${id}`;
    const response = await axios.get(url, config);

    return response.data;
  } catch (error) {
    console.error("Failed on selecting account:", error);
    return error;
  }
}
