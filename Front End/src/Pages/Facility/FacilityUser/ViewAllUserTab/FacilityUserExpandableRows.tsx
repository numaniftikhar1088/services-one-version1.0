import React, { memo } from "react";
import Row from "./Row";
import ViewAssignedFacilites from "./ViewAssignedFacilites";

const FacilityUserExpandableRows: React.FC<{}> = () => {
  return (
    <div className="row">
      <div className="col-lg-12 bg-white px-lg-14 pb-6">

        <ViewAssignedFacilites id={Row} />
      </div>
    </div>
  );
};
export default memo(FacilityUserExpandableRows);
