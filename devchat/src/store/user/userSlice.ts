import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../util/type";

interface Users {
  data: Record<string, User>;
}

const initialState: Users = {
  data: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addAllUsers: (state, action) => {
      state.data = {};
      action.payload.forEach((user: User) => {
        state.data[user?.userId || ""] = user;
      });
    },
    addUser: (state, action) => {
      const user = action.payload;
      state.data[user.userId] = user;
    },
    removeUser: (state, action: PayloadAction<string>) => {
      delete state.data[action.payload];
    },
  },
});

export const { addAllUsers, addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
