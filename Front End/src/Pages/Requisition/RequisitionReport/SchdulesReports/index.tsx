import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import ScheduledRow from "./row";

import {
  RequisitionReportDelete,
  RequisitionReportGetAll,
} from "../../../../Services/Requisition/RequisitionReports/RequisitionReport";
import usePagination from "../../../../Shared/hooks/usePagination";
import { sortById, SortingTypeI } from "../../../../Utils/consts";
import { StringRecord } from "../../../../Shared/Type";
import NoRecord from "../../../../Shared/Common/NoRecord";
import { Loader } from "../../../../Shared/Common/Loader";
import LookupsFunctions from "Pages/ManageNotification/LookupsFunctions";
import CustomPagination from "./../../../../Shared/JsxPagination/index";
import useLang from "./../../../../Shared/hooks/useLanguage";

const SchduledReports = () => {
  const { t } = useLang();
  const [reset, setReset] = useState(false);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  /*############################## PAGINATION Start  #################*/
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

  /*############################## PAGINATION End  #################*/

  const initialSearchCriteria = {
    reportName: "",
    frequency: "",
    scheduledDate: "",
  };
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  /*#########################----SORT STARTS------########################## */
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef<any>(null);

  /////////////
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

    showData();
  };
  /*#########################----SORT ENDS------########################## */

  /*##############################  Start Get Api  #################*/
  const [apiGetData, setApiGetData] = useState([]);
  const showData = async () => {
    let obj = {
      pageNumber: curPage,
      pageSize: pageSize,

      queryModel: {
        reportName: searchCriteria.reportName.trim() || "",
        frequency: searchCriteria.frequency.trim() || "",
        scheduledDate: searchCriteria.scheduledDate || null,
      },
      sortColumn: sort.clickedIconData || "Id",
      sortDirection: sort.sortingOrder || "Desc",
    };
    let resp = await RequisitionReportGetAll(obj);
    setApiGetData(resp.data.result);
    setTotal(resp?.data?.totalRecord);
    setLoading(false);
  };
  useEffect(() => {
    showData();
  }, [pageSize, curPage, triggerSearchData]);
  /*##############################  End Get Api  #################*/

  /*##############################  Start handleDelete #################*/

  const handleDelete = async (id: number) => {
    try {
      await RequisitionReportDelete(id);
      showData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  /*##############################  End handleDelete #################*/

  const handleReset = async () => {
    setSearchCriteria(initialSearchCriteria);
    setReset(!reset);
    setCurPage(1);
    setPageSize(50);
  };
  useEffect(() => {
    showData();
  }, [reset]);

  /*##############################-----Search Function And Show Tags-----##############################*/

  const queryDisplayTagNames: StringRecord = {
    reportName: "Name",
    frequency: "Frequency",
    scheduledDate: "Date",
  };
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchCriteria((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchCriteria as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchCriteria)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchCriteria]);

  useEffect(() => {
    if (searchedTags.length === 0) handleReset();
  }, [searchedTags.length]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };
  /*##############################-----Search function End-----##############################*/
  const { userLookup, getUserLookup } = LookupsFunctions();

  useEffect(() => {
    getUserLookup(1);
  }, []);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map((tag) =>
          tag === "status" || tag === "categoryId" ? (
            ""
          ) : (
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
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              id="SchdulesReportRecord"
              className="form-select w-100px h-33px rounded"
              data-allow-clear="true"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-kt-select2="true"
              data-placeholder={t("Select option")}
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            id="SchdulesReportSearchButton"
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
            onClick={() => {
              setCurPage(1);
              setTriggerSearchData((prev) => !prev);
            }}
          >
            {t("Search")}
          </button>
          <button
            id="SchdulesReportResetButton"
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            type="button"
            onClick={handleReset}
          >
            <span>{t("Reset")}</span>
          </button>
        </div>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

      <div className="card">
        <Box sx={{ height: "auto", width: "100%" }}>
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
              component={Paper}
              className="shadow-none"
            >
              <Table
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell className="w-50px"></TableCell>
                    <TableCell className="w-50px"></TableCell>
                    <TableCell>
                      <input
                        id="SchdulesReportSearchName"
                        type="text"
                        name="CategoryTitle"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t("Search ....")}
                        value={searchCriteria.reportName}
                        onChange={(e) =>
                          setSearchCriteria({
                            ...searchCriteria,
                            reportName: e.target.value,
                          })
                        }
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="SchdulesReportSearchFrequency"
                        type="text"
                        name="CategoryTitle"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t("Search ....")}
                        value={searchCriteria.frequency}
                        onChange={(e) =>
                          setSearchCriteria({
                            ...searchCriteria,
                            frequency: e.target.value,
                          })
                        }
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="SchdulesReportSearchDate"
                        type="date"
                        name="CategoryTitle"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        value={searchCriteria.scheduledDate}
                        onChange={(e) =>
                          setSearchCriteria({
                            ...searchCriteria,
                            scheduledDate: e.target.value,
                          })
                        }
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell className="w-50px"></TableCell>
                    <TableCell>{t("Actions")}</TableCell>
                    <TableCell>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("reportName")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>{t("Name")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "reportName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "reportName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("frequency")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Frequency")}
                        </div>
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "frequency"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "frequency"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("scheduledDate")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>{t("Date")}</div>
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "scheduledDate"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "scheduledDate"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>{t("Share")}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableCell colSpan={10}>
                      <Loader />
                    </TableCell>
                  ) : apiGetData.length === 0 ? (
                    <NoRecord colSpan={10} />
                  ) : (
                    apiGetData.map((row: any, index: number) => (
                      <ScheduledRow
                        row={row}
                        index={index}
                        setApiGetData={setApiGetData}
                        key={row.id}
                        apiGetData={apiGetData}
                        showData={showData}
                        userLookup={userLookup}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
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
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
    </>
  );
};

export default SchduledReports;
