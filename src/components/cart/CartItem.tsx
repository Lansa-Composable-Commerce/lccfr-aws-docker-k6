"use client";

import Image from "next/image";
import { SvgBin } from "@/assets/svg";
import SvgNoImage from "@/assets/svg/No-Image-Placeholder.svg";
import { Link } from "@/i18n/routing";
import QuantitySelector from "@/components/QuantitySelector";
import React, { useState } from "react";

type CartItemPropType = {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  basePrice: number;
  totalPrice: string;
};

export default function CartItem({
  id,
  name,
  image,
  quantity,
  basePrice,
  totalPrice,
}: CartItemPropType) {
  return (
    <div className="flex gap-2 my-4">
      <div>
        {image ? (
          <Image src={image} width={100} height={100} alt="item_image" />
        ) : (
          <Image src={SvgNoImage} width={100} height={100} alt="item_image" />
        )}
      </div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col justify-between">
          <div>
            <Link
              href={`/products/${id}`}
              className="text-sm font-medium hover:underline dark:text-white md:text-lg"
            >
              {name}
            </Link>
            <p className="text-xs"></p>
            <p className="text-xs"></p>
          </div>
          <p className="text-xs font-semibold md:text-sm">
            ${basePrice.toFixed(2)} x {quantity}
          </p>
        </div>
        <div className="flex flex-col justify-between">
          <SvgBin className="size-5 cursor-pointer self-end hover:text-red-700" />
          <p className="text-xs text-brand font-semibold md:text-sm">
            {totalPrice}
          </p>
        </div>
      </div>
    </div>
  );
}
