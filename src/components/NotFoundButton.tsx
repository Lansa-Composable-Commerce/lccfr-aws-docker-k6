"use client";

import Button from "@/components/globalUI/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function NotFoundButton({
  isAuthorized,
}: {
  isAuthorized: boolean;
}) {
  const router = useRouter();

  const tNotFound = useTranslations("NotFound");

  const handleRedirect = () => router.push(isAuthorized ? "/" : "/login");

  return (
    <Button variant="secondary" onClick={handleRedirect}>
      {isAuthorized ? tNotFound("BackToHome") : tNotFound("BackToLogin")}
    </Button>
  );
}
