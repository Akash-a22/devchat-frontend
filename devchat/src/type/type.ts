export interface Message {
  id?: string;
  userName?: string;
  userId?: string;
  message?: string;
  time: string;
}

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export interface FormData {
  username: string;
  roomName?: string;
  size?: number;
  key?: string;
}

export interface ToasterMessage {
  level: string;
  message: string;
}

export interface Room {
  name?: string;
  users: User[];
  size?: number;
  key?: string;
  roomId?: string;
}
export interface User {
  name: string;
  userId?: string;
  status?: string;
  token?: string;
}

export interface Response {
  message: string;
  status: string;
  code: number;
  responseObject: Room | string[];
}
export interface UserResponse {
  message: string;
  status: string;
  code: number;
  responseObject: User | string[];
}
