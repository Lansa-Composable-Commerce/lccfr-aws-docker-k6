import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { getInvoices } from "@/api/invoices/getInvoices";
import { API } from "@/utils/constants";

jest.mock("@/lib/helpers/axiosInstance");
jest.mock("@/lib/auth/verifyToken", () => ({ decodeToken: jest.fn() }));
jest.mock("@/lib/auth/session", () => ({
  getDecryptedCookie: jest.fn(),
  COOKIE_ACCESS_TOKEN: { name: "access_token" },
}));

describe("Get Invoices API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("it should return list of invoices", async () => {
    const mockInvoices = [
      {
        LW3IIIN: "269",
        LW3IIIT: 0,
        LW3IIPO: "RG-123645654-13",
        invoiceDate: "01/24/2024",
        invoiceCloseDate: "01/24/2024",
        LW3INVAMT: 0,
        D_IIIT: "$.00",
        D_INVAMT: "$.00",
      },
      {
        LW3IIIN: "268",
        LW3IIIT: 0,
        LW3IIPO: "123111",
        invoiceDate: "08/03/2023",
        invoiceCloseDate: "08/03/2023",
        LW3INVAMT: 0,
        D_IIIT: "$.00",
        D_INVAMT: "$.00",
      },
    ];

    const queryPayload = {
      days: 3,
      id: 269,
      ponum: "RG-123645654-13",
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockInvoices }),
    });

    const result = await getInvoices(queryPayload);

    expect(result?.data).toEqual(mockInvoices);
    expect(mockAxiosInstance().get).toHaveBeenCalledWith(
      `${API.INVOICES}?days=3&id=269&ponum=RG-123645654-13`,
    );
  });

  test("should filter out null values from queryPayload", async () => {
    const queryPayload = { days: 3, id: null, ponum: "123111" };
    const expectedParams = { days: 3, ponum: "123111" };

    const mockGet = jest.fn();
    mockAxiosInstance.mockReturnValue({
      get: mockGet,
    });

    await getInvoices(queryPayload);

    const calledUrl = new URL(mockGet.mock.calls[0][0]);
    const calledParams = Object.fromEntries(
      Array.from(calledUrl.searchParams.entries()).map(([key, value]) => [
        key,
        key === "days" || key === "id" ? Number(value) : value,
      ]),
    );

    expect(calledParams).toEqual(expectedParams);
  });

  test("should construct URL correctly when all fields are provided", async () => {
    const queryPayload = { days: 3, id: 268, ponum: "123111" };

    const mockGet = jest.fn();
    mockAxiosInstance.mockReturnValue({
      get: mockGet,
    });

    await getInvoices(queryPayload);

    const expectedUrl = `${API.INVOICES}?days=3&id=268&ponum=123111`;
    expect(mockAxiosInstance().get).toHaveBeenCalledWith(expectedUrl);
  });

  test("should return success with data when API call is successful and no error messages", async () => {
    const queryPayload = { id: 268 };

    const mockInvoicesData = {
      success: true,
      data: [
        {
          LW3IIIN: "268",
          LW3IIIT: 0,
          LW3IIPO: "123111",
          invoiceDate: "08/03/2023",
          invoiceCloseDate: "08/03/2023",
          LW3INVAMT: 0,
          D_IIIT: "$.00",
          D_INVAMT: "$.00",
        },
      ],
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockInvoicesData),
    });

    const result = await getInvoices(queryPayload);

    expect(result).toEqual({
      success: true,
      data: mockInvoicesData.data,
    });
  });

  test("should return errors when response.data.messages contains error messages", async () => {
    const queryPayload = { days: 30 };

    const mockInvoicesData = {
      data: {
        messages: [{ type: "error", message: "Some error occurred" }],
      },
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockInvoicesData),
    });

    const result = await getInvoices(queryPayload);

    expect(result).toEqual({
      success: false,
      data: [],
      errors: ["Some error occurred"],
    });
  });

  test("should return success with empty data when all filtered query in null", async () => {
    const queryPayload = { days: null, id: null, ponum: null };

    const mockInvoicesData = {
      data: {
        messages: [{ type: "error", message: "Some error occurred" }],
      },
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockInvoicesData),
    });

    const result = await getInvoices(queryPayload);

    expect(result).toEqual({ data: [], errors: "" });
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

    const result = await getInvoices(queryPayload);

    expect(consoleErrorSpy).toHaveBeenCalledWith("API call failed:", mockError);
    expect(result).toEqual({
      success: false,
      data: [],
      errors: "An unknown error occurred",
    });

    consoleErrorSpy.mockRestore();
  });
});
