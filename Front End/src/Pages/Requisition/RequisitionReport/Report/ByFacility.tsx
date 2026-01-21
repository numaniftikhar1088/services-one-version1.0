import React from "react";
import useLang from "./../../../../Shared/hooks/useLanguage";

function ByFacility({
  handleFacilityClick,
  filteredAllFacilities,
  moveAllToFacilityLookup,
  allFacilitiesSearchTerm,
  removeSelectedFacilities,
  filteredSelectedFacilities,
  setAllFacilitiesSearchTerm,
  moveAllToSelectedFacilities,
  selectedFacilitiesSearchTerm,
  setSelectedFacilitiesSearchTerm,
}: any) {
  const { t } = useLang();
  return (
    <>
      <div className="py-0">
        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
            <h6 className="text-warning mb-0">{t("Facilities")}</h6>
          </div>
          <div className="card-body py-md-4 py-3 px-4">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                <div className="d-flex align-items-center flex-wrap justify-content-around">
                  <div className="col-lg-5 col-md-5 col-sm-12">
                    <span className="fw-bold">{t("All Facilities")}</span>
                    <input
                      id="ReportAllFacilitySearchInput"
                      className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-30px"
                      value={allFacilitiesSearchTerm}
                      onChange={(e) =>
                        setAllFacilitiesSearchTerm(e.target.value)
                      }
                      placeholder={t("Search...")}
                      type="text"
                    />
                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                      <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                        <span className="fw-bold">{t("All List")}</span>
                      </div>
                      <ul
                        id="ReportAllFacility"
                        className="list-group rounded-0 list-group-even-fill h-225px scroll"
                      >
                        {filteredAllFacilities.map(
                          (facility: any, index: any) => (
                            <li
                              key={index}
                              onClick={() => handleFacilityClick(facility)}
                              className="list-group-item py-1 px-2 border-0 cursor-pointer"
                            >
                              <div className="d-flex">
                                <span>{facility.label}</span>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="align-items-center d-flex flex-md-column mt-2 justify-content-center gap-2 px-3">
                    <span
                      className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                      onClick={moveAllToSelectedFacilities}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        id="SelectAllFacilityButton"
                        style={{
                          fontSize: "20px",
                          color: "white",
                        }}
                        className="fa"
                      >
                        &#xf101;
                      </i>
                    </span>
                    <span
                      className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1"
                      onClick={moveAllToFacilityLookup}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        id="DeselectFacilityButton"
                        style={{
                          fontSize: "20px",
                          color: "white",
                        }}
                        className="fa"
                      >
                        &#xf100;
                      </i>
                    </span>
                  </div>
                  <div className="col-lg-6 col-md-5 col-sm-12">
                    <span className="fw-bold required">
                      {t("Selected Facilities")}
                    </span>
                    <input
                      id="ReportSelectedFacilitySearchInput"
                      className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-30px"
                      value={selectedFacilitiesSearchTerm}
                      onChange={(e) =>
                        setSelectedFacilitiesSearchTerm(e.target.value)
                      }
                      placeholder={t("Search...")}
                      type="text"
                    />
                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                      <div className="align-items-center bg-secondary d-flex h-40px justify-content-between px-4 rounded">
                        <span className="fw-bold">{t("Selected List")}</span>
                      </div>
                      <ul
                        id="ReportSelectedFacility"
                        className="list-group rounded-0 list-group-even-fill h-225px scroll"
                      >
                        {filteredSelectedFacilities.map(
                          (facility: any, index: any) => (
                            <li
                              key={index}
                              onClick={() => removeSelectedFacilities(facility)}
                              className="list-group-item py-1 px-2 border-0 cursor-pointer"
                            >
                              {facility.label}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ByFacility;
