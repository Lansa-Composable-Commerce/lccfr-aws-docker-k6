"use client";

export default function SkeletonAddress() {
  return (
    <div className="relative flex flex-col w-full gap-2 border border-gray-200 rounded-sm p-4">
      <div className="h-5 bg-gray-300 rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
    </div>
  );
}
