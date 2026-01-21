import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import Row from "./Row";
import useLang from "Shared/hooks/useLanguage";
import { useCourierContext } from "Shared/CourierContext";
import useIsMobile from "Shared/hooks/useIsMobile";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";

function ManageGridData(props: {
  rows: any;
  loading: boolean;
  sort: any;
  searchRequest: any;
  onInputChangeSearch: any;
  handleKeyPress: any;
  handleSort: any;
  searchRef: any;
}) {
  const {
    rows,
    loading,
    sort,
    searchRequest,
    onInputChangeSearch,
    handleKeyPress,
    handleSort,
    searchRef,
  } = props;

  const { t } = useLang();
  const isMobile = useIsMobile();

  const { courierName } = useCourierContext();

  return (
    <div className="table_bordered overflow-hidden">
      <TableContainer
        sx={
          isMobile
            ? {}
            : {
                maxHeight: "calc(100vh - 100px)",
                "&::-webkit-scrollbar": {
                  width: 7,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#fff",
                },
                "&:hover": {
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "var(--kt-gray-400)",
                    borderRadius: 2,
                  },
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "var(--kt-gray-400)",
                  borderRadius: 2,
                },
              }
        }
        // component={Paper}
        className="shadow-none"
        // sx={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        <Table
          aria-label="sticky table collapsible"
          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
        >
          <TableHead>
            <TableRow className="h-40px">
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchContectName`}
                  type="text"
                  name="contactName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.contactName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchCompanyName`}
                  type="text"
                  name="companyName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.companyName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchAddress`}
                  type="text"
                  name="address"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.address}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchCity`}
                  type="text"
                  name="city"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.city}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchState`}
                  type="text"
                  name="stateName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 w-175px"
                  placeholder={t("Search ...")}
                  value={searchRequest.stateName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchZipCode`}
                  type="text"
                  name="zipCode"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.zipCode}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <SearchDatePicker
                  name="pickupDate"
                  value={searchRequest.pickupDate}
                  onChange={onInputChangeSearch}
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchTrackingNumber`}
                  type="text"
                  name="trackingNumber"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.trackingNumber ?? ""}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchDispatchConfirmation`}
                  type="text"
                  name="dispatchConfirmationNo"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.dispatchConfirmationNo}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchLocation`}
                  type="text"
                  name="location"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.location}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              {courierName === "UPS" ? (
                <TableCell>
                  <input
                    id={`ShipingAndPickupPickupSearchPackageWeight`}
                    type="text"
                    name="packageWeight"
                    className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                    placeholder={t("Search ...")}
                    value={searchRequest?.packageWeight || ""}
                    onChange={onInputChangeSearch}
                    onKeyDown={(e) => handleKeyPress(e)}
                  />
                </TableCell>
              ) : null}
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupArchiveSearchRemarks`}
                  type="text"
                  name="remarks"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.remarks}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ShipingAndPickupPickupSearchLogIdentifier`}
                  type="text"
                  name="logIdentifier"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.logIdentifier}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow className="h-30px">
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("contactName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Contact Name")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "contactName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "contactName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("companyName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Company Name")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "companyName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "companyName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  onClick={() => handleSort("address")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div className="d-flex justify-content-between align-items-center min-w-100px">
                    <div> {t("Address")}</div>
                    <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                      <ArrowUp
                        CustomeClass={`${
                          sort.sortingOrder === "desc" &&
                          sort.clickedIconData === "address"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                      />
                      <ArrowDown
                        CustomeClass={`${
                          sort.sortingOrder === "asc" &&
                          sort.clickedIconData === "address"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                      />
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("city")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("City")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "city"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "city"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("stateName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("State")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "stateName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "stateName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("zipCode")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Zip Code")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "zipCode"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "zipCode"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("pickupDate")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Scheduled Pickup Date")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "pickupDate"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "pickupDate"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("startPickupTime")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Scheduled Pickup Time")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "startPickupTime"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "startPickupTime"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("trackingNumber")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Tracking Number")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "trackingNumber"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "trackingNumber"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("dispatchConfirmationNo")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Dispatch Confirmation No")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "dispatchConfirmationNo"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "dispatchConfirmationNo"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("location")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Location")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "location"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "location"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              {courierName === "UPS" ? (
                <TableCell sx={{ width: "max-content" }}>
                  <div
                    onClick={() => handleSort("packageWeight")}
                    className="d-flex justify-content-between cursor-pointer"
                    id=""
                    ref={searchRef}
                  >
                    <div style={{ width: "max-content" }}>
                      {t("Package Weight")}
                    </div>

                    <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                      <ArrowUp
                        CustomeClass={`${
                          sort.sortingOrder === "desc" &&
                          sort.clickedIconData === "packageWeight"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                      />
                      <ArrowDown
                        CustomeClass={`${
                          sort.sortingOrder === "asc" &&
                          sort.clickedIconData === "packageWeight"
                            ? "text-success fs-7"
                            : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                      />
                    </div>
                  </div>
                </TableCell>
              ) : null}
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("remarks")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Courier Remarks")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "remarks"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "remarks"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("logIdentifier")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Log Identifier")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "logIdentifier"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "logIdentifier"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("cancelReason")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Cancellation Remarks")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "cancelReason"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "cancelReason"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableCell colSpan={13} className="">
                <Loader />
              </TableCell>
            ) : rows.length ? (
              rows?.map((row: any) => <Row row={row} key={row.id} />)
            ) : (
              <NoRecord colSpan={13} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageGridData;
