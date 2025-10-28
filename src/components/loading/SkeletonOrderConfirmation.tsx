"use client";

import { Fragment } from "react";
import SkeletonOrderDetails from "@/components/loading/SkeletonOrderDetails";
import SkeletonOrderSummary from "@/components/loading/SkeletonOrderSummary";

export default function SkeletonOrderConfirmation() {
  return (
    <Fragment>
      <h1 className="text-xl font-semibold my-8 md:text-4xl">
        <span className="block h-6 bg-gray-200 rounded-md md:h-10 w-2/4 animate-pulse"></span>
      </h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col w-full gap-8 lg:w-[60%]">
          <div className="flex flex-col gap-4 md:flex-row">
            <Fragment>
              <SkeletonOrderDetails />
            </Fragment>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4 lg:w-[40%]">
          <SkeletonOrderSummary />
        </div>
      </div>
    </Fragment>
  );
}
