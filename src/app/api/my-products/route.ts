import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

export async function GET() {
  try {
    const axios = axiosInstance();

    let response = await axios(API.MY_PRODUCTS);

    let products = response.data || [];

    if (response?.data?.messages) {
      const messages = response.data.messages;
      const errorMessages = messages
        .filter((message: any) => message.type === "error")
        .map((message: any) => `${message.message}`);

      if (errorMessages.length > 0) {
        return NextResponse.json(
          {
            success: false,
            data: [],
            errors: errorMessages.join(", "),
          },
          { status: 400 },
        );
      }
    } else {
      return NextResponse.json(
        { success: true, data: products },
        { status: 200 },
      );
    }
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
