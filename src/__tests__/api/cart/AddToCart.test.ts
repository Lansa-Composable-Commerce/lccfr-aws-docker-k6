import { POST } from "@/app/api/cart/route";
import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "@/lib/helpers/axiosInstance";

jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data) => data),
  },
}));
jest.mock("@/lib/helpers/axiosInstance");

const mockNextRequest = NextRequest as jest.Mock;

describe("Add to Cart Route Handler API", () => {
  test("it should return the 'No Product Found!' error message when no product pass.", async () => {
    const mockPayload = { status: 400, message: "No product found!" };

    const mockRequest = {
      json: jest.fn().mockResolvedValue(undefined),
    };

    mockNextRequest.mockImplementation(() => mockRequest);
    const response = await POST(mockRequest as unknown as NextRequest);

    expect(response).toEqual(mockPayload);
    expect(NextResponse.json).toHaveBeenCalledWith(mockPayload);
  });

  test("it should return the 'Please enter a quantity!' error message if the product quantity is zero.", async () => {
    const mockResponse = {
      messages: [
        { message: "Quantity for item with ID 2W10017 is zero." },
        { message: "Quantity for item with ID 2000S is zero." },
      ],
    };
    const mockPayload = [
      { LW3ITEMCD: "2W10017", LW3COLQTY: 0 },
      { LW3ITEMCD: "2000SX", LW3COLQTY: 2 },
      { LW3ITEMCD: "2000S", LW3COLQTY: 0 },
    ];

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockPayload),
    };

    const response = await POST(mockRequest as unknown as NextRequest);

    expect(response).toEqual(mockResponse);
    expect(NextResponse.json).toHaveBeenCalledWith(mockResponse);
  });

  test("it should return the 'MsgAddToCartSuccessful' message with other details the adding to cart is success.", async () => {
    const mockAxiosInstance = axiosInstance as jest.Mock;

    const mockResponse = {
      messages: [
        {
          code: "MsgAddToCartSuccessful",
          message: "Add to cart successful.",
          type: "success",
          field: "",
          detail: "Add To Cart Successful Request",
          substitutions: [],
        },
      ],
    };

    const mockPayload = [
      { LW3ITEMCD: "2W10017", LW3COLQTY: 3 },
      { LW3ITEMCD: "2000SX", LW3COLQTY: 2 },
      { LW3ITEMCD: "2000S", LW3COLQTY: 1 },
    ];

    const mockRequest = {
      json: jest.fn().mockResolvedValue(mockPayload),
    };

    mockAxiosInstance.mockReturnValue({
      post: jest.fn().mockResolvedValue({ data: mockResponse }),
    });

    const response = await POST(mockRequest as unknown as NextRequest);

    expect(response).toEqual(mockResponse);
    expect(NextResponse.json).toHaveBeenCalledWith(mockResponse);
  });
});
