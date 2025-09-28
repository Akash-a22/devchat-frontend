import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserResponse } from "../../type/type";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    removeUserfromRoom: builder.mutation<UserResponse, string>({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useRemoveUserfromRoomMutation } = userApi;
