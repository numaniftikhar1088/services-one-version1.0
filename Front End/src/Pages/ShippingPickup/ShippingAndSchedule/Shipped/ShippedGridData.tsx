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
import useIsMobile from "Shared/hooks/useIsMobile";

function ShippedGridData(props: {
  rows: any;
  loading: boolean;
  sort: any;
  searchRequest: any;
  onInputChangeSearch: any;
  handleKeyPress: Function;
  handleSort: Function;
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

  const { t } = useLang()
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
              <TableCell>
                <input
                id={`ReadyToShipShipedSearchLabName`}
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
                id={`ReadyToShipShipedSearchRequisitionType`}
                  type="text"
                  name="requsitionType"
                  className="form-control bg-white  min-w-125px rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.requsitionType}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                id={`ReadyToShipShipedSearchOrderNumber`}
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
                id={`ReadyToShipShipedSearchDateOfCollection`}
                  type="date"
                  name="dateofCollection"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={
                    searchRequest.dateofCollection === null
                      ? ""
                      : searchRequest.dateofCollection
                  }
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                id={`ReadyToShipShipedSearchTimeIfCollection`}
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
                id={`ReadyToShipShipedSearchFirstName`}
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
                id={`ReadyToShipShipedSearchLastName`}
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
                id={`ReadyToShipShipedSearchDOB`}
                  type="date"
                  name="dob"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.dob === null ? "" : searchRequest.dob}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell>
                <input
                id={`ReadyToShipShipedSearchCourierName`}
                  type="text"
                  name="courierName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.courierName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                id={`ReadyToShipShipedSearchTrakingNumber`}
                  type="text"
                  name="trackingNumber"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Search ...")}
                  value={searchRequest.trackingNumber}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
            </TableRow>
            <TableRow className="h-30px">
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
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "labName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "labName"
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
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "requsitionType"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
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
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "orderNumber"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
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
                  <div className="d-flex justify-content-between align-items-center">
                    <div>{t("Date")}</div>
                    <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                      <ArrowUp
                        CustomeClass={`${sort.sortingOrder === "desc" &&
                          sort.clickedIconData === "dateofCollection"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                          }  p-0 m-0 "`}
                      />
                      <ArrowDown
                        CustomeClass={`${sort.sortingOrder === "asc" &&
                          sort.clickedIconData === "dateofCollection"
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
                  onClick={() => handleSort("timeofCollection")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Time")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "timeofCollection"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
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
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "firstName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
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
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "lastName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
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
                  <div style={{ width: "max-content" }}>{t("Date of Birth")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "dob"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
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
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "status"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "status"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("courierName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Courier")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "courierName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "courierName"
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
                  <div style={{ width: "max-content" }}>{t("Tracking #")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "trackingNumber"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "trackingNumber"
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
              <TableCell colSpan={11} className="">
                <Loader />
              </TableCell>
            ) : rows.length ? (
              rows?.map((row: any, index: any) => (
                <Row
                  row={row}
                />
              ))
            ) : (
              <NoRecord colSpan={11} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ShippedGridData;
