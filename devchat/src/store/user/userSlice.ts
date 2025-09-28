import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../type/type";

const initialState: User = {
  name: "",
  userId: "",
  status: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    currentUser: (state, action) => {
      console.log(action?.payload);
      state.name = action?.payload?.name;
      state.userId = action?.payload?.userId;
      state.status = action?.payload?.status;
    },
  },
});

export const { currentUser } = userSlice.actions;
export default userSlice.reducer;
