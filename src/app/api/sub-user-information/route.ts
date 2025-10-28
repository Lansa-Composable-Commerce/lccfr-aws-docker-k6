import { NextRequest, NextResponse } from "next/server";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const axios = axiosInstance();

    const response = await axios.post(API.SUB_USER, data);

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const querySubUserId = searchParams.get("subuserId");

    const axios = axiosInstance();

    const response = await axios.get(
      `${API.SUB_USER}/profile/${querySubUserId}`,
    );

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

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    const axios = axiosInstance();

    const response = await axios.put(API.SUB_USER, data);

    /* if (response?.data?.messages) {
      const messages = response.data.messages;

      const errorMessages = messages
        .filter((message: any) => message.type === "error")
        .map((message: any) => `${message.message}`);

      if (errorMessages.length > 0) {
        return NextResponse.json(
          {
            success: false,
            data: [],
            errors: errorMessages.join(", "),
            messages: response.data.messages[0]?.code,
          },
          { status: 400 },
        );
      }
    }*/
    return NextResponse.json(
      {
        success: true,
        data: response.data,
        messages: response.data.messages[0]?.code,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API call failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        errors: "An unknown error occurred",
        messages: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const querySubUserId = searchParams.get("subuserId");

    const axios = axiosInstance();

    const config = {
      params: {
        subuserId: querySubUserId,
      },
    };

    const response = await axios.delete(API.SUB_USER, config);

    if (response?.data?.messages) {
      const messages = response.data.messages;

      const errorMessages = messages
        .filter((message: any) => message.type === "error")
        .map((message: any) => `${message.message}`);
      if (errorMessages.length > 0) {
        return NextResponse.json(
          {
            success: false,
            data: [],
            errors: errorMessages.join(", "),
            messages: response.data.messages[0]?.code,
          },
          { status: 400 },
        );
      }
    }
    return NextResponse.json(
      {
        success: true,
        data: response.data,
        messages: response.data.messages[0]?.code,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API call failed:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        error: error,
        messages: "500\n" + "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
