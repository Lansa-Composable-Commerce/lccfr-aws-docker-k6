"use client";

import React, { useRef, useState, type KeyboardEvent } from "react";
import classNames from "classnames";
import HTMLClientParser from "@/components/HTMLClientParser";

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
  id: number;
  caption: string;
  content: string;
}

interface TabProps {
  tabs: Tab[];
  cn?: string;
  children?: React.ReactNode;
  className?: any;
}

export default function TabsBasic({ tabs, cn, className }: TabProps) {
  const tablistRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const isActive = (tab: Tab) => activeTab.caption === tab.caption;
  const tabId = (label: string) => `${label}-tab`;
  const panelId = (label: string) => `${label}-panel`;

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

  return (
    <div className="flex flex-col w-full h-full">
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Select tab"
        aria-orientation="horizontal"
        className="flex md:justify-center items-center h-full pb-7 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {tabs.map((tab) => (
          <button
            key={tab.caption}
            type="button"
            role="tab"
            id={tabId(tab.caption)}
            aria-controls={panelId(tab.caption)}
            aria-selected={isActive(tab)}
            tabIndex={isActive(tab) ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={handleKeyDown}
            className={classNames(
              "px-4 py-2 capitalize rounded-md whitespace-nowrap text-gray01 hover:enabled:bg-brand/50 hover:enabled:text-primary-800 active:enabled:bg-brand/50 active:enabled:text-primary-900 disabled:text-disabled-500 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:shadow-[inset_0_0_0_4px_rgb(255,255,255)]",
              { "!bg-brand/20 !text-brand shadow-md": isActive(tab) },
              cn,
            )}
          >
            {tab.caption}
          </button>
        ))}
      </div>
      <div className={`${className}`}>
        {tabs.map((tab) => (
          <div
            key={tab.caption}
            role="tabpanel"
            id={panelId(tab.caption)}
            aria-labelledby={tabId(tab.caption)}
          >
            {isActive(tab) && <HTMLClientParser content={tab.content} />}
          </div>
        ))}
      </div>
    </div>
  );
}
