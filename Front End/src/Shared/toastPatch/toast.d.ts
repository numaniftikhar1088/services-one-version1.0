import { Id, ToastContent, ToastOptions } from "react-toastify";

declare module "react-toastify" {
  namespace toast {
    function reminder<TData = unknown>(
      content: ToastContent<TData>,
      options?: ToastOptions
    ): Id;

    // Ensure clearWaitingQueue is recognized globally
    function clearWaitingQueue(): void;
  }
}
