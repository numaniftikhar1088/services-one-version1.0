import React from "react";
import { useErrorBoundary } from "use-error-boundary";

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();
  if (didCatch) {
    console.log(error?.message);
  }
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default ErrorBoundary;
