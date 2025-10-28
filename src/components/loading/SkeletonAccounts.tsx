import React from "react";

export default function SkeletonAccounts() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full h-12 animate-pulse bg-gray-300 rounded-lg"></div>
      <div className="flex flex-col w-full my-6 gap-4">
        <div className="mx-auto w-full h-20 animate-pulse bg-gray-300 rounded-lg"></div>
        <div className="mx-auto w-full h-20 animate-pulse bg-gray-300 rounded-lg"></div>
        <div className="mx-auto w-full h-20 animate-pulse bg-gray-300 rounded-lg"></div>
        <div className="mx-auto w-full h-20 animate-pulse bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
}
