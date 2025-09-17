import React from "react";
import { JoinRoom } from "../join_room/JoinRoom";
import { CreateRoom } from "../create_room/CreateRoom";
import style from "./style.module.scss";
import { Separator } from "./Separator";

export const ChatOpt: React.FC = () => {
  return (
    <>
      <div className={style["room-container"]}>
        <CreateRoom />
        <Separator />
        <JoinRoom />
      </div>
    </>
  );
};
