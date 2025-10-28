"use client";

import { SvgCart } from "@/assets/svg";
import CartPreview from "@/components/cart/CartPreview";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectCartState,
  selectCartTotalItems,
  setCartOpen,
} from "@/lib/features/cart/cartSlice";
import CartEmpty from "@/components/cart/CartEmpty";
import { SfBadge } from "@storefront-ui/react";
import { useGetCartQuery } from "@/services/cartApi";
import CartSummary from "@/components/cart/CartSummary";
import { usePathname } from "@/i18n/routing";
import useRemoveCartItem from "@/lib/hooks/useRemoveCartItem";
import usePromoCodeHandler from "@/lib/hooks/usePromoCodeHandler";
import { useEffect } from "react";

function Cart() {
  const { refetch: refetchCart, isSuccess } = useGetCartQuery(undefined);

  const { isCartOpen, items, message } = useAppSelector(selectCartState);
  const cartTotalItems = useAppSelector(selectCartTotalItems);
  const dispatch = useAppDispatch();
  usePromoCodeHandler(isSuccess, message);

  const toggleCart = () => dispatch(setCartOpen(!isCartOpen));

  const { handleRemoveItem, loadingItem } = useRemoveCartItem(refetchCart);

  useEffect(() => {
    refetchCart();
  }, []);

  return (
    <>
      <div
        onClick={toggleCart}
        className="relative svg-icons flex-none  h-full m-1 mr-2 sm:mr-3.5 lg:mr-2"
      >
        <SvgCart className={"svg-icons"} />
        {cartTotalItems > 0 && (
          <SfBadge
            content={cartTotalItems}
            className={`bg-red-600 top-[-10px] right-[-5px] text-xs rounded-full ${
              cartTotalItems === 1 ? "px-2" : "px-1.5"
            }`}
          />
        )}
      </div>
      <CartPreview>
        {items && items.length > 0 ? (
          items.map((item) => (
            <CartSummary
              key={item.productCode}
              cartItem={item}
              remove={handleRemoveItem}
              isLoading={loadingItem === item.lineNumber}
              mode="preview"
            />
          ))
        ) : (
          <CartEmpty imageStyle="md:w-[16em]" />
        )}
      </CartPreview>
    </>
  );
}

export default function CartButton() {
  const pathname = usePathname();

  const isInCheckoutProcess =
    pathname !== "/cart" &&
    pathname !== "/checkout" &&
    pathname !== "/order-confirmation";

  return isInCheckoutProcess && <Cart />;
}
