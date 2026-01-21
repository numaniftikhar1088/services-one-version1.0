import { Collapse } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styles } from "Utils/Common";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
function SearchAssignComor({
  searchAssignComor,
  handleInputChangeComor,
  searchCriteriaAssignComor,
  handleResetComor,
  handleKeyPress,
  handleSearchComor,
}: any) {
  const { t } = useLang();
  return (
    <>
      <Collapse in={searchAssignComor}>
        <div id="SearchCollapse" className="card mb-5">
          <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-1 minh-42px">
            <h4 className="m-1">{t("Search Assign Comorbidities")}</h4>
          </div>
          <div id="form-search" className=" card-body">
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">
                    {t("Comorbidities Code")}
                  </label>
                  <input
                    id={`AllInsuranceProviderName`}
                    type="text"
                    name="code"
                    value={searchCriteriaAssignComor.code}
                    onChange={handleInputChangeComor}
                    className="form-control bg-transparent"
                    placeholder={t("Comorbidities Code")}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">
                    {t("Comorbidities Description")}
                  </label>
                  <input
                    id={`AllInsuranceProviderCode`}
                    type="text"
                    name="description"
                    value={searchCriteriaAssignComor.description}
                    onChange={handleInputChangeComor}
                    className="form-control bg-transparent"
                    placeholder={t("Comorbidities Description")}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Group")}</label>
                  <input
                    id={`AllInsuranceCity`}
                    type="text"
                    name="group"
                    value={searchCriteriaAssignComor.group}
                    onChange={handleInputChangeComor}
                    className="form-control bg-transparent"
                    placeholder={t("Group")}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Requisition")}</label>
                  <input
                    id={`AllInsuranceZipCode`}
                    type="text"
                    name="requisition"
                    value={searchCriteriaAssignComor.requisition}
                    onChange={handleInputChangeComor}
                    className="form-control bg-transparent"
                    placeholder={t("Requisition")}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Reference Lab")}</label>
                  <input
                    id={`AllInsuranceZipCode`}
                    type="text"
                    name="referenceLab"
                    value={searchCriteriaAssignComor.referenceLab}
                    onChange={handleInputChangeComor}
                    className="form-control bg-transparent"
                    placeholder={t("Reference Lab")}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Facility")}</label>
                  <input
                    id={`AllInsuranceZipCode`}
                    type="text"
                    name="facility"
                    value={searchCriteriaAssignComor.facility}
                    onChange={handleInputChangeComor}
                    className="form-control bg-transparent"
                    placeholder={t("Facility")}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Panel")}</label>
                  <input
                    id={`AllInsuranceZipCode`}
                    type="text"
                    name="panel"
                    value={searchCriteriaAssignComor.panel}
                    onChange={handleInputChangeComor}
                    className="form-control bg-transparent"
                    placeholder={t("Panel")}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end  gap-2 gap-lg-3">
                <button
                  id={`AllInsuranceSearch`}
                  onClick={handleSearchComor}
                  className="btn btn-primary btn-sm btn-primary--icon"
                >
                  <span>
                    <i className="fa fa-search"></i>
                    <span>{t("Search")}</span>
                  </span>
                </button>
                <button
                  id={`AllInsuranceSearch`}
                  onClick={handleResetComor}
                  className="btn btn-secondary btn-sm btn-secondary--icon"
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
    </>
  );
}

export default SearchAssignComor;
