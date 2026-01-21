import React from "react";

const PatientInformation = () => {
  return (
    <>
      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="m-0">Patient Information</h3>
          </div>
          <div className="card-body py-md-4 py-3">
            <div className="row">
              <div className="mb-3 col-xl-5 col-lg-5 col-md-5 col-sm-5 d-flex justify-content-between align-items-center">
                <span className="fw-500">First Name</span>
                <div>
                  <div>
                    <span>TMIT</span>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2"></div>
              <div className="mb-3  col-xl-5 col-lg-5 col-md-5 col-sm-5 d-flex justify-content-between align-items-center">
                <span className="fw-500">Last Name</span>
                <div>
                  <div>
                    <span>....</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientInformation;
