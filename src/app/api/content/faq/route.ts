import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const axios = axiosInstance();

    const response = await axios.get(`${API.CONTENT}/layout/faq`);

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
