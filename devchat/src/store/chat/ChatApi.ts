import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ChatResponse, Response } from "../../util/type";
import { apiUrl } from "../../util/constants";

export const chatApi = createApi({
  reducerPath: "chatApi",
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
    messagesWithRoom: builder.query<ChatResponse, string>({
      query: (roomId) => ({
        method: "GET",
        url: `v1/chat/${roomId}`,
      }),
    }),
    deleteMessage: builder.mutation<Response, string>({
      query: (id) => ({
        method: "DELETE",
        url: `v1/chat/${id}`,
      }),
    }),
  }),
});

export const { useLazyMessagesWithRoomQuery, useDeleteMessageMutation } =
  chatApi;
