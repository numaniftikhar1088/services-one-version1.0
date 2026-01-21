import React, { useState} from "react";

// breadcrumb
import ManageSalesRepBreadCrumb from "./Sections/ManageSalesRepBreadCrumb";
import ManageSalesRepTable from "./Sections/ManageSalesRepTable";
import ManageSalesRepPagination from "./Sections/ManageSalesRepPagination";
import ManageSalesRepForm from "./Sections/ManageSalesRepForm";



const ManageSalesRep = () => {

// for showing and hiding data
const [showData, setShowData] = useState(false);
return (
<div>
  <div className="container-fluid px-10 py-5">
    {/* breadcrumb */}
    <ManageSalesRepBreadCrumb />
    {/* to show form */}
    {showData ? (
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center mt-0 bg-light-warning">
          <p className="m-0 fs-4 lead fw-500">Sales Member</p>
          <div className="d-flex align-items-center justify-content-end mb-2">
            <button
              className="btn btn-secondary btn-sm btn-secondary--icon mr-3"
              aria-controls="Search"
              onClick={() => setShowData(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm fw-500"
              aria-controls="Search"
            >
              Save
            </button>
          </div>
        </div>
        <div className="card-body py-md-4 py-3 ">
          <ManageSalesRepForm />
        </div>
      </div>
    ) : null}
    <div className="card shadow-sm mb-3 mt-6">
      <div className="container p-lg-0 rounded-0">
        <div className="card-header d-flex justify-content-between align-items-center p-0">
          <h5 className="m-0">Sales Representative</h5>
        </div>
        <div className="d-flex flex-wrap gap-4 justify-content-sm-between align-items-center col-12 responsive-flexed-actions mt-8">
          <div className="d-flex gap-3 responsive-flexed-actions-reverse">
            <div className="d-flex align-items-center">
              <span className="fw-400 mr-3">Records</span>
              <select
                className="form-select w-125px h-33px rounded"
                data-kt-select2="true"
                data-placeholder="Select option"
                data-dropdown-parent="#kt_menu_63b2e70320b73"
                data-allow-clear="true"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={150}>150</option>
                <option value={200}>200</option>
              </select>
            </div>
            <div className="d-flex gap-lg-3 gap-2">
              <div>
                <button
                  className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium btn btn-primary btn-sm css-18ngdvv-MuiButtonBase-root-MuiButton-root"
                  tabIndex={0}
                  type="button"
                  id="demo-positioned-button1"
                  aria-haspopup="true"
                  onClick={() => setShowData(true)}
                >
                  <i className="bi bi-plus-lg" />
                  Add New
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-setting btn-sm fw-500"
              aria-controls="Search"
            >
              {" "}
              Search
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
              id="kt_reset"
            >
              <span>
                <span>Reset</span>
              </span>
            </button>
          </div>
        </div>

        <div className="card-body py-3 px-0">
          <ManageSalesRepTable />
          <ManageSalesRepPagination />
        </div>
      </div>
    </div>

    {/* second */}
  </div>
  </div>
);
};
export default ManageSalesRep;
