import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { getOrderDetails } from "@/api/orders/getOrderDetails";

jest.mock("@/lib/helpers/axiosInstance");
jest.mock("@/lib/auth/verifyToken", () => ({ decodeToken: jest.fn() }));
jest.mock("@/lib/auth/session", () => ({
  getDecryptedCookie: jest.fn(),
  COOKIE_ACCESS_TOKEN: { name: "access_token" },
}));

describe("Get Order Details API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  const ORDER_ID = 269;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("it should retrieve order details", async () => {
    const mockOrderDetails = {
      items: [
        {
          LW3ITEMCD: "1001",
          LW3IDESC: "One Iron - Infiniti 425 Titanium Insert Iron",
          LW3LPRICE: 0,
          LW3UM: "EA",
          LW3QTYRQS: 3,
          LW3PRCEXT: 209.85,
          LW3OISD: 20240124,
          D_LPRICE: "$69.95",
          D_PRCEXT: "$209.85",
          LW3ISIZE: "",
          LW3ICOLR: "",
          shippingDate: "01/24/2024",
        },
      ],
      shipto: {
        LW3CSNAME: "Tiger Woods",
        LW3CSCPNY: "",
        LW3SADDR1: "9050 Bonita Beach Rd. SE",
        LW3SADDR2: "",
        LW3CSCITY: "Bonita Springs",
        LW3SSTATE: "FL",
        LW3SPSTAL: "34135",
        LW3SCNTRY: "USA",
      },
      billto: {
        LW3CHNAME: "Tiger Woods",
        LW3CHCPNY: "",
        LW3HADDR1: "9050 Bonita Beach Rd. SE",
        LW3HADDR2: "",
        LW3CHCITY: "Bonita Springs",
        LW3HSTATE: "FL",
        LW3HPSTAL: "34135",
        LW3HCNTRY: "USA",
      },
      totals: {
        D_ORDTOT: "$209.85",
        D_CHGTOT: "$.00",
        D_AMOUNT: "$.00",
        D_TOTAL: "$209.85",
      },
      order: {
        customer: "004",
        order: "269",
      },
    };

    mockAxiosInstance.mockReturnValue({
      // Mock the axios instance
      get: jest.fn().mockResolvedValue({ data: mockOrderDetails }),
    });

    const result = await getOrderDetails(ORDER_ID);

    expect(mockAxiosInstance().get).toHaveBeenCalledWith(
      `${API.ORDER_DETAILS}/${ORDER_ID}`,
    ); // Check API endpoint called with correct ID
    expect(result).toEqual(mockOrderDetails); // Check if the returned data matches expected data
  });

  test("it should handle and return error messages from the API", async () => {
    const mockErrorMessage = "Order not found";

    const mockResponse = {
      success: false,
      data: null,
      messages: mockErrorMessage,
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: mockResponse,
      }),
    });

    const result = await getOrderDetails(ORDER_ID);

    expect(result).toEqual({
      success: false,
      data: null,
      messages: mockErrorMessage,
    });
  });

  test("should catch and log errors when the API call fails", async () => {
    const mockError = {
      response: {
        data: {
          error: {
            messages: ["Network Error"],
          },
        },
      },
    };
    const consoleLogSpy = jest
      .spyOn(console, "log")
      .mockImplementation(() => {});
    const mockGet = jest.fn().mockRejectedValue(mockError);
    mockAxiosInstance.mockReturnValue({
      get: mockGet,
    });

    const result = await getOrderDetails(ORDER_ID);

    expect(mockAxiosInstance().get).toHaveBeenCalledWith(
      `${API.ORDER_DETAILS}/${ORDER_ID}`,
    );
    expect(consoleLogSpy).toHaveBeenCalledWith("error", "Network Error");
    expect(result).toEqual({
      data: null,
      messages: "Network Error",
      success: false,
    });

    consoleLogSpy.mockRestore();
  });
});
