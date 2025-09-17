import React from "react";
import styles from "./style.module.scss";

export const CreateRoom: React.FC = () => {
  return (
    <div className={styles["create-room-container"]}>
      <h2 className={styles["title"]}>Create a Room</h2>
      <button className={styles["create-button"]}>Create</button>
    </div>
  );
};
