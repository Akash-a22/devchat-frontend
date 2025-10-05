import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Response, Room } from "../../util/type";
import { apiUrl } from "../../util/constants";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
  }),
  endpoints: (builder) => ({
    createRoom: builder.mutation<Response, Room>({
      query: (roomData) => ({
        url: "v1/room",
        body: roomData,
        method: "POST",
      }),
    }),
    joinRoom: builder.mutation<Response, Room>({
      query: (roomData) => ({
        url: "v1/room/join",
        body: roomData,
        method: "POST",
      }),
    }),
    getRoom: builder.query<Response, { roomId: string; userId: string }>({
      query: ({ roomId, userId }) => {
        const token = localStorage.getItem("token");
        return {
          url: `v1/room/${roomId}/${userId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useJoinRoomMutation,
  useLazyGetRoomQuery,
} = roomApi;
