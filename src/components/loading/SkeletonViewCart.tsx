import { Fragment } from "react";
import SkeletonCartSummary from "@/components/loading/SkeletonCartSummary";
import SkeletonDiscountForm from "@/components/loading/SkeletonDiscountForm";
import SkeletonOrderSummary from "@/components/loading/SkeletonOrderSummary";

export default function SkeletonViewCart() {
  return (
    <Fragment>
      <div className="w-full lg:w-[70%] space-y-4">
        <SkeletonCartSummary />
        <SkeletonCartSummary />
        <SkeletonCartSummary />
      </div>
      <div className="flex flex-col gap-4 w-full lg:w-[30%]">
        <SkeletonDiscountForm />
        <SkeletonOrderSummary />
      </div>
    </Fragment>
  );
}
