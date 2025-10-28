"use client";

import { ReactNode } from "react";

import usePreferences from "@/lib/hooks/usePreferences";
import useGTMUserActivity from "@/lib/hooks/useGTMUserActivity";
import useGetClarityId from "@/lib/hooks/useGetClarityId";

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({
  children,
}: ClientLayoutWrapperProps) {
  useGTMUserActivity();
  usePreferences();
  useGetClarityId();

  return <>{children}</>;
}
