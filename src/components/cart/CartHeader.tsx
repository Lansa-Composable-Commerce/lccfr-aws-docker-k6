"use client";

import { useTranslations } from "next-intl";
import { useAppSelector } from "@/lib/hooks";
import {
  selectCartTotalItems,
  selectCartTotalQuantity,
} from "@/lib/features/cart/cartSlice";
import classNames from "classnames";

type CartHeaderPropType = {
  className?: string;
  totalItems?: number;
  totalQuantity?: number;
};

export default function CartHeader({
  totalItems,
  totalQuantity,
  className,
}: CartHeaderPropType) {
  const tCart = useTranslations("Checkout");

  const cartTotalItems = useAppSelector(selectCartTotalItems);
  const cartTotalQuantity = useAppSelector(selectCartTotalQuantity);

  return (
    <div className={classNames("font-semibold", `${className}`)}>
      {tCart("YourCart")} (
      {tCart("CountLineAndItem", {
        lineCount: totalItems ?? cartTotalItems,
        itemCount: totalQuantity ?? cartTotalQuantity,
      })}
      )
    </div>
  );
}
