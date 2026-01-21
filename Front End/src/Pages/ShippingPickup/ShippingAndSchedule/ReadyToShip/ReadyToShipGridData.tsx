import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Row from "./Row";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

function ReadyToShipGridData(props: {
  rows: any;
  setRows: any;
  loading: boolean;
  sort: any;
  searchRequest: any;
  onInputChangeSearch: any;
  handleKeyPress: Function;
  handleAllSelect: Function;
  handleSort: Function;
  searchRef: any;
  handleChangeSelectedIds: Function;
  selectedBox: any;
}) {
  const {
    rows,
    loading,
    setRows,
    sort,
    searchRequest,
    onInputChangeSearch,
    handleKeyPress,
    handleAllSelect,
    handleSort,
    searchRef,
    handleChangeSelectedIds,
    selectedBox,
  } = props;

  const { t } = useLang();
  const isMobile = useIsMobile();

  return (
    <div className="table_bordered overflow-hidden">
      <TableContainer
        sx={
          
          isMobile ?  {} :
          {
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
        }}
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
              <TableCell></TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchLabName`}
                  type="text"
                  name="labName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.labName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchFacilityName`}
                  type="text"
                  name="facilityName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.facilityName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchRequisitionType`}
                  type="text"
                  name="requsitionType"
                  className="form-control bg-white min-w-125px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.requsitionType}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchOrderNumber`}
                  type="text"
                  name="orderNumber"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.orderNumber}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchDateOfCollection`}
                  type="date"
                  name="dateofCollection"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.dateofCollection ?? ""}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchTimeOfCollection`}
                  type="text"
                  name="timeofCollection"
                  className="form-control bg-white  min-w-75px rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.timeofCollection ?? ""}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchFirstName`}
                  type="text"
                  name="firstName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.firstName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchLastName`}
                  type="text"
                  name="lastName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.lastName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ReadyToShipSearchDOB`}
                  type="date"
                  name="dob"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.dob ?? ""}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow className="h-30px">
              <TableCell className="w-20px min-w-20px ">
                <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                  <input
                    id={`ReadyToShipCheckAll`}
                    className="form-check-input"
                    type="checkbox"
                    onChange={(e) => handleAllSelect(e.target.checked, rows)}
                  />
                </label>
              </TableCell>
              <TableCell className="min-w-50px">
                <div
                  onClick={() => handleSort("labName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Lab Name")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "labName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "labName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="min-w-50px">
                <div
                  onClick={() => handleSort("facilityName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Facility Name")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "facilityName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "facilityName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("requsitionType")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Req Type")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "requsitionType"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "requsitionType"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("orderNumber")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Order#")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "orderNumber"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "orderNumber"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div
                  onClick={() => handleSort("dateofCollection")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Date")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "dateofCollection"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "dateofCollection"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("timeofCollection")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Time")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "timeofCollection"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "timeofCollection"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("firstName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("First Name")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "firstName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "firstName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("lastName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Last Name")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "lastName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "lastName"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("dob")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Date of Birth")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "dob"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "dob"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("status")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Status")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${
                        sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "status"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                      }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${
                        sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "status"
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
              <TableCell colSpan={10} className="">
                <Loader />
              </TableCell>
            ) : rows.length ? (
              rows?.map((row: any, index: any) => (
                <Row
                  row={row}
                  handleChangeSelectedIds={handleChangeSelectedIds}
                  selectedBox={selectedBox}
                />
              ))
            ) : (
              <NoRecord colSpan={10} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ReadyToShipGridData;
