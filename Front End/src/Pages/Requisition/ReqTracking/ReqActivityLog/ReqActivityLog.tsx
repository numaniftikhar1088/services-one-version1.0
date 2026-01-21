import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import NoRecord from "Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader } from "../../../../Shared/Common/Loader";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import CustomPagination from "../../../../Shared/JsxPagination";
import { StringRecord } from "../../../../Shared/Type";
import usePagination from "../../../../Shared/hooks/usePagination";
import { SortingTypeI } from "../../../../Utils/consts";
import Row from "./Row";
import { TBL_HEADERS } from "./tableHeader";

// Convert HH:mm:ss to 12-hour format with AM/PM
export const convertTo12HourFormatInSeconds = (time: any) => {
  if (!time) return "";

  let [hours, minutes, seconds] = time.split(":");
  let period = "AM";

  hours = parseInt(hours, 10);

  if (hours >= 12) {
    period = "PM";
    if (hours > 12) hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  return `${hours}:${minutes}:${seconds} ${period}`;
};

function ReqActivityLog() {
  const { t } = useLang();

  const initialSearchQuery = {
    ActivityAction: "",
    ActivityDate: "",
    ActivityName: "",
    ActivityTime: "",
    UserName: "",
  };

  const queryDisplayTagNames: StringRecord = {
    UserName: "User Name",
    ActivityAction: "Activity Status",
    ActivityName: "Activity Name",
    ActivityDate: "Activity Date",
    ActivityTime: "Activity Time",
  };

  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);

  const location = useLocation();
  const parts = location.pathname.split("/requisition-tracking/");
  const InnerParts = parts[1].split("/");
  const reqOrderId = window.atob(InnerParts[0]);


  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      loadData(false);
    }
  };

  const {
    curPage,
    pageSize,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setTotal,
    setCurPage,
  } = usePagination();

  useEffect(() => {
    if (initialRender) {
      loadData(false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  const sortById = {
    clickedIconData: "Id",
    sortingOrder: "desc",
  };
  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const searchRef = useRef<any>(null);

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  useEffect(() => {
    if (initialRender2) {
      loadData(true);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);

  useEffect(() => {
    setCurPage(1);
  }, [pageSize]);

  function resetSearch() {
    setSearchQuery(initialSearchQuery);
    setSorting(sortById);
    loadData(true);
  }

  const loadData = async (reset: boolean) => {
    setLoading(true);

    const formattedSearchQuery = {
      ...searchQuery,
      ActivityTime:
        convertTo12HourFormatInSeconds(searchQuery.ActivityTime) ?? "",
      ActivityDate: searchQuery.ActivityDate
        ? moment(searchQuery.ActivityDate).format("MM/DD/YYYY")
        : "",
    };
    try {
      const queryModel = {
        pageSize: pageSize,
        pageNumber: curPage,
        sortDirection: sort?.sortingOrder,
        sortColumn: sort?.clickedIconData,
        filterJson: reset ? "{}" : JSON.stringify(formattedSearchQuery),
        requisitionOrderId: reqOrderId,
      };

      const response = await RequisitionType.trackingActivityLogs(queryModel);
      setTotal(response?.data?.total);
      setRows(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchQuery((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchQuery)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchQuery]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <div>
        <div className=" py-1 py-lg-2">
          <div className="d-flex gap-4 flex-wrap">
            {searchedTags.map((tag) =>
              tag === "isDefault" ||
              tag === "isActive" ||
              tag === "courierName" ? null : (
                <div
                  className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                  onClick={() => handleTagRemoval(tag)}
                >
                  <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
                  <i className="bi bi-x"></i>
                </div>
              )
            )}
          </div>
          <div className="d-flex flex-wrap gap-3 justify-content-center mb-2 justify-content-sm-between align-items-center">
            <div className="d-flex align-items-center gap-2">
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
            <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2">
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
              className="shadow-none"
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
                        name="UserName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchQuery.UserName}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        name="ActivityAction"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchQuery.ActivityAction}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        name="ActivityName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchQuery.ActivityName}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="date"
                        name="ActivityDate"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchQuery.ActivityDate}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="time"
                        name="ActivityTime"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        step="1"
                        value={searchQuery.ActivityTime}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-30px">
                    {TBL_HEADERS.map((header) =>
                      header.name === "" ? (
                        <TableCell></TableCell>
                      ) : (
                        <TableCell className="min-w-50px">
                          <div
                            onClick={() => handleSort(header.variable)}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: "max-content" }}>
                              {t(header.name)}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === header.variable
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === header.variable
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={13}>
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows.map((row: any, index: number) => (
                      <Row key={index} row={row} />
                    ))
                  ) : (
                    <NoRecord colSpan={17} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="card">
            <Box sx={{ height: "auto", width: "100%" }}>
              <CustomPagination
                curPage={curPage}
                nextPage={nextPage}
                pageNumbers={pageNumbers}
                pageSize={pageSize}
                prevPage={prevPage}
                showPage={showPage}
                total={total}
                totalPages={totalPages}
              />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReqActivityLog;
