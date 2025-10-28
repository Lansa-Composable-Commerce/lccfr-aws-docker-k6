"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { SvgCaution } from "@/assets/svg";

interface ErrorPagePropType {
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function ErrorPage({
  imageSrc,
  imageAlt,
  title,
  description,
  children,
}: ErrorPagePropType) {
  return (
    <div className="w-full h-[50em] flex flex-col justify-center items-center gap-8 p-4">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt || "No Image"}
          height={300}
          width={300}
          priority={true}
          className="w-auto h-auto"
        />
      ) : (
        <SvgCaution className="size-56 text-red-700" />
      )}

      <div className="space-y-4 text-center">
        <p className="text-md font-medium md:text-2xl">{title}</p>
        {description && (
          <p className="text-xs max-w-[40rem] md:text-base">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
