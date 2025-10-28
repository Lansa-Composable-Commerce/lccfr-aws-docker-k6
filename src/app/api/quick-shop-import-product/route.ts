import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

export async function POST(request: NextRequest) {
  const { importText } = await request.json();

  const axios = axiosInstance();

  try {
    const data = {
      importText: importText,
      searchType: "",
    };

    const response = await axios.post(`${API.QUICK_SHOP_PRODUCT}/import`, data);

    return NextResponse.json(
      { success: true, data: response?.data },
      { status: 200 },
    );
  } catch (error: any) {
    const errorMessages = error?.response?.data?.messages
      .filter((message: any) => message.type === "error")
      .map((message: any) => `${message.message}`);
    return NextResponse.json(
      {
        success: false,
        data: error?.response?.data,
        errors: errorMessages.toString(),
      },
      { status: 400 },
    );
  }
}
