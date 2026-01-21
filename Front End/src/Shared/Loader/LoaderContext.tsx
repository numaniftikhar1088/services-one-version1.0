import React, { createContext, useContext, useState, ReactNode } from "react";
import FullScreenLoader from "./FullScreenLoader";

// Context type definition
interface LoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  hideAllLoaders: () => void;
}

// Create the context
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

// Provider props type
interface LoaderProviderProps {
  children: ReactNode;
}

// Custom hook to use the loader
export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

// Loader Provider Component
export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => {
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  // Force hide all loaders (useful for cleanup or error handling)
  const hideAllLoaders = () => {
    setIsLoading(false);
  };

  const contextValue: LoaderContextType = {
    isLoading,
    showLoader,
    hideLoader,
    hideAllLoaders,
  };

  return (
    <LoaderContext.Provider value={contextValue}>
      {children}
      <FullScreenLoader isVisible={isLoading} />
    </LoaderContext.Provider>
  );
};
