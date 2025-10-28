"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import Select from "@/components/globalUI/Select";
import GridList from "@/components/GridList";

// lib
import { useAppDispatch } from "@/lib/hooks";
import { openFilterDrawer } from "@/lib/features/global/globalSlice";
import { DEFAULT_SHOW_COUNT } from "@/utils/constants";

import { SvgAdjustmentVertical } from "@/assets/svg";

const SortOption = ({
  resultCount,
  handleSortChange,
  sortByValueFromURL,
}: {
  resultCount: number;
  handleSortChange: (sortOption: string | undefined) => void;
  sortByValueFromURL: string | undefined;
}) => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tProducts: any = useTranslations("Products");

  const sortOptions = [
    { label: `${tProducts("ProductID")}`, value: "productID" },
    { label: `${tProducts("Description")}`, value: "description" },
    {
      label: `${tProducts("Price")}: ${tProducts("LowToHigh")}`,
      value: "lowest-price",
    },
    {
      label: `${tProducts("Price")}: ${tProducts("HighToLow")}`,
      value: "highest-price",
    },
  ];

  const optionShow = [
    { label: `${tProducts("Show")} 9`, value: 9 },
    { label: `${tProducts("Show")} 36`, value: 36 },
    { label: `${tProducts("Show")} 54`, value: 54 },
    { label: `${tProducts("Show")} 72`, value: 72 },
    { label: `${tProducts("Show")} 90`, value: 90 },
    { label: `${tProducts("ShowAll")}`, value: "all" },
  ];

  const showFromURL: string =
    searchParams.get("show") || DEFAULT_SHOW_COUNT.toString();

  const handleOnChangeSortBy = (event: any) => {
    handleSortChange(event.target.value);
  };

  const handleOnChangeShow = (event: any) => {
    if (event !== "all") {
      router.push(
        pathname + "?" + createQueryString("show", event.target.value),
      );
    } else router.push(pathname);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleFilterDrawer = () => {
    dispatch(openFilterDrawer());
  };

  return (
    <div className="w-full flex flex-wrap justify-between items-end md:flex-nowrap lg:items-center gap-y-4 text-gray03 mb-4 dark:text-gray-200">
      <div className="w-full grow flex flex-row items-end gap-x-1 lg:gap-x-3">
        <div
          className="p-1 rounded-md xl:hidden cursor-pointer hover:bg-gray02"
          onClick={handleFilterDrawer}
        >
          <SvgAdjustmentVertical />
        </div>
        <div className="w-full flex items-center gap-3 max-w-[450px]">
          <div className="w-full">
            <p className="text-xs sm:text-sm lg:block ">
              {tProducts("SortBy")}:{" "}
            </p>
            <Select
              size="sm"
              onChange={handleOnChangeSortBy}
              aria-label="Sort By"
              value={sortByValueFromURL}
            >
              {sortOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-full">
            <p className="text-xs sm:text-sm lg:block">{tProducts("Show")}: </p>
            <Select
              size="sm"
              onChange={handleOnChangeShow}
              aria-label="Show"
              value={showFromURL}
            >
              {optionShow.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto flex-none">
        <div className="w-full flex flex-row items-center justify-between lg:flex-row lg:items-center lg:justify-normal gap-x-3">
          <p className="text-xs sm:text-sm flex gap-x-1 lg:text-base">
            <span className="font-semibold">{resultCount || 0}</span>
            {tProducts("ResultFound")}
          </p>
          <GridList />
        </div>
      </div>
    </div>
  );
};

export default SortOption;
