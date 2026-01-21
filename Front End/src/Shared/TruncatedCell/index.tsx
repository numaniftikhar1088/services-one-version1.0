import { useEffect, useRef, useState } from "react";
import { Modal, Box } from "@mui/material";

export const TruncatedCell = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseFloat(
        window.getComputedStyle(textRef.current).lineHeight
      );
      const maxHeight = lineHeight * 3; // allow only 3 lines
      setIsOverflowing(textRef.current.scrollHeight > maxHeight);
    }
  }, [text]);

  return (
    <div className="relative flex items-center w-full">
      <div
        ref={textRef}
        onClick={() => isOverflowing && setOpen(true)}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          cursor: isOverflowing ? "pointer" : "text",
          transition: "all 0.25s ease",
          width: "100%",
        }}
        className={isOverflowing ? "truncate-cell-hover" : ""}
      >
        {text}
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
            fontFamily: "Poppins, sans-serif",
            fontSize: "1rem",
            lineHeight: 1.5,
          }}
        >
          {text}
        </Box>
      </Modal>
    </div>
  );
};
