import React, { useState } from "react";

const CollectionRequest = () => {
  const [showhide, setshowhide] = useState(true);
  return (
    <>
      <div className="mb-5 col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
        <label className="required mb-2">Order Priority</label>
        <div className="row m-0">
          <label className="form-check form-check-sm form-check-solid col-3 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="OrderPririty"
            />
            <span className="form-check-label">Routine</span>
          </label>
          <label className="form-check form-check-sm form-check-solid col-3 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="StartOrder"
            />
            <span className="form-check-label">Urgent</span>
          </label>
          <label className="form-check form-check-sm form-check-solid col-3 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="StartOrder"
            />
            <span className="form-check-label">STAT</span>
          </label>
        </div>
      </div>
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <label className="required mb-2">Collect by date</label>
        <input
          type="date"
          name=""
          className="form-control bg-transparent mb-3 mb-lg-0"
          placeholder="Date Received"
          value=""
        />
      </div>
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
        <label className="required mb-2">Collect by time</label>
        <input
          type="time"
          name=""
          className="form-control bg-transparent mb-3 mb-lg-0"
          placeholder="HH:MI"
          value=""
        />
      </div>

      <div className="mb-5 col-xl-5 col-lg-5 col-md-5 col-sm-12 ">
        <label className=" mb-2">Mileage</label>
        <input
          type="text"
          name=""
          className="form-control bg-transparent mb-3 mb-lg-0"
          placeholder="Mileage"
          value=""
        />
      </div>
      <div className="mb-5 col-xl-7 col-lg-7 col-md-7 col-sm-12 ">
        <label className="required mb-2">
          Address to use for specimen
        </label>
        <div className="row m-0">
          <label className="form-check form-check-sm form-check-solid col-6 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="specimencollection"
              onChange={() => setshowhide(true)}
            />
            <span className="form-check-label">Patient Address</span>
          </label>
          <label className="form-check form-check-sm form-check-solid col-6 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="specimencollection"
              onChange={() => setshowhide(!showhide)}
            />
            <span className="form-check-label">Use Other Address</span>
          </label>
        </div>
      </div>
      <div
        className={`mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ${
          showhide ? "collapse" : ""
        }`}
      >
        <label className="required mb-2">Address 1</label>
        <input
          type="text"
          name=""
          className="required form-control bg-transparent mb-3 mb-lg-0"
          placeholder="Address 1"
          value=""
        />
      </div>
      <div
        className={`mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ${
          showhide ? "collapse" : ""
        }`}
      >
        <label className="mb-2">Address 2</label>
        <input
          type="text"
          name=""
          className="required form-control bg-transparent mb-3 mb-lg-0"
          placeholder="Address 2"
          value=""
        />
      </div>
      <div
        className={`mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ${
          showhide ? "collapse" : ""
        }`}
      >
        <label className="mb-2">City</label>
        <input
          type="text"
          name=""
          className="required form-control bg-transparent mb-3 mb-lg-0"
          placeholder="City"
          value=""
        />
      </div>
      <div
        className={`mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ${
          showhide ? "collapse" : ""
        }`}
      >
        <label className="required mb-2">State </label>
        <select
          className="form-select"
          data-kt-select2="true"
          data-placeholder="Select option"
          data-dropdown-parent="#kt_menu_63b2e70320b73"
          data-allow-clear="true"
        >
          <option> --- Select State ---</option>
          <option value="1">option 1</option>
          <option value="2">option 2</option>
          <option value="3">option 3</option>
          <option value="4">option 4</option>
        </select>
      </div>
      <div
        className={`mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ${
          showhide ? "collapse" : ""
        }`}
      >
        <label className=" mb-2">Zip Code</label>
        <input
          type="text"
          name=""
          className="required form-control bg-transparent mb-3 mb-lg-0"
          placeholder="Zip Code"
          value=""
        />
      </div>
    </>
  );
};

export default CollectionRequest;
