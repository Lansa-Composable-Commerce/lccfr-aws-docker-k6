"use client";

import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import {
  SfAccordionItem,
  SfCounter,
  SfListItem,
  SfRadio,
} from "@storefront-ui/react";
import { Transition } from "react-transition-group";
import { useTranslations } from "next-intl";

import SfCheckbox from "@/components/ui/Checkbox";

import { createSlug } from "@/lib/helpers/createSlug";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  filterByCategory,
  onSetHandOption,
  onSetLoftOption,
  selectCategoryName,
  selectOptionHandText,
  selectOptionLoft,
} from "@/lib/features/products/productsSlice";
import {
  onGetCateg,
  onGetSubCateg,
  selectSubCateg,
} from "@/lib/features/breadcrumbs/breadcrumbsSlice";

import { SvgCheck, SvgChevronLeft } from "@/assets/svg";
import { removeWhitespace } from "@/utils/removeWhiteSpace";

const RenderOptionForFairwayWoods = ({
  categoryData,
}: {
  categoryData: any;
}) => {
  const tProducts: any = useTranslations("Products");

  const dispatch = useAppDispatch();

  const selectOptionLoftData = useAppSelector(selectOptionLoft);
  const handSideText = useAppSelector(selectOptionHandText);

  const [isHandOptionVisible, setIsHandOptionVisible] = useState(false);
  const [isLoftVisible, setLoftVisible] = useState(false);
  const [selectedLoft, setSelectedLoft] = useState<any>([]);

  const filterOptionData = categoryData.data?.filters;

  const loftFilter = useMemo(
    () => filterOptionData.find((filter: any) => filter.LW3FLTDSC === "Loft"),
    [filterOptionData],
  ); // Memoize loft filter

  const handFilter = useMemo(
    () => filterOptionData.find((filter: any) => filter.LW3FLTDSC === "HAND"),
    [filterOptionData],
  );

  const sortedLoftItems = useMemo(
    () =>
      loftFilter?.selections.sort((a: any, b: any) =>
        a.LW3FLTACD.localeCompare(b.LW3FLTACD),
      ),

    [loftFilter],
  ); // Memoize sorted loft items

  const handleHandOptionChange = (event: any) => {
    const value = event.target.value;

    dispatch(onSetHandOption(value)); // Directly update redux state
  };

  // loft option
  const handleLoftsSelection = (selectedValue: string) => {
    // @ts-ignore
    if (selectOptionLoftData.indexOf(selectedValue) > -1) {
      setSelectedLoft([
        ...selectOptionLoftData.filter((value) => value !== selectedValue),
      ]);
    } else {
      setSelectedLoft([...selectOptionLoftData, selectedValue]);
    }
  };

  const isLoftSelected = (selectedValue: any) =>
    // @ts-ignore
    selectOptionLoftData.includes(selectedValue);

  useEffect(() => {
    dispatch(onSetLoftOption(selectedLoft));
  }, [selectedLoft, dispatch]);

  if (loftFilter === undefined || handFilter === undefined) return null;

  return (
    <div className="relative flex flex-col gap-y-4">
      <SfAccordionItem
        open={isHandOptionVisible}
        onToggle={() => setIsHandOptionVisible(!isHandOptionVisible)}
        className={classNames(
          "w-full md:max-w-[376px] list-none shadow-card rounded-lg hover:shadow-transaction dark:bg-light-dark",
        )}
        summary={
          <div className="flex justify-between py-2 px-2 xl:px-4">
            <p className="text-sm text-black01 font-medium xl:text-base dark:text-gray-400">
              {tProducts("Hand")}
            </p>

            <SvgChevronLeft
              className={classNames("size-5", {
                "rotate-90": isHandOptionVisible,
                "-rotate-90": !isHandOptionVisible,
              })}
            />
          </div>
        }
      >
        <div className="my-2">
          {handFilter?.selections?.map(
            ({ LW3FLTDSC, LW3FLTECN }: any, id: number) => (
              <label
                key={id}
                className="flex items-center cursor-pointer py-1 px-4"
              >
                <SfRadio
                  name={LW3FLTDSC}
                  value={LW3FLTDSC}
                  checked={handSideText === LW3FLTDSC}
                  onChange={handleHandOptionChange}
                />
                <span className="ml-2 text-xs lg:text-sm font-normal leading-6 dark:text-gray-400">
                  {LW3FLTDSC}{" "}
                  <SfCounter size="sm" className="dark:text-gray-200">
                    ({LW3FLTECN})
                  </SfCounter>
                </span>
              </label>
            ),
          )}
        </div>
      </SfAccordionItem>
      <SfAccordionItem
        open={isLoftVisible}
        onToggle={() => setLoftVisible(!isLoftVisible)}
        className={classNames(
          "w-full md:max-w-[376px] list-none shadow-card rounded-lg hover:shadow-transaction dark:bg-light-dark",
        )}
        summary={
          <div className="flex justify-between py-2 px-2 xl:px-4">
            <p className="text-sm text-black01 font-medium xl:text-base dark:text-gray-400">
              {tProducts("Loft")}
            </p>
            <SvgChevronLeft
              className={classNames(
                "size-5",
                `${isLoftVisible ? "rotate-90" : "-rotate-90"}`,
              )}
            />
          </div>
        }
      >
        <div className="relative h-[300px] pb-4">
          <div className="h-full overflow-auto">
            {sortedLoftItems?.map(
              (
                { LW3FLTACD, LW3FLTECN }: any, // Optional chaining for sortedLoftItems
              ) => (
                <SfListItem
                  key={LW3FLTACD}
                  as="label"
                  size="sm"
                  disabled={LW3FLTECN === 0}
                  className={classNames(
                    "px-1.5 bg-transparent hover:bg-transparent",
                    {
                      "font-medium": isLoftSelected(LW3FLTACD),
                    },
                  )}
                  slotPrefix={
                    <SfCheckbox
                      disabled={LW3FLTECN === 0}
                      className="flex items-center"
                      value={LW3FLTACD}
                      checked={isLoftSelected(LW3FLTACD)} // Corrected checked logic
                      onChange={(event) => {
                        handleLoftsSelection(event.target.value);
                      }}
                    />
                  }
                >
                  <p>
                    <span className="mr-2 text-xs lg:text-sm dark:text-gray-400">
                      {LW3FLTACD}
                    </span>
                    <SfCounter size="sm" className="dark:text-gray-200">
                      ({LW3FLTECN})
                    </SfCounter>
                  </p>
                </SfListItem>
              ),
            )}
          </div>
        </div>
      </SfAccordionItem>
    </div>
  );
};

export default function CategoryFilter({
  label,
  categoryData,
}: {
  label: string;
  categoryData: any;
}) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const categoryQueryParams: any = searchParams.get("search");

  const categoryName: any = useAppSelector(selectCategoryName);
  const subCategory: any = useAppSelector(selectSubCateg);

  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);

  const [isTransitioning, setTransitioning] = useState(false);

  const filterOptionData = categoryData.data?.filters;

  const categoriesFiltered: any = filterOptionData?.find(
    (filter: any) => filter.LW3FLTDSC === "CATEGORIES",
  );

  const handFiltered: any = filterOptionData?.find(
    (filter: any) => filter.LW3FLTDSC === "HAND",
  );

  const loftFiltered: any = filterOptionData?.find(
    (filter: any) => filter.LW3FLTDSC === "Loft",
  );

  const handleStopTransition = () => {
    setTransitioning(false);
  };

  const handleToggleCategories = () => {
    setTransitioning(true);
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  return (
    <div className="w-full flex flex-col pr-3 gap-y-4">
      <SfAccordionItem
        open={isTransitioning || isCategoriesVisible}
        onToggle={handleToggleCategories}
        className="w-full list-none shadow-card rounded-lg hover:shadow-transaction md:max-w-[376px] dark:bg-light-dark"
        summary={
          <div className="flex items-center justify-between py-2 px-2 xl:px-4">
            <p className="text-sm text-black01 font-medium xl:text-base dark:text-gray-400">
              {label}
            </p>
            <SvgChevronLeft
              className={classNames(
                "size-5",
                `${isCategoriesVisible ? "rotate-90" : "-rotate-90"}`,
              )}
            />
          </div>
        }
      >
        <Transition
          in={isCategoriesVisible}
          timeout={300}
          onEntered={handleStopTransition}
          onExited={handleStopTransition}
          mountOnEnter
          unmountOnExit
        >
          {(state) => (
            <div
              className={classNames(
                "grid transition-[grid-template-rows] duration-300 grid-rows-[0fr]",
                {
                  "!grid-rows-[1fr]":
                    state === "entering" || state === "entered",
                  "grid-rows-[0fr]": state === "exiting",
                },
              )}
            >
              <ul className="mb-3 px-2">
                {categoriesFiltered?.selections.map((category: any) => {
                  const newSubCateg = removeWhitespace(category?.LW3FLTDSC);
                  const handleCLickCategory = () => {
                    dispatch(filterByCategory(category?.LW3FLTDSC));
                    dispatch(onGetCateg(`${createSlug(categoryQueryParams)}`));
                    dispatch(onGetSubCateg(newSubCateg));
                  };

                  return (
                    <li key={category?.LW3CATNAM}>
                      <SfListItem
                        size="sm"
                        as="div"
                        onClick={handleCLickCategory}
                        className={classNames(
                          "first-of-type:mt-2 rounded-md active:bg-primary-100 hover:bg-primary-100/50 py-1 dark:active:text-gray-100 dark:text-gray-400 dark:hover:text-gray-100",
                          {
                            "border border-primary-500 bg-primary-500/50 font-medium dark:text-gray-100":
                              category?.LW3FLTDSC === categoryName,
                          },
                        )}
                        slotSuffix={
                          category?.LW3FLTDSC === categoryName && (
                            <SvgCheck className="size-5 text-primary-700 dark:text-lightGreen" />
                          )
                        }
                      >
                        <span className="flex items-center capitalize">
                          <p className="text-xs lg:text-sm">
                            {category?.LW3FLTDSC}
                          </p>
                          <SfCounter className="ml-2 typography-text-sm font-normal dark:text-gray-200">
                            ({category?.LW3FLTECN})
                          </SfCounter>
                        </span>
                      </SfListItem>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Transition>
      </SfAccordionItem>

      <RenderOptionForFairwayWoods categoryData={categoryData} />
    </div>
  );
}
