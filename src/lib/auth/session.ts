import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/utils/crypto";
import { decodeToken, verifyToken } from "@/lib/auth/verifyToken";
import { getCookieValue } from "@/utils/cookies";

export const COOKIE_ACCESS_TOKEN = {
  name: "ce_ac_token",
  options: {
    httpOnly: true,
    secure: false,
    sameSite: false,
    path: "/",
  },
  duration: 15 * 60 * 1000,
};

export const COOKIE_REFRESH_TOKEN = {
  name: "ce_rf_token",
  options: {
    httpOnly: true,
    secure: false,
    sameSite: false,
    path: "/",
  },
  duration: 7 * 24 * 60 * 60 * 1000,
};

export async function createCookieSession(
  accessToken: string,
  refreshToken: string,
) {
  const encryptAccess = encrypt(
    accessToken,
    process.env.SECRET_KEY_ACCESS_TOKEN,
  );
  const encryptRefresh = encrypt(
    refreshToken,
    process.env.SECRET_KEY_REFRESH_TOKEN,
  );

  if (!encryptRefresh || !encryptAccess) {
    throw new Error("Error on creating sessions.");
  }

  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);

  const atcExpires = new Date(
    decodedAccessToken
      ? decodedAccessToken?.exp * 1000
      : Date.now() + COOKIE_ACCESS_TOKEN.duration,
  );
  const rtcExpires = new Date(
    decodedRefreshToken
      ? decodedRefreshToken.exp * 1000
      : Date.now() + COOKIE_REFRESH_TOKEN.duration,
  );

  cookies().set(COOKIE_ACCESS_TOKEN.name, encryptAccess, {
    ...COOKIE_ACCESS_TOKEN.options,
    expires: atcExpires,
  });
  cookies().set(COOKIE_REFRESH_TOKEN.name, encryptRefresh, {
    ...COOKIE_REFRESH_TOKEN.options,
    expires: rtcExpires,
  });
}

export async function verifyTokenFromCookie(
  cookieName: string,
  secretKey: string | undefined,
  signatureKey: string | undefined,
) {
  const cookie = getCookieValue(cookieName);

  if (!cookie) {
    return { isValid: false };
  }

  const token = decrypt(cookie, secretKey);

  if (token) {
    const key = new TextEncoder().encode(signatureKey);

    return await verifyToken(token, key);
  }

  return { isValid: false };
}

export const getDecryptedCookie = (
  cookieName: string,
  secretKey: string | undefined,
) => {
  const cookieValue = getCookieValue(cookieName);

  if (!cookieValue) return;

  return decrypt(cookieValue, secretKey);
};
