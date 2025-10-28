import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const queryPayload = {
    days: searchParams.get("days"),
    order: searchParams.get("order"),
    ponum: searchParams.get("ponum"),
  };

  try {
    const axios = axiosInstance();

    const url = new URL(API.ORDERS);
    for (const [key, value] of Object.entries(queryPayload)) {
      //More concise

      if (value) {
        url.searchParams.append(key, value);
      }
    }

    const response = await axios(url.toString());
    if (response?.data?.messages) {
      const errorMessages = response?.data?.messages?.filter(
        (message: any) => message.type === "error",
      ); //Get error messages

      return NextResponse.json(
        {
          success: false,
          data: [],
          errors: errorMessages || "An error occurred during the request",
        },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json(
      { success: true, data: response.data, errors: null, url: url.toString() },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API call failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        errors: "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}
