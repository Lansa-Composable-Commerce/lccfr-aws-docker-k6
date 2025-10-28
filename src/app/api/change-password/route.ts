import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();

    const axios = axiosInstance();

    const response = await axios.post(API.CHANGE_PASSWORD, requestData);

    return NextResponse.json(
      {
        success: true,
        data: response?.data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        errors: error,
      },
      { status: 500 },
    );
  }
}
