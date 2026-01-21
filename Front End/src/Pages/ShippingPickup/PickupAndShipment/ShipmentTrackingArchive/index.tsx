import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCourierContext } from "../../../../Shared/CourierContext";
import { StringRecord } from "../../../../Shared/Type";
import ManageGridData from "./ManageGridData";
import { useParams } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";

function ShipmentTrackingArchive() {
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const queryDisplayTagNames: StringRecord = {
    facilityName: "Facility Name",
    trackingNumber: "Tracking Number",
    dateofScan: "Date of Scan",
    status: "Status",
  };
  // let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const {
    setSearchRequestShipmentTracking,
    shipmentTracking,
    searchRequestShipmentTracking,
    initialSearchQueryShipmentTracking,
    loadDataShipmentTracking,
    setSorting,
    sortById,
    setPageSize,
    sort,
    searchRef,
    handleSort,
    pageSize,
    curPage,
    total,
    showPage,
    prevPage,
    pageNumbers,
    nextPage,
    totalPages,
    courierName,
    loading,
    setCurPage,
  } = useCourierContext();

  const { t } = useLang();

  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);

  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequestShipmentTracking({
      ...searchRequestShipmentTracking,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };
  function resetSearch() {
    setSearchRequestShipmentTracking(initialSearchQueryShipmentTracking);
    setSorting(sortById);
    loadDataShipmentTracking(true, true, sortById);
  }
  useEffect(() => {
    if (initialRender) {
      loadDataShipmentTracking(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);
  useEffect(() => {
    if (initialRender2) {
      loadDataShipmentTracking(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);
  const params = useParams().courierName;
  useEffect(() => {
    if (courierName == params) {
      loadDataShipmentTracking(false, false);
    }
  }, [courierName, params]);
  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequestShipmentTracking((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQueryShipmentTracking as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequestShipmentTracking)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequestShipmentTracking]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);
  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="">
          <div className="d-flex gap-4 flex-wrap mb-2">
            {searchedTags.map((tag) =>
              tag === "isDeleted" || tag === "courierName" ? (
                ""
              ) : (
                <div
                  className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light pe-1"
                  onClick={() => handleTagRemoval(tag)}
                >
                  <span className="fw-bold">
                    {t(queryDisplayTagNames[tag])}
                  </span>
                  <i className="bi bi-x"></i>
                </div>
              )
            )}
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
            <div className="d-flex gap-2 responsive-flexed-actions">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t("Records:")}</span>
                <select
                  className="form-select w-125px h-33px rounded py-2"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-allow-clear="true"
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50" selected>
                    50
                  </option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => {
                  setCurPage(1);
                  setTriggerSearchData((prev) => !prev);
                }}
                className="btn btn-linkedin btn-sm fw-500"
                aria-controls="Search"
              >
                {t("Search")}
              </button>
              <button
                onClick={resetSearch}
                type="button"
                className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                id="kt_reset"
              >
                <span>
                  <span>{t("Reset")}</span>
                </span>
              </button>
            </div>
          </div>
          <div className="card">
            <Box sx={{ height: "auto", width: "100%" }}>
              <ManageGridData
                rows={shipmentTracking}
                loading={loading}
                sort={sort}
                searchRef={searchRef}
                handleSort={handleSort}
                searchRequest={searchRequestShipmentTracking}
                onInputChangeSearch={onInputChangeSearch}
                handleKeyPress={handleKeyPress}
              />
              {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
                {/* =============== */}
                <p className="pagination-total-record mb-0">
                  {Math.min(pageSize * curPage, total) === 0 ? (
                    <span>Showing 0 of Total 0 Entries</span>
                  ) : (
                    <span>
                      Showing {pageSize * (curPage - 1) + 1} to{" "}
                      {Math.min(pageSize * curPage, total)} of Total{" "}
                      <span> {total} </span> entries{" "}
                    </span>
                  )}
                </p>
                {/* =============== */}
                <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
                  <li
                    className="btn btn-lg p-2 h-33px"
                    onClick={() => showPage(1)}
                  >
                    <i className="fa fa-angle-double-left"></i>
                  </li>
                  <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
                    <i className="fa fa-angle-left"></i>
                  </li>

                  {pageNumbers.map((page: any) => (
                    <li
                      key={page}
                      className={`px-2 ${
                        page === curPage
                          ? "font-weight-bold bg-primary text-white h-33px"
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => showPage(page)}
                    >
                      {page}
                    </li>
                  ))}

                  <li className="btn btn-lg p-2 h-33px" onClick={nextPage}>
                    <i className="fa fa-angle-right"></i>
                  </li>
                  <li
                    className="btn btn-lg p-2 h-33px"
                    onClick={() => {
                      if (totalPages === 0) {
                        showPage(curPage);
                      } else {
                        showPage(totalPages);
                      }
                    }}
                  >
                    <i className="fa fa-angle-double-right"></i>
                  </li>
                </ul>
              </div>
              {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShipmentTrackingArchive;
