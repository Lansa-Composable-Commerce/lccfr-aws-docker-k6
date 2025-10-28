import { NextRequest, NextResponse } from "next/server";
import { getCheckoutDetails } from "@/api/checkout";
import { PlaceOrderRequest } from "@/types/Checkout";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { createCookieSession } from "@/lib/auth/session";
import { AxiosError } from "axios";

export async function GET() {
  const response = await getCheckoutDetails();

  return NextResponse.json({ data: response });
}

export async function POST(request: NextRequest) {
  try {
    const payload: PlaceOrderRequest = await request.json();

    if (!payload) {
      return NextResponse.json(
        { message: "Please fill out all required fields." },
        { status: 400 },
      );
    }

    const axios = axiosInstance();

    const response = await axios.post(API.PLACE_ORDER, payload);

    if (response.status === 200) {
      await createCookieSession(
        response.data.LW3ACSTKN,
        response.data.LW3RFSTKN,
      );
    }

    return NextResponse.json({ ...response.data }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(error.response?.data);

      return NextResponse.json(
        {
          ...error.response?.data,
        },
        { status: error.response?.status || 500 },
      );
    } else {
      console.error("An unknown error occurred when placing order!", error);
    }
  }
}
