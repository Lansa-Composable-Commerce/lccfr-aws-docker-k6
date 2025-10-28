import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "@/lib/store";
import { ISubUserProps, SubUserAssocAccountsItem, SubUserInfo } from "@/types";

type SubUserState = {
  isLoading: {
    addSubUser: boolean;
    information: boolean;
    updateInformation: boolean;
    permission: boolean;
    assocAccounts: boolean;
    updateAssocAccounts: boolean;
    changePassword: boolean;
    updatePermission: boolean;
    removeSubUser: boolean;
  };
  isSubUserInfoDrawerVisible: boolean;
  subUserTabName: string;
  selectedSubUser: ISubUserProps;
  isSubUserInfoModalVisible: boolean;
  subUserDetails: {};
  informationData: SubUserInfo;
  permissionData: String[];
  assocAccountsData: SubUserAssocAccountsItem[];
  isAddSubUSerModalVisible: boolean;
};

const initialState = {
  isLoading: {
    addSubUser: false,
    information: false,
    updateInformation: false,
    permission: false,
    assocAccounts: false,
    updateAssocAccounts: false,
    changePassword: false,
    updatePermission: false,
    removeSubUser: false,
  },
  isSubUserInfoDrawerVisible: false,
  subUserTabName: "",
  selectedSubUser: {
    subUserId: "",
    fullName: "",
    subUserEmail: "",
  },
  isSubUserInfoModalVisible: false,
  subUserDetails: {},
  informationData: {
    userId: "",
    accountStatus: "",
    email: "",
    firstName: "",
    lastName: "",
    workPhone: "",
    fax: "",
    inheritsSuperUserAccounts: "N",
  },
  permissionData: [],
  assocAccountsData: [],
  isAddSubUSerModalVisible: false,
} satisfies SubUserState as SubUserState;

export const addSubUser = createAsyncThunk(
  "accountSettings/addSubUser",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sub-user-information`,
        payload,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getSubUserInformation = createAsyncThunk(
  "accountSettings/getSubUserDetails",
  async (subUserId: string, thunkAPI) => {
    try {
      const config = {
        params: {
          subuserId: subUserId,
        },
      };
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sub-user-information`,
        config,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const updateSubUserInformation = createAsyncThunk(
  "accountSettings/updateSubUserInformation",
  async (payload: {}, thunkAPI) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sub-user-information`,
        payload,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const removeSubUser = createAsyncThunk(
  "accountSettings/removeSubUser",
  async (subUserId: string, thunkAPI) => {
    console.log("subUserId", subUserId);
    try {
      const config = {
        params: {
          subuserId: subUserId,
        },
      };

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sub-user-information`,
        config,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const updateSubUserPassword = createAsyncThunk(
  "accountSettings/updateSubUserPassword",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/update-sub-user-password`,
        payload,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getSubUSerPermission = createAsyncThunk(
  "accountSettings/getSubUSerPermission",
  async (payload: string, thunkAPI) => {
    try {
      const config = {
        params: {
          subuserId: payload,
        },
      };
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sub-user-permissions`,
        config,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const updateSubUSerPermission = createAsyncThunk(
  "accountSettings/updateSubUSerPermission",
  async (payload: any, thunkAPI) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sub-user-permissions`,

        payload,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const getSubUserAssocAccounts = createAsyncThunk(
  "accountSettings/getSubUserAssocAccounts",
  async (payload: string, thunkAPI) => {
    try {
      const config = {
        params: {
          subuserId: payload,
        },
      };
      const response = await axios(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sub-user-assoc-accounts`,
        config,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const updateSubUserAssocAccounts = createAsyncThunk(
  "accountSettings/updateSubUserAssocAccounts",
  async ({ payload, subuserId }: any, thunkAPI) => {
    try {
      console.log({ payload, subuserId });
      const config = {
        subuserId: subuserId,
        payload,
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/sub-user-assoc-accounts`,
        config,
      );

      return response?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        success: false,
        data: [],
        errors: error,
      });
    }
  },
);

export const subUserSlice = createSlice({
  name: "subUser",
  initialState,
  reducers: {
    setSubUserInfoModalVisible: (state, action) => {
      state.subUserTabName = action.payload.subUserTabName;
      state.isSubUserInfoModalVisible = !state.isSubUserInfoModalVisible;
    },
    setSelectedSubUser: (state, action: PayloadAction<ISubUserProps>) => {
      state.selectedSubUser = action.payload;
    },
    setAddSubUserModalVisible: (state) => {
      state.isAddSubUSerModalVisible = !state.isAddSubUSerModalVisible;
    },
    setNewSubUserInformation: (state, action) => {
      state.informationData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addSubUser.pending, (state) => {
      state.isLoading.addSubUser = true;
    });
    builder.addCase(addSubUser.fulfilled, (state, action) => {
      console.log("payload", action.payload);
      state.isLoading.addSubUser = false;
    });
    builder.addCase(addSubUser.rejected, (state) => {
      state.isLoading.addSubUser = false;
    });
    builder.addCase(getSubUserInformation.pending, (state) => {
      /*state.informationData = {
        userId: "",
        accountStatus: "",
        email: "",
        firstName: "",
        lastName: "",
        workPhone: "",
        fax: "",
      };*/
      state.isLoading.information = true;
    });
    builder.addCase(getSubUserInformation.fulfilled, (state, action) => {
      state.informationData = action.payload.data;
      state.isLoading.information = false;
    });
    builder.addCase(getSubUserInformation.rejected, (state) => {
      state.isLoading.information = false;
    });
    builder.addCase(updateSubUserInformation.pending, (state) => {
      state.isLoading.updateInformation = true;
    });
    builder.addCase(updateSubUserInformation.fulfilled, (state, action) => {
      state.isLoading.updateInformation = false;
    });
    builder.addCase(updateSubUserInformation.rejected, (state) => {
      state.isLoading.updateInformation = false;
    });
    builder.addCase(removeSubUser.pending, (state) => {
      state.isLoading.removeSubUser = true;
    });
    builder.addCase(removeSubUser.fulfilled, (state) => {
      state.isLoading.removeSubUser = false;
    });
    builder.addCase(removeSubUser.rejected, (state) => {
      state.isLoading.removeSubUser = false;
    });
    builder.addCase(updateSubUserPassword.pending, (state) => {
      state.isLoading.changePassword = true;
    });
    builder.addCase(updateSubUserPassword.fulfilled, (state) => {
      state.isLoading.changePassword = false;
    });
    builder.addCase(updateSubUserPassword.rejected, (state) => {
      state.isLoading.changePassword = false;
    });
    builder.addCase(getSubUSerPermission.pending, (state) => {
      state.isLoading.permission = true;
    });
    builder.addCase(
      getSubUSerPermission.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.permissionData = action.payload?.data;
        state.isLoading.permission = false;
      },
    );
    builder.addCase(getSubUSerPermission.rejected, (state) => {
      state.isLoading.permission = false;
    });
    builder.addCase(updateSubUSerPermission.pending, (state) => {
      state.isLoading.updatePermission = true;
    });
    builder.addCase(updateSubUSerPermission.fulfilled, (state) => {
      state.isLoading.updatePermission = false;
    });
    builder.addCase(updateSubUSerPermission.rejected, (state) => {
      state.isLoading.updatePermission = false;
    });
    builder.addCase(getSubUserAssocAccounts.pending, (state) => {
      state.isLoading.assocAccounts = true;
    });
    builder.addCase(
      getSubUserAssocAccounts.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.assocAccountsData = action.payload?.data;
        state.isLoading.assocAccounts = false;
      },
    );
    builder.addCase(getSubUserAssocAccounts.rejected, (state) => {
      state.isLoading.assocAccounts = false;
    });
    builder.addCase(updateSubUserAssocAccounts.pending, (state) => {
      state.isLoading.updateAssocAccounts = true;
    });
    builder.addCase(
      updateSubUserAssocAccounts.fulfilled,
      (state, action: PayloadAction<any>) => {
        console.log(
          "updateSubUserAssocAccounts.fulfilled",
          action.payload.data,
        );
        state.isLoading.updateAssocAccounts = false;
      },
    );
    builder.addCase(updateSubUserAssocAccounts.rejected, (state) => {
      state.isLoading.updateAssocAccounts = false;
    });
  },
});

export const {
  setSubUserInfoModalVisible,
  setSelectedSubUser,
  setAddSubUserModalVisible,
  setNewSubUserInformation,
} = subUserSlice.actions;

export const selectIsSubUserTabName = (state: RootState) =>
  state.subUser.subUserTabName;
export const selectSelectedSubUser = (state: RootState) =>
  state.subUser.selectedSubUser;
export const selectSubUserInfoModalVisible = (state: RootState) =>
  state.subUser.isSubUserInfoModalVisible;
export const selectAddSubUserModalVisible = (state: RootState) =>
  state.subUser.isAddSubUSerModalVisible;

// Update Sub-User Details
export const selectIsLoadingUpdateInformation = (state: RootState) =>
  state.subUser.isLoading.updateInformation;

// Information tab
export const selectIsLoadingInformation = (state: RootState) =>
  state.subUser.isLoading.information;
export const selectSubUserInformation = (state: RootState) =>
  state.subUser.informationData;
export const selectIsLoadingRemoveSubUser = (state: RootState) =>
  state.subUser.isLoading.removeSubUser;

// Permission
export const selectIsLoadingPermission = (state: RootState) =>
  state.subUser.isLoading.permission;
export const selectIsLoadingUpdatePermission = (state: RootState) =>
  state.subUser.isLoading.updatePermission;

// Associated Accounts
export const selectIsLoadingAssocAccounts = (state: RootState) =>
  state.subUser.isLoading.assocAccounts;
export const selectIsLoadingUpdateAssocAccounts = (state: RootState) =>
  state.subUser.isLoading.updateAssocAccounts;
export const selectAssocAccountsData = (state: RootState) =>
  state.subUser.assocAccountsData;

export default subUserSlice.reducer;
