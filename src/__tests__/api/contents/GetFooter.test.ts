import { axiosInstance } from "@/lib/helpers/axiosInstance";
import getFooter from "@/api/contents/getFooter";
import { AxiosError } from "axios";

jest.mock("@/lib/auth/verifyToken", () => ({
  decodeToken: jest.fn(),
}));
jest.mock("@/lib/helpers/axiosInstance");

describe("GetFooter API", () => {
  const mockAxiosInstance = axiosInstance as jest.Mock;

  test("it should return footer content for the correct locale", async () => {
    const mockResponse = { LW3CNTSTR: "Footer content for EN" };

    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockResponse }),
    });

    const result = await getFooter();

    expect(result).toEqual(mockResponse);
    expect(mockAxiosInstance().get).toHaveBeenCalledWith(
      `/CNSCNTAST/content/layout/footer-en`,
    );
  });

  test("it should handle axios errors and log to console", async () => {
    const mockError = new AxiosError("Axios Error");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });

    console.error = jest.fn();

    await getFooter();

    expect(console.error).toHaveBeenCalledWith(
      "Content Axios Error:",
      mockError.response,
    );
  });

  test("it should handle non axios errors and log to console", async () => {
    const mockError = new Error("Unexpected Error");
    mockAxiosInstance.mockReturnValue({
      get: jest.fn().mockRejectedValue(mockError),
    });

    console.error = jest.fn();

    await getFooter();

    expect(console.error).toHaveBeenCalledWith("Content Error:", mockError);
  });
});
