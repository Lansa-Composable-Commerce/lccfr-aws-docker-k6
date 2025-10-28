"use server";

import { revalidatePath } from "next/cache";

import { STOREFRONT_ROUTES } from "@/utils/constants";

export async function reFetchSavedOrder() {
  revalidatePath(STOREFRONT_ROUTES.ORDER_TEMPLATE);
}
