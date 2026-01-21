import React from "react";
import SignPad from "../../../Shared/Common/Input/SignPad";
import ReadMore from "./ReadMore";

const PatientSignature = () => {
  return (
    <div className="card shadow-sm mb-3 rounded mb-4">
      <div className="card-header d-flex justify-content-between align-items-center rounded">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <h6>Patient Signature</h6>
        </div>
      </div>
      <div className="card-body py-md-4 py-3">
        <div className="row">
          <div className=" col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-3">
            <span>
              For non-touch screen devices, the patient needs to type their full
              name below, and provide a secondary identifier.
            </span>
          </div>
          <div className="mb-1 col-xl-5 col-lg-5 col-md-5 col-sm-5 ">
            <input
              type="text"
              name="name"
              className="form-control bg-transparent mb-3"
              placeholder="Full Name"
              value=""
            />
          </div>
          <div className="row">
            <div className="mb-5 col-xl-5 col-lg-5 col-md-5 col-sm-5">
              <select
                className="form-select"
                data-kt-select2="true"
                data-placeholder="Select option"
                data-dropdown-parent="#kt_menu_63b2e70320b73"
                data-allow-clear="true"
              >
                <option>--- select Option ---</option>
                <option value="1">option 1</option>
                <option value="2">option 2</option>
                <option value="3">option 3</option>
                <option value="4">option 4</option>
              </select>
            </div>
            <div className="mb-5 col-xl-3 col-lg-3 col-md-3 col-sm-3 ">
              <input
                type="text"
                name="signature"
                className="form-control bg-transparent mb-3"
                placeholder="..."
                value=""
              />
            </div>
            <div className="mb-5 col-xl-4 col-lg-4 col-md-4 col-sm-4 ">
              <button
                type="button"
                className="btn btn-primary btn-sm px-4 mx-2 p-2"
              >
                <span className="bi bi-plus"></span>Add Signature
              </button>
            </div>

            <div className="mb-5 col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
              <span>
                <strong>
                  By selecting the Add Signature button, I attest that I approve
                  of this digital signature
                </strong>
              </span>
            </div>
          </div>
          <div className=" col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <label className="mb-5 form-check form-check-sm form-check-solid col-12">
              <input className="form-check-input mr-2" type="checkbox" />
              <span>Signature on Paper Requisition</span>
            </label>
            <SignPad />
            <div>
              <ReadMore>
                I authorize the collection of a Nasopharyngeal specimen for
                Covid-19 Testing. I further understand and agree to the
                following: Read More
              </ReadMore>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSignature;
