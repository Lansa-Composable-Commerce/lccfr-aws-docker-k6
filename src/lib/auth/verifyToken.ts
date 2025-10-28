import { decodeJwt, jwtVerify } from "jose";
import { DecodedToken } from "@/types/TokenPayload";

export const verifyToken = async (token: string, secret: Uint8Array) => {
  if (!token) {
    return { isValid: false };
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    return { isValid: true, payload };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { isValid: false };
  }
};

export const decodeToken = (token: string | null): DecodedToken | null => {
  if (!token) return null;

  return decodeJwt(token);
};
