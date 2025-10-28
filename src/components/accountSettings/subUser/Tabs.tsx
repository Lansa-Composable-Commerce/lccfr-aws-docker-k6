"use client";

import { useRef, useState, type KeyboardEvent, useEffect } from "react";
import classNames from "classnames";
import { SfButton } from "@storefront-ui/react";

import InformationTab from "@/components/accountSettings/subUser/InformationTab";
import PasswordTab from "@/components/accountSettings/subUser/PasswordTab";
import PermissionTab from "@/components/accountSettings/subUser/PermissionTab";
import AccountsTab from "@/components/accountSettings/subUser/AccountsTab";

import { useAppSelector } from "@/lib/hooks";
import { selectIsSubUserTabName } from "@/lib/features/subUser/subUserSlice";

import {
  SvgIdentification,
  SvgKey,
  SvgLockClosed,
  SvgUsers,
} from "@/assets/svg";

function getPreviousIndex(current: number, elements: HTMLButtonElement[]) {
  for (let index = current - 1; index >= 0; index -= 1) {
    if (!elements[index].disabled) {
      return index;
    }
  }
  for (let index = elements.length - 1; index > -1; index -= 1) {
    if (!elements[index].disabled) {
      return index;
    }
  }
  return current;
}

function getNextIndex(current: number, elements: HTMLButtonElement[]) {
  for (let index = current + 1; index < elements.length; index += 1) {
    if (!elements[index].disabled) {
      return index;
    }
  }
  for (let index = 0; index < elements.length; index += 1) {
    if (!elements[index].disabled) {
      return index;
    }
  }
  return current;
}

interface Tab {
  name: string;
  label: any;
  component: any;
  disabled?: boolean;
}

const tabs: Tab[] = [
  {
    name: "details",
    label: <SvgIdentification className="size-5 lg:size-6" />,
    component: <InformationTab />,
  },
  {
    name: "password",
    label: <SvgLockClosed className="size-5 lg:size-6" />,
    component: <PasswordTab />,
  },
  {
    name: "permission",
    label: <SvgKey className="size-5 lg:size-6" />,
    component: <PermissionTab />,
  },
  {
    name: "accounts",
    label: <SvgUsers className="size-5 lg:size-6" />,
    component: <AccountsTab />,
  },
];

export default function Tabs() {
  const tablistRef = useRef<HTMLDivElement>(null);

  const tabName = useAppSelector(selectIsSubUserTabName);

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);

  useEffect(() => {
    const matchingTab = tabs.find((tab) => tab.name === tabName);
    if (matchingTab) {
      setActiveTab(matchingTab);
    }
  }, [tabName]);

  const isActive = (tab: Tab) => activeTab.name === tab.name;
  const tabId = (name: string) => `${name}-tab`; // Use name as id
  const panelId = (name: string) => `${name}-panel`; // Use name as id

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const elements = Array.from(
      tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ||
        [],
    );
    const current = elements.findIndex((el) => event.currentTarget === el);
    const nextTab = getNextIndex(current, elements);
    const prevTab = getPreviousIndex(current, elements);
    const lastTab = elements.length - 1;

    const goTo = (index: number) => () => {
      event.stopPropagation();
      event.preventDefault();
      const goToElement = elements[index];
      goToElement.focus();
      goToElement.click();
      goToElement.scrollIntoView();
    };

    const interactionsMap = new Map([
      ["ArrowLeft", goTo(prevTab)],
      ["ArrowRight", goTo(nextTab)],
      ["Home", goTo(0)],
      ["End", goTo(lastTab)],
    ]);

    const interaction = interactionsMap.get(event.key);
    interaction?.();
  };

  const handleClick = (tab: Tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Select tab"
        aria-orientation="horizontal"
        className="mt-4 w-full min-h-12 flex gap-2 border-b border-b-neutral-200 pb-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {tabs.map((tab) => (
          <SfButton
            key={tab.name}
            type="button"
            role="tab"
            variant="tertiary"
            value="button"
            id={tabId(tab.name)}
            aria-controls={panelId(tab.name)}
            aria-selected={isActive(tab)}
            disabled={tab.disabled}
            tabIndex={isActive(tab) ? 0 : -1}
            onClick={() => handleClick(tab)}
            onKeyDown={handleKeyDown}
            className={classNames(
              "w-full text-center flex items-center justify-center p-1.5 lg:p-3 rounded-md font-medium whitespace-nowrap text-neutral-500 hover:enabled:bg-brand/30 hover:enabled:text-primary-800 active:enabled:bg-brand/30 active:enabled:text-primary-900 disabled:text-disabled-500 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:shadow-[inset_0_0_0_4px_rgb(255,255,255)]",
              {
                "!bg-brand/30 text-primary-800 dark:text-gray02": isActive(tab),
              },
            )}
          >
            <span className="hidden">{tab.name}</span>
            <span className="text-center">{tab.label}</span>
          </SfButton>
        ))}
      </div>
      <div style={{ maxHeight: "calc(100vh - 100px)" }}>
        {tabs.map((tab) => (
          <div
            key={tab.name}
            role="tabpanel"
            id={panelId(tab.name)}
            aria-labelledby={tabId(tab.name)}
          >
            {isActive(tab) && tab.component}
          </div>
        ))}
      </div>
    </>
  );
}
