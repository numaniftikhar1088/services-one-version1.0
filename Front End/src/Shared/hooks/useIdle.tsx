import { useEffect, useRef, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

const useIdleTimeout = ({ onIdle }: any) => {
  const logoutTimeoutRef = useRef<any>(null);
  const [isIdle, setIdle] = useState(false);

  const handleIdle = () => {
    if (!sessionStorage.getItem("userinfo")) return;
    setIdle(true);
    onIdle();
    clearTimeout(logoutTimeoutRef.current);
  };

  const { reset } = useIdleTimer({
    timeout: 1200000,
    onIdle: handleIdle,
    debounce: 500,
    crossTab: true,
  });

  const resetAll = () => {
    reset();
    clearTimeout(logoutTimeoutRef.current);
    setIdle(false);
  };

  useEffect(() => {
    const resetIdleTimeoutAcrossTabs = () => {
      localStorage.setItem("resetTime", Date.now().toString());
    };

    const resetIdleTimeoutHandler = () => {
      reset();
      resetIdleTimeoutAcrossTabs();
    };

    window.addEventListener("mousemove", resetIdleTimeoutHandler);
    window.addEventListener("keypress", resetIdleTimeoutHandler);

    return () => {
      window.removeEventListener("mousemove", resetIdleTimeoutHandler);
      window.removeEventListener("keypress", resetIdleTimeoutHandler);
    };
  }, [reset]);

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (event.key === "continueClicked") {
        resetAll();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    isIdle,
    setIdle,
    reset: resetAll,
  };
};

export default useIdleTimeout;
