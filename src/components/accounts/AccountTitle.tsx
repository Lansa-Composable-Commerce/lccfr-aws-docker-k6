import React from "react";
import { MainTitle } from "@/components/globalUI/Typography";
import SelectedAccount from "@/components/ui/SelectedAccount";
import { useTranslations } from "next-intl";

const AccountTitle = () => {
  const tAccount = useTranslations("Account");

  return (
    <div className="mt-10 mb-5">
      <div className="flex flex-col md:flex-row items-center justify-between w-full py-2 md:py-0">
        <MainTitle content={tAccount("AssociatedAccountSelection")} />
        <SelectedAccount />
      </div>
    </div>
  );
};

export default AccountTitle;
