import { cookies } from "next/headers";

export const getCookieValue = (cookieName: string | null) => {
  if (!cookieName) return;

  const hasCookie = cookies().has(cookieName);

  if (!hasCookie) return;

  return cookies().get(cookieName)?.value;
};
