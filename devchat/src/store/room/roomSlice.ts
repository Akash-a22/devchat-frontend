import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    createRoom: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { createRoom } = roomSlice.actions;
export default roomSlice.reducer;
