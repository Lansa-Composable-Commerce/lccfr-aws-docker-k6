import { cookies } from "next/headers";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "@/lib/auth/session";
import { COOKIE_PREFIX } from "@/utils/constants";

export function deleteSession() {
  const cookieStore = cookies();

  cookieStore.delete(COOKIE_ACCESS_TOKEN.name);
  cookieStore.delete(COOKIE_REFRESH_TOKEN.name);
  cookieStore.delete(COOKIE_PREFIX + "accNum");
  cookieStore.delete(COOKIE_PREFIX + "customerName");
}
