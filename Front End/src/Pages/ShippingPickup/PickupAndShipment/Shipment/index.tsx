import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { useCourierContext } from "../../../../Shared/CourierContext";
import useLang from "Shared/hooks/useLanguage";
import { StringRecord } from "../../../../Shared/Type";
import ManageGridData from "./ManageGridData";

function Shipment(props: {
  setModalShow: any;
  // courierName: any;
}) {
  const { setModalShow } = props;

  const queryDisplayTagNames: StringRecord = {
    senderName: "Sender Name",
    recipentName: "Recipent Name",
    recipentAddress: "Recipent Address",
    recipentCity: "Recipent City",
    recipentStateName: "Recipent State",
    recipentZipCode: "Recipent ZipCode",
    shipmentDate: "Shipment Date",
    trackingNumber: "Tracking Number",
    status: "Status",
    remarks: "Remarks",
  };
  // let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const {
    loadDataShipment,
    setShipment,
    shipment,
    setSearchRequestShipment,
    searchRequestShipment,
    initialSearchQueryShipment,
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
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);

  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequestShipment({
      ...searchRequestShipment,
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
    setSearchRequestShipment(initialSearchQueryShipment);
    setSorting(sortById);
    loadDataShipment(true, true, sortById);
  }
  useEffect(() => {
    if (initialRender) {
      loadDataShipment(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);
  useEffect(() => {
    if (initialRender2) {
      loadDataShipment(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);
  const AddNew = () => {
    setModalShow(true);
  };
  const params = useParams().courierName;
  useEffect(() => {
    if (courierName == params) {
      loadDataShipment(false, false);
    }
  }, [courierName, params]);
  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequestShipment((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQueryShipment as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequestShipment)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequestShipment]);

  useEffect(() => {
    if (searchedTags.length === 1) resetSearch();
  }, [searchedTags.length]);
  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="">
          <div className="d-flex gap-4 flex-wrap mb-2">
            {searchedTags.map((tag) =>
              tag === "courierName" ? (
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
                <span className="fw-400 mr-3">{t("Records")}</span>
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
              <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
                <div className="mt-0">
                  <PermissionComponent
                    moduleName="Shipping and Pickup"
                    pageName={`${
                      courierName === "UPS"
                        ? "UPS Pickup and Shipment"
                        : "FedEx Pickup and Shipment"
                    }`}
                    permissionIdentifier={`${
                      courierName === "UPS" ? "AddNew" : "AddNew"
                    }`}
                  >
                    <button
                      className="btn btn-primary btn-sm btn-primary--icon px-7"
                      onClick={(e) => AddNew()}
                    >
                      <span>
                        <i style={{ fontSize: "15px" }} className="fa">
                          &#xf067;
                        </i>
                        <span>{t("Schedule a New Shipment")}</span>
                      </span>
                    </button>
                  </PermissionComponent>
                </div>
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
                rows={shipment}
                loading={loading}
                sort={sort}
                searchRef={searchRef}
                handleSort={handleSort}
                searchRequest={searchRequestShipment}
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

export default Shipment;
