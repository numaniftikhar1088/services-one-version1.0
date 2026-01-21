import React from "react";

const PatientInformation = () => {
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="m-0">Patient Information</h3>
      </div>
      <div className="card-body py-md-4 py-3">
        <div className="row">
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">First Name</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="First Name"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Last Name</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Last Name"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Date of Birth</label>
            <input
              type="date"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Date of Birth"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Gender</label>
            <div className="row m-0">
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Male</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Female</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Unknown </span>
              </label>
              {/* <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Intersex</span>
              </label> */}
            </div>
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Address 1</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Address 1"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Address 2</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Address 2"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Zip Code</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Zip Code"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">City</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="City"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">State</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="State"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Country</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Country"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">County</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="County"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Email</label>
            <input
              type="email"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Email"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Phone Number</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="(999) 999-9999"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Mobile Number</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="(999) 999-9999"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Race</label>
            <div className="row m-0">
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Asian</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Black</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">White </span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">American Indian/AK</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Hawaiian/Pacific </span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Unknown</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Not Specified</span>
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
            <label className="mb-2">Ethnicity </label>
            <div className="row m-0">
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Hispanic/Latino</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Non-Hispanic / Latino </span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Not Specified</span>
              </label>
            </div>
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Social Security Number</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Social Security Number"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">DL/ID Number</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="DL/ID Number"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Passport Number</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Passport Number"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="required mb-2">Patient Type</label>
            <div className="row m-0">
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Resident</span>
              </label>
              <label className="form-check form-check-sm form-check-solid col-6 my-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="BillingType"
                />
                <span className="form-check-label">Staff</span>
              </label>
            </div>
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Height</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Height"
              value=""
            />
          </div>
          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <label className="mb-2">Weight (LBS)</label>
            <input
              type="text"
              name=""
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder="Weight (LBS)"
              value=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInformation;
