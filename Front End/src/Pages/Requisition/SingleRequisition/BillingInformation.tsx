import React from "react";
import { UploadPhoto } from "../../../Shared/Icons";

const BillingInformation = () => {
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="m-0">Billing Information</h3>
      </div>
      <div className="card-body py-md-4 py-3">
        <div className="row">
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Billing Type</label>
            <div className="row m-0">
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Commercial</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Self Pay</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Medicare </span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Medicaid</span>
              </label>
            </div>
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Relationship to Insured </label>
            <div className="row m-0">
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Self</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Spouse</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Dependent</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Other</span>
              </label>
            </div>
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Primary Insurance Provider</label>
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
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Primary Policy ID</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Primary Policy ID"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Primary Group ID</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Primary Group ID"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Insurance Phone #</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Insurance Phone #"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className=" mb-2">Take Photo for Demographic info</label>
            <div className="d-flex align-items-stretch">
              <div className="d-flex align-items-center bg-hover-light-primary p-2 rounded px-3">
                <UploadPhoto />
                <div className="text-capitalize">Take Photo </div>
              </div>
            </div>
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className=" mb-2">Take Photo for Insurance card</label>
            <div className="d-flex align-items-stretch">
              <div className="d-flex align-items-center bg-hover-light-primary p-2 rounded px-3">
                <UploadPhoto />
                <div className="text-capitalize">Take Photo </div>
              </div>
            </div>
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <button className="btn btn-info">
              <i className="bi bi-plus-lg"></i> Add Another Insurance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingInformation;
