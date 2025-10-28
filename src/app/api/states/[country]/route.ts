import { type NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { State } from "@/types";
import { AxiosError } from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } },
) {
  const { country } = params;

  try {
    const axios = axiosInstance();

    const result = await axios.get(`${API.STATES}/${country}`);

    const states = result.data.States.map((state: State) => {
      return {
        label: state.LW3STATED.trim(),
        value: state.LW3STATE,
      };
    });

    return NextResponse.json({ states });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on getting states:", error.response?.data);

      const errorDetails = error.response?.data.messages[0];

      return NextResponse.json(errorDetails, { status: error.status });
    } else {
      console.error("An error occurred on getting states.", error);

      return NextResponse.json(
        {
          message: "An unexpected error occurred.",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  }
}
