import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

interface ErrorMessage {
  type: "error" | "warning" | "info";
  message: string;
  code?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  errors?: string[];
}

export async function GET() {
  try {
    const axios = axiosInstance();

    const response = await axios.get(API.PREFERENCES);

    return NextResponse.json(
      {
        success: true,
        data: response?.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        errors: ["An unexpected error occurred"],
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const requestData = await request.json();

    const axios = axiosInstance();

    const response = await axios.put(API.PREFERENCES, requestData);

    return NextResponse.json(
      {
        success: true,
        data: response?.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        errors: ["An unexpected error occurred"],
      },
      { status: 500 },
    );
  }
}
