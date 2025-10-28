import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const axios = axiosInstance();

  try {
    const response = await axios.post(API.SAVE_ORDER, data);

    if (response.status === 200) {
      return NextResponse.json(
        {
          success: true,
          data: response?.data,
        },
        { status: 200 },
      );
    }
  } catch (error: any) {
    if (error?.status === 400) {
      return NextResponse.json(
        {
          success: false,
          data: error?.response?.data,
          errors: error,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        data: error?.response?.data,
        errors: error,
      },
      { status: 500 },
    );
  }
}
