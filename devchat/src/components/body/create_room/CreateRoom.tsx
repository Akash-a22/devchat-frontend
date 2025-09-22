import React, { useState } from "react";
import styles from "./style.module.scss";
import { CreateRoomModal } from "./CreateRoomModal";
import type { FormData } from "./type";

export const CreateRoom: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (form: FormData) => {
    console.log("Creating room with data:", form);
    // api call  ... create room
  };

  return (
    <div className={styles["create-room-container"]}>
      <h2 className={styles["title"]}>Create a Room</h2>
      <button className={styles["create-button"]} onClick={() => setOpen(true)}>
        Create
      </button>

      <CreateRoomModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(form) => handleSubmit(form)}
      />
    </div>
  );
};
