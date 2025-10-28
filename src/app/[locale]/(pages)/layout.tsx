import { ReactNode } from "react";
import { getStorefront } from "@/api/getStorefront";
import { getCookieValue } from "@/utils/cookies";
import { COOKIE_ACCESS_TOKEN } from "@/lib/auth/session";
import SubNavBar from "@/components/SubNavBar";
import { redirect } from "next/navigation";

export default async function PagesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const accessCookieValue = getCookieValue(COOKIE_ACCESS_TOKEN.name);
  const storefront = await getStorefront();

  if (storefront?.status === 400) redirect("/forbidden");

  return (
    <>
      <SubNavBar cookieValue={accessCookieValue} storefront={storefront} />
      {children}
    </>
  );
}
