import { Box, CircularProgress, Container, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useLang from "./../hooks/useLanguage";

interface CountdownTimerProps {
  initialTime: number;
  isActive: boolean;
  onTimeout: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime,
  isActive,
  onTimeout,
}) => {
  const { t } = useLang();
  const [time, setTime] = useState<number>(initialTime);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    const deltaTime = timestamp - startTimeRef.current;
    if (deltaTime >= 10) {
      setTime((prevTime) => {
        const newTime = Math.max(prevTime - deltaTime, 0);
        if (newTime === 0 && isActive) {
          cancelAnimationFrame(requestRef.current);
          onTimeout();
        }
        return newTime;
      });
      startTimeRef.current = timestamp;
    }
    if (time > 0 && isActive) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isActive) {
      setTime(initialTime);
      startTimeRef.current = 0;
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive, initialTime]);

  const formatTime = (time: number): string => {
    const seconds = Math.floor(time / 1000) % 60;
    const minutes = Math.floor(time / (1000 * 60));
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const progress = (time / initialTime) * 100;

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={250}
          thickness={2}
          color="error"
        />
        <Typography
          variant="h3"
          component="div"
          position="absolute"
          className="d-flex justify-content-center align-items-center flex-column"
        >
          {formatTime(time)}
          <h4>{t("Session Timeout")}</h4>
        </Typography>
      </Box>
    </Container>
  );
};

export default CountdownTimer;
