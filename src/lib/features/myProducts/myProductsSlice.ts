import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";

interface ProductWithQuantity {
  // Define interface if it doesn't exist in your types.ts
  LW3ITEMCD: string;
  LW3COLQTY: number;
}

interface MyProductState {
  isLoading: boolean;
  isOpen: boolean;
  items: any;
  productItemsWithQuantity: ProductWithQuantity[];
  myProductsData: any;
}

const initialState: MyProductState = {
  isLoading: false,
  isOpen: false,
  items: [],
  productItemsWithQuantity: [],
  myProductsData: [],
};

export const getMyProducts = createAsyncThunk(
  "myProducts/getMyProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/my-products`,
      );

      return response?.data;
    } catch (error) {
      console.error("API call failed:", error);
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const myProductsSlice = createSlice({
  name: "myProducts",
  initialState,
  reducers: {
    onOpenAddItemModal: (state) => {
      state.isOpen = !state.isOpen;
    },
    onRemoveItemToMyProducts: (state, action) => {
      state.items = action.payload;
    },
    onGetSelectedItems: (state, action) => {
      state.items = action.payload;
    },
    onRemoveSelectItem: (state, action: { payload: string[] }) => {
      const itemsToRemove = action.payload;

      state.items = state.items.filter(
        (item: any) => !itemsToRemove.includes(item.LW3ITEMCD),
      );
    },
    onGetProductWithQuantity: (state, action) => {
      state.productItemsWithQuantity = action.payload;
    },
    onGetMyProducts: (state, action) => {
      state.myProductsData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMyProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMyProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.myProductsData = action.payload?.data;
    });
    builder.addCase(getMyProducts.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  onOpenAddItemModal,
  onGetSelectedItems,
  onRemoveSelectItem,
  onGetProductWithQuantity,
  onGetMyProducts,
} = myProductsSlice.actions;

export const selectIsMyProductsData = (state: RootState) =>
  state.myProducts.myProductsData;
export const selectIsLoading = (state: RootState) => state.myProducts.isLoading;
export const selectIsOpen = (state: RootState) => state.myProducts.isOpen;
export const selectIsItems = (state: RootState) => state.myProducts.items;
export const selectIsProductItemWithQuantity = (state: RootState) =>
  state.myProducts.productItemsWithQuantity;

export default myProductsSlice.reducer;
