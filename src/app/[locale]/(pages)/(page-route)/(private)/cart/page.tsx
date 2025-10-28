import ViewCartWrapper from "@/components/cart/ViewCartWrapper";
import { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Cart",
  description: "CE Next Cart page",
};

export default async function Cart() {
  const tCart = await getTranslations("Cart");

  return (
    <div className="page">
      <h1 className="text-xl font-semibold my-8 md:text-4xl">
        {tCart("ViewCart")}
      </h1>
      <Suspense fallback={<>Loading...</>}>
        <ViewCartWrapper />
      </Suspense>
    </div>
  );
}
