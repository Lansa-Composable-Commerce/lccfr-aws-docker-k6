import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";
import { Message } from "@/types";
import { PromotionCode } from "@/types/Cart";

export async function PUT(request: NextRequest) {
  const data: PromotionCode = await request.json();

  if (!data) {
    return NextResponse.json(
      { message: "Please input a promo code!" },
      { status: 400 },
    );
  }

  try {
    const axios = axiosInstance();

    const response = await axios.put(`${API.PROMOTIONS_ADD}`, data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on adding promotion", error.response?.data);

      const errorDetails: Message[] = error.response?.data.messages;

      return NextResponse.json(errorDetails[0], { status: error.status });
    } else {
      console.error("An error occurred while creating promotion", error);

      return NextResponse.json(
        {
          message: "An unexpected error occurred.",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  }
}

export async function DELETE() {
  try {
    const axios = axiosInstance();

    const response = await axios.delete(`${API.PROMOTIONS_REMOVE}`);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on removing promotion", error.response?.data);

      const errorDetails: Message[] = error.response?.data.messages;

      return NextResponse.json(errorDetails[0], { status: error.status });
    } else {
      console.error("An error occurred while removing promotion", error);

      return NextResponse.json(
        {
          message: "An unexpected error occurred.",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  }
}
