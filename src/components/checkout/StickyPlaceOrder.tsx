"use client";

import { RefObject, useEffect, useState } from "react";
import Spinner from "@/components/loading/Spinner";
import Button from "@/components/globalUI/Button";
import { useTranslations } from "next-intl";
import classNames from "classnames";

type StickyPlaceOrderPropType = {
  isLoading: boolean;
  isFetching: boolean;
  placeOrderRef: RefObject<HTMLButtonElement>;
  placeOrder(): void;
};

export default function StickyPlaceOrder({
  isLoading,
  isFetching,
  placeOrderRef,
  placeOrder,
}: StickyPlaceOrderPropType) {
  const tCart = useTranslations("Cart");
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    if (isFetching) return;

    const button = placeOrderRef.current;

    if (!button) {
      console.error("StickyPlaceOrder: placeOrderRef is null");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      { threshold: 1.0 },
    );

    observer.observe(button);

    return () => observer.disconnect();
  }, [isFetching, placeOrderRef]);

  return (
    isStickyVisible && (
      <div
        className={classNames(
          "sticky p-4 bottom-0",
          "bg-gray02 dark:bg-light-dark shadow-2xl border-t",
        )}
      >
        <div className="container mx-auto px-4 flex justify-end items-center">
          <Button
            ref={placeOrderRef}
            className="w-full lg:py-3 lg:mx-4 lg:w-[27%]"
            disabled={isLoading}
            onClick={placeOrder}
          >
            {!isLoading ? (
              tCart("PlaceOrder")
            ) : (
              <Spinner className="fill-primary-700" />
            )}
          </Button>
        </div>
      </div>
    )
  );
}
