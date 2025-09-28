// store.ts
import { configureStore, type Middleware } from "@reduxjs/toolkit";
import roomReducer from "./room/roomSlice";
import userReducer from "./user/userSlice";
import { apis } from "./apiRegistry"; // [roomApi, userApi]

const apiReducers = Object.fromEntries(
  apis.map((api) => [api.reducerPath, api.reducer])
);

const rootReducer = {
  room: roomReducer,
  user: userReducer,
  ...apiReducers,
};

const apiMiddlewares: Middleware[] = apis.map((api) => api.middleware);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apiMiddlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
