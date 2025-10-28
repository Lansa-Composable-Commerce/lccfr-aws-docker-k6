"use client";

import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";
import { generateUniqueId } from "@/lib/helpers/generateUniqueId";

import {
  ProductSuggestionResponse,
  QuickShopImportItem,
  QuickShopResponse,
} from "@/types";
import { showToast } from "@/components/globalUI/CustomToast";

type quickShopTypes = {
  isLoading: {
    addProduct: boolean;
    importingData: boolean;
    suggestionData: boolean;
    suggestionDataInList: boolean;
  };
  isError: boolean;
  errorMessage: string;
  importDataErrorMessage: {};
  isAddItemModalOpen: boolean;
  isImportDataModalOpen: boolean;
  suggestionData: ProductSuggestionResponse[];
  suggestionDataInTheList: ProductSuggestionResponse[];
  productData: QuickShopResponse[];
  importData: QuickShopResponse[];
  newItemCode: string;
  uniqueId: number;
  importProductData: QuickShopImportItem[];
  onCustomerItemNumber: boolean;
  isAlertVisible: boolean;
  errorMessages: [];
  successMessages: [];
  successMessagesDisplayed: boolean;
};

const initialState = {
  isLoading: {
    addProduct: false,
    importingData: false,
    suggestionData: false,
    suggestionDataInList: false,
  },
  isError: false,
  errorMessage: "",
  importDataErrorMessage: {},
  isAddItemModalOpen: false,
  isImportDataModalOpen: false,
  suggestionData: [],
  suggestionDataInTheList: [],
  productData: [],
  importData: [],
  newItemCode: "",
  uniqueId: 0,
  importProductData: [],
  onCustomerItemNumber: true,
  isAlertVisible: false,
  errorMessages: [],
  successMessages: [],
  successMessagesDisplayed: false,
} satisfies quickShopTypes as quickShopTypes;

export const quickShopImportData = createAsyncThunk(
  "quickshop/import",
  async (params: { importText?: any }, thunkAPI) => {
    try {
      const data = {
        importText: params?.importText,
        searchType: "",
      };

      console.log("import data", data);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/quick-shop-import-product`,
        data,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error?.response?.data?.errors,
      });
    }
  },
);
export const getQuickOrderSuggestion = createAsyncThunk(
  "quickshop/suggestion",
  async (
    params: {
      itemCode: string;
      quantity: number;
      type?: string | undefined;
    },
    thunkAPI,
  ) => {
    try {
      const config = {
        params: {
          search: params?.itemCode,
          quantity: params?.quantity,
          type: params?.type,
        },
      };

      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/quick-shop-suggestion`,
        config,
      );

      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: "An unknown error occurred",
      });
    }
  },
);
export const getQuickOrderSuggestionInTheList = createAsyncThunk(
  "quickshop/suggestioninthelist",
  async (
    params: {
      itemCode: string;
      type?: string | undefined;
    },
    thunkAPI,
  ) => {
    try {
      const config = {
        params: {
          search: params?.itemCode,
          type: params?.type,
        },
      };
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/quick-shop-suggestion`,
        config,
      );

      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: "An unknown error occurred",
      });
    }
  },
);

export const getQuickShopProduct = createAsyncThunk(
  "quickshop/getQuickShopProduct",
  async (
    params: {
      itemCode?: string;
      quantity?: number | string;
    },
    thunkAPI,
  ) => {
    try {
      const config = {
        params: {
          itemcode: params?.itemCode,
          quantity: params?.quantity,
        },
      };

      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/quick-shop-product`,
        config,
      );

      return response?.data;
    } catch (error) {
      console.error("API call failed:", error);
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: "An unknown error occurred",
      });
    }
  },
);

export const quickShopImportProduct = createAsyncThunk(
  "quickshop/quickShopImportProduct",
  async (params: { importText: string }, thunkAPI) => {
    try {
      const data = {
        importText: params?.importText,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/quick-shop-import-product`,
        data,
      );

      return { ...response?.data };
    } catch (error: any) {
      console.error("API call failed:", error);
      return thunkAPI.rejectWithValue({
        success: false,
        data: error?.response?.data?.data,
        errors: error?.response?.data?.errors,
      });
    }
  },
);

/*export const quickShopImportProduct = createAsyncThunk(
  "quickshop/quickShopImportProduct",
  async (
    params: {
      productCode?: string;
      quantity?: number | string;
      originalIndex: number;
    },
    thunkAPI,
  ) => {
    try {
      const config = {
        params: {
          itemcode: params?.productCode,
          quantity: params?.quantity,
        },
      };

      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/quick-shop-product`,
        config,
      );

      return { ...response?.data, originalIndex: params.originalIndex };
    } catch (error) {
      console.error("API call failed:", error);
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: "An unknown error occurred",
      });
    }
  },
);*/

export const quickShopSlice = createSlice({
  name: "quickshop",
  initialState,
  reducers: {
    openQuickShopAddItemModal: (state) => {
      state.isAddItemModalOpen = !state.isAddItemModalOpen;
      state.successMessagesDisplayed = false;
    },
    openQuickShopImportDataModal: (state, action) => {
      state.isImportDataModalOpen = action.payload;
      state.successMessagesDisplayed = false;
    },
    setRemoveItem: (state, action) => {
      const id = action.payload;
      state.productData = state.productData.filter(
        (item: any) => item.id !== id,
      );
    },
    setNewItemCode: (state, action) => {
      state.newItemCode = action.payload.toString();
    },
    setUniqueId: (state, action) => {
      state.uniqueId = action.payload;
    },
    setImportProductData: (state, action) => {
      state.importProductData = action.payload;
    },
    setToggleItemNumber: (state) => {
      state.onCustomerItemNumber = !state.onCustomerItemNumber;
      state.suggestionData = [];
      state.suggestionDataInTheList = [];
    },
    setRemoveQuickShopItems: (state) => {
      state.productData = [];
      state.successMessages = [];
      state.successMessagesDisplayed = false;
    },
    setAlertVisible: (state, action) => {
      state.isAlertVisible = action.payload;
      state.successMessagesDisplayed = false;
    },
    setSuccessMessagesDisplayed: (state) => {
      state.successMessagesDisplayed = true;
    },
    setSuccessMessagesEmpty: (state) => {
      state.successMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getQuickOrderSuggestion.pending, (state) => {
      state.isLoading.suggestionData = true;
    });
    builder.addCase(getQuickOrderSuggestion.fulfilled, (state, action) => {
      state.isLoading.suggestionData = false;
      state.suggestionData = action.payload?.data;
    });
    builder.addCase(getQuickOrderSuggestion.rejected, (state) => {
      state.isLoading.suggestionData = false;
      state.suggestionData = [];
    });
    builder.addCase(getQuickOrderSuggestionInTheList.pending, (state) => {
      state.isLoading.suggestionDataInList = true;
    });
    builder.addCase(
      getQuickOrderSuggestionInTheList.fulfilled,
      (state, action) => {
        state.isLoading.suggestionDataInList = false;
        state.suggestionDataInTheList = action.payload?.data;
      },
    );
    builder.addCase(getQuickOrderSuggestionInTheList.rejected, (state) => {
      state.isLoading.suggestionDataInList = false;
    });
    builder.addCase(getQuickShopProduct.pending, (state) => {
      state.isError = false;
      state.errorMessage = "";
      state.isLoading.addProduct = true;
    });
    builder.addCase(getQuickShopProduct.fulfilled, (state, action) => {
      if (action.payload.success && action.payload.data?.productCode !== "") {
        const newObject = { ...action.payload.data, id: generateUniqueId() };
        console.log("newObject", newObject);
        if (state.newItemCode !== "") {
          console.log("newItemCode", state.newItemCode);
          // Update existing item

          let found = false;
          state.productData = state.productData.map(
            (obj: QuickShopResponse) => {
              if (
                obj.productCode === state.newItemCode &&
                obj.id === state.uniqueId
              ) {
                found = true;
                return { ...obj, ...newObject };
              }
              return obj;
            },
          );

          if (!found) {
            state.productData = [...state.productData, newObject];
          }
        } else {
          state.productData = [...state.productData, newObject];
        }
        state.isLoading.addProduct = false;
        state.isAddItemModalOpen = false;
        return;
      }

      state.errorMessage = action.payload?.data?.lineNotes[0];
      state.isLoading.addProduct = false;
      state.isError = true;
      state.isAddItemModalOpen = true;
    });
    builder.addCase(getQuickShopProduct.rejected, (state, action: any) => {
      state.isLoading.addProduct = false;
      showToast("error", action.payload?.errors);
    });
    builder.addCase(quickShopImportData.pending, (state) => {
      state.isLoading.importingData = true;
    });
    builder.addCase(quickShopImportData.fulfilled, (state, action) => {
      const newResponse = action.payload?.data.map((item: any) => {
        return { ...item, id: generateUniqueId() };
      });
      state.productData = [...state.productData, ...newResponse];
      state.isLoading.importingData = false;
    });
    builder.addCase(quickShopImportData.rejected, (state, action: any) => {
      showToast("error", action.payload?.errors);
      state.isLoading.importingData = false;
    });
    builder.addCase(quickShopImportProduct.pending, (state) => {
      state.successMessages = [];
      state.isError = false;
      state.errorMessages = [];
      state.isLoading.importingData = true;
    });
    builder.addCase(quickShopImportProduct.fulfilled, (state, action) => {
      const itemsWithIds = action.payload?.data?.items.map((item: any) => ({
        ...item,
        id: generateUniqueId(),
      }));
      state.productData = [...state.productData, ...itemsWithIds];

      state.successMessages = action.payload.data.message.filter(
        (message: any) => message.type === "success",
      );
      state.errorMessages = action.payload.data.message.filter(
        (message: any) => message.type === "error",
      );

      state.isImportDataModalOpen = false;
      state.isLoading.importingData = false;
    });
    builder.addCase(quickShopImportProduct.rejected, (state, action: any) => {
      state.isLoading.importingData = false;
      state.errorMessages = action.payload.data.messages;
    });
  },
});

export const {
  openQuickShopAddItemModal,
  openQuickShopImportDataModal,
  setRemoveItem,
  setNewItemCode,
  setUniqueId,
  setToggleItemNumber,
  setRemoveQuickShopItems,
  setAlertVisible,
  setSuccessMessagesDisplayed,
  setSuccessMessagesEmpty,
} = quickShopSlice.actions;

export const selectIsLoading = (state: RootState) =>
  state.quickShop.isLoading.suggestionData;
export const selectIsLoadingAddProduct = (state: RootState) =>
  state.quickShop.isLoading.addProduct;
export const selectIsLoadingImportProduct = (state: RootState) =>
  state.quickShop.isLoading.importingData;
export const selectIsOpenQuickShopAddItemModal = (state: RootState) =>
  state.quickShop.isAddItemModalOpen;
export const selectIsOpenQuickShopImportDataModal = (state: RootState) =>
  state.quickShop.isImportDataModalOpen;
export const selectQuickShopSuggestionData = (state: RootState) =>
  state.quickShop.suggestionData;
export const selectQuickShopData = (state: RootState) =>
  state.quickShop.productData;
export const selectToggleCustomerItemNumber = (state: RootState) =>
  state.quickShop.onCustomerItemNumber;
export const selectIsError = (state: RootState) => state.quickShop.errorMessage;
export const selectIsAlertVisible = (state: RootState) =>
  state.quickShop.isAlertVisible;
export const selectErrorMessages = (state: RootState) =>
  state.quickShop.errorMessages;
export const selectSuccessMessagesDisplayed = (state: RootState) =>
  state.quickShop.successMessagesDisplayed;
export const selectSuccessMessages = (state: RootState) =>
  state.quickShop.successMessages;

export default quickShopSlice.reducer;
