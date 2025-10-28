import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";
import { CartRequest } from "@/types/Cart";
import { getCart } from "@/api/cart";

export async function GET() {
  const response = await getCart();

  return NextResponse.json({ data: response });
}

export async function POST(request: NextRequest) {
  const data: { cartItems: CartRequest[]; type: string } = await request.json();

  if (!data.cartItems || data.cartItems.length === 0) {
    return NextResponse.json({ status: 400, message: "No product found!" });
  }

  const hasZeroQuantity = data.cartItems.some((item) => item.quantity === 0);

  if (hasZeroQuantity) {
    const errorMessages = data.cartItems
      .filter((item) => item.quantity === 0)
      .map((item) => ({
        message: `Quantity for item with ID ${item.productCode} is zero.`,
      }));

    return NextResponse.json({ messages: errorMessages });
  }

  try {
    const axios = axiosInstance();

    const requestPayload = data.cartItems.map((item) => {
      const { productCode, quantity } = item;

      return { productCode, quantity };
    });

    let response;

    if (data.type === "add") {
      response = await axios.post(`${API.CART_ADD}`, requestPayload);
    } else {
      response = await axios.post(`${API.CART_UPDATE}`, requestPayload);
    }

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed on adding items to cart:", error.response?.data);

      const errorDetails = error.response?.data.messages;

      return NextResponse.json(errorDetails, { status: error.status });
    } else {
      console.error("An error occurred on adding items to cart:", error);

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

export async function DELETE(request: NextRequest) {
  let data = null;

  try {
    data = await request.json();
  } catch (error) {
    console.warn("Request body is empty or invalid JSON. Assuming delete all.");
  }

  try {
    const axios = axiosInstance();

    if (data) {
      const response = await axios.delete(`${API.CART_REMOVE_ITEM}/${data}`);

      return NextResponse.json(response.data);
    } else {
      const response = await axios.delete(API.CART_REMOVE_ALL_ITEM);

      return NextResponse.json(response.data);
    }
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "Failed on removing item from the cart:",
        error.response?.data,
      );

      const errorDetails = error.response?.data.messages;

      return NextResponse.json(errorDetails, { status: error.status });
    } else {
      console.error("An error occurred on removing item from the cart:", error);

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
