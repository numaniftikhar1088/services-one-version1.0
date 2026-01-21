import Skeleton from "@mui/material/Skeleton";

const MuiSkeleton = (props: any) => {
  return (
    <Skeleton
      sx={{ bgcolor: "#ffffff" }}
      variant="rounded"
      animation="wave"
      width="100%"
      height={props.height ?? 38}
      style={{ borderRadius: "10px" }}
    />
  );
};

export default MuiSkeleton;
