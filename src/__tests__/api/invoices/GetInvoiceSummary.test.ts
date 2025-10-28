import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";
import { getInvoiceSummary } from "@/api/invoices/getInvoiceSummary";

jest.mock("@/lib/helpers/axiosInstance");
jest.mock("@/lib/auth/verifyToken", () => ({ decodeToken: jest.fn() }));
jest.mock("@/lib/auth/session", () => ({
  getDecryptedCookie: jest.fn(),
  COOKIE_ACCESS_TOKEN: { name: "access_token" },
}));

describe("Get Invoice Summary API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  const API_URL = API.INVOICE_SUMMARY;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("it should return data when API call is successful", async () => {
    const mockInvoiceSummaryData = {
      customer: {
        LW3CUSNAM: "Tiger Woods",
        LW3ADDRS1: "9050 Bonita Beach Rd. SE",
        LW3ADDRS2: "",
        LW3CTY1: "Bonita Springs",
        LW3ADDS: "FL",
        LW3ADDZ: "34135",
        LW3HCNTRY: "USA",
      },
      summary: {
        WKCMAAMT: 30548.07,
        WKCBAAMT: 0,
        WKCURCDE: "USD",
        FXOPNAMT: 30548.07,
      },
    };
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockInvoiceSummaryData }),
    });

    const result = await getInvoiceSummary();

    expect(mockAxiosInstance().get).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual(mockInvoiceSummaryData);
  });

  test("it should catch and log errors when the API call fails", async () => {
    const mockError = new Error("Network Error");
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const mockGet = jest.fn().mockRejectedValue(mockError);
    mockAxiosInstance.mockReturnValue({ get: mockGet });

    const result = await getInvoiceSummary();

    expect(mockGet).toHaveBeenCalledWith(API_URL);
    expect(consoleErrorSpy).toHaveBeenCalledWith("API call failed:", mockError);
    expect(result).toEqual({ message: "Something went wrong" });

    consoleErrorSpy.mockRestore();
  });
});
