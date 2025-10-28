import { Suspense } from "react";
import Checkout from "@/components/checkout/Checkout";
import CheckoutAddressModal from "@/components/checkout/CheckoutAddressModal";
import { useTranslations } from "next-intl";

export default function CheckoutPage() {
  const tCheckout = useTranslations("Checkout");

  return (
    <section className="page">
      <h1 className="text-xl font-semibold my-8 md:text-4xl">
        {tCheckout("Checkout")}
      </h1>
      <Suspense fallback={<>Loading...</>}>
        <Checkout />
      </Suspense>
      <CheckoutAddressModal />
    </section>
  );
}
