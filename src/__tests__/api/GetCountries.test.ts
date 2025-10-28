import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { getCountries } from "@/api/getCountries";
import { AxiosError } from "axios";
import { API } from "@/utils/constants";

jest.mock("@/lib/helpers/axiosInstance");

describe("Get Countries API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("it should return all countries", async () => {
    const mockCountries = [
      {
        LW3CTRY: "CAN",
        LW3CTRYD: "CANADA",
      },
      {
        LW3CTRY: "FRE",
        LW3CTRYD: "FRANCE",
      },
      {
        LW3CTRY: "MEX",
        LW3CTRYD: "MEXICO",
      },
      {
        LW3CTRY: "USA",
        LW3CTRYD: "UNITED STATES OF AMERICA",
      },
    ];

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: { Countries: mockCountries } }),
    });

    const result = await getCountries();

    expect(result).toEqual(mockCountries);
    expect(mockAxiosInstance().get).toHaveBeenCalledWith(API.COUNTRIES);
  });

  test("it should handle axios errors and log to console", async () => {
    const mockError = new AxiosError("Axios Error");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });

    console.error = jest.fn();
    await getCountries();

    expect(console.error).toHaveBeenCalledWith(
      "Failed on getting countries:",
      mockError.response,
    );
  });

  test("it should handle non axios errors and log to console", async () => {
    const mockError = new Error("Unexpected Error");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });

    console.error = jest.fn();
    await getCountries();

    expect(console.error).toHaveBeenCalledWith(
      "An error occurred on getting countries:",
      mockError,
    );
  });
});
