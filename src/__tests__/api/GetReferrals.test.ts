import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { getReferrals } from "@/api/getReferrals";
import { API } from "@/utils/constants";
import { AxiosError } from "axios";

jest.mock("@/lib/helpers/axiosInstance");

describe("Get Referral API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  beforeEach(() => {
    mockAxiosInstance.mockReset();
  });

  test("it should return the referral lists.", async () => {
    const mockReferrals = [
      {
        LW3CODE: "CUS",
        LW3CDES: "Customer Service",
      },
      {
        LW3CODE: "EMA",
        LW3CDES: "Email",
      },
    ];

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: { Referrals: mockReferrals } }),
    });

    const result = await getReferrals();

    expect(result).toEqual(mockReferrals);
    expect(mockAxiosInstance().get).toHaveBeenCalledWith(API.REFERRALS);
  });

  test("it should handle axios errors and log to console", async () => {
    const mockError = new AxiosError("Axios Error");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });

    console.error = jest.fn();
    await getReferrals();

    expect(console.error).toHaveBeenCalledWith(
      "Failed on getting referrals:",
      mockError.response,
    );
  });

  test("it should handle non axios errors and log to console", async () => {
    const mockError = new Error("Unexpected Error");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });

    console.error = jest.fn();
    await getReferrals();

    expect(console.error).toHaveBeenCalledWith(
      "An error occurred on getting referrals:",
      mockError,
    );
  });
});
