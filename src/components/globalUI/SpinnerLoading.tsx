import React from "react";
import { SvgSpinner } from "@/assets/svg";

const SpinnerLoading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SvgSpinner className="size-1/6 mx-auto text-gray-200 dark:text-gray-600 fill-primary-500 animate-spin" />
    </div>
  );
};

export default SpinnerLoading;
