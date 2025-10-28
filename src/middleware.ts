import { type NextRequest, NextResponse } from "next/server";
import {
  APP_URL,
  AUTH_ROUTES,
  COOKIE_PREFIX,
  PRIVATE_ROUTES,
} from "@/utils/constants";
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  verifyTokenFromCookie,
} from "@/lib/auth/session";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { parseLocaleAndPath } from "@/utils";

const nextIntlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const intlResponse = nextIntlMiddleware(req);

  if (intlResponse && intlResponse.status !== 200) {
    return intlResponse;
  }

  const currentPath = parseLocaleAndPath(req.nextUrl.pathname);

  const isPrivateRoute = PRIVATE_ROUTES.includes(currentPath.path);
  const isAuthRoute = AUTH_ROUTES.includes(currentPath.path);

  const accessToken = await verifyTokenFromCookie(
    COOKIE_ACCESS_TOKEN.name,
    process.env.SECRET_KEY_ACCESS_TOKEN,
    process.env.JWT_ACCESS_TOKEN_KEY,
  );

  if (accessToken.isValid) {
    const accountNumber = req.cookies.get(`${COOKIE_PREFIX}accNum`)?.value;

    const isPrivateRouteExcludingAccounts = PRIVATE_ROUTES.filter(
      (route) => route !== "/accounts",
    ).includes(currentPath.path);

    if (!accountNumber && isPrivateRouteExcludingAccounts) {
      return NextResponse.redirect(
        new URL(`${currentPath.locale}/accounts`, APP_URL),
      );
    }
  }

  if (isAuthRoute && accessToken.isValid) {
    return NextResponse.redirect(
      new URL(`${currentPath.locale}/accounts`, APP_URL),
    );
  }

  if (!accessToken.isValid) {
    const refreshToken = await verifyTokenFromCookie(
      COOKIE_REFRESH_TOKEN.name,
      process.env.SECRET_KEY_REFRESH_TOKEN,
      process.env.JWT_REFRESH_TOKEN_KEY,
    );
    const redirectTo = encodeURIComponent(
      `${currentPath.path}` + `${req.nextUrl?.search}`,
    );

    if (refreshToken.isValid) {
      return NextResponse.redirect(
        new URL(`/api/refresh-token?redirectTo=${redirectTo}`, APP_URL),
      );
    }

    if (!refreshToken.isValid && isPrivateRoute) {
      const loginPath =
        currentPath.path === "/" || currentPath.path === "/accounts"
          ? `${currentPath.locale}/login`
          : `${currentPath.locale}/login?callbackUrl=${redirectTo}`;
      return NextResponse.redirect(new URL(loginPath, APP_URL));
    }
  }

  const response = NextResponse.next(intlResponse);
  response.headers.set("x-current-path", currentPath.path);

  return response;
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico).*)",
    "/",
    "/(de|en|es|fr)/:path*",
  ],
};
