import CircularProgress from "@mui/material/CircularProgress";
import useIsMobile from "Shared/hooks/useIsMobile";

export const Loader = ({ className = "", extraClass = "" }) => {
  const isMobile = useIsMobile();

  return (
    <div
      // className={`${isMobile ?  : "" }`}
      style={{
        display: "flex",
        // marginLeft: isMobile ? `${extraClass}`  : "0px",
        // justifyContent: isMobile ? `${className}`: "center", // example usage

        marginLeft: isMobile ? ` 130px` : "0px",
        justifyContent: isMobile ? `start` : "center", // example usage
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress style={{ color: "#69A54B" }} />
    </div>
  );
};
