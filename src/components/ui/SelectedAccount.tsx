"use client";

import AlertNeutral from "@/components/ui/Alert";
import { useAppSelector } from "@/lib/hooks";
import { selectAccount } from "@/lib/features/global/globalSlice";
import { useEffect, useState } from "react";

const SelectedAccount = () => {
  const selectedAccount = useAppSelector(selectAccount);

  const accountParse =
    selectedAccount === undefined ? "" : JSON.parse(selectedAccount).LW3CUSNAM;
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    setAccountName(accountParse);
  }, [accountParse]);

  if (!accountName) {
    return null;
  }
  return <AlertNeutral content={accountName} />;
};

export default SelectedAccount;
