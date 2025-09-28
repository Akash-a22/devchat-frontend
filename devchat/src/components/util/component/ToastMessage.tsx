// Toast.ts
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "info" | "success" | "error" | "warn";

export const showToast = (
  type: ToastType,
  message: string,
  options?: ToastOptions
) => {
  const config: ToastOptions = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: false,
    pauseOnHover: true,
    className: "toastify-custom-toast",
    draggable: true,
    ...options,
  };

  toast[type](message, config);
};
