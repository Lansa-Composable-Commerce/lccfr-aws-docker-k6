"use client";

import Button from "@/components/globalUI/Button";
import { useRouter } from "@/i18n/routing";
import { useAppDispatch } from "@/lib/hooks";
import { setCartOpen } from "@/lib/features/cart/cartSlice";
import { useTranslations } from "next-intl";
import { sendGTMEvent } from "@next/third-parties/google";
import { GTM_EVENTS } from "@/utils/constants";
import { CartItem, CartItems } from "@/types/Cart";

type CartFooterPropType = {
  subTotal: string;
  orderTotal?: number;
  items: CartItem[];
};

export default function CartFooter({
  subTotal,
  orderTotal,
  items,
}: CartFooterPropType) {
  const tCart = useTranslations("Cart");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleViewCart = () => {
    router.push("/cart");
    dispatch(setCartOpen(false));
  };

  const handleCheckout = () => {
    sendGTMEvent({
      event: GTM_EVENTS.BEGIN_CHECKOUT,
      currency: "USD",
      value: orderTotal,
      items: items.map((item: CartItem) => ({
        item_name: item.productDesc,
        item_id: item.productCode,
        item_category: item?.categoryName || "",
        quantity: item.quantity,
        price: item.unitPrice,
      })),
    });

    router.push("/checkout");
    dispatch(setCartOpen(false));
  };

  return (
    <div className="flex flex-col gap-4 border-t-2">
      <hr />
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold">{tCart("Subtotal")}</p>
          <p className="text-lg font-semibold text-brand dark:text-gray-200">
            {subTotal}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button
          onClick={handleViewCart}
          size="sm"
          variant="secondary"
          className="w-full lg:py-4.5"
        >
          <span className="text-brand uppercase dark:text-neutral-200">
            {tCart("ViewCart")}
          </span>
        </Button>
        <Button
          onClick={handleCheckout}
          size="sm"
          className="w-full uppercase lg:py-4.5"
        >
          {tCart("Checkout")}
        </Button>
      </div>
    </div>
  );
}
