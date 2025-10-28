import { axiosInstance } from "@/lib/helpers/axiosInstance";
import axios from "axios";

jest.mock("axios");
jest.mock("@/lib/auth/verifyToken", () => ({
  decodeToken: jest.fn(),
}));

describe("Axios Create Instance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue({
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    });
  });

  test("it should create an axios instance with the correct baseURL and default headers", () => {
    process.env.NEXT_PUBLIC_CENEXT_URL = "http://localhost:8081/cen";

    axiosInstance();

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "http://localhost:8081/cen",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        host: "localhost",
        referer: "",
        "Accept-Language": "en",
      },
    });
  });

  test("it should use the fallback baseURL if the env is not defined", () => {
    delete process.env.NEXT_PUBLIC_CENEXT_URL;

    axiosInstance();

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "http://solutions.lansa.com:8571/cen",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        host: "localhost",
        referer: "",
        "Accept-Language": "en",
      },
    });
  });
});
