"use client";

import Drawer from "@/components/globalUI/Drawer";
import CartFooter from "@/components/cart/CartFooter";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectCartState, setCartOpen } from "@/lib/features/cart/cartSlice";
import { SvgXMark } from "@/assets/svg";
import { ReactNode } from "react";
import CartHeader from "@/components/cart/CartHeader";

export default function CartPreview({ children }: { children: ReactNode }) {
  const { isCartOpen, items, cartSubTotalPrice, orderTotal } =
    useAppSelector(selectCartState);
  const dispatch = useAppDispatch();

  const handleCloseCart = () => dispatch(setCartOpen(false));

  return (
    <Drawer
      open={isCartOpen}
      setOpen={handleCloseCart}
      placement="right"
      className="flex flex-col gap-3 w-full h-full p-4 bg-white border border-1 shadow-xl dark:bg-light-dark"
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between mb-2">
          <CartHeader className="text-xl dark:text-gray-200 font-bold" />
          <div onClick={handleCloseCart} className="cursor-pointer">
            <SvgXMark className="svg-icons" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
        {items && items.length > 0 && (
          <CartFooter
            subTotal={cartSubTotalPrice}
            orderTotal={orderTotal}
            items={items}
          />
        )}
      </div>
    </Drawer>
  );
}
