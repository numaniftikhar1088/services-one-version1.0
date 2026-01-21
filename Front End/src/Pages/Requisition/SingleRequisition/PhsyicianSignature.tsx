import React, { useState } from "react";
import SignPad from "../../../Shared/Common/Input/SignPad";
import ReadMore from "./ReadMore";

const PhsyicianSignature = () => {
  return (
    <div className="card shadow-sm mb-3 rounded mb-4">
      <div className="card-header d-flex justify-content-between align-items-center rounded">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <h6>Physician Signature</h6>
        </div>
      </div>
      <div className="card-body py-md-4 py-3">
        <div className="row">
          <div className=" col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <label className="form-check form-check-sm form-check-solid col-12 mb-5">
              <input className="form-check-input mr-2" type="checkbox" />
              <span>Signature on Paper Requisition</span>
            </label>
            <SignPad />
            <div>
              <ReadMore>
                As part of my antibiotic stewardship policy, I find it medically
                necessary to rapidly determine and differentiate a viral and/or
                bacterial infection in order to treat with or without
                appropriate antibiotics. Having the most accurate and timely
                data available to me directly guides my treatment and patient
                management.
              </ReadMore>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhsyicianSignature;
