import { getInvoiceInit } from "@/api/invoices/getInvoiceInit";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

jest.mock("@/lib/helpers/axiosInstance");
jest.mock("@/lib/auth/verifyToken", () => ({ decodeToken: jest.fn() }));
jest.mock("@/lib/auth/session", () => ({
  getDecryptedCookie: jest.fn(),
  COOKIE_ACCESS_TOKEN: { name: "access_token" },
}));

describe("Get Invoice Init API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  const API_URL = API.INVOICES_INIT;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("should return success with data when API call is successful", async () => {
    const mockInvoiceInitData = [
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
      get: jest.fn().mockResolvedValue({ data: mockInvoiceInitData }),
    });

    const result = await getInvoiceInit();

    expect(mockAxiosInstance().get).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual(mockInvoiceInitData);
  });

  test("should catch and log errors when the API call fails", async () => {
    const mockError = new Error("Network Error");
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const mockGet = jest.fn().mockRejectedValue(mockError);
    mockAxiosInstance.mockReturnValue({ get: mockGet });

    const result = await getInvoiceInit();

    expect(mockGet).toHaveBeenCalledWith(API_URL);
    expect(consoleErrorSpy).toHaveBeenCalledWith("API call failed:", mockError);
    expect(result).toEqual({ message: "Something went wrong" });

    consoleErrorSpy.mockRestore();
  });
});
