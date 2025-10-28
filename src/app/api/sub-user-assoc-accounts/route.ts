import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const querySubUserId = searchParams.get("subuserId");

    const axios = axiosInstance();

    const config = {
      params: {
        subuserId: querySubUserId,
      },
    };

    const response = await axios.get(`${API.SUB_USER}/accounts`, config);

    return NextResponse.json(
      { success: true, data: response.data },
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

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const querySubUserId = searchParams.get("subuserId");

    const axios = axiosInstance();

    const config = {
      params: {
        subuserId: querySubUserId,
      },
      data,
    };

    const response = await axios.put(
      `${API.SUB_USER}/accounts?subuserId=${data.subuserId}`,
      config?.data.payload,
    );

    return NextResponse.json(
      { success: true, data: response.data },
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
