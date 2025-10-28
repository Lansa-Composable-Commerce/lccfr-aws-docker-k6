import { NextRequest, NextResponse } from "next/server";

import { LoginRequest, LoginResponse } from "@/types";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { createCookieSession } from "@/lib/auth/session";
import { AxiosError, AxiosResponse } from "axios";

export async function POST(request: NextRequest) {
  try {
    const payload: LoginRequest = await request.json();

    if (!payload.Email || !payload.Password) {
      return NextResponse.json(
        { message: "Email and password is required" },
        { status: 400 },
      );
    }

    const axios = axiosInstance();
    const response: AxiosResponse<LoginResponse> = await axios.post(
      API.LOGIN,
      payload,
    );

    if (response.status === 200) {
      await createCookieSession(
        response.data.LW3ACSTKN,
        response.data.LW3RFSTKN,
      );

      return NextResponse.json({ ...response.data }, { status: 200 });
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log("error", error.response);

      return NextResponse.json(
        {
          ...error.response?.data,
        },
        { status: error.response?.status || 500 },
      );
    } else {
      console.error("An unknown error occurred on login!", error);
    }
  }
}
