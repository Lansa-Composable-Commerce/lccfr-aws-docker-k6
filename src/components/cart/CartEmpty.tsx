import { Link } from "@/i18n/routing";
import EmptyPlaceholder from "@/components/EmptyPlaceholder";
import React from "react";
import { useTranslations } from "next-intl";

type CartEmptyPropType = {
  imageStyle?: string;
  hasLink?: boolean;
};

export default function CartEmpty({ imageStyle, hasLink }: CartEmptyPropType) {
  const tGlobal = useTranslations("Global");
  const tCart = useTranslations("Cart");

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <EmptyPlaceholder imageStyle={imageStyle}>
        <div className="h-full flex flex-col justify-center items-center my-3 gap-2">
          <p className="text-lg lg:text-xl font-semibold dark:text-gray-300">
            {tCart("EmptyCartTitle")}
          </p>
          <p className="text-sm px-14 text-center">
            {tCart("EmptyCartDescription")}
          </p>
          {hasLink && (
            <Link
              href={"/"}
              className="underline underline-offset-2 my-4 hover:text-primary-700 dark:text-gray-200 dark:hover:text-gray-300"
            >
              {tGlobal("ContinueShopping")}
            </Link>
          )}
        </div>
      </EmptyPlaceholder>
    </div>
  );
}
