"use client";

import {
  SfDrawer,
  SfButton,
  useTrapFocus,
  SfDrawerPlacement,
} from "@storefront-ui/react";
import React, { useRef, useState } from "react";
import { Transition } from "react-transition-group";
import classNames from "classnames";

import CategoryFilter from "@/components/ui/FiltersCategories";

import {
  selectIsFilterDrawerOpen,
  openFilterDrawer,
} from "@/lib/features/global/globalSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import { SvgXMark } from "@/assets/svg";
import { useTranslations } from "next-intl";

export default function Drawer({ categoryData }: any) {
  const tProducts: any = useTranslations("Products");
  const dispatch = useAppDispatch();
  const nodeRef = useRef(null);
  const drawerRef = useRef(null);

  const isDrawOpen = useAppSelector(selectIsFilterDrawerOpen);
  const [placement, setPlacement] = useState<`${SfDrawerPlacement}`>("left");

  const handleFilterDrawer = () => {
    // @ts-ignore
    dispatch(openFilterDrawer());
  };

  const handleCloseDrawer = () => {
    // @ts-ignore
    dispatch(openFilterDrawer());
  };

  useTrapFocus(drawerRef, { activeState: isDrawOpen });

  return (
    <Transition ref={nodeRef} in={isDrawOpen} timeout={300}>
      {(state: string) => (
        <>
          {isDrawOpen && (
            <div className="lg:hidden fixed top-0 inset-0 bg-neutral-500 bg-opacity-50 z-10" />
          )}
          <SfDrawer
            ref={drawerRef}
            open={isDrawOpen}
            onClose={() => handleFilterDrawer()}
            placement={"left"}
            className={classNames(
              "bg-white absolute w-full h-full max-w-xs z-20",
              {
                "translate-x-0": state === "entered" && placement === "left",
                "-translate-x-full":
                  (state === "entering" || state === "exited") &&
                  placement === "left",
              },
            )}
          >
            <header className="flex items-center justify-between py-4 px-5">
              <div className="flex items-center text-white"></div>
              <SfButton
                square
                variant="secondary"
                onClick={handleCloseDrawer}
                className="text-white"
              >
                <SvgXMark className="size-4 text-black01" />
              </SfButton>
            </header>
            <div className="w-full h-full pt-2">
              <div className="w-full flex items-center justify-center">
                <CategoryFilter
                  label={tProducts("Categories")}
                  categoryData={categoryData}
                />
              </div>
            </div>
          </SfDrawer>
        </>
      )}
    </Transition>
  );
}
