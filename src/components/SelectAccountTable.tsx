"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";

import TablePagination from "@/components/ui/TablePagination";

import { COOKIE_PREFIX, ITEM_PER_PAGE } from "@/utils/constants";

import { useRouter } from "@/i18n/routing";
import { useLazyGetAccountQuery } from "@/services/accountsApi";
import SkeletonAccounts from "@/components/loading/SkeletonAccounts";
import { useTranslations } from "next-intl";
import { getUserPreferences } from "@/lib/features/userPreferences/userPreferencesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useSearchParams } from "next/navigation";
import { Account } from "@/types/Accounts";
import { selectStorefrontState } from "@/lib/features/storefront/storefrontSlice";
import ConfirmationModal from "@/components/ConfirmationModal";

interface AccountListTypes {
  id: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  onCollapse?: boolean;
  onClickRow?: () => void;
}

const RenderAccountList = ({
  id,
  name,
  address1,
  city,
  state,
  zip,
  country,
  children,
  onCollapse = false,
  onClickRow,
}: React.PropsWithChildren<AccountListTypes>) => {
  const tAccount = useTranslations("Account");

  let [isExpand, setIsExpand] = useState(false);

  return (
    <div
      className="relative py-3 mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark"
      onClick={onClickRow}
    >
      <div
        className="text-black01 relative grid h-auto cursor-pointer grid-cols-2 items-center gap-3 py-4 sm:grid-cols-3 sm:gap-6 sm:py-0 lg:py-3 lg:grid-cols-6"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="col-span-2 px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:text-sm lg:text-base sm:col-auto sm:px-8">
          <span className="text-sm text-brand mb-1 block font-medium lg:text-base dark:text-gray-400">
            {id}
          </span>
          {name}
        </div>
        <div className="px-4 text-xs font-medium uppercase tracking-wider dark:text-white sm:px-8 sm:text-base">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            {tAccount("Address 1")}
          </span>
          {address1}
        </div>
        <div className=" px-4 text-xs font-medium uppercase tracking-wider dark:text-white sm:px-8 sm:text-base lg:block text-center">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            {tAccount("State")}
          </span>
          {state}
        </div>
        <div className="px-4 text-xs font-medium uppercase tracking-wider dark:text-white sm:px-8 sm:text-base lg:block">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 lg:hidden">
            {tAccount("City")}
          </span>
          {city}
        </div>
        <div className="px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-base lg:block text-center sm:text-left lg:text-center">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 lg:hidden">
            {tAccount("Country")}
          </span>
          {country}
        </div>
        <div className="hidden px-4 text-xs font-medium uppercase tracking-wider dark:text-white sm:px-8 sm:text-base lg:block text-center">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 lg:hidden">
            {tAccount("Zip")}
          </span>
          {zip}
        </div>
      </div>
      {onCollapse && (
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
                <div className="mb-6 flex items-center justify-center rounded-lg bg-gray-100 p-3 text-center text-xs font-medium uppercase tracking-wider text-gray-900 dark:bg-gray-900 dark:text-white sm:h-13 sm:text-base"></div>
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const SelectAccountTable = ({ accounts }: { accounts: Account[] }) => {
  const dispatch = useAppDispatch();
  const tAccount = useTranslations("Account");
  const { pendingCartFlag } = useAppSelector(selectStorefrontState);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [trigger] = useLazyGetAccountQuery();

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEM_PER_PAGE;
  const endIndex = startIndex + ITEM_PER_PAGE;
  const currentItems = accounts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const openConfirmationModal = (account: Account) => {
    setSelectedAccount(account);
    setIsConfirmationModalOpen(true);
  };
  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedAccount(null);
  };

  const navigate = () => {
    if (callbackUrl === "/") {
      router.push(callbackUrl);
    } else {
      window.location.href = callbackUrl;
    }
  };

  const startSwitchAccount = async (account: Account) => {
    setIsLoading(true);

    await trigger(account.customerId);

    Cookies.set(`${COOKIE_PREFIX}accNum`, account.customerId);
    Cookies.set(`${COOKIE_PREFIX}customerName`, account.customerName);

    dispatch(getUserPreferences());

    setIsLoading(false);
    closeConfirmationModal();
    navigate();
  };

  const handleSelectAccount = async (account: Account) => {
    const cookieAccountNumber = Cookies.get(`${COOKIE_PREFIX}accNum`);

    if (!pendingCartFlag && !cookieAccountNumber) {
      await startSwitchAccount(account);
      return;
    }

    if (!pendingCartFlag && cookieAccountNumber === account.customerId) {
      navigate();
      return;
    }

    if (!pendingCartFlag && cookieAccountNumber !== account.customerId) {
      openConfirmationModal(account);
      return;
    }

    await startSwitchAccount(account);
  };

  const handleConfirm = async () => {
    if (selectedAccount) {
      await startSwitchAccount(selectedAccount);
    }
  };

  useEffect(() => {
    if (accounts && accounts.length === 1) {
      handleSelectAccount(accounts[0]).catch((err) => err);
    }
  }, [accounts]);

  if (accounts.length === 1) {
    return <SkeletonAccounts />;
  }

  return (
    <div className="w-full mb-4">
      <div className="mx-auto w-full sm:pt-8">
        <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-6 uppercase">
          <span className="px-8 py-6 text-base tracking-wider text-gray-500 dark:text-gray-300">
            {tAccount("Account")}
          </span>
          <span className="px-8 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 line-clamp-2">
            {tAccount("Address 1")}
          </span>
          <span className="px-8 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 text-center">
            {tAccount("State")}
          </span>
          <span className="hidden px-8 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block">
            {tAccount("City")}
          </span>
          <span className="hidden px-8 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-center">
            {tAccount("Country")}
          </span>
          <span className="hidden px-8 py-6 text-sm lg:text-base tracking-wider text-gray-500 dark:text-gray-300 lg:block text-center">
            {tAccount("Zip")}
          </span>
        </div>
        {currentItems.map((account) => {
          return (
            <RenderAccountList
              key={account.customerId}
              id={account.customerId}
              name={account.customerName}
              address1={account.address1}
              address2={account.address2}
              city={account.city}
              state={account.state}
              zip={account.zip}
              country={account.country}
              onClickRow={() => handleSelectAccount(account)}
            />
          );
        })}
        {accounts.length > ITEM_PER_PAGE && (
          <TablePagination
            items={accounts}
            itemsPerPage={ITEM_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        isLoading={isLoading}
        close={closeConfirmationModal}
        title={tAccount("ModalAccountSwitchTitle")}
        description={tAccount("ModalAccountSwitchDescription")}
        confirmText={tAccount("ModalAccountSwitchConfirm")}
        cancelText={tAccount("ModalAccountSwitchCancel")}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default SelectAccountTable;
