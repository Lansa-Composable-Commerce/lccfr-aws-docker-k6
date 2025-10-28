"use client";

import React from "react";

import { MainTitle } from "@/components/globalUI/Typography";
import Button from "@/components/globalUI/Button";

import { useRouter } from "@/i18n/routing";

import { SvgArrowLeft } from "@/assets/svg";

const PageTitle = ({
  content,
  withTitle = false,
  backText,
  withBackText,
}: {
  content?: string;
  withTitle?: boolean;
  backText?: string;
  withBackText?: boolean;
}) => {
  const router = useRouter();
  return (
    <div className="pt-3 lg:pt-6 mb-1 lg:mb-7">
      <div className="flex flex-row items-center justify-between w-full py-2 md:py-0">
        {withTitle && <MainTitle content={content || ""} />}
        <div>&nbsp;</div>
        {withBackText && (
          <Button
            variant="secondary"
            onClick={() => router.back()}
            className="bg-white px-4 py-2 border border-brand flex items-center justify-end gap-2 cursor-pointer dark:bg-transparent dark:hover:bg-brand/20 translate-05"
            aria-label="bacl"
            title="back"
          >
            <SvgArrowLeft className="text-brand size-6 dark:text-white" />
            <h1 className="hidden text-right text-sm md:text-base lg:block lg:text-lg font-medium text-brand/80 dark:text-white ">
              {backText}
            </h1>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
