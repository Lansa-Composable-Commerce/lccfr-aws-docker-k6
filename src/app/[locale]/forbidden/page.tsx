import ErrorPage from "@/components/ErrorPage";
import { useTranslations } from "next-intl";
import { getCookieValue } from "@/utils/cookies";
import { COOKIE_ACCESS_TOKEN } from "@/lib/auth/session";
import ForbiddenButton from "@/components/ForbiddenButton";

export default function ForbiddenPage() {
  const tForbidden = useTranslations("NotFound");

  const hasAccessToken = getCookieValue(COOKIE_ACCESS_TOKEN.name);

  return (
    <main className="page">
      <ErrorPage
        title={tForbidden("ForbiddenTitle")}
        description={tForbidden(
          hasAccessToken ? "NoAccessDescription" : "ForbiddenDescription",
        )}
      >
        {hasAccessToken && <ForbiddenButton />}
      </ErrorPage>
    </main>
  );
}
