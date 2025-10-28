import OrderConfirmation from "@/components/orderConfirmation/OrderConfirmation";
import { getOrderConfirmation } from "@/api/orderConfirmation";
import { Suspense } from "react";
import GlobalError from "@/components/GlobalError";
import SkeletonOrderConfirmation from "@/components/loading/SkeletonOrderConfirmation";
import { getTranslations } from "next-intl/server";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { cartId } = await searchParams;

  const orderDetails = await getOrderConfirmation(cartId);

  const tOrderConfirmation = await getTranslations("OrdConfirm");

  return (
    <main className="page">
      {!cartId && (
        <GlobalError title={tOrderConfirmation("OrderNotFoundTitle")}>
          <p className="md:max-w-[60%] md:text-center">
            {tOrderConfirmation("OrderNotFountDescription")}
          </p>
        </GlobalError>
      )}
      <Suspense fallback={<SkeletonOrderConfirmation />}>
        {orderDetails && orderDetails.status === 401 && (
          <GlobalError title={tOrderConfirmation("OrderUnauthorizedTitle")}>
            <p className="md:max-w-[60%] md:text-center">
              {tOrderConfirmation("OrderUnauthorizedDescription")}
            </p>
          </GlobalError>
        )}
        {orderDetails && orderDetails.status === 200 && (
          <div className="space-y-8 mt-8">
            <span className="text-xl font-semibold  md:text-4xl">
              {tOrderConfirmation("OrderConfirmation")}
            </span>
            <OrderConfirmation orderDetails={orderDetails.data} />
          </div>
        )}
      </Suspense>
    </main>
  );
}
