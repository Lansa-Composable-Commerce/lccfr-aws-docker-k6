import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const id = searchParams.get("id");

  try {
    const axios = axiosInstance();

    const response = await axios.delete(`${API.SAVED_ORDER}/${id}`);

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
