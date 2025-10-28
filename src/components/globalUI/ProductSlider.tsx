import React from "react";
import { SfButton, SfScrollable } from "@storefront-ui/react";
import classNames from "classnames";

import { SvgChevronLeft, SvgChevronRight } from "@/assets/svg";

interface ProductSliderProps {
  children: React.ReactNode;
}

function ButtonPrev({ disabled, ...attributes }: { disabled?: boolean }) {
  return (
    <SfButton
      className={classNames(
        "absolute !rounded-full z-10 left-4 bg-white hidden md:block",
        {
          "!hidden": disabled,
        },
      )}
      variant="secondary"
      size="sm"
      square
      {...attributes}
      aria-label="Previous"
    >
      <SvgChevronLeft />
    </SfButton>
  );
}

function ButtonNext({ disabled, ...attributes }: { disabled?: boolean }) {
  return (
    <SfButton
      className={classNames(
        "absolute !rounded-full z-10 right-4 bg-white hidden md:block",
        {
          "!hidden": disabled,
        },
      )}
      variant="secondary"
      size="sm"
      square
      {...attributes}
      aria-label="Next"
    >
      <SvgChevronRight />
    </SfButton>
  );
}

const ProductSlider: React.FC<ProductSliderProps> = ({ children }) => {
  return (
    <SfScrollable
      className="m-auto py-4 items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      buttons-placement="floating"
      drag
      slotPreviousButton={<ButtonPrev />}
      slotNextButton={<ButtonNext />}
    >
      {children}
    </SfScrollable>
  );
};

export default ProductSlider;
