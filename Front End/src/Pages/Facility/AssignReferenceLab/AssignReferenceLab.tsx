import { Tooltip } from "@mui/material";
import React from "react";
import useLang from "Shared/hooks/useLanguage";
import { AssignReferenceLabGrid } from "./Grid";

const AssignReferenceLab: React.FC<{}> = () => {
  const { t } = useLang()
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        {/* **************** TOP NAV ****************8 */}
        <div className="app-toolbar py-3 py-lg-6">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                <li className="breadcrumb-item text-muted">
                  <a href="" className="text-muted text-hover-primary">
                  {t("Home")}
                  </a>
                </li>

                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>

                <li className="breadcrumb-item text-muted">{t("Manage Facility")}</li>

                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>

                <li className="breadcrumb-item text-muted">
                {t("Assign Reference Lab")}
                </li>
              </ul>
            </div>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <Tooltip title="Download" arrow placement="top">
                <button className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light">
                  <i className="bi bi-download"></i>
                </button>
              </Tooltip>
              <Tooltip title="Upload" arrow placement="top">
                <button className="btn btn-icon btn-sm fw-bold btn-warning ">
                  <i className="bi bi-cloud-upload"></i>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        {/* **************** Body ****************8 */}

        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid">
            <div className="card rounded-top-0 shadow-none">
              <div className="card-body px-3 px-md-8">
                <AssignReferenceLabGrid />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignReferenceLab