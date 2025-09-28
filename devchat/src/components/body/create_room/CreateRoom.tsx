import React, { useState } from "react";
import styles from "./style.module.scss";
import { CreateRoomModal } from "./CreateRoomModal";
import { useCreateRoomMutation } from "../../../store/room/roomapi";
import { useDispatch } from "react-redux";
import { createRoom } from "../../../store/room/roomSlice";
import { useNavigate } from "react-router-dom";
import { currentUser } from "../../../store/user/userSlice";
import type { FormData } from "../../../type/type";

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
      if (key) {
        navigate(`/room/${key}`);
      }
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
