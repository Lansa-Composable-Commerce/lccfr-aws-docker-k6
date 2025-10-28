"use client";

import { useState } from "react";
import classNames from "classnames";
import { SfAccordionItem, SfIconChevronLeft } from "@storefront-ui/react";

export default function CollapsableAccordion({ tabsData }: { tabsData: [] }) {
  const [active, setActive] = useState<string | null>(null);

  const isOpen = (id: string) => id === active;

  const handleToggle = (id: string) => (open: boolean) => {
    if (open) {
      setActive(id);
    } else if (isOpen(id)) {
      setActive(null);
    }
  };

  return (
    <div className="border border-neutral-200 rounded-md divide-y text-neutral-900">
      {tabsData.map(({ id, caption, content }) => (
        <SfAccordionItem
          key={id}
          summary={
            <div className="flex justify-between p-4 font-medium hover:bg-neutral-100 active:neutral-100">
              <p>{caption}</p>
              <SfIconChevronLeft
                className={classNames("text-gray-400 size-8", {
                  "rotate-90": isOpen(id),
                  "-rotate-90": !isOpen(id),
                })}
              />
            </div>
          }
          onToggle={handleToggle(id)}
          open={isOpen(id)}
        >
          <p className="p-4">{content}</p>
        </SfAccordionItem>
      ))}
    </div>
  );
}
