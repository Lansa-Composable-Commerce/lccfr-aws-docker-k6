"use client";

import { ReactElement } from "react";

const renderListItems = (): ReactElement[] => {
  return Array(5)
    .fill(0)
    .map((_: number, index) => (
      <li key={index} className="mb-3 bg-slate-700 w-60 h-5 rounded-lg"></li>
    ));
};

export default function SkeletonFooter() {
  return (
    <div className="bg-black01 text-white">
      <div className="container mx-auto px-4 py-[60px]">
        <div className="flex flex-col justify-center gap-5 lg:gap-10 w-full lg:flex-row text-sm lg:text-base animate-pulse">
          {/* Header Skeleton */}
          <div className="h-full w-full">
            <div className="bg-slate-700 w-60 h-16 rounded-2xl"></div>
          </div>

          {/* Column 1 */}
          <div className="w-full">
            <div className="mb-5 bg-slate-700 w-60 h-7 rounded-lg"></div>
            <ul className="flex flex-col gap-2">{renderListItems()}</ul>
          </div>

          {/* Column 2 */}
          <div className="w-full">
            <div className="mb-5 bg-slate-700 w-60 h-7 rounded-lg"></div>
            <ul className="flex flex-col gap-2">{renderListItems()}</ul>
          </div>

          {/* Column 3 */}
          <div className="w-full">
            <div className="mb-5 bg-slate-700 w-60 h-7 rounded-lg"></div>
            <ul className="flex flex-col gap-2">{renderListItems()}</ul>
          </div>

          {/* Column 4 */}
          <div className="w-full">
            <div className="mb-5 bg-slate-700 w-60 h-7 rounded-lg"></div>
            <ul className="flex flex-col gap-2">{renderListItems()}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
