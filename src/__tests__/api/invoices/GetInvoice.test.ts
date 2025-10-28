import { getInvoice } from "@/api/invoices/getInvoice";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { API } from "@/utils/constants";

jest.mock("@/lib/helpers/axiosInstance");
jest.mock("@/lib/auth/verifyToken", () => ({ decodeToken: jest.fn() }));
jest.mock("@/lib/auth/session", () => ({
  getDecryptedCookie: jest.fn(),
  COOKIE_ACCESS_TOKEN: { name: "access_token" },
}));

describe("Get Invoice API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  const INVOICE_ID = 269;
  const API_URL = `${API.INVOICE}/${INVOICE_ID}`;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("should return success with data when API call is successful", async () => {
    const mockInvoiceData = {
      success: true,
      data: {
        items: [
          {
            LW3ORDNUM: "269",
            LW3COLNUM: 1,
            LW3ITEMCD: "1001",
            LW3IDESC: "One Iron - Infiniti 425 Titanium Insert Iron",
            D_LPRICE: "$.69",
            LW3UM: "EA",
            LW3ISIZE: "Size - M",
            LW3ICOLR: "Color - Navy",
          },
        ],
        shipTo: {
          LW3CSNAME: "Tiger Woods",
          LW3CSCPNY: "",
          LW3SADDR1: "9050 Bonita Beach Rd. SE",
          LW3SADDR2: "",
          LW3CSCITY: "Bonita Springs",
          LW3SSTATE: "FL",
          LW3SPSTAL: "34135",
          LW3STCSZ: "Bonita Springs FL  34135",
          LW3SCNTRY: "USA",
        },
        billTo: {
          LW3CHNAME: "Tiger Woods",
          LW3CHCPNY: "",
          LW3HADDR1: "9050 Bonita Beach Rd. SE",
          LW3HADDR2: "",
          LW3CHCITY: "Bonita Springs",
          LW3HSTATE: "FL",
          LW3HPSTAL: "34135",
          LW3BTCSZ: "Bonita Springs FL  34135",
          LW3HCNTRY: "USA",
        },
        invoice: {
          customer: "004",
          invoiceDate: "01/24/2024",
          InvoiceTotal: "$.00",
        },
      },
      messages: "",
    };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue(mockInvoiceData),
    });

    const result = await getInvoice(INVOICE_ID);

    expect(mockAxiosInstance().get).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual(mockInvoiceData);
  });

  test("should return errors when API call returns error messages", async () => {
    const mockErrorMessages = [
      { type: "error", message: "Invalid ID" },
      { type: "error", message: "Not found" },
    ];
    const mockResponse = { data: { messages: mockErrorMessages } };
    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    mockAxiosInstance.mockReturnValue({
      get: mockGet,
    });

    const result = await getInvoice(INVOICE_ID);

    expect(mockAxiosInstance().get).toHaveBeenCalledWith(API_URL);
    expect(result).toEqual({
      data: null,
      messages: "Invalid ID, Not found",
      success: false,
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

    const result = await getInvoice(INVOICE_ID);

    expect(mockAxiosInstance().get).toHaveBeenCalledWith(API_URL);
    expect(consoleLogSpy).toHaveBeenCalledWith("error", "Network Error");
    expect(result).toEqual({
      data: null,
      messages: "Network Error",
      success: false,
    });

    consoleLogSpy.mockRestore();
  });
});
