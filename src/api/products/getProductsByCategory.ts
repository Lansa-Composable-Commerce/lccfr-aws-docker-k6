import { API } from "@/utils/constants";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { ProductTypes } from "@/types";

export async function getProductsByCategory(urlParams: string, sort: any) {
  try {
    // Create an instance of Axios
    const axios = axiosInstance();

    // Fetch products by category from the API
    const res = await axios(`${API.PRODUCTS_BY_CATEGORY}/${urlParams}`);

    // Extract products from the response, defaulting to an empty array if null/undefined
    let products = res.data?.products || [];

    // Remove duplicate products based on LW3ITEMCD
    const uniqueProducts = products.reduce(
      (acc: ProductTypes[], current: any) => {
        const existingProduct = acc.find(
          (product) => product.LW3ITEMCD === current.LW3ITEMCD,
        );
        if (!existingProduct) {
          acc.push(current);
        }
        return acc;
      },
      [],
    );

    // Initialize counters for left and right-handed products
    let leftHandCount = 0;
    let rightHandCount = 0;

    // Iterate through products to count left and right-handed options
    uniqueProducts.forEach(
      (product: { W_LEFTHND: string; W_RGHTHND: string }) => {
        if (product.W_LEFTHND) {
          leftHandCount++;
        }

        if (product.W_RGHTHND) {
          rightHandCount++;
        }
      },
    );

    // Enhanced sortFunctions with ascending/descending options for all fields
    const sortFunctions: any = {
      productID: (a: any, b: any) => a.LW3ITEMCD.localeCompare(b.LW3ITEMCD),
      /*      "productID-desc": (a: any, b: any) =>
        b.LW3ITEMCD.localeCompare(a.LW3ITEMCD),*/
      "lowest-price": (a: any, b: any) => a.LW3LPRICE - b.LW3LPRICE,
      "highest-price": (a: any, b: any) => b.LW3LPRICE - a.LW3LPRICE,
      description: (a: any, b: any) => a.LW3IDESC.localeCompare(b.LW3IDESC),
      /*     "description-desc": (a: any, b: any) =>
        b.LW3IDESC.localeCompare(a.LW3IDESC),*/
    };

    const sortKey = sort || "productID";

    if (sortFunctions[sortKey]) {
      uniqueProducts.sort(sortFunctions[sortKey]);
    } else {
      console.warn(
        `Invalid sort parameter: ${sort}. Sorting by product ID (ascending).`,
      );
      uniqueProducts.sort(sortFunctions["productID-asc"]); // Ensure a default sort even with an invalid parameter
    }

    const newProducts = uniqueProducts.map((product: ProductTypes) => ({
      ...product,
      buyerType: "B2B",
    }));

    // Return the API response data, including products, filters, and hand options
    return {
      success: true,
      data: {
        products: newProducts,
        filters: res.data?.filters || [],
      },
      messages: "",
    };
  } catch (error: any) {
    // Log the error message to the console
    console.log("error", error?.response?.data?.error?.messages.toString());
    // Return an error response with empty data and the error message
    return {
      success: false,
      data: {
        products: [],
        filters: [],
      },
      messages:
        error?.response?.data?.error?.messages.toString() ||
        "An error occurred.",
    };
  }
}
