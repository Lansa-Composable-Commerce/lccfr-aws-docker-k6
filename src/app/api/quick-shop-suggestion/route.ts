import { NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const querySearch = searchParams.get("search");
    const queryType = searchParams.get("type");

    const axios = axiosInstance();
    const config = {
      params: {
        search: querySearch,
        type: queryType,
      },
    };

    const response = await axios(
      `${API.QUICK_SHOP_PRODUCT}/suggestion`,
      config,
    );

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
      const newResponse = response.data.map(
        (item: { productCode: string }) => ({
          label: item.productCode,
          value: item.productCode,
        }),
      );
      return NextResponse.json(
        { success: true, data: newResponse },
        { status: 200 },
      );
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Token exchange error" },
      { status: 500 },
    );
  }
}
