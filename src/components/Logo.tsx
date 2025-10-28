"use client";

import HTMLServerParser from "@/components/HTMLServerParser";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectGlobalState,
  selectLogoData,
} from "@/lib/features/global/globalSlice";
import classNames from "classnames";

export default function Logo({ height }: { height?: string }) {
  const dispatch = useAppDispatch();

  const { isLoading } = useAppSelector(selectGlobalState);
  const { LW3CNTSTR } = useAppSelector(selectLogoData);

  return (
    <>
      {isLoading ? (
        <div
          className={classNames(
            "w-[158px] bg-gray-50 rounded animate-pulse",
            height ? height : "h-[78px]",
          )}
        >
          &nbsp;
        </div>
      ) : (
        <HTMLServerParser content={LW3CNTSTR} />
      )}
    </>
  );
}
