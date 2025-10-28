"use server";

import { revalidatePath } from "next/cache";

import { STOREFRONT_ROUTES } from "@/utils/constants";

export async function reFetchUserPreferences() {
  revalidatePath(STOREFRONT_ROUTES.USER_PREFERENCE);
}
