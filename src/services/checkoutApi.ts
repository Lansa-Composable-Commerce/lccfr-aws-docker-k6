import { apiSlice } from "@/services/apiSlice";
import { PlaceOrderRequest } from "@/types/Checkout";

export const checkoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCheckoutDetails: builder.query({
      query: () => ({
        url: "/api/checkout",
        method: "GET",
      }),
    }),
    placeOrder: builder.mutation({
      query: (payload: PlaceOrderRequest) => ({
        url: "/api/checkout",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useGetCheckoutDetailsQuery, usePlaceOrderMutation } =
  checkoutApi;
