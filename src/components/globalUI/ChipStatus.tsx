import React from "react";
import { SfChip } from "@storefront-ui/react";
import classNames from "classnames";

import { ChipStatusProps } from "@/types";

const ChipStatus: React.FC<ChipStatusProps> = ({
  status,
  className,
  props,
}) => {
  let backgroundColorClass: string;
  let textColorClass: string;
  let statusText: string;

  const transformStatusText = status.toLowerCase();

  switch (transformStatusText) {
    case "active":
      backgroundColorClass = "brand";
      textColorClass = "text-brand";
      statusText = "Active";
      break;
    case "inactive" || "Inactive":
      backgroundColorClass = "gray-300";
      textColorClass = "text-gray-500";
      statusText = "Inactive";
      break;
    case "suspended" || "Suspended":
      backgroundColorClass = "orange-500";
      textColorClass = "text-orange-500";
      statusText = "Suspended";
      break;
    default:
      backgroundColorClass = "gray-300";
      textColorClass = "text-gray-500";
      statusText = "Unknown";
  }

  return (
    <div className={classNames("inline-flex", className)}>
      <SfChip
        className={classNames(
          `border border-${backgroundColorClass}`,
          textColorClass,
        )}
        inputProps={{
          disabled: true,
        }}
        {...props}
      >
        <span className={classNames("text-xs lg:text-sm")}>{statusText}</span>
      </SfChip>
    </div>
  );
};

export default ChipStatus;
