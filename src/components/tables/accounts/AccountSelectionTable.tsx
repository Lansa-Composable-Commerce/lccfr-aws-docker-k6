"use client";

import React, { useMemo } from "react";

import MainTable from "@/components/globalUI/MainTable";

import { accountColumns } from "@/app/[locale]/(pages)/(page-route)/accounts/columns";

import { getAccount } from "@/api/account";
import Cookies from "js-cookie";
import { COOKIE_PREFIX } from "@/utils/constants";
import { useRouter } from "@/i18n/routing";

const AccountSelectionTable = ({ accounts }: any) => {
  const router = useRouter();
  const memoizedAccountsData = useMemo(() => accountColumns, [accountColumns]);

  const onClickRow = async (value: any) => {
    await getAccount(value.LW3JDEC01);
    Cookies.set(`${COOKIE_PREFIX}accNum`, value.LW3JDEC01);

    router.push("/");
  };

  return (
    <div className="mb-10">
      <div className="w-full flex justify-end mb-4">
        {/*<div className="w-full lg:w-1/3">
          <SearchInput />
        </div>*/}
      </div>
      <MainTable
        label="List of Accounts"
        noDataLabel="No associated accounts available."
        tableData={accounts}
        columns={memoizedAccountsData}
        onClickRow={(e: any) => onClickRow(e)}
      />
    </div>
  );
};

export default AccountSelectionTable;
