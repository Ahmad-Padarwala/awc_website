import React from "react";
import { ToastContainer, toast } from "react-toastify";

const showToast = (message, type) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const ErrorToast = (message) => {
  showToast(message, "error");
};

export const SuccessToast = (message) => {
  showToast(message, "success");
};

export const WarningToast = (message) => {
  showToast(message, "warning");
}
const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default Toast;
