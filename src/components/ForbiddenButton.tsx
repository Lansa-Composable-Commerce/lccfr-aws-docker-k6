"use client";

import Button from "@/components/globalUI/Button";
import { useTranslations } from "next-intl";

export default function ForbiddenButton() {
  const tForbidden = useTranslations("NotFound");

  return (
    <Button variant="secondary" onClick={() => (window.location.href = "/")}>
      {tForbidden("BackToHome")}
    </Button>
  );
}
