import React from "react";

const OrderInformation = () => {
  return (
    <>
      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="m-0">Order Information</h3>
          </div>
          <div className="card-body py-md-4 py-3">
            <div className="row">
              <div className="mb-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
                <span className="fw-500 text-primary">Order Type</span>
                <div>
                  <div>
                    <span className="fw-500">Normal</span>
                  </div>
                </div>
              </div>
              <div className="mb-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
                <span className="fw-500">Date of Collection</span>
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

export default OrderInformation;
