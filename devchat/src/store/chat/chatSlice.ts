import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../../util/type";

interface Messages {
  data: Record<string, Message>;
}

const initialState: Messages = {
  data: {},
};
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.data = {};
      action.payload.forEach((msg) => {
        state.data[msg?.id || ""] = msg;
      });
    },
    addMessage(state, action: PayloadAction<Message>) {
      const message = action.payload;
      state.data[message?.id || ""] = message;
    },
    clearMessages(state) {
      state.data = {};
    },
    removeMessage(state, action: PayloadAction<string>) {
      delete state.data[action.payload];
    },
  },
});

export const { addMessage, setMessages, clearMessages, removeMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
