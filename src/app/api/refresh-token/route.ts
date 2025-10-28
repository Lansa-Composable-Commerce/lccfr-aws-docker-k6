import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/verifyToken";
import { createCookieSession, getDecryptedCookie } from "@/lib/auth/session";
import { API, APP_URL } from "@/utils/constants";
import { deleteSession } from "@/lib/actions/deleleSession";
import { getCookieValue } from "@/utils/cookies";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const refreshLocks = new Map<string, Promise<Tokens>>();

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Refresh token timeout")),
      ms,
    );
    promise
      .then((res) => {
        clearTimeout(timeout);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timeout);
        reject(err);
      });
  });
}

async function refreshTokenRequest(refreshToken: string) {
  try {
    const response = await fetch(API.REFRESH_TOKEN, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "text/plain",
        Cookie: `ce_rf_token=${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw {
        status: response.status,
        statusText: response.statusText,
      };
    }

    const data = await response.json();

    await createCookieSession(data.LW3ACSTKN, data.LW3RFSTKN);

    console.info("Tokens refreshed successfully.");

    return {
      accessToken: data.LW3ACSTKN,
      refreshToken: data.LW3RFSTKN,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

async function refreshTokens(refreshToken: string): Promise<Tokens> {
  if (refreshLocks.has(refreshToken)) {
    return refreshLocks.get(refreshToken)!;
  }

  const promise = withTimeout(refreshTokenRequest(refreshToken), 5000)
    .then((tokens) => {
      refreshLocks.delete(refreshToken);
      return tokens;
    })
    .catch((err) => {
      refreshLocks.delete(refreshToken);
      throw err;
    });

  refreshLocks.set(refreshToken, promise);

  return await promise;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = getCookieValue("NEXT_LOCALE");
  const login = new URL(`/${locale}/login`, APP_URL);

  const key = new TextEncoder().encode(process.env.JWT_REFRESH_TOKEN_KEY);
  const secretKey = process.env.SECRET_KEY_REFRESH_TOKEN;

  const refreshToken = getDecryptedCookie("ce_rf_token", secretKey);

  if (!refreshToken) return NextResponse.redirect(login);

  const isRefreshTokenValid = await verifyToken(refreshToken, key);

  if (!isRefreshTokenValid) {
    deleteSession();
    return NextResponse.redirect(login);
  }

  console.info(
    "Refresh token is valid, proceed to refreshing of tokens by a middleware.",
  );

  try {
    await refreshTokens(refreshToken);
    return NextResponse.redirect(
      new URL(`/${locale}${searchParams.get("redirectTo")}`, APP_URL),
    );
  } catch (error: any) {
    if (error.status === 401) {
      deleteSession();
      return NextResponse.redirect(login);
    }

    return new NextResponse(
      "Something went wrong in the server. Please try again later.",
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const login = new URL(`/en/login`, APP_URL);

  const secretKey = process.env.SECRET_KEY_REFRESH_TOKEN;
  const refreshToken = getDecryptedCookie("ce_rf_token", secretKey);

  let body = null;
  try {
    body = await request.json();
  } catch (error) {
    console.warn("Empty Body!");
  }

  if (!body) {
    deleteSession();
    return NextResponse.redirect(login);
  }

  console.info(
    "Refresh token is valid, proceed to refreshing of tokens by interceptors.",
  );

  try {
    const tokens = await refreshTokens(refreshToken ?? body);
    return NextResponse.json(tokens, { status: 200 });
  } catch (error: any) {
    if (error.status === 401) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    return new NextResponse(
      "Something went wrong in the server. Please try again later.",
      { status: 500 },
    );
  }
}
