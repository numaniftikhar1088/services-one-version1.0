import React from "react";
import CollapsibleTable from ".";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";

export const ToxicologyConfirmationResultFile: React.FC<{}> = () => {
  return (
    <>
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <CollapsibleTable />
    </>
  );
};
export default ToxicologyConfirmationResultFile;
