import React from "react";
import classNames from "classnames";

interface FavoriteHeartButtonProps {
  onClick: () => void;
  productData: { W_FLAGP?: string } | undefined; // Define the type for productData
  noBorder?: boolean;
}

const ProductDetailsFavHeartButton: React.FC<FavoriteHeartButtonProps> = ({
  onClick,
  productData,
  noBorder = false,
}) => {
  return (
    <div
      className={classNames(
        `h-full p-2 md:p-2.5 lg:p-4 rounded-lg md:rounded-[0.938rem] cursor-pointer hover:bg-brand/20 border border-primary-500`,
        noBorder && `border-none`,
      )}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // width={31}
        // height={26}
        className="w-8 h-7 lg:w-8 lg:h-7"
        fill={productData?.W_FLAGP !== "Y" ? `#228b22` : `none`}
      >
        <path
          stroke={productData?.W_FLAGP !== "Y" ? `#228b22` : `#228b22`}
          strokeWidth={1.5}
          d="M15.53 25.072c-26.665-14.739-7.999-30.739 0-20.621 8.001-10.118 26.668 5.882 0 20.621Z"
        />
      </svg>
    </div>
  );
};

export default ProductDetailsFavHeartButton;
