import { NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

import { FilterOrders } from "@/types";

export async function GET() {
  try {
    const axios = axiosInstance();

    const response = await axios.get<FilterOrders[]>(API.ORDERS_DROPDOWN);

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
