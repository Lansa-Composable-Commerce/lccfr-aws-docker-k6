import { apiSlice } from "@/services/apiSlice";
import { CartRequest, PromotionCode } from "@/types/Cart";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: "/api/cart",
        method: "GET",
      }),
    }),
    addToCart: builder.mutation({
      query: (cartItems: CartRequest[]) => ({
        url: "/api/cart",
        method: "POST",
        body: { cartItems, type: "add" },
      }),
    }),
    updateCartItem: builder.mutation({
      query: (cartItems: CartRequest[]) => ({
        url: "/api/cart",
        method: "POST",
        body: { cartItems, type: "update" },
      }),
    }),
    removeCartItem: builder.mutation({
      query: (column: number) => ({
        url: "/api/cart",
        method: "DELETE",
        body: column,
      }),
    }),
    removeAllCartItems: builder.mutation({
      query: () => ({
        url: "/api/cart",
        method: "DELETE",
      }),
    }),
    addPromotions: builder.mutation({
      query: (promotions: PromotionCode) => ({
        url: "/api/promotions",
        method: "PUT",
        body: promotions,
      }),
    }),
    removePromotions: builder.mutation({
      query: () => ({
        url: "/api/promotions",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useRemoveAllCartItemsMutation,
  useAddPromotionsMutation,
  useRemovePromotionsMutation,
} = cartApi;
