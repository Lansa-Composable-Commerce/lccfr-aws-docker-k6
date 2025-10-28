import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { getOrders } from "@/api/orders/getOrders";

jest.mock("@/lib/helpers/axiosInstance");
jest.mock("@/lib/auth/verifyToken", () => ({ decodeToken: jest.fn() }));
jest.mock("@/lib/auth/session", () => ({
  getDecryptedCookie: jest.fn(),
  COOKIE_ACCESS_TOKEN: { name: "access_token" },
}));

describe("Get Orders API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("it should return list of orders", async () => {
    const mockOrders = [
      {
        LW3OION: "269",
        LW3OIOT: 209.85,
        LW3OIPO: "RG-123645654-13",
        LW3OIOD: 20240124,
        LW3OISD: 20240124,
        LW3OITK: "",
        LW3OIURL: "",
        D_OIOT: "$209.85",
        orderDate: "01/24/2024",
        shippingDate: "01/24/2024",
      },
      {
        LW3OION: "268",
        LW3OIOT: 2366.93,
        LW3OIPO: "123111",
        LW3OIOD: 20230803,
        LW3OISD: 20230803,
        LW3OITK: "",
        LW3OIURL: "",
        D_OIOT: "$2,366.93",
        orderDate: "08/03/2023",
        shippingDate: "08/03/2023",
      },
    ];

    const queryPayload = {
      days: 3,
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockOrders }),
    });

    const result = await getOrders(queryPayload);

    expect(result?.data).toEqual(mockOrders);
    expect(mockAxiosInstance().get).toHaveBeenCalledWith(
      `${API.ORDERS}?days=3`,
    );
  });

  test("it should filter out null values from queryPayload", async () => {
    const queryPayload = { days: 3, order: null, ponum: "123111" };
    const expectedParams = { days: 3, ponum: "123111" };

    const mockGet = jest.fn();
    mockAxiosInstance.mockReturnValue({
      get: mockGet,
    });

    await getOrders(queryPayload);

    const calledUrl = new URL(mockGet.mock.calls[0][0]);

    const calledParams = Object.fromEntries(
      Array.from(calledUrl.searchParams.entries()).map(([key, value]) => [
        key,
        key === "days" || key === "order" ? Number(value) : value,
      ]),
    );

    expect(calledParams).toEqual(expectedParams);
  });

  test("it should construct URL correctly when all fields are provided", async () => {
    const queryPayload = { days: 3, order: 268, ponum: "123111" };

    const mockGet = jest.fn();
    mockAxiosInstance.mockReturnValue({
      get: mockGet,
    });

    await getOrders(queryPayload);

    const expectedUrl = `${API.ORDERS}?days=3&order=268&ponum=123111`;
    expect(mockAxiosInstance().get).toHaveBeenCalledWith(expectedUrl);
  });

  test("should return errors when response.data.messages contains error messages", async () => {
    const queryPayload = { days: 30 };

    const mockOrdersData = {
      data: {
        messages: [{ type: "error", message: "Some error occurred" }],
      },
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockOrdersData),
    });

    const result = await getOrders(queryPayload);

    expect(result).toEqual({
      success: false,
      data: [],
      messages: ["Some error occurred"],
    });
  });

  test("should return success with empty data when all filtered query in null", async () => {
    const queryPayload = { days: null, id: null, ponum: null };

    const mockInvoicesData = {
      data: {
        messages: [{ type: "error", message: "Some error occurred" }], // Contains error messages
      },
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockInvoicesData),
    });

    const result = await getOrders(queryPayload);

    expect(result).toEqual({ data: [], errors: "" }); // The key assertion
  });

  test("should catch and log errors when the API call fails", async () => {
    const queryPayload = { days: 30 };
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const mockError = new Error("Network Error");

    const mockGet = jest.fn().mockRejectedValue(mockError);
    mockAxiosInstance.mockReturnValue({
      get: mockGet,
    });

    const result = await getOrders(queryPayload);
    expect(consoleErrorSpy).toHaveBeenCalledWith("API call failed:", mockError);
    expect(result).toEqual({
      success: false,
      data: [],
      errors: "An unknown error occurred",
    });

    consoleErrorSpy.mockRestore();
  });
});
