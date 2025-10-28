"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import { SfTooltip } from "@storefront-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import { SvgChevronDown, SvgKey, SvgLockClosed, SvgUsers } from "@/assets/svg";

import { IRenderSubUserInformationList } from "@/types";
import {
  selectSelectedSubUser,
  setSelectedSubUser,
  setSubUserInfoModalVisible,
} from "@/lib/features/subUser/subUserSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

const RenderSubUserInformationList = ({
  subUser,
  name,
  email,
  onClickRow,
  onCollapse = false,
  children,
}: React.PropsWithChildren<IRenderSubUserInformationList>) => {
  const dispatch = useAppDispatch();
  const selectedSubUser = useAppSelector(selectSelectedSubUser);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  let [isExpand, setIsExpand] = useState(false);

  const isSelected =
    selectedSubUser &&
    selectedSubUser.subUserId === subUser &&
    selectedSubUser.fullName === name &&
    selectedSubUser.subUserEmail === email;

  const handleSubUserModal = (
    e: React.MouseEvent<HTMLDivElement>,
    tabName: any,
  ) => {
    e.stopPropagation();
    const payload = { isVisible: true, subUserTabName: tabName };
    dispatch(setSubUserInfoModalVisible(payload));
    dispatch(
      setSelectedSubUser({
        subUserId: subUser,
        fullName: name,
        subUserEmail: email,
      }),
    );
  };

  return (
    <div
      className={classNames("", {
        "pb-3": !isMobile,
      })}
    >
      <div
        onClick={onClickRow}
        className={classNames(
          "flex flex-col cursor-pointer",
          { "border-brand border-solid border rounded-lg": isSelected },
          /*  {
            "hover:bg-neutral-100 cursor-pointer dark:hover:bg-gray-800":
              !isSelected,
          },*/
        )}
      >
        <div className="px-3 lg:px-0 relative grid h-auto grid-cols-2 items-center gap-3 py-4 sm:grid-cols-3 sm:gap-6 sm:py-2 lg:py-3 lg:grid-cols-8 hover:shadow-transaction rounded-lg">
          <div className="col-span-2 text-sm lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:col-auto text-left sm:text-center flex flex-col sm:items-center sm:justify-center">
            <span className="mb-1 hidden sm:block text-gray-600 dark:text-gray-400 lg:hidden">
              Sub-User
            </span>
            <p className="w-full truncate">{subUser}</p>
          </div>
          <div className="text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:col-span-1  lg:col-span-2 text-center">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              Name
            </span>
            {name}
          </div>

          <div className="text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm  sm:col-span-1  lg:col-span-2 text-center">
            <SfTooltip label={email}>
              <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
                Email
              </span>
              <div className="w-full truncate">{email}</div>
            </SfTooltip>
          </div>
          <div className="text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:col-auto flex flex-col items-center justify-center">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              Password
            </span>
            <div
              className=" hover:bg-gray-100 dark:hover:bg-gray-900 p-3 rounded"
              onClick={(e) => handleSubUserModal(e, "password")}
            >
              <SvgLockClosed className="size-5 md:size-6" />
            </div>
          </div>
          <div className="text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:col-auto flex flex-col items-center justify-center">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              Permission
            </span>
            <div
              className=" hover:bg-gray-100 dark:hover:bg-gray-900 p-3 rounded"
              onClick={(e) => handleSubUserModal(e, "permission")}
            >
              <SvgKey className="size-5 md:size-6" />
            </div>
          </div>
          <div className="hidden text-xs lg:text-base font-medium uppercase tracking-wider dark:text-white sm:text-sm sm:col-auto sm:flex flex-col items-center justify-center">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              Account
            </span>
            <div
              className=" hover:bg-gray-100 dark:hover:bg-gray-900 p-3 rounded"
              onClick={(e) => handleSubUserModal(e, "accounts")}
            >
              <SvgUsers className="size-5 md:size-6" />
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => setIsExpand(!isExpand)}
        className="w-full bg-gray-100 flex justify-center sm:hidden "
      >
        <SvgChevronDown
          className={classNames(
            "size-6 text-gray-500 transition-transform ease-in-out duration-300",
            {
              "rotate-180": isExpand,
            },
          )}
        />
      </div>
      {onCollapse && isMobile && (
        <AnimatePresence initial={false}>
          {isExpand && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="border-t border-dashed border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-8 sm:py-6">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default RenderSubUserInformationList;
