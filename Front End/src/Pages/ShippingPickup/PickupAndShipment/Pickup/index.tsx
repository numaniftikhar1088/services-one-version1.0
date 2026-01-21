import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { useCourierContext } from "../../../../Shared/CourierContext";
import { StringRecord } from "../../../../Shared/Type";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import ManageGridData from "./ManageGridData";
import useLang from "Shared/hooks/useLanguage";

function Pickup(props: { setModalShow: any }) {
  const { t } = useLang();

  const cancelPickupSchema = yup.object().shape({
    cancelReason: yup
      .string()
      .required("Reason of cancel order is required")
      .min(5, "Reason must be at least 5 characters")
      .max(300, "Reason cannot exceed 300 characters"),
  });

  const { setModalShow } = props;
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const queryDisplayTagNames: StringRecord = {
    companyName: "Company Name",
    contactName: "Contact Name",
    address: "Address",
    city: "City",
    stateName: "State",
    zipCode: "Zip Code",
    pickupDate: "Pickup Date",
    dispatchConfirmationNo: "Dispatch Confirmation No",
    location: "Location",
    remarks: "Remarks",
    startPickupTime: "Start Pickup Time",
    trackingNumber: "Tracking Number",
    logIdentifier: "Log Identifier",
    packageWeight: "Package Weight",
  };
  // let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const {
    loadData,
    rows,
    setSearchRequest,
    searchRequest,
    initialSearchQuery,
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
    // ✅ ADD THESE
    openCancelModal,
    selectedRowForCancel,
    handleCloseCancelModal,
  } = useCourierContext();
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const [isApiSubmitting, setIsApiSubmitting] = useState(false);

  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadData(true, true, sortById);
  }

  useEffect(() => {
    if (initialRender) {
      loadData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  useEffect(() => {
    if (initialRender2) {
      loadData(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);

  const AddNew = () => {
    setModalShow(true);
  };

  const params = useParams().courierName;
  useEffect(() => {
    if (courierName === params) {
      loadData(false, false);
    }
  }, [courierName, params]);
  // Handling searchedTags

  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 1) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <Collapse in={openCancelModal} className="border rounded">
        <div className="app-content flex-column-fluid mt-4 mb-4">
          <div>
            <div id="ModalCollapse" className="card">
              <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-3 minh-42px">
                <h5 className="m-1">Cancel Order</h5>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id={`SpecimenTypeCancel`}
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={() => {
                      handleCloseCancelModal();
                    }}
                  >
                    <span>
                      <i className="fa fa-times"></i>
                      <span>{t("Cancel")}</span>
                    </span>
                  </button>

                  <button
                    type="submit"
                    form="cancelPickupForm"
                    className="btn btn-primary btn-sm px-7"
                    disabled={isApiSubmitting} // ✅ use new state // ✅ disable while submitting
                  >
                    {t("Submit")}
                  </button>
                </div>
              </div>

              <div id="form-search" className="card-body py-3">
                <Formik
                  initialValues={{ cancelReason: "" }}
                  validationSchema={cancelPickupSchema}
                  onSubmit={async (values, { resetForm, setSubmitting }) => {
                    if (!selectedRowForCancel) return;

                    setIsApiSubmitting(true); // start API submit
                    const payload = {
                      pickupId: selectedRowForCancel.id,
                      cancelReason: values.cancelReason,
                    };

                    try {
                      const res: any =
                        await InsuranceService.CancelPickup(payload);
                      if (res?.data?.httpStatusCode === 200) {
                        toast.success(
                          res?.data?.message || "Pickup cancelled successfully"
                        );
                        await loadData(false, false);
                        handleCloseCancelModal();
                        resetForm();
                      }
                    } catch (err: any) {
                      console.error("Cancel pickup error:", err);
                      toast.error("Failed to cancel pickup");
                      // setSubmitting(true);
                    } finally {
                      setIsApiSubmitting(false); // ✅ reset local state
                      setSubmitting(false); // ✅ update Formik state (optional)
                      await loadData(false, false);
                      resetForm();
                      handleCloseCancelModal();
                    }
                  }}
                >
                  {({ handleSubmit, values }) => (
                    <Form id="cancelPickupForm" onSubmit={handleSubmit}>
                      <label>
                        <h6>{t("Reason of Cancel Order")}</h6>
                      </label>

                      <Field
                        as="textarea"
                        name="cancelReason"
                        className="form-control h-65px"
                      />

                      <div className="text-muted mt-1">
                        {values.cancelReason.length} / 300 characters
                      </div>

                      <ErrorMessage
                        name="cancelReason"
                        component="div"
                        className="text-danger mt-1"
                      />
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </Collapse>

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
                  key={tag + Math.random()}
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
                  id={`ShipingAndPickupPickupRecords`}
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
                      id={`ShipingAndPickupPickupAddNew`}
                      className="btn btn-primary btn-sm btn-primary--icon px-7"
                      onClick={() => AddNew()}
                    >
                      <span>
                        <i style={{ fontSize: "15px" }} className="fa">
                          &#xf067;
                        </i>
                        <span>{t("Schedule a New Pickup")}</span>
                      </span>
                    </button>
                  </PermissionComponent>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 ">
              <button
                id={`ShipingAndPickupPickupSearch`}
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
                id={`ShipingAndPickupPickupReset`}
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
                rows={rows}
                loading={loading}
                sort={sort}
                searchRef={searchRef}
                handleSort={handleSort}
                searchRequest={searchRequest}
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
                    <span>{t("Showing 0 of Total 0 Entries")}</span>
                  ) : (
                    <span>
                      {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}
                      {Math.min(pageSize * curPage, total)} {t("of Total")}
                      <span> {total} </span> {t("entries")}
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

export default Pickup;
