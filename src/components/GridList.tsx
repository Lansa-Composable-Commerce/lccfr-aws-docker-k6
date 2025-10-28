"use client";

import React from "react";

import { motion } from "framer-motion";

import {
  selectGridSwitch,
  setGridView,
} from "@/lib/features/global/globalSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { SvgColumn, SvgList } from "@/assets/svg";
const GridList = () => {
  const dispatch = useAppDispatch();

  const isGridView = useAppSelector(selectGridSwitch);

  const handleGridSwitch = (value: string) => {
    dispatch(setGridView(value));
  };
  return (
    <div className="flex overflow-hidden rounded-lg">
      <div
        className={`relative flex size-9 lg:size-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800 cursor-pointer ${
          isGridView ? "text-white" : "text-brand dark:text-white"
        }`}
        onClick={() => handleGridSwitch("GRID")}
      >
        {isGridView && (
          <motion.span
            className="absolute left-0 right-0 bottom-0 h-full w-full bg-brand shadow-large"
            layoutId="gridSwitchIndicator"
          />
        )}
        <SvgColumn className="size-5 lg:size-7 relative" />
      </div>

      <div
        className={`relative flex size-9 lg:size-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800 cursor-pointer ${
          !isGridView ? "text-white" : "text-brand dark:text-white"
        }`}
        onClick={() => handleGridSwitch("LIST")}
      >
        {!isGridView && (
          <motion.span
            className="absolute left-0 right-0 bottom-0 h-full w-full bg-brand shadow-large"
            layoutId="gridSwitchIndicator"
          />
        )}
        <SvgList className="size-5 lg:size-7 relative" />
      </div>
    </div>
  );
};

export default GridList;
