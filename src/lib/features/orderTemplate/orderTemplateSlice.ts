import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";
import { SavedOrderResponseTypes } from "@/types";

interface OrderTemplateState {
  isLoading: {
    removeSavedOrder: boolean;
    saveOrder: boolean;
    addToCart: boolean;
  };
  status: "idle" | "pending" | "success" | "error";
  orderTemplateMessages: [];
  isRemoveModalVisible: boolean;
  savedOrderNumber: number;
  isSaveOrderModalVisible: boolean;
  savedOrderData: SavedOrderResponseTypes[];
}

const initialState: OrderTemplateState = {
  isLoading: {
    removeSavedOrder: false,
    saveOrder: false,
    addToCart: false,
  },
  status: "idle",
  orderTemplateMessages: [],
  isRemoveModalVisible: false,
  savedOrderNumber: 0,
  isSaveOrderModalVisible: false,
  savedOrderData: [],
};

export const removeSavedOrder = createAsyncThunk(
  "orderTemplate/removeSavedOrder",
  async (payload: number, thunkAPI) => {
    try {
      const config = {
        params: {
          id: payload,
        },
      };
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/remove-saved-order`,
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

export const saveNewOrderTemplate = createAsyncThunk(
  "orderTemplate/saveNewOrderTemplate",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/save-new-order-template`,
        payload,
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

export const addToCartSavedOrder = createAsyncThunk(
  "orderTemplate/addToCartSavedOrder",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/saved-order-to-cart`,
        payload,
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

export const updateSavedOrder = createAsyncThunk(
  "orderTemplate/updateSavedOrder",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/update-saved-order`,
        payload,
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

export const orderTemplateSlice = createSlice({
  name: "orderTemplate",
  initialState,
  reducers: {
    setRemoveModalVisible: (state) => {
      state.isRemoveModalVisible = !state.isRemoveModalVisible;
    },
    getSavedOrderNumber: (state, action) => {
      state.savedOrderNumber = action.payload;
    },
    setRemoveMessages: (state) => {
      state.orderTemplateMessages = [];
    },
    setSaveOrderModalVisible: (state) => {
      state.isSaveOrderModalVisible = !state.isSaveOrderModalVisible;
    },
    setOrderTemplateData: (state, action) => {
      state.savedOrderData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeSavedOrder.pending, (state) => {
      state.isLoading.removeSavedOrder = true;
    });
    builder.addCase(removeSavedOrder.fulfilled, (state, action) => {
      state.orderTemplateMessages = action?.payload?.data?.messages;
      state.status = "success";
      state.isLoading.removeSavedOrder = false;
    });
    builder.addCase(removeSavedOrder.rejected, (state) => {
      state.isLoading.removeSavedOrder = false;
    });
    builder.addCase(saveNewOrderTemplate.pending, (state) => {
      state.status = "idle";
      state.isLoading.saveOrder = true;
    });
    builder.addCase(saveNewOrderTemplate.fulfilled, (state, action) => {
      state.orderTemplateMessages = action?.payload?.data?.messages;
      state.status = "success";
      state.isLoading.saveOrder = false;
    });
    builder.addCase(saveNewOrderTemplate.rejected, (state) => {
      state.isLoading.saveOrder = false;
      state.status = "error";
    });
    builder.addCase(addToCartSavedOrder.pending, (state) => {
      state.status = "idle";
      state.isLoading.addToCart = true;
    });
    builder.addCase(addToCartSavedOrder.fulfilled, (state, action) => {
      state.status = "success";
      state.isLoading.addToCart = false;
    });
    builder.addCase(addToCartSavedOrder.rejected, (state) => {
      state.isLoading.addToCart = false;
      state.status = "error";
    });
    builder.addCase(updateSavedOrder.pending, (state) => {
      state.status = "idle";
      state.isLoading.saveOrder = true;
    });
    builder.addCase(updateSavedOrder.fulfilled, (state, action) => {
      state.orderTemplateMessages = action?.payload?.data?.messages;
      state.status = "success";
      state.isLoading.saveOrder = false;
    });
    builder.addCase(updateSavedOrder.rejected, (state) => {
      state.isLoading.saveOrder = false;
      state.status = "error";
    });
  },
});

export const {
  setRemoveModalVisible,
  getSavedOrderNumber,
  setRemoveMessages,
  setSaveOrderModalVisible,
  setOrderTemplateData,
} = orderTemplateSlice.actions;

export const selectIsLoadingRemoveSavedOrder = (state: RootState) =>
  state.orderTemplate.isLoading.removeSavedOrder;
export const selectIsLoadingSaveOrder = (state: RootState) =>
  state.orderTemplate.isLoading.saveOrder;
export const selectIsRemoveModalVisible = (state: RootState) =>
  state.orderTemplate.isRemoveModalVisible;
export const selectIsSavedOrderNumber = (state: RootState) =>
  state.orderTemplate.savedOrderNumber;
export const selectIsMessages = (state: RootState) =>
  state.orderTemplate.orderTemplateMessages;
export const selectIsSaveOrderModalVisible = (state: RootState) =>
  state.orderTemplate.isSaveOrderModalVisible;
export const selectSaveOrderData = (state: RootState) =>
  state.orderTemplate.savedOrderData;
export const selectIsLoadingAddToCart = (state: RootState) =>
  state.orderTemplate.isLoading.addToCart;

export default orderTemplateSlice.reducer;
