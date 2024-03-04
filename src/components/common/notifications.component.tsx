import toast from "react-hot-toast";

export const SuccessNotifications = (text: string) => {
  return toast.success(text, {
    position: "bottom-right",
  });
};

export const ErrorNotifications = (text: string) => {
  return toast.error(text, {
    position: "bottom-right",
  });
};
