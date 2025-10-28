import axios from "axios";

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { COOKIE_PREFIX } from "@/utils/constants";

type productTypes = {
  productData: any[];
  isLoading: boolean;
  optionHand: boolean;
  optionHandText: string;
  optionsLoft: any[];
  itemCode: string;
  categoryName: string;
  messages: [];
  bestSellerRecommendData: {
    bestsellers: any[];
    recommended: any[];
  };
  status: "success" | "error";
};

const initialState: productTypes = {
  productData: [],
  isLoading: false,
  optionHand: false,
  optionHandText: "",
  optionsLoft: [],
  itemCode: "",
  categoryName: "",
  messages: [],
  bestSellerRecommendData: {
    bestsellers: [],
    recommended: [],
  },
  status: "success",
};

export const addProductToFavorite = createAsyncThunk(
  "products/addProductToFavorite",
  async (payload: String[], thunkAPI) => {
    try {
      const data = {
        productListBodyArray: payload,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/add-to-favorite`,
        data,
      );

      return response?.data;
    } catch (error: any) {
      console.error("API call failed:", error);
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error?.response?.data?.errors,
      });
    }
  },
);

export const removeProductToFavorite = createAsyncThunk(
  "products/removeProductToFavorite",
  async (payload: string, thunkAPI) => {
    try {
      const config = {
        params: {
          item: payload,
        },
      };

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/remove-to-favorite`,
        config,
      );

      return response?.data;
    } catch (error: any) {
      console.error("API call failed:", error);
      return thunkAPI.rejectWithValue({
        success: false,
        data: error?.response?.data?.data,
        errors: error?.response?.data?.data?.messages[0].message,
      });
    }
  },
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    onSetHandOption: (state, action: PayloadAction<string>) => {
      state.optionHand = action.payload === "Left Hand";
      state.optionHandText = action.payload;
    },
    onSetLoftOption: (state, action: any) => {
      state.optionsLoft = action.payload;
    },
    setItemCode: (state, action: PayloadAction<string>) => {
      state.itemCode = action.payload;
      localStorage.setItem(
        `${COOKIE_PREFIX}select_product_item_code`,
        action.payload,
      );
    },
    onRemoveHandSideChip: (state) => {
      state.optionHandText = "";
    },
    onRemoveOptionLoft: (state) => {
      state.optionsLoft = [];
    },
    filterByCategory: (state, action) => {
      state.categoryName = action?.payload;
    },
    removeFilterCategory: (state) => {
      state.categoryName = "";
    },
    removeSuccessMessage: (state) => {
      state.messages = [];
    },
    getProductBestSellerAndRecommended: (state, action) => {
      state.bestSellerRecommendData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProductToFavorite.pending, (state) => {
      state.messages = [];
      state.isLoading = true;
    });
    builder.addCase(addProductToFavorite.fulfilled, (state, action) => {
      state.status = "success";
      state.messages = action?.payload?.data?.messages;
      state.isLoading = false;
    });
    builder.addCase(addProductToFavorite.rejected, (state) => {
      state.messages = [];
      state.isLoading = false;
    });
    builder.addCase(removeProductToFavorite.pending, (state) => {
      state.isLoading = true;
      state.messages = [];
    });
    builder.addCase(removeProductToFavorite.fulfilled, (state, action) => {
      state.isLoading = false;
      state.status = "success";
      state.messages = action?.payload?.data?.messages;
    });
    builder.addCase(removeProductToFavorite.rejected, (state, action: any) => {
      state.isLoading = false;
      state.status = "error";
      state.messages = action?.payload?.data?.messages;
      console.log("rejected)", action.payload);
    });
  },
});

export const {
  onSetHandOption,
  onSetLoftOption,
  setItemCode,
  onRemoveHandSideChip,
  onRemoveOptionLoft,
  filterByCategory,
  removeFilterCategory,
  removeSuccessMessage,
  getProductBestSellerAndRecommended,
} = productsSlice.actions;

export const selectIsLoading = (state: RootState) => state.products.isLoading;
export const selectCategoryName = (state: RootState) =>
  state.products.categoryName;
export const selectOptionHand = (state: RootState) => state.products.optionHand;
export const selectOptionHandText = (state: RootState) =>
  state.products.optionHandText;
export const selectOptionLoft = (state: RootState) =>
  state.products.optionsLoft;
export const selectIsFavoritesMessages = (state: RootState) =>
  state.products.messages;
export const selectIsStatus = (state: RootState) => state.products.status;
export const selectProductBestSellerAndRecommended = (state: RootState) =>
  state.products.bestSellerRecommendData;

export default productsSlice.reducer;
