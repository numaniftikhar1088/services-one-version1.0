import React, { useState } from "react";
function NormalOrder() {
  return (
    <>
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
        <label className="required mb-2">Date of Collection</label>
        <input
          type="date"
          name=""
          className="form-control bg-transparent mb-3 mb-lg-0"
          placeholder="Date Received"
          value=""
        />
      </div>
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
        <label className="required mb-2">Time of Collection</label>
        <input
          type="time"
          name=""
          className="form-control bg-transparent mb-3 mb-lg-0"
          placeholder="HH:MI"
          value=""
        />
      </div>
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <label className="required mb-2">Date Received</label>
        <input
          type="date"
          name=""
          className="form-control bg-transparent mb-3 mb-lg-0"
          placeholder="Date Received"
          value=""
        />
      </div>
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
        <label className="mb-2">Mileage</label>
        <input
          type="text"
          name=""
          className="form-control bg-transparent mb-3 mb-lg-0"
          placeholder="Mileage"
          value=""
        />
      </div>
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <label className="required mb-2">Collector Name </label>
        <select
          className="form-select"
          data-kt-select2="true"
          data-placeholder="Select option"
          data-dropdown-parent="#kt_menu_63b2e70320b73"
          data-allow-clear="true"
        >
          <option> Select Collector Name </option>
          <option value="1">option 1</option>
          <option value="2">option 2</option>
          <option value="3">option 3</option>
          <option value="4">option 4</option>
        </select>
      </div>
      
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
        <label className="required mb-2">Collected by</label>
        <div className="row m-0">
          <label className="form-check form-check-sm form-check-solid col-6 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="Collectedby"
            />
            <span className="form-check-label">Office Staff</span>
          </label>
          <label className="form-check form-check-sm form-check-solid col-6 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="Collectedby"
            />
            <span className="form-check-label">United</span>
          </label>
        </div>
      </div>
      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
        <label className="required mb-2">STAT Order</label>
        <div className="row m-0">
          <label className="form-check form-check-sm form-check-solid col-6 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="StartOrder"
            />
            <span className="form-check-label">Yes</span>
          </label>
          <label className="form-check form-check-sm form-check-solid col-6 my-1">
            <input
              className="form-check-input"
              type="radio"
              name="StartOrder"
            />
            <span className="form-check-label">No</span>
          </label>
        </div>
      </div>
    </>
  );
}

export default NormalOrder;
