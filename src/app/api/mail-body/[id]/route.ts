import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;

  try {
    const axios = axiosInstance();
    let response = await axios(`${API.MAIL}/${id}/body.html`);

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
