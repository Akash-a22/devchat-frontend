import { useState, useRef, useEffect } from "react";
import style from "./ChatRoom.module.scss";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLazyGetRoomQuery } from "../../../store/room/roomapi";
import { createRoom } from "../../../store/room/roomSlice";
import { currentUser } from "../../../store/user/userSlice";
import { showToast } from "../../util/component/ToastMessage";
import { useNavigate } from "react-router-dom";
import type { Message, Room, User } from "../../../type/type";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useRemoveUserfromRoomMutation } from "../../../store/user/UserApi";

const ChatRoom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[] | null>([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [room, setRoom] = useState<Room>();
  const [roomKey, setRoomKey] = useState<string>();
  const [users, setUsers] = useState<User[] | null>(null);

  const currentUserData = useSelector(
    (state: RootState) => state.user
  ) as User | null;

  const [getRoomById] = useLazyGetRoomQuery();
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
  }, []);
  useEffect(() => {
    if (room?.users) {
      setUsers(room.users);
    }
  }, [room]);

  const getRoom = async () => {
    const roomId = localStorage.getItem("roomId");
    const currentUserId = localStorage.getItem("currentUserId");
    const response = await getRoomById(roomId || "").unwrap();
    if (response?.code !== 400 && response?.responseObject) {
      if (!Array.isArray(response.responseObject)) {
        dispatch(createRoom(response.responseObject));
        setRoom(response?.responseObject);
        const user = response.responseObject.users?.find(
          (user) => user?.userId === currentUserId
        );
        setRoomKey(response?.responseObject?.key);
        dispatch(currentUser(user));
        const usersFromRoom = response.responseObject.users as User[];
        setUsers(usersFromRoom);
        localStorage.setItem("token", user?.token || "");
      } else {
        console.warn("Received array of rooms, not a single room.");
      }
    } else if (response && response?.code === 400) {
      showToast("error", response?.responseObject?.[0]);
      navigate("/");
    }
  };

  const handleRoomExit = async () => {
    if (currentUserData) {
      const userId = currentUserData.userId;
      const response = await removeUserFromRoom(userId || "").unwrap();
      if (response && response?.code === 200) {
        localStorage.removeItem("roomId");
        localStorage.removeItem("currentUserId");
        showToast("success", "room exit");
        navigate("/");
      }
    }
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    setMessages((msgs) => [
      ...(msgs || []),
      {
        userId: currentUserData?.userId,
        userName: currentUserData?.name,
        message: newMsg,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setNewMsg("");
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(roomKey || "").then(() => {
      showToast("info", "room key copied to clipboard sucessfully");
    });
  };

  return (
    <div className={style.container}>
      {/* Sidebar */}
      <div className={style.sidebar}>
        <div className={style.sidebarHeader}>Users</div>
        <div className={style.userList}>
          {users &&
            users?.map((user) => (
              <div key={user?.userId} className={style.user}>
                <div
                  className={`${style.userStatus} ${
                    user.status ? style.online : style.offline
                  }`}
                ></div>
                <div>{user.name}</div>
              </div>
            ))}
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
            <IconButton onClick={() => handleRoomExit()} aria-label="exit">
              <LogoutOutlinedIcon />
            </IconButton>
            <IconButton onClick={handleCopy} aria-label="copy room key">
              <ContentCopyIcon />
            </IconButton>
          </div>
        </div>

        {/* Messages */}
        <div className={style.messages}>
          {messages ? (
            messages?.map((msg) => (
              <div
                key={msg?.id}
                className={`${style.message} ${
                  msg?.userName === currentUserData?.name
                    ? style.messageFromMe
                    : style.messageFromOthers
                }`}
              >
                <div className={style.messageUser}>{msg.userName}</div>
                <div className={style.messageText}>{msg.message}</div>
                <div className={style.messageTime}>{msg?.time}</div>
              </div>
            ))
          ) : (
            <div>No meesages</div>
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
          <button onClick={sendMessage} className={style.sendBtn}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
