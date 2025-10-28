import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const queryItem = searchParams.get("item");

  const axios = axiosInstance();

  try {
    const response = await axios.delete(`${API.MY_PRODUCTS}?item=${queryItem}`);

    if (response.status === 200) {
      if (response?.data?.messages[0].type === "error") {
        return NextResponse.json(
          {
            success: false,
            data: response?.data,
          },
          { status: 400 },
        );
      }
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
