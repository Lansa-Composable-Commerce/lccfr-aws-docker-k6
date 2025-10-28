import { API } from "@/utils/constants";

import { axiosInstance } from "@/lib/helpers/axiosInstance";
import { ProductTypes } from "@/types";

export async function getProducts(querySearch: string, sort: any) {
  try {
    const axios = axiosInstance();

    const response = await axios(`${API.PRODUCTS}?search=${querySearch}`);

    // Extract products from the response, defaulting to an empty array if null/undefined
    let products = response.data?.products || [];

    if (response?.data?.messages) {
      const messages = response.data.messages;
      const errorMessages = messages
        .filter((message: any) => message.type === "error")
        .map((message: any) => `${message.message}`);

      if (errorMessages.length > 0) {
        return {
          success: false,
          data: {
            products: [],
            filters: [],
          },
          messages: errorMessages.join(", "),
        };
      }
    }

    // Enhanced sortFunctions with ascending/descending options for all fields
    const sortFunctions: any = {
      productID: (a: any, b: any) => a.LW3ITEMCD.localeCompare(b.LW3ITEMCD),
      "lowest-price": (a: any, b: any) => a.LW3LPRICE - b.LW3LPRICE,
      "highest-price": (a: any, b: any) => b.LW3LPRICE - a.LW3LPRICE,
      description: (a: any, b: any) => a.LW3IDESC.localeCompare(b.LW3IDESC),
    };

    const sortKey = sort || "productID";

    if (sortFunctions[sortKey]) {
      products.sort(sortFunctions[sortKey]);
    } else {
      console.warn(
        `Invalid sort parameter: ${sort}. Sorting by product ID (ascending).`,
      );
      products.sort(sortFunctions["productID"]); // Ensure a default sort even with an invalid parameter
    }

    const newProducts = products.map((product: ProductTypes) => ({
      ...product,
      buyerType: "B2B",
    }));

    // Return the API response data, including products, filters, and hand options
    return {
      success: true,
      data: {
        products: newProducts,
        filters: response.data?.filters || [],
      },
      messages: "",
    };
  } catch (error: any) {
    console.log("error", error?.response?.data?.error?.messages.toString());
    return {
      success: false,
      data: {
        products: [],
        filters: [],
      },
      messages: error?.response?.data?.error?.messages.toString(),
    };
  }
}
