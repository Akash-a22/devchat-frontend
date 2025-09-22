import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import type { FormData, Props } from "./type";

export const CreateRoomModal: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = React.useState<FormData>({
    username: "",
    roomName: "",
    size: 1,
  });

  const [error, setError] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { username, roomName, size } = form;

    if (!username.trim() || !roomName.trim() || !size) {
      setError("Please fill all the fields.");
      return;
    }

    setError(""); // Clear previous error
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a New Room</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          margin="dense"
          label="Enter your name"
          name="username"
          fullWidth
          size="small"
          variant="outlined"
          value={form.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Room Name"
          name="roomName"
          fullWidth
          size="small"
          variant="outlined"
          value={form.roomName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Size"
          name="size"
          size="small"
          type="number"
          variant="outlined"
          fullWidth
          value={form.size}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
