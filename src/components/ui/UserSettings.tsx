"use client";

import React from "react";
import classNames from "classnames";
import { SfDropdown, useDisclosure } from "@storefront-ui/react";
import { useTranslations } from "next-intl";

import { SvgUser } from "@/assets/svg";
import useLogout from "@/lib/hooks/useLogout";

const UserSettings = () => {
  const tGlobal = useTranslations("Global");

  const { isOpen, toggle, close } = useDisclosure();
  const logout = useLogout();

  return (
    <SfDropdown
      trigger={
        <SvgUser
          onClick={toggle}
          className={classNames(
            "cursor-pointer translate-05 size-7 text-black01 dark:text-gray-400 hover:dark:text-white z-0",
          )}
        />
      }
      open={isOpen}
      onClose={close}
      className="relative"
    >
      <ul className="p-2  bg-gray-100 rounded-lg z-50">
        <li
          className="cursor-pointer hover:bg-lightGreen rounded py-1 px-3 dark:text-gray-400 hover:dark:text-gray-900"
          onClick={logout}
        >
          {tGlobal("Logout")}
        </li>
      </ul>
    </SfDropdown>
  );
};

export default UserSettings;
