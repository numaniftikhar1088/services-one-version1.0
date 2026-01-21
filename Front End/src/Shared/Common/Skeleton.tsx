import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingSkeleton = (props: any) => {
  return (
    <>
      <SkeletonTheme baseColor="#fff" highlightColor="gray">
        <div>
          <Skeleton count={props?.count} duration={2} />
        </div>
      </SkeletonTheme>
    </>
  );
};

export default LoadingSkeleton;
