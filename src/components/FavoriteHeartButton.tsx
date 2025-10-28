import React from "react";
import { SfTooltip } from "@storefront-ui/react";
import { useTranslations } from "next-intl";

import Button from "@/components/globalUI/Button";

import Spinner from "@/components/loading/Spinner";

interface FavoriteHeartButtonProps {
  onClick: () => void;
  productData: { W_FLAGP?: string } | undefined;
  noBorder?: boolean;
  isLoading?: boolean;
}

const FavoriteHeartButton: React.FC<FavoriteHeartButtonProps> = ({
  onClick,
  productData,
  isLoading,
}) => {
  const tProducts = useTranslations("Products");

  return (
    <SfTooltip
      label={
        productData?.W_FLAGP !== "Y"
          ? tProducts("RmvFromFavorites")
          : tProducts("AddToFav")
      }
    >
      <Button
        square
        aria-label={tProducts("AddToFav")}
        variant="secondary"
        className="h-full rounded-md md:rounded-lg uppercase p-0 translate-05 max-h-[40px]"
        onClick={onClick}
      >
        {isLoading ? (
          <Spinner className="size-5 md:size-6 fill-primary-700" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={productData?.W_FLAGP !== "Y" ? `#228b22` : `none`}
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke={productData?.W_FLAGP !== "Y" ? `#228b22` : `#228b22`}
            className="size-5 md:size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        )}
      </Button>
    </SfTooltip>
  );
};

export default FavoriteHeartButton;
