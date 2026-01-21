import { LoadingButton } from "@mui/lab";
import {
  Box,
  CircularProgress,
  Container,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useRef, useState } from "react";
import { refreshToken } from "../../HttpClient";
import { getToken } from "../../Utils/Auth";
import useIdleTimeout from "../hooks/useIdle";
import useLang from "../hooks/useLanguage";
import useLogoutListener from "../hooks/useLogoutListener";

export default function AuthDialog() {
  const { t } = useLang();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number>(0);

  const token = getToken();
  const logout = useLogoutListener();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const decodedToken = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token format", error);
      return null;
    }
  }, [token]);

  const expiryTime = decodedToken?.exp ? decodedToken.exp * 1000 : 0;
  const expiryTimeInSeconds = Math.max((expiryTime - Date.now()) / 1000, 0);

  const handleIdle = () => {
    if (token) {
      setOpenModal(true);
      localStorage.setItem("openModal", "true");
    }
  };

  const handleLogout = () => {
    logout();
    setOpenModal(false);
    localStorage.setItem("openModal", "false");
  };

  const { reset } = useIdleTimeout({ onIdle: handleIdle });

  const handleContinue = async () => {
    setLoading(true);
    reset();
    const newToken = await refreshToken();
    setLoading(false);
    if (newToken) {
      setOpenModal(false);
      localStorage.setItem("continueClicked", Date.now().toString());
      localStorage.setItem("openModal", "false");
    }
  };

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "resetTime") reset();
      if (event.key === "openModal") setOpenModal(event.newValue === "true");
      if (event.key === "remainingTime" && openModal) {
        setTime(Number(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [openModal, reset]);

  useEffect(() => {
    if (!openModal) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    setTime(expiryTimeInSeconds);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current!);
          handleLogout();
          return 0;
        }
        const updatedTime = prevTime - 1;
        if (localStorage.getItem("openModal") === "true") {
          localStorage.setItem("remainingTime", updatedTime.toString());
        }
        return updatedTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [openModal, expiryTimeInSeconds]);

  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <Modal open={openModal} closeAfterTransition disableEscapeKeyDown>
      <Container
        sx={{
          backgroundColor: "white",
          p: 5,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          transition: "0.3s",
          opacity: openModal ? 1 : 0,
          transform: openModal ? "translateY(0)" : "translateY(100%)",
        }}
        maxWidth="xs"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <CircularProgress
            variant="determinate"
            value={(time / expiryTimeInSeconds) * 100}
            size={250}
            thickness={2}
            color="error"
          />
          <Typography
            variant="h3"
            component="div"
            position="absolute"
            textAlign="center"
          >
            {formatTime(time)}
            <Typography variant="h5">{t("Session Timeout")}</Typography>
          </Typography>
        </Box>
        <Typography align="center" mt={3} fontWeight="bold">
          {t("Your session is about to expire...")}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={5}
          gap={2}
        >
          <LoadingButton
            onClick={handleContinue}
            loadingIndicator={<CircularProgress color="inherit" size={24} />}
            loading={loading}
            variant="contained"
            color="success"
          >
            {t("Continue")}
          </LoadingButton>
          <LoadingButton
            onClick={handleLogout}
            variant="outlined"
            color="error"
          >
            {t("Logout")}
          </LoadingButton>
        </Box>
      </Container>
    </Modal>
  );
}
