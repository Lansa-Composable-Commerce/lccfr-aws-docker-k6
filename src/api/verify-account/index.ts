import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";
import { Message } from "@/types";

type VerifyAccount = {
  token: string;
  email: string;
};

type APIResponse = {
  status: number;
  data: { messages: Message[] };
};

export default async function verifyAccount({ token, email }: VerifyAccount) {
  if (!token || !email) return;

  const decodeToken = token.replace(/ /g, "+");

  try {
    const axios = axiosInstance();

    const response = await axios.post(API.VERIFY_ACCOUNT, {
      token: decodeToken,
      email,
    });

    return {
      status: response.status,
      data: response.data,
    } as APIResponse;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "Failed on verifying the account link:",
        error.response?.data,
      );

      return {
        status: error.response?.status,
        data: error.response?.data,
      } as APIResponse;
    } else {
      const errorMessage = {
        code: "MsgDefaultError",
        message: "An error occurred on verifying account link:",
        type: "error",
        field: "",
        detail: "",
        substitutions: [],
      };
      console.error("An error occurred on verifying account link:", error);

      return {
        status: 500,
        data: { messages: [errorMessage] },
      };
    }
  }
}
