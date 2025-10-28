"use server";
import { revalidatePath } from "next/cache";
import { STOREFRONT_ROUTES } from "@/utils/constants";

export async function reFetchAccountSettings() {
  revalidatePath(STOREFRONT_ROUTES.ACCOUNT_SETTINGS);
}
