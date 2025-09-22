export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export interface FormData {
  username: string;
  roomName: string;
  size: number;
}
