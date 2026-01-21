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
                  type="date"
                  name="dateofScan"
                  className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                  placeholder={t("Search ...")}
                  value={searchRequest.dateofScan ?? ""}
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
            </TableRow>
            <TableRow className="h-30px">
              <TableCell className="min-w-50px">{t("Actions")}</TableCell>
              <TableCell sx={{ width: "max-content" }}>
                <div
                  onClick={() => handleSort("facilityName")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Facility Name")}</div>

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

              <TableCell>
                <div
                  onClick={() => handleSort("dateofScan")}
                  className="d-flex justify-content-between cursor-pointer"
                  id=""
                  ref={searchRef}
                >
                  <div style={{ width: "max-content" }}>{t("Date of scan")}</div>
                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                    <ArrowUp
                      CustomeClass={`${sort.sortingOrder === "desc" &&
                        sort.clickedIconData === "dateofScan"
                        ? "text-success fs-7"
                        : "text-gray-700 fs-7"
                        }  p-0 m-0 "`}
                    />
                    <ArrowDown
                      CustomeClass={`${sort.sortingOrder === "asc" &&
                        sort.clickedIconData === "dateofScan"
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
                  <div style={{ width: "max-content" }}>{t("Package Status")}</div>

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
