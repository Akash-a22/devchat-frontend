import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Response, Room } from "../../type/type";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/v1",
  }),
  endpoints: (builder) => ({
    createRoom: builder.mutation<Response, Room>({
      query: (roomData) => ({
        url: "/room",
        body: roomData,
        method: "POST",
      }),
    }),
    joinRoom: builder.mutation<Response, Room>({
      query: (roomData) => ({
        url: "/room/join",
        body: roomData,
        method: "POST",
      }),
    }),
    getRoom: builder.query<Response, string>({
      query: (id) => ({
        url: `/room/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useJoinRoomMutation,
  useLazyGetRoomQuery,
} = roomApi;
