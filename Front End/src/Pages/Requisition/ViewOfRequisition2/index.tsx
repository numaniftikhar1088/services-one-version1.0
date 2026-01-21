import React, { useRef } from "react";
import PatientInformation from "./PatientInformation";
import OrderInformation from "./OrderInformation";
import BillingInformation from "./BillingInformation";
import RequisitionInformation from "./RequisitionInformation";
import PhysicianSignature from "./PhysicianSignature";
import PatientSignature from "./PatientSignature";
import Files from "./FilesInformation";

const ViewSingleRequisition = () => {
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-stack">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="" className="text-muted text-hover-primary">
                  Home
                </a>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">Requisition</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">
                View Of Requisition
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-sm fw-bold btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_new_target"
            >
              <i style={{ fontSize: "18px" }} className="fa">
                &#xf1c1;
              </i>{" "}
              PDF
            </button>
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="row">
              {/* ***************** Patient Information ****************** */}
              <PatientInformation />
              {/* ***************** Order Information ****************** */}
              <OrderInformation />
              {/* ***************** Billing Information ****************** */}
              <BillingInformation />
              {/* ***************** Requisition Information ****************** */}
              <RequisitionInformation />
              {/* ***************** Physician Signature Information ****************** */}
              <PhysicianSignature />
              {/* ***************** Patient Signature Information ****************** */}
              <PatientSignature />
              {/* ***************** Files Information *******************/}
              <Files />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleRequisition;
