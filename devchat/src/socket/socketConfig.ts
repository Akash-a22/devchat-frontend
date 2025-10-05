import { Client } from "@stomp/stompjs";
import { addMessage, removeMessage } from "../store/chat/chatSlice";
import store from "../store/store";
import type { MessageEvent, Message, RoomEvent } from "../util/type";
import { addUser, removeUser } from "../store/user/userSlice";
import { wsURL } from "../util/constants";

let stompClient: Client | null = null;
const messageQueue: Message[] = [];

export const connectToRoom = (roomId: string) => {
  const token = localStorage.getItem("token");

  stompClient = new Client({
    brokerURL: wsURL,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (msg) => console.log("STOMP:", msg),
  });

  stompClient.onConnect = () => {
    stompClient?.subscribe(`/topic/room/${roomId}`, (msg) => {
      console.log("Update received:", msg.body);
      const body = JSON.parse(msg.body);

      if (body.value) {
        store.dispatch(addMessage(body));
      } else if (body.type) {
        if (body.type === "JOIN") {
          store.dispatch(addUser(body));
        } else if (body.type === "LEAVE") {
          store.dispatch(removeUser(body.userId));
        } else if (body.type === "REMOVE_MESSAGE") {
          store.dispatch(removeMessage(body.id));
        }
      }
      while (messageQueue.length) {
        const msg = messageQueue.shift()!;
        sendMessageWS(msg);
      }
    });
  };

  stompClient.onStompError = (frame) => {
    console.error("STOMP error:", frame);
  };

  stompClient.onWebSocketError = (error) => {
    console.error("WebSocket error:", error);
  };

  stompClient.onWebSocketClose = (event) => {
    console.error("WebSocket closed:", event);
  };

  stompClient.activate();
};

export const joinRoomWS = (roomEvent: RoomEvent) => {
  if (!stompClient || !stompClient.connected) {
    return;
  }
  stompClient.publish({
    destination: "/app/room",
    body: JSON.stringify(roomEvent),
  });
};

export const sendMessageWS = (chatMessage: Message) => {
  if (!stompClient || !stompClient.connected) {
    messageQueue.push(chatMessage);
    return;
  }
  stompClient.publish({
    destination: "/app/send",
    body: JSON.stringify(chatMessage),
  });
};

export const leaveRoomWS = (roomId: string, userId: string) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/room",
      body: JSON.stringify({ roomId, userId, type: "LEAVE" }),
    });
  }
  stompClient?.deactivate();
  stompClient = null;
};

export const messageWS = (chatEvent: MessageEvent) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/remove-message",
      body: JSON.stringify(chatEvent),
    });
  }
};
