import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";

import { COOKIE_PREFIX } from "@/utils/constants";
import { createSlug } from "@/lib/helpers/createSlug";

const initialState = {
  recentlyViewedData: [],
};

export const getRecentlyViewedItems = createAsyncThunk(
  "recentlyViewed/getRecentlyViewedItems",
  async (_, thunkAPI) => {
    try {
      const response = JSON.parse(localStorage.getItem("recently") || "[]");

      const res = await response.recentlyViewedData.map((item: any) => {
        const slug = createSlug(item.zProductDescription);

        return {
          ...item,
          slug,
        };
      });
      console.log("res", res);
      return await res;
    } catch (error) {
      console.log("error", error);
      return thunkAPI.rejectWithValue(
        "Failed to get cart items from local storage",
      );
    }
  },
);

const recentlyViewedProductsSlice = createSlice({
  name: "recentlyViewedProducts",
  initialState,
  reducers: {
    addRecentlyViewedItems: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.recentlyViewedData.find(
        (item: { LW3ITEMCD: string }) => item.LW3ITEMCD === newItem.LW3ITEMCD,
      );

      if (existingItemIndex) {
        return;
      } else {
        // @ts-ignore
        state.recentlyViewedData.unshift(newItem);
      }
    },
    clearRecentlyView: (state) => {
      state.recentlyViewedData = [];
      localStorage.removeItem("recently"); // clear local storage
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRecentlyViewedItems.fulfilled, (state, action) => {
      state.recentlyViewedData = action.payload;
    });
  },
});

export const { addRecentlyViewedItems, clearRecentlyView } =
  recentlyViewedProductsSlice.actions;

export const selectRecentlyViewedProducts = (state: RootState) =>
  state.recentlyViewedProducts.recentlyViewedData;

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(
      `${COOKIE_PREFIX}recently_viewed_products`,
    );
    // const serializedState = JSON.parse(cookieValue);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

export const initializeRecentlyViewedState = () => {
  return loadFromLocalStorage() ?? { recentlyViewedData: [] };
};

export default recentlyViewedProductsSlice.reducer;
