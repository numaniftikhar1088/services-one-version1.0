import React, { useEffect } from "react";
import { createPortal } from "react-dom";

// Component props type
interface FullScreenLoaderProps {
  isVisible: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isVisible }) => {
  useEffect(() => {
    // Prevent body scrolling when loader is visible
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount or when visibility changes
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const loaderElement = (
    <>
      {/* Global CSS for spinner animation */}
      <style>
        {`
          @keyframes fullscreen-loader-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Overlay Container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
        onClick={(e) => e.stopPropagation()} // Block click events
        onKeyDown={(e) => e.stopPropagation()} // Block keyboard events
        tabIndex={-1} // Make it focusable to capture events
      >
        {/* Custom Spinner */}
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(255, 255, 255, 0.2)",
            borderTop: "4px solid white",
            borderRadius: "50%",
            animation: "fullscreen-loader-spin 1s linear infinite",
          }}
          aria-label="Loading..."
          role="progressbar"
        />
      </div>
    </>
  );

  // Use portal to render at document.body level (above everything)
  return createPortal(loaderElement, document.body);
};

export default FullScreenLoader;
