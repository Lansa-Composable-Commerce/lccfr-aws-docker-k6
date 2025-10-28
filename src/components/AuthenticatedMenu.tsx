import React from "react";
import SearchModal from "@/components/SearchModal";
import Navbar from "@/components/Navbar";
import BreadCrumbs from "@/components/ui/BreadCrumbs";
import { SvgChevronRight, SvgHome } from "@/assets/svg";
import { getCookieValue } from "@/utils/cookies";
import { COOKIE_ACCESS_TOKEN } from "@/lib/auth/session";
import { getMenus } from "@/api/navbar";
import { getRecommendedAndBestSellers } from "@/api/home/getRecommendedAndBestSellers";
import { extractPathsFromMenu, isAllowedPath } from "@/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function AuthenticatedMenu() {
  const accessCookieValue = getCookieValue(COOKIE_ACCESS_TOKEN.name);
  const [menus] = await Promise.all([getMenus()]);

  if (!menus) return null;

  const filteredMenu = menus.data.children.filter(
    (menuItem: any) => menuItem.isMenu,
  );

  const paths = extractPathsFromMenu(menus.data.children);
  const currentPath = headers().get("x-current-path") || "";
  const isAllowed = isAllowedPath(currentPath, paths);

  if (!isAllowed) {
    redirect("/forbidden");
  }

  menus.data = {
    ...menus.data,
    children: filteredMenu,
  };

  return (
    <>
      <SearchModal />
      <Navbar
        menus={menus}
        accessCookieValue={accessCookieValue}
        paths={paths}
      />
      <BreadCrumbs
        homeElement={<SvgHome />}
        separator={
          <span>
            <SvgChevronRight className="size-4 text-gray-500 dark:text-gray-400" />
          </span>
        }
        activeClasses="text-primary-700 dark:text-primary-400"
        listClasses="text-xs lg:text-sm mx-2 text-gray-500 dark:text-gray-400"
        capitalizeLinks
      />
    </>
  );
}
