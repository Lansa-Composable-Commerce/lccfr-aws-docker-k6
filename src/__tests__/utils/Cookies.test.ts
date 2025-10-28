import { cookies } from "next/headers";
import { getCookieValue } from "@/utils/cookies";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("Get Cookie Value", () => {
  const mockCookies = cookies as jest.Mock;

  beforeEach(() => {
    mockCookies.mockClear();
  });

  test("it should return undefined if the cookie name is null", () => {
    mockCookies.mockReturnValue({
      has: jest.fn().mockReturnValue(false),
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = getCookieValue(null);

    expect(result).toBeUndefined();
    expect(cookies().has).not.toHaveBeenCalled();
    expect(cookies().get).not.toHaveBeenCalled();
  });

  test("it should return undefined if the cookie does not exist", () => {
    const mockCookieName = "nonExistentCookie";
    mockCookies.mockReturnValue({
      has: jest.fn().mockReturnValue(false),
      get: jest.fn().mockReturnValue(undefined),
    });

    const result = getCookieValue(mockCookieName);

    expect(result).toBeUndefined();
    expect(cookies().has).toHaveBeenCalledWith(mockCookieName);
    expect(cookies().get).not.toHaveBeenCalled();
  });

  test("it should return the cookie value if the cookie exists", () => {
    const mockCookieName = "testCookie";
    const mockCookieValue = { value: "cookieValue" };
    mockCookies.mockReturnValue({
      has: jest.fn().mockReturnValue(true),
      get: jest.fn().mockReturnValue(mockCookieValue),
    });

    const result = getCookieValue(mockCookieName);

    expect(result).toEqual("cookieValue");
    expect(cookies().has).toHaveBeenCalledWith(mockCookieName);
    expect(cookies().get).toHaveBeenCalledWith(mockCookieName);
  });
});
