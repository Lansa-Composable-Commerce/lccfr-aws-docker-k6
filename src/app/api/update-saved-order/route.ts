import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

import { API } from "@/utils/constants";

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const axios = axiosInstance();

    const items = data?.items;

    const response = await axios.put(`${API.UPDATE_SAVED_ORDER}/${data.id}`, {
      items,
    });

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
