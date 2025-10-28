import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { FilterOrders } from "@/types";
import { getOrderInit } from "@/api/orders/getOrderInit";

jest.mock("@/lib/helpers/axiosInstance");
jest.mock("@/lib/auth/verifyToken", () => ({ decodeToken: jest.fn() }));
jest.mock("@/lib/auth/session", () => ({
  getDecryptedCookie: jest.fn(),
  COOKIE_ACCESS_TOKEN: { name: "access_token" },
}));

describe("Get Order Init API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("it should successfully fetch order initialization data", async () => {
    const mockOrderDropdownData: FilterOrders[] = [
      {
        value: "0",
        desc: "0 - 30 days",
      },
      {
        value: "1",
        desc: "31 - 60 days",
      },
      {
        value: "2",
        desc: "61 - 90 days",
      },
      {
        value: "3",
        desc: "91+ days",
      },
    ];

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockOrderDropdownData }),
    });

    const result = await getOrderInit();

    expect(mockAxiosInstance().get).toHaveBeenCalledWith(API.ORDERS_DROPDOWN);
    expect(result).toEqual(mockOrderDropdownData);
  });

  test("it should catch and log errors when the API call fails", async () => {
    const mockError = new Error("Network error");
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {}); // Suppress console output

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });
    const mockGet = jest.fn().mockRejectedValue(mockError);
    mockAxiosInstance.mockReturnValue({ get: mockGet });

    const result = await getOrderInit();

    expect(mockGet).toHaveBeenCalledWith(API.ORDERS_DROPDOWN);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching order initialization data:",
      mockError,
    );
    expect(result).toEqual({
      success: false,
      data: null,
      messages: "Something went wrong",
    });

    consoleErrorSpy.mockRestore(); // Restore console.error
  });
});
