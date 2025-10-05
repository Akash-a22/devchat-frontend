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
import type { FormData, Props } from "../../../util/type";

export const JoinRoomModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = React.useState<FormData>({
    username: "",
    key: "",
  });

  const [error, setError] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { username, key } = form;
    console.log(username, key);

    if (!username.trim() || !key?.trim()) {
      setError("Please fill all the fields.");
      return;
    }

    setError("");
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Join a Room</DialogTitle>
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
          label="key"
          name="key"
          fullWidth
          size="small"
          variant="outlined"
          value={form.key}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};
