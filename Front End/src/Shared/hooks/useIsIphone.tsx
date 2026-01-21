// Created by Hafiz Abdullah for iPhone Detection | Enhancement of Ticket #45132
import { useEffect, useState } from "react";

function useIsIphone(): boolean {
  const [isIphone, setIsIphone] = useState(false);

  useEffect(() => {
    const checkIphone = () => {
      // Type-safe access: window as any (because window.opera is not in TS definitions)
      const ua =
        navigator.userAgent ||
        (navigator as any).vendor ||
        ((window as any).opera ?? "");

      const isiPhone = /iPhone/i.test(ua);
      setIsIphone(isiPhone);
    };

    checkIphone();
  }, []);

  return isIphone;
}

export default useIsIphone;
