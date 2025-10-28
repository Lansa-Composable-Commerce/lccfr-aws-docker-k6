import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const axios = axiosInstance();
    let response = await axios(`${API.CONTENT}/homepage/logo`);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
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
