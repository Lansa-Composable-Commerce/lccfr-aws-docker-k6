import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { RootState } from "@/lib/store";
import { COOKIE_PREFIX } from "@/utils/constants";
import { PostOrderDetails } from "@/types/Checkout";

export interface GlobalState {
  error: string;
  isLoading: boolean;
  isDrawerOpen: boolean;
  email: string;
  account: {
    LW3CUSNAM: string | undefined;
  };
  isGridView: boolean;
  isFilterDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  isSidebarOpen: boolean;
  fairWayWoodsFilterData: String[];
  postOrderDetails: PostOrderDetails;
  logoData: { LW3CNTSTR: "" };
}

const initialState: GlobalState = {
  error: "",
  isLoading: false,
  isDrawerOpen: true,
  email: "",
  account: {
    LW3CUSNAM: Cookies.get(`${COOKIE_PREFIX}account`),
  },
  isGridView: false,
  isFilterDrawerOpen: false,
  isSearchModalOpen: false,
  fairWayWoodsFilterData: [],
  isSidebarOpen: false,
  postOrderDetails: {
    isSuccess: false,
    emailStatus: "OK",
  },
  logoData: {
    LW3CNTSTR: "",
  },
};

export const getLogo = createAsyncThunk("global/logo", async (_, thunkAPI) => {
  try {
    const response = await axios(`${process.env.NEXT_PUBLIC_APP_URL}/api/logo`);

    return response?.data;
  } catch (error) {
    console.error("API call failed:", error);
  }
});

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setGridView: (state, action) => {
      state.isGridView = action.payload === "GRID";
    },
    openFilterDrawer: (state) => {
      state.isFilterDrawerOpen = !state.isFilterDrawerOpen;
    },
    openSearchModal: (state) => {
      state.isSearchModalOpen = !state.isSearchModalOpen;
    },
    setPostOrderDetails(state, action: PayloadAction<PostOrderDetails>) {
      state.postOrderDetails = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getLogo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getLogo.fulfilled, (state, action) => {
      state.logoData = action.payload;

      state.isLoading = false;
    });
    builder.addCase(getLogo.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setGridView,
  openFilterDrawer,
  openSearchModal,
  setPostOrderDetails,
} = globalSlice.actions;

export const selectGlobalState = (state: RootState) => state.global;

export const selectAccount = (state: RootState) =>
  state.global.account?.LW3CUSNAM;
export const selectGridSwitch = (state: RootState) => state.global.isGridView;
export const selectIsFilterDrawerOpen = (state: RootState) =>
  state.global.isFilterDrawerOpen;
export const selectOpenSearchModal = (state: RootState) =>
  state.global.isSearchModalOpen;
export const selectLogoData = (state: RootState) => state.global.logoData;

export default globalSlice.reducer;
