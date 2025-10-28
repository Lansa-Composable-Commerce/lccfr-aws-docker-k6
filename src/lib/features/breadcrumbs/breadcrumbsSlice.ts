import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";
import { COOKIE_PREFIX } from "@/utils/constants";
import { createSlug } from "@/lib/helpers/createSlug";

export interface BreadCrumbsState {
  category: string | null | false;
  subCategory: string | null | false;
}

const initialState: BreadCrumbsState = {
  category: "",
  subCategory: "",
};

export const breadcrumbSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    onGetCateg: (state, action) => {
      state.category = createSlug(action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `${COOKIE_PREFIX}product_category`,
          `"${createSlug(action.payload)}"`,
        );
      }
    },
    onGetSubCateg: (state, action) => {
      state.subCategory = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `${COOKIE_PREFIX}product_sub_category`,
          `"${action.payload}"`,
        );
      }
    },
    onRemoveCateg: (state) => {
      state.category = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem(`${COOKIE_PREFIX}product_category`);
      }
    },
    onRemoveSubCateg: (state) => {
      state.subCategory = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem(`${COOKIE_PREFIX}product_sub_category`);
      }
    },
  },
  extraReducers: () => {},
});

export const { onGetCateg, onGetSubCateg, onRemoveCateg, onRemoveSubCateg } =
  breadcrumbSlice.actions;

export const selectCateg = (state: RootState) => state.breadcrumbs.category;
export const selectSubCateg = (state: RootState) =>
  state.breadcrumbs.subCategory;

export default breadcrumbSlice.reducer;
