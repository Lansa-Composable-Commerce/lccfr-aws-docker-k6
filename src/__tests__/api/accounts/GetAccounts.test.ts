import { getDecryptedCookie } from "@/lib/auth/session";
import { getAccounts } from "@/api/accounts";
import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { AxiosError } from "axios";
import { API } from "@/utils/constants";

jest.mock("@/lib/helpers/axiosInstance");
jest.mock("@/lib/auth/session", () => ({
  getDecryptedCookie: jest.fn(),
  COOKIE_ACCESS_TOKEN: { name: "access_token" },
}));

describe("Get Accounts API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;
  const mockGetDecryptedCookie = getDecryptedCookie as jest.Mock;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
    mockGetDecryptedCookie.mockReset();
  });

  test("it should return undefined if the access token doesn't exist.", async () => {
    mockGetDecryptedCookie.mockReturnValue(undefined);

    const result = await getAccounts();

    expect(result).toBeUndefined();
    expect(getDecryptedCookie).toHaveBeenCalledWith(
      "access_token",
      process.env.SECRET_KEY_ACCESS_TOKEN,
    );
    expect(axiosInstance).not.toHaveBeenCalled();
  });

  test("it should return list of accounts.", async () => {
    const mockConfig = {
      headers: { Authorization: "Bearer access_token" },
    };
    const mockAccounts = [
      {
        LW3JDEC01: "00-1730158",
        LW3CUSNAM: "Junie Casine",
        LW3ADDRS1: "44 Meadow Ridge Road",
        LW3ADDRS2: "043 Kedzie Parkway",
        LW3CTY1: "Dallas",
        LW3ADDS: "TX",
        LW3ADDZ: "75353",
        LW3SCNTRY: "US",
      },
      {
        LW3JDEC01: "001",
        LW3CUSNAM: "Arnold Palmer",
        LW3ADDRS1: "6001 Shellmound Street",
        LW3ADDRS2: "Suite 600",
        LW3CTY1: "Emeryville",
        LW3ADDS: "CA",
        LW3ADDZ: "94608",
        LW3SCNTRY: "USA",
      },
    ];

    mockGetDecryptedCookie.mockReturnValue("access_token");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockAccounts }),
    });

    const result = await getAccounts();

    expect(result).toEqual(mockAccounts);
    expect(mockAxiosInstance().get).toHaveBeenCalledWith(
      API.ACCOUNTS,
      mockConfig,
    );
  });

  test("it should handle axios errors and log to console", async () => {
    const mockError = new AxiosError("Axios Error");
    mockGetDecryptedCookie.mockReturnValue("access_token");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });

    console.error = jest.fn();
    await getAccounts();

    expect(console.error).toHaveBeenCalledWith(
      "Failed on getting accounts:",
      mockError.response,
    );
  });

  test("it should handle non axios errors and log to console", async () => {
    const mockError = new Error("Unexpected Error");
    mockGetDecryptedCookie.mockReturnValue("access_token");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });

    console.error = jest.fn();
    await getAccounts();

    expect(console.error).toHaveBeenCalledWith(
      "An error occurred on getting accounts:",
      mockError,
    );
  });
});
