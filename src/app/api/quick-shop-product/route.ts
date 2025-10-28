import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function GET(request: NextRequest) {
  const axios = axiosInstance();

  const searchParams = request.nextUrl.searchParams;
  const queryItemCode = searchParams.get("itemcode");
  const queryQuantity = searchParams.get("quantity");

  const config = {
    params: {
      itemcode: queryItemCode,
      quantity: queryQuantity,
    },
  };

  try {
    const response = await axios(`${API.QUICK_SHOP_PRODUCT}`, config);

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
            errors: errorMessages,
          },
          { status: 400 },
        );
      }
    } else {
      const newResponse = {
        ...response?.data,
        itemCode: queryItemCode,
        quantity: queryQuantity || 0,
      };
      return NextResponse.json(
        { success: true, data: newResponse },
        { status: 200 },
      );
    }
  } catch (error) {
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
