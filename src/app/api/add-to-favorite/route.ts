import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const axios = axiosInstance();

  try {
    const response = await axios.post(`${API.MY_PRODUCTS}`, data);

    if (response.status === 200) {
      return NextResponse.json(
        {
          success: true,
          data: response?.data,
        },
        { status: 200 },
      );
    } else {
      console.error("API returned an unsuccessful response:", response.data); // Log the error from the API response
      return NextResponse.json(
        {
          success: false,
          data: [],
          errors: response.data.errors || [],
        },
        { status: response.status || 500 },
      );
    }
  } catch (error: any) {
    console.error("An error occurred:", error); //Log the error
    return NextResponse.json(
      {
        success: false,
        data: [],
        errors: error?.response?.data?.errors || [],
      },
      { status: 500 },
    );
  }
}
