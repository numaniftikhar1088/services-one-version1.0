import { Collapse } from "@mui/material";
import React, { useEffect, useState } from "react";
import { styles } from "Utils/Common";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
function SearchAllComorbidities({
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
            <h4 className="m-1">{t("Search All Comorbidities")}</h4>
          </div>
          <div id="form-search" className=" card-body">
            <div className="row">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Comorbidity Code")}</label>
                  <input
                    id={`AllComorBiditiesProviderCode`}
                    type="text"
                    name="AllComorbidityCode"
                    value={searchCriteria.AllComorbidityCode}
                    onChange={handleInputChange}
                    className="form-control bg-transparent"
                    placeholder={t("Comorbidity Code")}
                    onKeyDown={handleKeyPress1}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">
                    {t("Comorbidity Description")}
                  </label>
                  <input
                    id={`AllComorBiditiesCity`}
                    type="text"
                    name="AllComorbidityDescription"
                    value={searchCriteria.AllComorbidityDescription}
                    onChange={handleInputChange}
                    className="form-control bg-transparent"
                    placeholder={t("Description")}
                    onKeyDown={handleKeyPress1}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end  gap-2 gap-lg-3">
                <button
                  id={`AllComorBiditiesSearch`}
                  onClick={handleSearch}
                  className="btn btn-primary btn-sm btn-primary--icon"
                >
                  <span>
                    <i className="fa fa-search"></i>
                    <span>{t("Search")}</span>
                  </span>
                </button>
                <button
                  id={`AllComorBiditiesSearch`}
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

export default SearchAllComorbidities;
