import { apiSlice } from "@/services/apiSlice";

export const accountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccount: builder.query({
      query: (id: string) => ({
        url: `/api/accounts/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazyGetAccountQuery } = accountsApi;
