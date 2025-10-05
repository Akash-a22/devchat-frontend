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
    autoClose: 1000,
    hideProgressBar: true,
    pauseOnHover: false,
    className: "toastify-custom-toast",
    draggable: false,
    ...options,
  };

  toast[type](message, config);
};
