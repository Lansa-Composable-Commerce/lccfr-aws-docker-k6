import { apiSlice } from "@/services/apiSlice";

export const locationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    states: builder.query({
      query: (country: string) => `/api/states/${country}`,
    }),
  }),
});

export const { useStatesQuery } = locationsApi;
