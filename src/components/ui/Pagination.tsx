"use client";

import { Fragment } from "react";
import classNames from "classnames";

import Button from "@/components/globalUI/Button";

import { SvgChevronLeft, SvgChevronRight } from "@/assets/svg";
import { useTranslations } from "next-intl";

export function Pagination({
  totalPages,
  pages,
  selectedPage,
  startPage,
  endPage,
  next,
  prev,
  setPage,
  maxVisiblePages,
}: any) {
  const tGlobal = useTranslations("Global");

  return (
    <div className="container mx-auto px-4 w-full">
      <nav
        className="w-full flex items-center justify-center "
        role="navigation"
        aria-label="pagination"
      >
        <Button
          square
          aria-label="previous"
          variant="tertiary"
          className="mr-3 p-3 border !rounded-full cursor-pointer"
          onClick={() => prev()}
          disabled={selectedPage <= 1}
        >
          <SvgChevronLeft />
        </Button>
        <ul className="flex justify-center items-center gap-x-1.5">
          {!pages.includes(1) && (
            <li>
              <div
                className={classNames("flex border-transparent rounded-full", {
                  "font-medium !bg-primary-700": selectedPage === 1,
                })}
              >
                <button
                  type="button"
                  className="min-w-[50px]  min-h-[50px] px-3 sm:px-4 py-3 rounded-full text-neutral-500 md:w-12 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900"
                  aria-current={selectedPage === 1}
                  onClick={() => setPage(1)}
                >
                  1
                </button>
              </div>
            </li>
          )}
          {startPage > 2 && (
            <li>
              <div className="flex  border-transparent">
                <button
                  type="button"
                  disabled
                  aria-hidden="true"
                  className="  min-h-[50px] px-3 sm:px-4 py-3 text-neutral-500 md:w-12 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 dark:text-neutral-200"
                >
                  ...
                </button>
              </div>
            </li>
          )}
          {pages.map((page: number) => (
            <Fragment key={page}>
              {maxVisiblePages === 1 && selectedPage === totalPages && (
                <li>
                  <div className="flex border-transparent">
                    <button
                      type="button"
                      className="min-w-[50px]  min-h-[50px] rounded-full text-neutral-500 md:w-12 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 dark:text-neutral-200"
                      aria-current={endPage - 1 === selectedPage}
                      onClick={() => setPage(endPage - 1)}
                    >
                      {endPage - 1}
                    </button>
                  </div>
                </li>
              )}
              <li>
                <div
                  className={classNames(
                    "flex border-transparent rounded-full",
                    {
                      "font-medium !bg-primary-700 text-gray-100":
                        selectedPage === page,
                    },
                  )}
                >
                  <button
                    type="button"
                    className={classNames(
                      "min-w-[50px] min-h-[50px] text-neutral-500 md:w-12 rounded-full hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 dark:text-neutral-200 ",
                      {
                        "!text-gray-100 hover:!text-primary-800 active:!text-primary-900":
                          selectedPage === page,
                      },
                    )}
                    aria-label={`Page ${page} of ${totalPages}`}
                    aria-current={selectedPage === page}
                    onClick={() => setPage(page)}
                  >
                    {page}
                  </button>
                </div>
              </li>
              {maxVisiblePages === 1 && selectedPage === 1 && (
                <li>
                  <div className="flex border-transparent">
                    <button
                      type="button"
                      className="min-h-[50px] rounded-full text-neutral-500 md:w-12 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 dark:text-neutral-200"
                      aria-current={selectedPage === 1}
                      onClick={() => setPage(2)}
                    >
                      2
                    </button>
                  </div>
                </li>
              )}
            </Fragment>
          ))}
          {endPage < totalPages - 1 && (
            <li>
              <div className="flex border-transparent">
                <button
                  type="button"
                  disabled
                  aria-hidden="true"
                  className=" h-full rounded-full text-neutral-500 dark:text-neutral-200"
                >
                  ...
                </button>
              </div>
            </li>
          )}
          {!pages.includes(totalPages) && (
            <li>
              <div
                className={classNames("flex  border-transparent", {
                  "font-medium  !border-primary-700":
                    selectedPage === totalPages,
                })}
              >
                <button
                  type="button"
                  className="min-w-[50px] min-h-[50px] rounded-full text-neutral-500 md:w-12 hover:bg-primary-100 hover:text-primary-800 active:bg-primary-200 active:text-primary-900 dark:text-neutral-200"
                  aria-current={totalPages === selectedPage}
                  onClick={() => setPage(totalPages)}
                >
                  {totalPages}
                </button>
              </div>
            </li>
          )}
        </ul>
        <Button
          square
          aria-label="next page"
          variant="tertiary"
          disabled={selectedPage >= totalPages}
          className="ml-3 !rounded-full p-3 border cursor-pointer"
          onClick={() => next()}
        >
          <SvgChevronRight />
        </Button>
      </nav>
    </div>
  );
}
