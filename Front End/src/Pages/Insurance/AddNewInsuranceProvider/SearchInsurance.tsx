import { Collapse } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styles } from "Utils/Common";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
function SearchInsurance({
  tab2Search,
  handleInputChange,
  stateLookup,
  postData,
  setpostData,
  GetStatelookup,
  handleStatelookup,
  searchCriteria,
  handleReset,
  handleKeyPress1,
  handleSearch,
}: any) {
  const { t } = useLang();
  useEffect(() => {
    GetStatelookup();
  }, []);
  return (
    <>
      <Collapse in={tab2Search}>
        <div id="SearchCollapse" className="card mb-5">
          <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-1 minh-42px">
            <h4 className="m-1">{t("Search Insurance Provider")}</h4>
          </div>
          <div id="form-search" className=" card-body">
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">
                    {t("Insurance Provider Name")}
                  </label>

                  <input
                    id={`AllInsuranceProviderName`}
                    type="text"
                    name="providerName"
                    value={searchCriteria.providerName}
                    onChange={handleInputChange}
                    className="form-control bg-transparent"
                    placeholder={t("Insurance Provider Name")}
                    onKeyDown={handleKeyPress1}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Provider Code")}</label>
                  <input
                    id={`AllInsuranceProviderCode`}
                    type="text"
                    name="providerCode"
                    value={searchCriteria.providerCode}
                    onChange={handleInputChange}
                    className="form-control bg-transparent"
                    placeholder={t("Provider Code")}
                    onKeyDown={handleKeyPress1}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("City")}</label>
                  <input
                    id={`AllInsuranceCity`}
                    type="text"
                    name="city"
                    value={searchCriteria.city}
                    onChange={handleInputChange}
                    className="form-control bg-transparent"
                    placeholder={t("City")}
                    onKeyDown={handleKeyPress1}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500  ">{t("State")}</label>
                  <Select
                    inputId={`AllInsuranceState`}
                    onKeyDown={handleKeyPress1}
                    menuPortalTarget={document.body}
                    options={stateLookup}
                    theme={(theme: any) => styles(theme)}
                    placeholder={t("State")}
                    name="state"
                    value={stateLookup?.filter(
                      (item: any) => item.label === postData.state
                    )}
                    onChange={(e) => {
                      handleStatelookup(e);
                      handleInputChange(e, "state");
                    }}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <label className="  mb-2 fw-500">{t("Zip Code")}</label>
                <input
                  id={`AllInsuranceZipCode`}
                  type="text"
                  name="zipCode"
                  onKeyDown={(e) => {
                    const regex = /^[0-9]*$/;
                    if (
                      !(
                        regex.test(e.key) ||
                        e.key === "Backspace" ||
                        e.key === "Tab"
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={handleInputChange}
                  className="form-control bg-transparent"
                  placeholder={t("ZipCode")}
                  value={searchCriteria.zipCode}
                  maxLength={5}
                  inputMode="numeric"
                />
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Phone#")}</label>
                  <input
                    id={`AllInsuranceZipCode`}
                    type="text"
                    name="landPhone"
                    value={searchCriteria.landPhone}
                    onChange={handleInputChange}
                    className="form-control bg-transparent"
                    placeholder={t("Phone#")}
                    onKeyDown={handleKeyPress1}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end  gap-2 gap-lg-3">
                <button
                  id={`AllInsuranceSearch`}
                  onClick={handleSearch}
                  className="btn btn-primary btn-sm btn-primary--icon"
                >
                  <span>
                    <i className="fa fa-search"></i>
                    <span>{t("Search")}</span>
                  </span>
                </button>
                <button
                  id={`AllInsuranceSearch`}
                  onClick={handleReset}
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

export default SearchInsurance;
