import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

export interface MailState {
  isLoading: boolean;
  isLoadingMessageBody: boolean;
  mailMessage: {
    MailTrapHTMLMessageFile: string;
    MailTrapHTMLMessageFilePath: string;
    MailTrapHTMLMessageURL: string;
  };
  listMessages: [];
  messageDataByID: {
    MailTrapMessageID: number;
    MailTrapMessageSubject: string;
    MailTrapMessageFromMail: string;
    MailTrapMessageFromName: string;
    MailTrapMessageToMail: string;
    MailTrapMessageToName: string;
    MailTrapMessageSentAt: string;
    MailTrapMessageIsRead: boolean;
  };
}

const initialState: MailState = {
  isLoading: false,
  isLoadingMessageBody: false,
  mailMessage: {
    MailTrapHTMLMessageFile: "",
    MailTrapHTMLMessageFilePath: "",
    MailTrapHTMLMessageURL: "",
  },
  listMessages: [],
  messageDataByID: {
    MailTrapMessageID: 0,
    MailTrapMessageSubject: "",
    MailTrapMessageFromMail: "",
    MailTrapMessageFromName: "",
    MailTrapMessageToMail: "",
    MailTrapMessageToName: "",
    MailTrapMessageSentAt: "",
    MailTrapMessageIsRead: false,
  },
};

export const getMailTrapMessages = createAsyncThunk(
  "mail/messages",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/mail`,
      );

      return response?.data;
    } catch (error) {
      console.error("API call failed:", error);
    }
  },
);

export const getMailTrapMessageById = createAsyncThunk(
  "mail/messagebyid",
  async (id: number, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/mail/${id}`,
      );

      return response?.data;
    } catch (error) {
      console.error("API call failed:", error);
    }
  },
);

export const getMailTrapMessage = createAsyncThunk(
  "mail/message",
  async (id: number, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/mail-body/${id}`,
      );

      return response?.data;
    } catch (error) {
      console.error("API call failed:", error);
    }
  },
);

export const emailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getMailTrapMessages.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMailTrapMessages.fulfilled, (state, action) => {
      state.listMessages = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getMailTrapMessages.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getMailTrapMessageById.pending, (state) => {
      state.isLoadingMessageBody = true;
    });
    builder.addCase(getMailTrapMessageById.fulfilled, (state, action) => {
      state.messageDataByID = action.payload;
      state.isLoadingMessageBody = false;
    });
    builder.addCase(getMailTrapMessageById.rejected, (state) => {
      state.isLoadingMessageBody = false;
    });
    builder.addCase(getMailTrapMessage.pending, (state) => {
      state.isLoadingMessageBody = true;
    });
    builder.addCase(getMailTrapMessage.fulfilled, (state, action) => {
      state.mailMessage = action.payload;
      state.isLoadingMessageBody = false;
    });
    builder.addCase(getMailTrapMessage.rejected, (state) => {
      state.isLoadingMessageBody = false;
    });
  },
});

export const selectMailData = (state: RootState) => state.mail;

export default emailSlice.reducer;
