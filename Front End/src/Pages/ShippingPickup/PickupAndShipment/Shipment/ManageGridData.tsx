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

function ManageGridData(props: {
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
              <TableCell>
                <input
                  type="text"
                  name="senderName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.senderName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  name="recipentName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.recipentName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  name="recipentAddress"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.recipentAddress}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  name="recipentCity"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.recipentCity}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  name="recipentStateName"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.recipentStateName}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  name="recipentZipCode"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.recipentZipCode}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="date"
                  name="shipmentDate"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.shipmentDate ?? ""}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  name="trackingNumber"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.trackingNumber}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  name="status"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.status}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
              <TableCell>
                <input
                  type="text"
                  name="remarks"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.remarks}
                  onChange={onInputChangeSearch}
                  onKeyDown={(e) => handleKeyPress(e)}
                />
              </TableCell>
            </TableRow>
            <TableRow className="h-30px">
              <TableCell className="min-w-50px">{t("Actions")}</TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("senderName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Shipper Name")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "senderName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "senderName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("recipentName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Recipient Name")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "recipentName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "recipentName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div
                  onClick={() => handleSort("recipentAddress")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div className="d-flex justify-content-between align-items-center min-w-150px">
                    <div>{t("Recipient Address")}</div>
                    <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                      <ArrowUp
                        CustomeClass={`${sort.sortingOrder === "desc" &&
                          sort.clickedIconData === "recipentAddress"
                          ? "text-success fs-7"
                          : "text-gray-700 fs-7"
                          }  p-0 m-0 "`}
                      />
                      <ArrowDown
                        CustomeClass={`${sort.sortingOrder === "asc" &&
                          sort.clickedIconData === "recipentAddress"
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
                  onClick={() => handleSort("recipentCity")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Recipient City")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "recipentCity"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "recipentCity"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("recipentStateName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Recipient State")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "recipentStateName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "recipentStateName"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("recipentZipCode")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Recipient Zip Code")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "recipentZipCode"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "recipentZipCode"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0`}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("shipmentDate")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Shipment Date")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "shipmentDate"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "shipmentDate"
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
                  <div style={{ width: "max-content" }}>{t("Tracking Number")}</div>

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
                  onClick={() => handleSort("remarks")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Shipping Label")}</div>

                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "remarks"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "remarks"
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
              <TableCell colSpan={12} className="">
                <Loader />
              </TableCell>
            ) : rows.length ? (
              rows?.map((row: any, index: any) => <Row row={row} />)
            ) : (
              <NoRecord colSpan={12} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageGridData;
