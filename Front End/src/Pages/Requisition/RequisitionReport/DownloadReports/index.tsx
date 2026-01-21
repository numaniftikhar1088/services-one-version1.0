import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
} from "@mui/material";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import DownloadRow from "./row";
import { RequisitionReportGeDownload } from "../../../../Services/Requisition/RequisitionReports/RequisitionReport";
import usePagination from "../../../../Shared/hooks/usePagination";
import { sortById, SortingTypeI } from "../../../../Utils/consts";
import { StringRecord } from "../../../../Shared/Type";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import CustomPagination from "./../../../../Shared/JsxPagination/index";
import useLang from "./../../../../Shared/hooks/useLanguage";

const DownloadReports = () => {
  const { t } = useLang();

  const [reset, setReset] = useState(false);
  /*##############################-----PAGINATION Start-----#################*/
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

  /*##############################-----PAGINATION End-----#################*/
  const initialSearchCriteria = {
    fileName: "",
    fileDate: "",
  };
  const [triggerSearchData, setTriggerSearchData] = useState(false);
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
        fileName: searchCriteria.fileName || "",
        fileDate: searchCriteria.fileDate || null,
      },
      sortColumn: sort.clickedIconData || "Id",
      sortDirection: sort.sortingOrder || "Desc",
    };
    let resp = await RequisitionReportGeDownload(obj);
    setApiGetData(resp.data.result);
    setTotal(resp?.data?.totalRecord);
    setLoading(false);
  };
  useEffect(() => {
    showData();
  }, [pageSize, curPage, triggerSearchData]);

  /*##############################  End Get Api  #################*/

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
    fileName: "File",
    fileDate: "Date",
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
  /*##############################-----Search function End-----##############################*/

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };
  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };
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
              id="DownloadReportRecord"
              className="form-select w-100px h-33px rounded"
              data-allow-clear="true"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-kt-select2="true"
              data-placeholder="Select option"
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
            id="DownloadReportSearch"
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
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id="DownloadReportReset"
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
                    <TableCell>
                      <input
                        id="DownloadReportFile"
                        type="text"
                        name="CategoryTitle"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t("Search ....")}
                        value={searchCriteria.fileName}
                        onChange={(e) =>
                          setSearchCriteria({
                            ...searchCriteria,
                            fileName: e.target.value,
                          })
                        }
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id="DownloadReportDate"
                        type="date"
                        name="CategoryTitle"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t("Search ....")}
                        value={searchCriteria.fileDate}
                        onChange={(e) =>
                          setSearchCriteria({
                            ...searchCriteria,
                            fileDate: e.target.value,
                          })
                        }
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("fileName")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>{t("File")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "fileName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "fileName"
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
                        onClick={() => handleSort("fileDate")}
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>{t("Date")}</div>
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "fileDate"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "fileDate"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Download")}
                        </div>
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
                    apiGetData.map((row: any) => (
                      <DownloadRow row={row} key={row.id} ShowBlob={ShowBlob} />
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

export default DownloadReports;
