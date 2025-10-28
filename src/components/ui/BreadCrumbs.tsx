"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

// lib
import {
  capitalizeWordsFromQuery,
  removeDashesAndSpaces,
} from "@/lib/helpers/stringUtils";
import { removeDashesFromSlug } from "@/lib/helpers/removeDashesFromSlug";

import { removeWhitespace } from "@/utils/removeWhiteSpace";

import { SfButton, SfDropdown, SfLink } from "@storefront-ui/react";
import { SvgChevronRight, SvgEllipsisHorizontal } from "@/assets/svg";

import { BreadcrumbItem, TBreadCrumbProps } from "@/types";
import { translatableSegment } from "@/lib/helpers/translateTableSegment";

const BreadCrumbs = ({ homeElement, capitalizeLinks }: TBreadCrumbProps) => {
  const tGlobal = useTranslations("Global");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryQueryParams = searchParams.get("category");
  const subCategoryQueryParams = searchParams.get("subCategory");

  const [dropdownOpened, setDropdownOpened] = useState(false);

  const close = () => {
    setDropdownOpened(false);
  };

  const toggle = () => {
    setDropdownOpened(!dropdownOpened);
  };

  const pathSegments = useMemo(
    () => pathname.split("/").filter(Boolean).slice(1),
    [pathname],
  );

  const isProductsPage = useMemo(
    () =>
      pathSegments.length > 0 && pathSegments[0].toLowerCase() === "products",
    [pathSegments],
  );

  const productId = useMemo(
    () => (isProductsPage && pathSegments.length > 1 ? pathSegments[1] : null),
    [isProductsPage, pathSegments],
  );
  /*  const handleCategoryClick = useCallback(() => {
    if (categoryQueryParams) {
      router.push(
        `/products?category=${categoryQueryParams}&url=${removeWhitespace(
          categoryQueryParams,
        )}`,
      );
      dispatch(onRemoveSubCateg());
      dispatch(removeFilterCategory());
    }
  }, [categoryQueryParams, dispatch, router]);*/

  /*  const handleSubCategoryClick = useCallback(() => {
    if (subCategoryQueryParams && categoryQueryParams) {
      router.push(
        `/products?category=${categoryQueryParams}&subCategory=${subCategoryQueryParams}&url=${removeWhitespace(
          subCategoryQueryParams,
        )}`,
      );
    }
  }, [subCategoryQueryParams, categoryQueryParams, router]);*/

  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [
      {
        id: 0,
        name: tGlobal("Home"),
        link: "/",
      },
    ];

    if (isProductsPage) {
      if (categoryQueryParams) {
        items.push({
          id: items.length,
          name: capitalizeWordsFromQuery(categoryQueryParams),
          link: `/products?category=${categoryQueryParams}&url=${removeWhitespace(
            categoryQueryParams,
          )}`,
        });
      }

      if (subCategoryQueryParams) {
        items.push({
          id: items.length,
          name: capitalizeWordsFromQuery(subCategoryQueryParams),
          link: `/products?category=${categoryQueryParams}&subCategory=${subCategoryQueryParams}&url=${removeWhitespace(
            subCategoryQueryParams,
          )}`,
        });
      }

      if (productId) {
        items.push({
          id: items.length,
          name: productId,
          link: `/products/${productId}`,
        });
      }
    } else {
      // Handle non-product pages
      pathSegments.forEach((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isMyProductsPath =
          pathSegments[0] === "my-products" ||
          pathSegments[0] === "search-result";
        const isProductIdSegment = isMyProductsPath && index === 1;

        const segmentText =
          !isProductIdSegment && translatableSegment(segment)
            ? tGlobal(removeDashesAndSpaces(capitalizeWordsFromQuery(segment)))
            : segment;
        items.push({
          id: items.length,
          name: segmentText,
          link: href,
        });
      });
    }

    return items;
  }, [
    pathSegments,
    pathname,
    capitalizeLinks,
    categoryQueryParams,
    subCategoryQueryParams,
    tGlobal,
    isProductsPage,
    homeElement,
    productId,
  ]);

  return pathSegments.length <= 0 ? null : (
    <nav
      aria-label="Breadcrumb"
      className="bg-gray02 py-1.5 lg:py-3 dark:bg-light-dark"
    >
      <div
        className=" md:container mx-auto pl-2.5 pr-2 lg:px-4 flex items-center
      lg:gap-x-2 gap-y-1.5"
      >
        <div className="flex items-center sm:hidden text-neutral-500">
          <SfDropdown
            trigger={
              <SfButton
                className="relative !p-0 rounded-sm outline-secondary-600 hover:bg-transparent active:bg-transparent z-10"
                aria-label="breadcrumbs"
                variant="tertiary"
                slotPrefix={
                  <SvgEllipsisHorizontal className="size-6 mt-2 dark:text-gray-400" />
                }
                square
                onClick={toggle}
              />
            }
            open={dropdownOpened}
            strategy="absolute"
            placement="bottom-start"
            onClose={close}
          >
            <div className="relative px-4 py-2 rounded-md shadow-md border-neutral-100 bg-white z-20">
              {breadcrumbs.map((item) => (
                <li className="py-2 last-of-type:hidden" key={item.id}>
                  <SfLink
                    href={item.link}
                    variant="secondary"
                    className="text-sm leading-5 no-underline hover:underline active:underline whitespace-nowrap outline-secondary-600 text-gray03"
                  >
                    {item.name}
                  </SfLink>
                </li>
              ))}
            </div>
          </SfDropdown>
        </div>
        <ul className="flex items-center gap-x-2">
          {breadcrumbs.map((item, index) => (
            <li
              data-icon="url('@assets/chevron_right.svg')"
              className="hidden peer sm:flex items-center last-of-type:flex last-of-type:text-black01 last-of-type:font-medium  text-sm capitalize"
              key={item.id}
            >
              {index !== 0 ? (
                <SvgChevronRight className="size-4 mr-2 dark:text-gray-400" />
              ) : null}
              {index < breadcrumbs.length - 1 ? (
                <SfLink
                  href={item.link}
                  variant="secondary"
                  className="leading-5 no-underline hover:underline active:underline whitespace-nowrap dark:text-gray-400"
                >
                  {item.name}
                </SfLink>
              ) : (
                <span className="font-semibold dark:text-gray-400">
                  {removeDashesFromSlug(item.name)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BreadCrumbs;
