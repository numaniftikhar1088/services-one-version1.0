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

function ManageOrdersGridData(props: {
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
  selectAll: boolean;
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
    selectAll,
  } = props;

  const { t } = useLang();

  return (
    <div className="table_bordered overflow-hidden">
      <TableContainer
        sx={{
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
              <TableCell></TableCell>
              <TableCell>
                <input
                  id={`ManageOrderShipedSearchFacilityName`}
                  type="text"
                  name="facilityName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.facilityName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageOrderShipedSearchCreatedBy`}
                  type="text"
                  name="createdBy"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.createdBy}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageOrderShipedSearchRepersentativeName`}
                  type="text"
                  name="representativeName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 min-w-200px"
                  placeholder={t("Search ...")}
                  value={searchRequest.representativeName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageOrderShipedSearchDateOfRequest`}
                  type="date"
                  name="dateofRequest"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={
                    searchRequest.dateofRequest === null
                      ? ""
                      : searchRequest.dateofRequest
                  }
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  id={`ManageOrderShipedSearchTrackingNumber`}
                  type="text"
                  name="trackingNumber"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 min-w-200px"
                  placeholder={t("Search ...")}
                  value={searchRequest.trackingNumber}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell> <TableCell></TableCell>
            </TableRow>




            <TableRow className="h-30px">
              <TableCell className="w-20px min-w-20px">
                <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                  <input
                    id={`ManageOrderShipedCheckAll`}
                    className="form-check-input"
                    type="checkbox"
                    onChange={(e) => handleAllSelect(e.target.checked, rows)}
                    checked={selectAll}
                  />
                </label>
              </TableCell>
              <TableCell className="min-w-50px">
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
                  onClick={() => handleSort("facilityName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Shipping To")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "facilityName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
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
                  onClick={() => handleSort("createdBy")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Requested By")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "createdBy"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "createdBy"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div
                  onClick={() => handleSort("representativeName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div>{t("Representative Name")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "representativeName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "representativeName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("dateofRequest")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>
                    {t("Request Date")}
                  </div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "dateofRequest"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "dateofRequest"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  onClick={() => handleSort("representativeName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div>{t("Tracking Number")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "representativeName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "representativeName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  onClick={() => handleSort("representativeName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div>{t("Order ID")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "representativeName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "representativeName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  onClick={() => handleSort("representativeName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div>{t("Order Sequence ID")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "representativeName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "representativeName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div style={{ width: "max-content" }}>{t("View Order")}</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableCell colSpan={9} className="">
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
              <NoRecord />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageOrdersGridData;
