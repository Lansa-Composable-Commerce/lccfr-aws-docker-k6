"use client";

import React, { useState } from "react";
import classNames from "classnames";
import { SfTooltip } from "@storefront-ui/react";
import { useTranslations } from "next-intl";

import AccountSettingCard from "@/components/accountSettings/AccountSettingCard";
import RenderSubUserInformationList from "@/components/accountSettings/RenderAssociatedAccountList";
import SubUserInfoModal from "@/components/accountSettings/subUser/SubUserInfoModal";
import Button from "@/components/globalUI/Button";
import TablePagination from "@/components/ui/TablePagination";
import AddSubUserModal from "@/components/accountSettings/subUser/AddSubUserModal";

import { useAppDispatch } from "@/lib/hooks";
import {
  setAddSubUserModalVisible,
  setSelectedSubUser,
  setSubUserInfoModalVisible,
} from "@/lib/features/subUser/subUserSlice";
import { INITIAL_PAGE, ITEM_PER_PAGE } from "@/utils/constants";

import { SvgPlus, SvgUsers } from "@/assets/svg";

import { ISubUserProps, UserInfo } from "@/types";

const associatedAccountHeader = {
  SubUser: "Sub-User",
  Name: "Name",
  Email: "Email",
  Password: "Password",
  Permission: "Permission",
  Accounts: "Accounts",
};

const SubUserList = ({
  userInfo,
  subUsersInfo,
}: {
  userInfo: UserInfo;
  subUsersInfo: ISubUserProps[];
}) => {
  const usrSettings = useTranslations("UsrSetting");
  const dispatch = useAppDispatch();

  const userType: "S" | "N" | undefined | any = userInfo?.userType;

  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE);

  // pagination
  const startIndex = (currentPage - INITIAL_PAGE) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const currentItems =
    subUsersInfo && subUsersInfo?.slice(startIndex, endIndex);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const handleSubUserInfoModal = (
    e: React.MouseEvent<SVGElement>,
    name: any,
    item: any,
  ) => {
    e.stopPropagation();
    const payload = { isVisible: true, subUserTabName: name };

    dispatch(setSubUserInfoModalVisible(payload));
    dispatch(setSelectedSubUser(item));
  };

  const handleSubUserModal = (
    e: React.MouseEvent<HTMLDivElement>,
    tabName: any,
    item: any,
  ) => {
    e.stopPropagation();
    const payload = { isVisible: true, subUserTabName: tabName };
    dispatch(setSubUserInfoModalVisible(payload));
    dispatch(
      setSelectedSubUser({
        subUserId: item?.subUser,
        fullName: item?.name,
        subUserEmail: item?.email,
      }),
    );
  };

  const AddSubUSerButton = () => {
    return (
      <SfTooltip label={usrSettings("Add")}>
        <Button
          square
          variant="secondary"
          className="p-1.5 lg:p-2.5"
          onClick={() => dispatch(setAddSubUserModalVisible())}
          aria-label="add sub-user"
        >
          <SvgPlus className="size-5 lg:size-6" />
          {/*<span className="hidden lg:block">Add Sub-User</span>*/}
        </Button>
      </SfTooltip>
    );
  };

  if (userType === "N") {
    return null;
  } else {
    if (userType === "S") {
      if (subUsersInfo.length <= 0) {
        return (
          <>
            <AccountSettingCard
              title={usrSettings("SubUserInfo")}
              id="subUserInformation"
              btn={<AddSubUSerButton />}
            >
              <div className="w-full mb-4">
                <span>{usrSettings("YouHveNoSubUsers")}</span>
              </div>
            </AccountSettingCard>
            <AddSubUserModal />
          </>
        );
      } else {
        return (
          <>
            <AccountSettingCard
              title={usrSettings("SubUserInfo")}
              id="subUserInformation"
              btn={<AddSubUSerButton />}
            >
              <div className="w-full mb-4">
                <div className="mx-auto w-full">
                  <div
                    className={classNames(
                      "mb-2 hidden grid-cols-3 gap-6 rounded-lg   dark:bg-light-dark lg:grid lg:grid-cols-8 uppercase",
                    )}
                  >
                    {Object.entries(associatedAccountHeader).map(
                      ([key], id) => (
                        <span
                          key={id}
                          className={classNames(
                            "py-3 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-center lg:grid-cols-8",
                            {
                              "col-span-2 overflow-x-auto":
                                id === 1 || id === 2,
                            },
                          )}
                        >
                          {usrSettings(key)}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
              <div>
                {currentItems.map((item, id: number) => (
                  <RenderSubUserInformationList
                    key={id}
                    subUser={item.subUserId}
                    name={item.fullName}
                    email={item.subUserEmail}
                    onClickRow={
                      (e: any) => handleSubUserInfoModal(e, "details", item)
                      // handleSubUserDrawer(e, "details", item)
                    }
                    onCollapse={true}
                  >
                    <div className=" px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm sm:hidden text-center">
                      <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 lg:hidden">
                        Account
                      </span>
                      <div className="flex justify-center items-center">
                        <div
                          className=" hover:bg-gray-100 dark:hover:bg-gray-900 p-3 rounded cursor-pointer"
                          onClick={(e) =>
                            handleSubUserModal(e, "accounts", item)
                          }
                        >
                          <SvgUsers className="size-5 md:size-6" />
                        </div>
                      </div>
                    </div>
                  </RenderSubUserInformationList>
                ))}
                {subUsersInfo.length > ITEM_PER_PAGE && (
                  <TablePagination
                    items={subUsersInfo}
                    itemsPerPage={ITEM_PER_PAGE}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </AccountSettingCard>
            <SubUserInfoModal />
            <AddSubUserModal />
          </>
        );
      }
    }
  }

  return null;
};

export default SubUserList;
