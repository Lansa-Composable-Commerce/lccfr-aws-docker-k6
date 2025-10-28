import React, { useState } from "react";
import Link from "next/link";
import { SfListItem } from "@storefront-ui/react";
import { SvgChevronRight } from "@/assets/svg";
import classNames from "classnames";

type MenuItem = {
  key: string;
  isLeaf: boolean;
  value: {
    label: string;
    link?: string;
  };
  children: MenuItem[];
  categoryURL?: string;
  categoryName?: string;
};

type Props = {
  items: MenuItem[];
  parentNode?: MenuItem;
  isProductPrimaryMenu: boolean;
  level?: number;
  onClickLeaf?: (parentNode: MenuItem, child: MenuItem) => void;
};

export const MultiLevelAccordion = ({
  items,
  parentNode,
  isProductPrimaryMenu,
  level = 1,
  onClickLeaf,
}: Props) => {
  const [expandedSubmenus, setExpandedSubmenus] = useState<
    Record<number, string>
  >({});
  const [hoverTimeout, setHoverTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const openSubmenu = (lvl: number, key: string) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setExpandedSubmenus((prev) => ({
      ...prev,
      [lvl]: key,
    }));
  };

  const closeSubmenu = (lvl: number) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoverTimeout(
      setTimeout(() => {
        setExpandedSubmenus((prev) => ({
          ...prev,
          [lvl]: "",
        }));
      }, 200),
    );
  };

  return (
    <>
      {items.map((item) => {
        const isLeaf = item.isLeaf;
        const label = item?.value?.label;
        const key = item.key;

        const href = isProductPrimaryMenu
          ? item?.categoryURL
            ? `/products?category=${parentNode?.value.label}&subCategory=${item?.categoryName}&url=${item.categoryURL}`
            : "/"
          : item?.value?.link || "#";

        const isExpanded = expandedSubmenus[level] === key;

        return (
          <li
            key={key}
            className="mb-1 relative group"
            onMouseEnter={() => !isLeaf && openSubmenu(level, key)}
            onMouseLeave={() => !isLeaf && closeSubmenu(level)}
          >
            {isLeaf ? (
              <Link
                href={href}
                onClick={() =>
                  isProductPrimaryMenu && onClickLeaf?.(parentNode!, item)
                }
                prefetch={false}
              >
                <div
                  className={classNames(isProductPrimaryMenu ? "ml-0" : "ml-5")}
                >
                  <SfListItem
                    as="a"
                    size="sm"
                    className="relative group typography-text-sm py-1.5 text-gray-900 dark:text-gray-400 hover:text-gray-800 hover:bg-transparent dark:hover:bg-black/30"
                  >
                    <span>{label}</span>
                    <span
                      className={classNames(
                        "ml-4 h-[1.5px] inline-block bg-brand absolute left-0 -bottom-0.5 transition-[width] ease duration-300 w-0",
                        {
                          "group-hover:w-full border-b -bottom-0.5": level < 3,
                          "group-hover:w-1/3": level >= 3,
                        },
                      )}
                    />
                  </SfListItem>
                </div>
              </Link>
            ) : (
              <div className="ml-8">
                <div className="flex items-center justify-between cursor-pointer text-sm dark:text-gray-200 hover:text-gray-900 hover:bg-gray-100 rounded-md py-1 px-1.5">
                  <span>{label}</span>
                  <span
                    className={classNames(
                      "ml-2 transition-transform duration-300 ease-in-out",
                      { "rotate-90": isExpanded },
                    )}
                  >
                    <SvgChevronRight className="size-6 text-gray-600 hover:text-gray-900" />
                  </span>
                </div>

                {item.children?.length > 0 && (
                  <ul
                    className="ml-4 mt-1 border-l border-gray-200 dark:border-gray-700 pl-2 overflow-hidden transition-[max-height] duration-300 ease-in-out"
                    style={{
                      maxHeight: isExpanded ? "500px" : "0",
                    }}
                  >
                    <MultiLevelAccordion
                      items={item.children}
                      parentNode={item}
                      isProductPrimaryMenu={isProductPrimaryMenu}
                      level={level + 1}
                      onClickLeaf={onClickLeaf}
                    />
                  </ul>
                )}
              </div>
            )}
          </li>
        );
      })}
    </>
  );
};
