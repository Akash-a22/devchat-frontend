import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserResponse } from "../../util/type";
import { apiUrl } from "../../util/constants";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
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
        url: `v1/user/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useRemoveUserfromRoomMutation } = userApi;
