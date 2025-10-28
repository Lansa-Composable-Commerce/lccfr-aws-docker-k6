import { useTranslations } from "next-intl";

import CategoryFilter from "@/components/ui/FiltersCategories";
import ProductList from "@/components/Products/ProductList";

const ProductsWrapper = ({ productByCategory, showCount }: any) => {
  const tProducts = useTranslations("Products");

  return (
    <>
      <div className="flex flex-row gap-6">
        {/*left section*/}
        <div className="hidden pr-3 border-r border-dashed w-full flex-none max-w-[200px] xl:block xl:max-w-[300px] dark:border-slate-700">
          <CategoryFilter
            label={tProducts("Categories")}
            categoryData={productByCategory}
          />
        </div>
        {/*right section*/}
        <div className="grow w-full h-full">
          <ProductList
            productList={productByCategory?.data?.products}
            showCount={showCount}
          />
        </div>
      </div>
    </>
  );
};

export default ProductsWrapper;
