import { useState, useRef, useEffect } from "react";
import style from "./ChatRoom.module.scss";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLazyGetRoomQuery } from "../../../store/room/roomapi";
import { createRoom } from "../../../store/room/roomSlice";
import { addAllUsers, removeUser } from "../../../store/user/userSlice";
import { showToast } from "../../util/component/ToastMessage";
import { useNavigate } from "react-router-dom";
import type { Message, Room, User } from "../../../util/type";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useRemoveUserfromRoomMutation } from "../../../store/user/UserApi";
import {
  useDeleteMessageMutation,
  useLazyMessagesWithRoomQuery,
} from "../../../store/chat/ChatApi";
import {
  addMessage,
  removeMessage,
  setMessages,
} from "../../../store/chat/chatSlice";
import {
  connectToRoom,
  leaveRoomWS,
  messageWS,
  sendMessageWS,
} from "../../../socket/socketConfig";
import editIcon from "../../../assets/edit-icon.svg";
import copyIcon from "../../../assets/copy-icon.svg";
import deleteIcon from "../../../assets/delete-icon.svg";
import moreIcon from "../../../assets/more-icon.svg";

const ChatRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string>("");
  const messages = useSelector((state: RootState) =>
    Object.values(state.chat.data)
  );
  const [deleteMessage] = useDeleteMessageMutation();

  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [room, setRoom] = useState<Room>();
  const [roomKey, setRoomKey] = useState<string>();
  const users = useSelector(
    (state: RootState) => Object.values(state.user.data) || []
  );

  const [currentUserData, setCurrentUserData] = useState<User | null>(null);

  const [getRoomById] = useLazyGetRoomQuery();
  const [getMessagesWithRoomId] = useLazyMessagesWithRoomQuery();

  const [removeUserFromRoom] = useRemoveUserfromRoomMutation();
  const getRoomCalled = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!room && !getRoomCalled.current) {
      getRoomCalled.current = true;
      getRoom();
    }
    const roomId = localStorage.getItem("roomId") || "";
    setRoomId(roomId);
    if (Array.isArray(messages) && messages.length === 0 && roomId) {
      getMessages(roomId);
    }
  }, []);

  const getMessages = async (roomId: string) => {
    if (roomId) {
      const response = await getMessagesWithRoomId(roomId).unwrap();
      if (response && response?.code === 200) {
        const messages = response.responseObject;
        if (Array.isArray(messages)) {
          dispatch(setMessages(messages));
        }
      }
    }
  };

  const getRoom = async () => {
    const roomId = localStorage.getItem("roomId") || "";
    const userId = localStorage.getItem("currentUserId") || "";
    const response = await getRoomById({ roomId, userId }).unwrap();
    if (response?.code !== 400 && response?.responseObject) {
      if (!Array.isArray(response.responseObject)) {
        dispatch(createRoom(response.responseObject));
        setRoom(response?.responseObject);
        const user = response.responseObject.users?.find(
          (user) => user?.userId === userId
        );
        setCurrentUserData(user);
        setRoomKey(response?.responseObject?.key);
        dispatch(addAllUsers(response.responseObject.users));
        localStorage.setItem("token", user?.token || "");
        connectToRoom(response.responseObject.roomId);
      } else {
        console.warn("Received array of rooms, not a single room.");
      }
    } else if (response && response?.code === 400) {
      showToast("error", response?.responseObject?.[0]);
      navigate("/");
      localStorage.removeItem("roomId");
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("token");
    }
  };

  const handleRoomExit = async () => {
    if (currentUserData) {
      const userId = currentUserData.userId ?? "";
      const response = await removeUserFromRoom(userId || "").unwrap();
      if (response && response?.code === 200) {
        localStorage.removeItem("roomId");
        localStorage.removeItem("currentUserId");
        localStorage.removeItem("token");
        dispatch(removeUser(userId));
        leaveRoomWS(roomId, userId);
        showToast("success", "room exit");
        navigate("/");
      }
    }
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const currentmessage: Message = {
      userId: currentUserData?.userId,
      userName: currentUserData?.name,
      roomId: roomId,
      value: newMsg,
      createdOn: new Date().toISOString(),
    };
    console.log("current meesage", currentmessage);
    sendMessageWS(currentmessage);
    addMessage(currentmessage);
    setNewMsg("");
  };

  const handleCopy = (key: string, message: string) => {
    navigator.clipboard.writeText(key || "").then(() => {
      showToast("info", message);
    });
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteMessage(id);
    messageWS({
      id,
      type: "REMOVE_MESSAGE",
      roomId,
    });
    dispatch(removeMessage(id));
    showToast("info", "message deleted for all users");
  };

  return (
    <div className={style.container}>
      {/* Sidebar */}
      <div className={style.sidebar}>
        <div className={style.sidebarHeader}>Users</div>
        <div className={style.userList}>
          {users &&
            users?.map((user) => {
              const isMe = user.userId === currentUserData?.userId;
              return (
                <div
                  key={user?.userId}
                  className={`${style.user} ${isMe ? style.currentUser : ""}`}
                >
                  <div
                    className={`${style.userStatus} ${
                      user.status ? style.online : style.offline
                    }`}
                  ></div>
                  <div>{isMe ? user.name + " (you)" : user.name}</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat area */}
      <div className={style.chatArea}>
        {/* Header */}
        <div className={style.chatHeader}>
          <div>
            <h2 className={style.roomTitle}>{room?.name ?? "Chat Room"}</h2>
          </div>
          <div className={style.headerLeft}>
            <IconButton
              onClick={() => handleRoomExit()}
              aria-label="exit"
              title="exit room"
            >
              <LogoutOutlinedIcon />
            </IconButton>
            <IconButton
              onClick={() => handleCopy(roomKey || "", "room key copied")}
              title="copy room key"
            >
              <ContentCopyIcon />
            </IconButton>
          </div>
        </div>

        {/* Messages */}
        <div className={style.messages}>
          {messages && messages.length > 0 ? (
            messages.map((msg) => {
              const formattedTime = new Date(
                msg?.createdOn || ""
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const isMe = msg.userName === currentUserData?.name;

              return (
                <div
                  className={`${style.message} ${
                    isMe ? style.messageFromMe : style.messageFromOthers
                  }`}
                >
                  <div className={style.messageHeader}>
                    <span className={style.messageInfo}>
                      {formattedTime} - {isMe ? "You" : msg.userName}
                    </span>
                    <div className={style.messageActions}>
                      <img
                        className={style.iconBtn}
                        src={editIcon}
                        alt="edit"
                        title="edit"
                        height={20}
                        width={20}
                        // onClick={() => handleMessageEdit()}
                      />
                      <img
                        className={style.iconBtn}
                        src={copyIcon}
                        alt="copy"
                        title="copy"
                        height={22}
                        width={22}
                        onClick={() =>
                          handleCopy(msg?.value || "", "message copied")
                        }
                      />
                      <img
                        className={style.iconBtn}
                        src={deleteIcon}
                        alt="delete"
                        title="delete"
                        height={18}
                        width={18}
                        onClick={() => handleDeleteMessage(msg?.id)}
                      />
                      <img
                        className={style.iconBtn}
                        src={moreIcon}
                        alt="more"
                        title="more"
                        height={20}
                        width={20}
                      />
                    </div>
                  </div>

                  <div className={style.messageBody}>{msg.value}</div>
                </div>
              );
            })
          ) : (
            <div className={style.noMessage}>No messages</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className={style.inputArea}>
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className={style.input}
          />
          <button onClick={() => sendMessage()} className={style.sendBtn}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
