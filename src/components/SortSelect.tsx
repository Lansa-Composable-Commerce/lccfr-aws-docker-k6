"use client";

import { SortConfig } from "@/lib/hooks/useSortData";
import { SvgSortAsc, SvgSortDesc } from "@/assets/svg";
import React from "react";

type HeaderOption<T> = {
  label: string;
  key: keyof T | string;
};

type SortSelectProps<T> = {
  header: HeaderOption<T>[];
  sortConfig: SortConfig<T> | null;
  handleSort(key: keyof T): void;
};

export default function SortSelect<T>({
  header,
  sortConfig,
  handleSort,
}: SortSelectProps<T>) {
  return (
    <div className="my-4 flex flex-col gap-1 sm:hidden">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Sort By
      </span>
      <div className="w-full flex items-center gap-2">
        <div className="w-full">
          <select
            onChange={(e) => handleSort(e.target.value as keyof T)}
            value={sortConfig?.key as string}
            className="p-2 w-full bg-white text-black cursor-pointer focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-500 rounded-md"
            style={{ border: "1px solid #CBD5E1" }}
            aria-label="Sort By"
          >
            {header.map(({ label, key }) => (
              <option key={String(key)} value={String(key)}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div
          onClick={() => sortConfig?.key && handleSort(sortConfig.key)}
          className="cursor-pointer"
        >
          {sortConfig?.direction === "asc" ? (
            <SvgSortAsc className="size-8 hover:text-primary-700" />
          ) : (
            <SvgSortDesc className="size-8 hover:text-primary-700" />
          )}
        </div>
      </div>
    </div>
  );
}
