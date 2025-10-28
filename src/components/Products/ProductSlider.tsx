"use client";

import React from "react";
import { SfScrollable } from "@storefront-ui/react";
import classNames from "classnames";

import ProductCard from "@/components/Products/ProductCard";
import Button from "@/components/globalUI/Button";

import { SvgArrowLeft, SvgArrowRight } from "@/assets/svg";

import { ProductTypes } from "@/types";

function ButtonPrev({ disabled, ...attributes }: { disabled?: boolean }) {
  return (
    <Button
      className={classNames(
        "absolute !rounded-full z-10 left-4 hidden md:block",
        {
          "!hidden": disabled,
        },
      )}
      variant="primary"
      size="lg"
      aria-label="Previous"
      square
      {...attributes}
    >
      <SvgArrowLeft className="text-white size-5" />
    </Button>
  );
}

function ButtonNext({ disabled, ...attributes }: { disabled?: boolean }) {
  return (
    <Button
      className={classNames(
        "absolute !rounded-full z-0 right-4 hidden md:block",
        {
          "!hidden": disabled,
        },
      )}
      variant="primary"
      size="lg"
      aria-label="Next"
      square
      {...attributes}
    >
      <SvgArrowRight className="text-white size-6" />
    </Button>
  );
}

/*function ProductCard({ product }: { product: ProductTypes }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectIsSwitchToB2B = useAppSelector(selectIsOnB2B);

  const tMessages = useTranslations("Messages");

  const [addToCart] = useAddToCartMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);

  const imgSrc = product?.LW3IMAGE
    ? `${BASE_IMAGE_URL}${product?.LW3IMAGE}`
    : SvgNoImage;

  const isAddToCartDisabled =
    product?.buyerType === BUYER_TYPE ? false : !product?.W_AVLQTY;

  const goToProductDetails = () => {
    router.push(
      `${STOREFRONT_ROUTES.PRODUCTS}/${createSlug(product?.LW3ITEMCD)}`,
    );
    dispatch(addRecentlyViewedItems(product));
    dispatch(setItemCode(product?.LW3ITEMCD));
    dispatch(onRemoveCateg());
    dispatch(onRemoveSubCateg());
  };

  const handleValueChange = (newValue: number) => setCount(newValue);

  const handleUpdateCart = async (product: ProductTypes) => {
    setIsLoading(true);
    const { LW3ITEMCD } = product;
    const response = await addToCart([
      {
        productCode: LW3ITEMCD,
        quantity: count,
      },
    ]);

    setCount(1);
    if (response && response.data) {
      const { messages } = response.data;
      showToast("success", tMessages(messages[0].code));
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="product-card relative hover:shadow-large dark:bg-light-dark">
        <div className={classNames("flex w-full h-full flex-col gap-2")}>
          <div className={classNames(" h-full group relative w-full")}>
            <div
              onClick={goToProductDetails}
              className="relative flex justify-center w-full h-full max-h-[315px]"
            >
              <Image
                src={imgSrc}
                width={267}
                height={315}
                className={classNames("lg:max-w-[300px]")}
                style={{ objectFit: "contain" }}
                alt="product-image"
                priority
              />
            </div>
            <div className="relative -top-10 md:-top-16 flex items-center justify-center group">
              <div className="absolute hidden group-hover:block">
                <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-x-3 gap-y-1 lg:gap-y-2">
                  <ProductCardQuantitySelector
                    min={1}
                    max={99999}
                    value={count}
                    onValueChange={handleValueChange}
                    productInStock={isAddToCartDisabled}
                  />
                  <div>
                    <Button
                      className="rounded-md lg:rounded-lg uppercase"
                      onClick={() => handleUpdateCart(product)}
                      disabled={isLoading || isAddToCartDisabled}
                    >
                      <SvgCart className="size-5 block lg:hidden" />
                      <p className="text-base tracking-wide font-medium  hidden lg:block">
                        {isLoading ? "Adding..." : "Add to cart"}
                      </p>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-full flex flex-col justify-start  gap-5 md:flex-row lg:py-0">
            <div
              onClick={goToProductDetails}
              className="w-full flex flex-col justify-start lg:justify-center text-left h-full"
            >
              <div className="w-full h-[50px]">
                <p className="text-sm text-left font-medium text-black01 line-clamp-2 lg:text-base dark:text-white03">
                  {product?.LW3IDESC || (
                    <span className="text-medium ">(- -)</span>
                  )}{" "}
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {product?.LW3ITEMCD}
                  </span>
                </p>
              </div>
              <div className="w-full flex items-center">
                <p className="w-full text-base font-medium lg:text-xl text-brand dark:text-primary-300">
                  {product?.D_LPRICE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}*/

export default function ProductSlider({
  products,
  sectionName,
}: {
  products: any;
  sectionName: string;
}) {
  return (
    <SfScrollable
      className="px-3 m-auto py-6 items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      buttons-placement="floating"
      drag
      slotPreviousButton={<ButtonPrev />}
      slotNextButton={<ButtonNext />}
    >
      {products &&
        products.map((product: ProductTypes, id: number) => (
          <div className="shrink-0 lg:w-[288px]" key={id}>
            <ProductCard
              product={product}
              sectionName={sectionName}
              hideFavBtn
            />
          </div>
        ))}
    </SfScrollable>
  );
}
