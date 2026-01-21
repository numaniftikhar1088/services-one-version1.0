import useLang from "./../../../../Shared/hooks/useLanguage";
function BySaleRep({
  handleRepClick,
  filteredAllReps,
  removeSelectedRep,
  allRepsSearchTerm,
  filteredSelectedReps,
  setAllRepsSearchTerm,
  selectedRepsSearchTerm,
  moveAllToFacilityLookup,
  moveAllToSelectedFacilities,
  setSelectedSalesRepsSearchTerm,
}: any) {
  const { t } = useLang();
  return (
    <>
      <div className="py-0">
        <div className="card shadow-sm rounded border border-warning">
          <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
            <h6 className="text-warning mb-0">{t("Sale Rep")}</h6>
          </div>
          <div className="card-body py-md-4 py-3 px-4">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="row">
                <div className="d-flex align-items-center flex-wrap justify-content-around">
                  <div className="col-lg-5 col-md-5 col-sm-12">
                    <span className="fw-bold">{t("All Reps")}</span>
                    <input
                    id="ReportAllSaleRepSearch"
                      className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-30px"
                      value={allRepsSearchTerm}
                      onChange={(e) => setAllRepsSearchTerm(e.target.value)}
                      placeholder={t("Search...")}
                      type="text"
                    />
                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                      <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                        <span className="fw-bold">{t("All List")}</span>
                      </div>
                      <ul  id="ReportAllSaleRep" className="list-group rounded-0 list-group-even-fill h-225px scroll">
                        {filteredAllReps.map((rep: any, index: any) => (
                          <li
                            key={index}
                            onClick={() => handleRepClick(rep)}
                            className="list-group-item py-1 px-2 border-0 cursor-pointer"
                          >
                            <div className="d-flex">
                              <span>{rep.label}</span>
                            </div>
                          </li>
                        ))}
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
                      id="ReportSelectAllSaleRep"
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
                      id="ReportDeSelectAllSaleRep"
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
                      {t("Selected Reps")}
                    </span>
                    <input
                     id="ReportSelectedSaleRepSearch"
                      className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-30px"
                      value={selectedRepsSearchTerm}
                      onChange={(e) =>
                        setSelectedSalesRepsSearchTerm(e.target.value)
                      }
                      placeholder={t("Search...")}
                      type="text"
                    />
                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                      <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                        <span className="fw-bold">{t("Selected List")}</span>
                      </div>
                      <ul id="ReportSelectedSaleRep" className="list-group rounded-0 list-group-even-fill h-225px scroll">
                        {filteredSelectedReps.map((rep: any, index: any) => (
                          <li
                            onClick={() => removeSelectedRep(rep)}
                            key={index}
                            className="list-group-item py-1 px-2 border-0 cursor-pointer"
                          >
                            {rep.label}
                          </li>
                        ))}
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

export default BySaleRep;
