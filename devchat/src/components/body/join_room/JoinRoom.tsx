import React from "react";
import styles from "../join_room/style.module.scss";

export const JoinRoom: React.FC = () => {
  return (
    <div className={styles["join-room-container"]}>
      <h2 className={styles["title"]}>Join a Room</h2>
      <button className={styles["join-button"]}>Join</button>
    </div>
  );
};
