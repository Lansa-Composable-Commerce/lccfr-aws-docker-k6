"use client";

export default function SkeletonOrderDetails() {
  return (
    <div className="flex flex-col w-full gap-2 border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-gray-200 rounded-md mb-4 w-1/3"></div>
      <div className="h-5 bg-gray-200 rounded-md w-1/2 mb-2"></div>
      <div className="flex flex-col md:flex-row md:justify-between gap-4 my-4">
        <div className="w-full">
          <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          </div>
        </div>
        <div className="w-full">
          <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
