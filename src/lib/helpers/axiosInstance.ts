import axios from "axios";
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  createCookieSession,
  getDecryptedCookie,
} from "@/lib/auth/session";
import { cookies, headers } from "next/headers";

let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((promise: any) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

export function axiosInstance() {
  const BASE_URL =
    process.env.NEXT_PUBLIC_CENEXT_URL || "http://solutions.lansa.com:8571/cen";

  let referer: string | undefined;
  let host: string | undefined;
  let locale: string | undefined;

  if (typeof window === "undefined") {
    const headersList = headers();
    referer = headersList.get("referer") || "";
    host = headersList.get("host") || "";

    locale = cookies().get("NEXT_LOCALE")?.value;
  } else {
    referer = document.referrer || "";
    host = window.location.host || "";
    locale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
  }

  // Create the Axios instance with base configuration.
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Allow sending cookies with requests.
    headers: {
      "Content-Type": "application/json", // Set default content type.
      host: host,
      referer: referer, // Set the 'referer' header.
      "Accept-Language": locale ?? "en",
    },
  });

  // Request interceptor: Modifies requests before sending.
  instance.interceptors.request.use(
    (config) => {
      // Add Authorization header with access token for all requests except for '/login'.
      if (config.url !== "/login") {
        const accessToken = getDecryptedCookie(
          COOKIE_ACCESS_TOKEN.name,
          process.env.SECRET_KEY_ACCESS_TOKEN,
        );
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      return config;
    },
    (error: any) => {
      // Handle request errors.
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getDecryptedCookie(
          COOKIE_REFRESH_TOKEN.name,
          process.env.SECRET_KEY_REFRESH_TOKEN,
        );

        if (!refreshToken) return Promise.reject(error);

        try {
          const response = await instance.post(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/refresh-token`,
            refreshToken,
          );

          const newAccessToken = response.data.accessToken;

          axios.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);

          await createCookieSession(newAccessToken, response.data.refreshToken);

          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}
