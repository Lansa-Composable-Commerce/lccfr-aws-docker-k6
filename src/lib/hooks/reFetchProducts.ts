"use server";

import { revalidatePath } from "next/cache";

import { STOREFRONT_ROUTES } from "@/utils/constants";

export async function reFetchProducts() {
  revalidatePath(STOREFRONT_ROUTES.PRODUCTS);
}
