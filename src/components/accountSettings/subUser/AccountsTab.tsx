import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import { useTranslations } from "next-intl";

import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/globalUI/Button";
import ChipStatus from "@/components/globalUI/ChipStatus";
import { showToast } from "@/components/globalUI/CustomToast";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  getSubUserAssocAccounts,
  selectAssocAccountsData,
  selectIsLoadingAssocAccounts,
  selectIsLoadingUpdateAssocAccounts,
  selectSelectedSubUser,
  selectSubUserInformation,
  updateSubUserAssocAccounts,
} from "@/lib/features/subUser/subUserSlice";

import { SvgSpinner } from "@/assets/svg";

import { RenderSubUserAssociatedAccountListProps } from "@/types";

const RenderSubUserAssociatedAccountList = ({
  customerId,
  customerName,
  customerType,
  accountStatusDesc,
  isAssociated,
  onClickRow,
  item,
  isInherit,
}: RenderSubUserAssociatedAccountListProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const [isChecked, setIsChecked] = useState<boolean>(
    isInherit || item.isAssociated === "Y",
  );

  useEffect(() => {
    setIsChecked(isInherit || item.isAssociated === "Y");
  }, [item.isAssociated, isInherit]);

  const handleOnChangeAssocAccount = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onClickRow({ ...item, isAssociated: newValue ? "Y" : "N" });
  };

  return (
    <div
      className={classNames("", {
        "pb-3": !isMobile,
      })}
    >
      <div
      /*onClick={() => {
          onClickRow(item);
          handleOnChangeAssocAccount();
        }}*/
      >
        <div className=" relative grid grid-cols-5 text-xs h-auto gap-3 mx-1.5 px-2 py-2 items-center rounded-lg  sm:py-3 lg:py-3 lg:grid-cols-7 hover:shadow-transaction">
          <div className="row-span-2 lg:row-span-1">
            <div className="flex items-center justify-center w-full">
              <Checkbox
                checked={isChecked}
                onChange={handleOnChangeAssocAccount}
                aria-label={customerId}
                disabled={isInherit}
              />
            </div>
          </div>
          <div className="col-span-2  font-medium uppercase tracking-wider dark:text-white sm:text-sm text-left md:text-center flex flex-col sm:items-center sm:justify-center lg:col-span-1">
            <span className="mb-1 hidden sm:block text-gray-600 dark:text-gray-400 lg:hidden">
              type
            </span>
            <span className="w-full truncate text-center">
              {customerType ? customerType : `- -`}
            </span>
          </div>
          <div className=" font-medium uppercase tracking-wider dark:text-white sm:text-sm col-span-2 text-center">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              Account
            </span>
            {customerId}
          </div>
          <div className=" font-medium uppercase tracking-wider dark:text-white sm:text-sm col-end-4 col-span-2 lg:col-end-7  text-center">
            <span className="mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              Name
            </span>
            {customerName}
          </div>
          <div className="col-span-2 lg:col-span-1 sm:text-sm uppercase font-medium">
            <span className="text-center mb-1 block text-gray-600 dark:text-gray-400 lg:hidden">
              Status
            </span>
            <div className="flex items-center justify-center w-full">
              <ChipStatus status={accountStatusDesc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountsTab = () => {
  const tValidation = useTranslations("Validation");
  const dispatch = useAppDispatch();

  const tUsrSetting = useTranslations("UsrSetting");

  const isLoading = useAppSelector(selectIsLoadingAssocAccounts);
  const isLoadingUpdateAssocAccounts = useAppSelector(
    selectIsLoadingUpdateAssocAccounts,
  );
  const associatedAccounts = useAppSelector(selectAssocAccountsData);
  const selectedSubUser = useAppSelector(selectSelectedSubUser);
  const subUserInformation = useAppSelector(selectSubUserInformation);

  const isInherit = subUserInformation?.inheritsSuperUserAccounts === "Y";

  const [updatedAssociatedAccounts, setUpdatedAssociatedAccounts] = useState<
    any[]
  >([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const associatedAccountHeader = {
    Type: "",
    Account: "Account",
    Name: "Name",
    Status: "Status",
  };

  const updateMySubUserAssociatedAccount = async () => {
    const res = await dispatch(
      updateSubUserAssocAccounts({
        payload: updatedAssociatedAccounts,
        subuserId: selectedSubUser?.subUserId,
      }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      showToast("success", tValidation("MsgSubUserAssocAccountUpdated"));
      setUpdatedAssociatedAccounts([]);
      setIsChanged(false);
    }
  };

  const handleRowClick = (item: any) => {
    setUpdatedAssociatedAccounts((prev) => {
      const updatedItems = prev.map((prevItem) =>
        prevItem.customerId === item.customerId ? item : prevItem,
      );

      const existingItemIndex = prev.findIndex(
        (prevItem) => prevItem.customerId === item.customerId,
      );

      if (existingItemIndex === -1) {
        updatedItems.push(item);
      }
      const hasChanges =
        JSON.stringify(associatedAccounts) !== JSON.stringify(updatedItems);
      setIsChanged(hasChanges);
      return updatedItems;
    });
  };

  useEffect(() => {
    const fetchAssocAccount = async () => {
      if (selectedSubUser?.subUserId) {
        dispatch(getSubUserAssocAccounts(selectedSubUser?.subUserId));
      }
    };

    fetchAssocAccount();
  }, [selectedSubUser?.subUserId, dispatch]);

  useEffect(() => {
    setIsChanged(false);
    setUpdatedAssociatedAccounts(
      associatedAccounts.map((item) => ({ ...item })),
    );
  }, [associatedAccounts]);

  return (
    <div className="flex-1 overflow-y-auto pb-2">
      <h1 className="my-3 text-center text-xl font-medium capitalize">
        {tUsrSetting("AssociatedAccounts")}
      </h1>
      <div className="mx-2 mt-4">
        <div className="w-full mb-4">
          <div className="mx-auto w-full">
            <div
              className={classNames(
                "mx-1.5 px-2 mb-2 hidden grid-cols-3 gap-3 rounded-lg  dark:bg-light-dark lg:grid lg:grid-cols-7 uppercase shadow-transaction",
              )}
            >
              {Object.entries(associatedAccountHeader).map(([key], id) => (
                <span
                  key={id}
                  className={classNames(
                    "py-3 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-center",
                    {
                      "col-span-2 overflow-x-auto": id === 1 || id === 2,
                      "col-start-2": id === 0,
                    },
                  )}
                >
                  {tUsrSetting(key)}
                </span>
              ))}
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="w-full h-24 flex  flex-col items-center justify-center  text-center">
            <SvgSpinner />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: "50vh" }}>
            {associatedAccounts.map((item) => (
              <RenderSubUserAssociatedAccountList
                key={item.customerId}
                {...item}
                onClickRow={handleRowClick}
                item={item}
                isInherit={isInherit}
              />
            ))}
          </div>
        )}
      </div>
      {!isInherit && (
        <footer className="mt-6">
          <div className="w-full flex items-center justify-end gap-5">
            <div className="hidden lg:block w-full">&nbsp;</div>
            <Button
              size="lg"
              className="w-full lg:py-4.5 lg:max-w-xs "
              type="submit"
              disabled={isLoadingUpdateAssocAccounts || !isChanged}
              onClick={updateMySubUserAssociatedAccount}
              aria-label="save"
            >
              {isLoadingUpdateAssocAccounts ? (
                <p className="btn-text">{tUsrSetting("Saving")}...</p>
              ) : (
                <p className="btn-text">{tUsrSetting("Save")}</p>
              )}
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AccountsTab;
