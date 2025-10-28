import { useTranslations } from "next-intl";
import { cookies } from "next/headers";
import NotFoundButton from "@/components/NotFoundButton";
import ErrorPage from "@/components/ErrorPage";

export default function NotFound() {
  const tNotFound = useTranslations("NotFound");

  const accessToken = cookies().get("ce_ac_token")?.value;
  const isAuthorized = !!accessToken;

  return (
    <main className="page">
      <ErrorPage
        imageSrc="https://res.cloudinary.com/dahqgdx87/image/upload/v1746581090/404_1.png"
        imageAlt="404 Not Found"
        title={tNotFound("NFTitle")}
        description={tNotFound("NFDescription")}
      >
        <NotFoundButton isAuthorized={isAuthorized} />
      </ErrorPage>
    </main>
  );
}
