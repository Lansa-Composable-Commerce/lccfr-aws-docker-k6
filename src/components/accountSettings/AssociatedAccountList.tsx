"use client";

import React from "react";
import classNames from "classnames";
import { IAccountProps, IRenderAssociatedAccountList } from "@/types";
import { useMediaQuery } from "react-responsive";
import { useTranslations } from "next-intl";

const RenderAssociatedAccountList = ({
  customerNumber,
  customerName,
  customerType,
  onClickRow,
}: React.PropsWithChildren<IRenderAssociatedAccountList>) => {
  const usrSettings = useTranslations("UsrSetting");

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <div
      className={classNames("", {
        "": !isMobile,
      })}
    >
      <div onClick={onClickRow}>
        <div className="associated-account-card-data-wrapper">
          <div className="associated-account-card-data">
            <span className="associated-account-card-data-span">
              {usrSettings("Account")}
            </span>
            {customerNumber || "- -"}
          </div>
          <div className="associated-account-card-data">
            <span className="associated-account-card-data-span">
              {usrSettings("Name")}
            </span>
            {customerName || "- -"}
          </div>
          <div className="associated-account-card-data text-center col-span-2 sm:col-auto">
            <span className="associated-account-card-data-span">
              {usrSettings("Type")}
            </span>
            {customerType || "- -"}
          </div>
        </div>
      </div>
    </div>
  );
};

const AssociatedAccountList = ({ accounts }: { accounts: IAccountProps[] }) => {
  const usrSettings = useTranslations("UsrSetting");

  return (
    <section>
      <div className="w-full mb-4">
        <div className="mx-auto w-full">
          <div className={classNames("associated-account-card")}>
            <span className="associated-account-card-header">
              {usrSettings("Account")}
            </span>
            <span className="associated-account-card-header">
              {usrSettings("Name")}
            </span>
            <span className="associated-account-card-header">
              {usrSettings("Type")}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-y-2">
        {accounts &&
          accounts.map((account: IAccountProps, id: number) => (
            <RenderAssociatedAccountList
              key={id}
              customerNumber={account.customerNumber}
              customerName={account.customerName}
              customerType={account.customerType}
            />
          ))}
      </div>
    </section>
  );
};

export default AssociatedAccountList;
