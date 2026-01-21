import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLang from './../../../../../Shared/hooks/useLanguage';

export const ViewReferenceLabNav: React.FC<{}> = () => {
  const { t } = useLang()
  const [open, setOpen] = useState(false);
  return (
    <>
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

              <li className="breadcrumb-item text-muted">{t("Admin")}</li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">
                {t("Reference Lab Setup")}
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button
              className={`btn btn-sm fw-500 btn-info text-capitalize ${open ? "d-none" : "d-block"
                }`}
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="bi bi-search"></i>
              {t("Search")}
            </Button>
            <Button
              className={`btn btn_icon min-w-30px btn-sm fw-500 btn-info ${open ? "" : "collapse"
                }`}
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="bi bi-x-lg p-0 m-0"></i>
            </Button>
            <Link
              to="/add-reference-lab"
              className="btn btn-sm fw-500 btn-primary"
            >
              <i className="bi bi-plus-lg"></i>
              {t("Add Reference Lab")}
            </Link>
          </div>
        </div>
      </div>
      <div className="app-container container-fluid w-100">
        <Collapse in={open}>
          <div id="SearchCollapse" className="card mb-5">
            <div id="form-search" className=" card-body">
              <div className="row">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                  <label className="mb-2">{t("Lab Name")}</label>
                  <input
                    id="providerName"
                    type="text"
                    name="patientFirstName"
                    value=""
                    className="form-control bg-transparent"
                    placeholder={t("Lab Name")}
                  />
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                  <label className="mb-2">{t("Address")}</label>
                  <input
                    id="providerName"
                    type="text"
                    name="patientFirstName"
                    value=""
                    className="form-control bg-transparent"
                    placeholder={t("Address")}
                  />
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                  <label className="mb-2">{t("Lab Display Name")}</label>
                  <input
                    id="providerName"
                    type="text"
                    name="patientFirstName"
                    value=""
                    className="form-control bg-transparent"
                    placeholder={t("Lab Display Name")}
                  />
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                  <label className="mb-2">{t("Enter 3 Digits Program")}</label>
                  <input
                    id="providerName"
                    type="text"
                    name="patientFirstName"
                    value=""
                    className="form-control bg-transparent"
                    placeholder={t("Enter 3 Digits Program")}
                  />
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                  <label className="mb-2">{t("3 Digits Lab Code")}</label>
                  <input
                    id="providerName"
                    type="text"
                    name="patientFirstName"
                    value=""
                    className="form-control bg-transparent"
                    placeholder={t("3 Digits Lab Code")}
                  />
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                  <label className="mb-2">{t("Enable Reference Id")}</label>
                  <input
                    id="providerName"
                    type="text"
                    name="patientFirstName"
                    value=""
                    className="form-control bg-transparent"
                    placeholder={t("Enable Reference Id")}
                  />
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-4">
                  <label className="mb-2">{t("Lab Type")}</label>
                  <input
                    id="providerName"
                    type="text"
                    name="patientFirstName"
                    value=""
                    className="form-control bg-transparent"
                    placeholder={t("Lab Type")}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-primary btn-sm btn-primary--icon">
                    <span>
                      <i className="fa fa-search"></i>
                      <span>{t("Search")}</span>
                    </span>
                  </button>
                  <button
                    type="reset"
                    className="btn btn-secondary btn-sm btn-secondary--icon"
                    id="kt_reset"
                  >
                    <span>
                      <i className="fa fa-times"></i>
                      <span>{t("Reset")}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};
