import React, { useState } from "react";
import styles from "../join_room/style.module.scss";
import { useNavigate } from "react-router-dom";
import { JoinRoomModal } from "./JoinRoomModal";
import type { FormData, Room } from "../../../type/type";
import { createRoom } from "../../../store/room/roomSlice";

import { useDispatch } from "react-redux";
import { currentUser } from "../../../store/user/userSlice";
import { useJoinRoomMutation } from "../../../store/room/roomapi";
import { showToast } from "../../util/component/ToastMessage";

export const JoinRoom: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [joinRoom] = useJoinRoomMutation();

  const handleSubmit = async (form: FormData) => {
    console.log("form", form);
    const room: Room = {
      key: form?.key,
      users: [
        {
          name: form.username,
        },
      ],
    };
    const responseData = await joinRoom(room)?.unwrap();
    if (responseData && responseData?.code === 200) {
      dispatch(createRoom(responseData?.responseObject));
      dispatch(currentUser(responseData?.responseObject?.users?.[0]));
      const key = responseData?.responseObject?.key;
      localStorage.setItem(
        "roomId",
        responseData?.responseObject?.roomId ?? ""
      );
      localStorage.setItem(
        "currentUserId",
        responseData?.responseObject?.users?.[0]?.userId || ""
      );
      localStorage.setItem(
        "token",
        responseData?.responseObject?.users?.[0].token
      );
      if (key) {
        navigate(`/room/${key}`);
      }
    } else if (responseData?.code === 400) {
      const failure = responseData?.responseObject?.[0];
      showToast("error", failure || "Room doesn't exists");
    }
  };
  return (
    <div className={styles["join-room-container"]}>
      <h2 className={styles["title"]}>Join a Room</h2>
      <button className={styles["join-button"]} onClick={() => setOpen(true)}>
        Join
      </button>
      <JoinRoomModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(form) => handleSubmit(form)}
      />
    </div>
  );
};
