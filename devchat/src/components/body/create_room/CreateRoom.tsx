import React, { useState } from "react";
import styles from "./style.module.scss";
import { CreateRoomModal } from "./CreateRoomModal";
import { useCreateRoomMutation } from "../../../store/room/roomapi";
import { useDispatch } from "react-redux";
import { createRoom } from "../../../store/room/roomSlice";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../../store/user/userSlice";
import type { FormData, RoomEvent } from "../../../util/type";
import { showToast } from "../../util/component/ToastMessage";
import { connectToRoom, joinRoomWS } from "../../../socket/socketConfig";
import { clearMessages } from "../../../store/chat/chatSlice";

export const CreateRoom: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [saveRoom] = useCreateRoomMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (form: FormData) => {
    const room = {
      name: form.roomName,
      size: form.size,
      users: [
        {
          name: form.username,
        },
      ],
    };
    const responseData = await saveRoom(room).unwrap();
    if (responseData && responseData?.code === 201) {
      dispatch(createRoom(responseData?.responseObject));
      dispatch(clearMessages());
      const roomId = responseData?.responseObject?.roomId || "";
      const user = responseData?.responseObject?.users?.[0];
      dispatch(addUser(user));
      const key = responseData?.responseObject?.key;
      localStorage.setItem("roomId", roomId);
      localStorage.setItem("currentUserId", user?.userId || "");
      localStorage.setItem("token", user.token);
      const roomEvent: RoomEvent = {
        roomId,
        type: "JOIN",
        userId: user?.userId,
        userName: user?.name,
      };
      connectToRoom(roomId);
      joinRoomWS(roomEvent);
      if (key) {
        navigate(`/room/${key}`);
      }
    } else if (responseData?.code === 400) {
      showToast("error", responseData?.responseObject?.[0] || "");
    }
  };

  return (
    <div className={styles["create-room-container"]}>
      <h2 className={styles["title"]}>Create a Room</h2>
      <button className={styles["create-button"]} onClick={() => setOpen(true)}>
        Create
      </button>

      <CreateRoomModal
        open={open}
        onClose={() => setOpen(!open)}
        onSubmit={(form) => handleSubmit(form)}
      />
    </div>
  );
};
