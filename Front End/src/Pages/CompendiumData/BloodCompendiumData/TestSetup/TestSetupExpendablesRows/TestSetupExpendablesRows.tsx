import React, { memo } from "react";
import AdditionalSetup from "../TestSetupExpendablesRows/AdditionalSetup";
import ReferenceCode from "../TestSetupExpendablesRows/ReferenceCode";
import ReflexTests from "../TestSetupExpendablesRows/ReflexTests";

const TestSetupExpendablesRows: React.FC<{}> = () => {
  return (
    <div className="row">
      <div className="col-lg-12 bg-white px-lg-14 pb-6">
        <AdditionalSetup />
        <ReferenceCode />
        <ReflexTests />
      </div>
    </div>
  );
};
export default memo(TestSetupExpendablesRows);
