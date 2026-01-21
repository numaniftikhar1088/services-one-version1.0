import { Collapse } from "@mui/material";
import React from "react";
import useLang from "Shared/hooks/useLanguage";

function SearchDrugAllergy({
  setSearchCriteria,
  searchCriteria,
  tab2Search,
  handleSearch,
  handleKeyPress1,
  handleReset,
}: any) {
  const { t } = useLang();
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <Collapse in={tab2Search}>
          <div id="SearchCollapse" className="card mb-5">
            <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-1 minh-42px">
              <h4 className="m-1">{t("Search Drug Allergy")}</h4>
            </div>
            <div id="form-search" className=" card-body">
              <div className="row">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Code")}</label>

                    <input
                      id={`NewDrugAllergyCodeSearch`}
                      type="text"
                      name="Code"
                      value={searchCriteria.Code}
                      onChange={(e) =>
                        setSearchCriteria((oldData: any) => ({
                          ...oldData,
                          Code: e.target.value,
                        }))
                      }
                      className="form-control bg-transparent"
                      onKeyDown={handleKeyPress1}
                      placeholder={t("Code")}
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Description")}</label>

                    <input
                      id={`NewDrugAllergyDescriptionSearch`}
                      type="text"
                      name="Description"
                      value={searchCriteria.description}
                      onChange={(e) =>
                        setSearchCriteria((oldData: any) => ({
                          ...oldData,
                          description: e.target.value,
                        }))
                      }
                      className="form-control bg-transparent"
                      onKeyDown={handleKeyPress1}
                      placeholder={t("Description")}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end  gap-2 gap-lg-3">
                  <button
                    id={`NewDrugAllergySearch`}
                    onClick={handleSearch}
                    className="btn btn-primary btn-sm btn-primary--icon"
                  >
                    <span>
                      <i className="fa fa-search"></i>
                      <span>{t("Search")}</span>
                    </span>
                  </button>
                  <button
                    type="reset"
                    onClick={handleReset}
                    className="btn btn-secondary btn-sm btn-secondary--icon"
                    id={`NewDrugAllergyReset`}
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
}

export default SearchDrugAllergy;
