// components/VersionChecker.tsx

import { CSSProperties, useEffect, useState } from "react";
import { SlRefresh } from "react-icons/sl";

export const fetchCurrentVersion = async () => {
  const res = await fetch("/meta.json", { cache: "no-store" });
  const data = await res.json();
  return data.version;
};

export default function VersionChecker() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const latestVersion = await fetchCurrentVersion();

        const currentVersion = localStorage.getItem("appVersion");

        if (!currentVersion) {
          // First load, store current version

          localStorage.setItem("appVersion", latestVersion);
        } else if (latestVersion != currentVersion) {
          // New version detected!

          setShowBanner(true);
        }
      } catch (err) {
        console.error("Failed to check version:", err);
      }
    };

    const interval = setInterval(checkForUpdate, 60000); // every 60s

    checkForUpdate(); // initial check on load

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    localStorage.removeItem("appVersion");

    window.location.reload();
  };

  if (!showBanner) return null;

  return (
    <div style={styles.banner as CSSProperties} onClick={handleRefresh}>
      <span className="mr-2"> A new version is available.</span>
      <SlRefresh style={styles.button} />
    </div>
  );
}

const styles = {
  banner: {
    position: "fixed",
    bottom: 0,
    width: "250px",
    right: 20,
    backgroundColor: "#69a54b",
    color: "#fff",
    padding: "10px",
    textAlign: "center",
    zIndex: 9999,
    borderTopRightRadius: "10px",
    borderTopLeftRadius: "10px",
    cursor: "pointer",
  },

  button: {
    cursor: "pointer",
    width: "20px",
    height: "20px",
  },
};
