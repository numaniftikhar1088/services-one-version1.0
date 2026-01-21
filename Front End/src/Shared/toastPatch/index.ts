import { toast, ToastOptions, Id, ToastContent } from "react-toastify";

const methods: Array<"success" | "error" | "info" | "warn" | "reminder"> = [
  "success",
  "error",
  "info",
  "warn",
  "reminder",
];

const activeToasts = new Set<Id>();

methods.forEach((method) => {
  const originalMethod = toast[method];

  toast[method] = <TData = unknown>(
    content: ToastContent<TData>,
    options: ToastOptions = {}
  ): Id => {
    toast.clearWaitingQueue();

    const toastId = (options.toastId || content) as Id;
    if (toast.isActive(toastId)) return toastId as Id;

    const id = originalMethod(content, { ...options, toastId });
    activeToasts.add(id);

    return id;
  };
});

// Patch default toast function
const originalToast = toast;
const patchedToast = <TData = unknown>(
  content: ToastContent<TData>,
  options: ToastOptions = {}
): Id | undefined => {
  toast.clearWaitingQueue();

  const toastId = (options.toastId || content) as Id;
  if (toast.isActive(toastId)) return toastId as Id;

  const id = originalToast(content, { ...options, toastId });
  activeToasts.add(id);

  return id;
};

Object.assign(patchedToast, toast);
export default patchedToast;
