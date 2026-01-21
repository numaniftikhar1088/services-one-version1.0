import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import useLang from "Shared/hooks/useLanguage";
import FacilityService from "../../Services/FacilityService/FacilityService";
import { Loader } from "../../Shared/Common/Loader";
import { ArrowDown, ArrowUp } from "../../Shared/Icons";
import { SortingTypeI, sortById } from "../../Utils/consts";
import Row from "./Row";

export interface IRows {
  id: number;
  testName: string;
  testDisplayName: string;
  testCode: string;
  referenceLabId: number;
  referenceLabName: string;
  createDate: string;
  rowStatus: boolean | undefined;
}
export default function CollapsibleTable() {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const searchRef = useRef<any>(null);

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1);
    }
  };
  const showPage = (i: number) => {
    setCurPage(i);
  };
  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };
  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
    const pgNumbers = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i);
      }
    }
    setPageNumbers(pgNumbers);
  }, [total, curPage, pageSize, totalPages]);

  useEffect(() => {
    loadGridData(true, false);
  }, [curPage, pageSize, triggerSearchData]);

  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>(() => []);

  useEffect(() => {
    loadGridData(true, true);
  }, []);

  ////////////-----------------Section For Searching-------------------///////////////////
  let [searchRequest, setSearchRequest] = useState({
    // userId: 0,
    firstName: "",
    lastName: "",
    npiNumber: "",
  });
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    searchRequest = {
      // userId: 0,
      firstName: "",
      lastName: "",
      npiNumber: "",
    };
    setSearchRequest({
      // userId: 0,
      firstName: "",
      lastName: "",
      npiNumber: "",
    });
    setSorting(sortById);
    loadGridData(true, true);
  }
  ////////////-----------------Section For Searching-------------------///////////////////
  const searchQuery = {
    firstName: searchRequest?.firstName,
    lastName: searchRequest?.lastName,
    npiNumber: searchRequest?.npiNumber,
  };

  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    const nullobj = {
      firstName: "",
      lastName: "",
      npiNumber: "",
    };
    const obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullobj : searchQuery,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    };
    FacilityService.physicianSignatureGetAll({ ...obj })
      .then((res: AxiosResponse) => {
        setRows(res?.data?.data);
        setLoading(false);
        setTotal(res?.data?.total);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  ////////////-----------------Sorting-------------------///////////////////

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
    loadGridData(true, false);
  }, [sort]);

  ////////////-----------------Sorting-------------------///////////////////
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      loadGridData(true, false);
    }
  };

  return (
    <>
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body py-2">
              <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    id="FacilityOptionsRecord"
                    className="form-select w-125px h-33px rounded py-2"
                    data-kt-select2="true"
                    data-placeholder={t("Select option")}
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
                <div className="dalign-items-center d-flex gap-2 gap-lg-3 mb-2 ms-3 ms-sm-0">
                  <button
                    id="FacilityOptionSearch"
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
                    id="FacilityOptionReset"
                    onClick={resetSearch}
                    type="button"
                    className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                  >
                    <span>
                      <span>{t("Reset")}</span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="card">
                <Box sx={{ height: "auto", width: "100%" }}>
                  <div className="table_bordered overflow-hidden">
                    <TableContainer
                      sx={{
                        maxHeight: 800,
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
                        // stickyHeader
                        aria-label="sticky table collapsible"
                        className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                      >
                        <TableHead>
                          <TableRow className="h-30px">
                            <TableCell></TableCell>
                            {/* <TableCell></TableCell> */}
                            <TableCell>
                              <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                className="form-control bg-white my-2 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.firstName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                className="form-control bg-white my-2 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.lastName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="npiNumber"
                                type="text"
                                name="npiNumber"
                                className="form-control bg-white my-2 h-30px rounded-2 fs-8 w-100"
                                placeholder={t("Search ...")}
                                value={searchRequest.npiNumber}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                          </TableRow>

                          <TableRow className="h-30px">
                            <TableCell className="w-20px min-w-20px">
                              {/* <span onClick={() => setOpen(!open)}>
                                {open ? (
                                  <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                                    <RemoveICon />
                                  </button>
                                ) : (
                                  <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                                    <AddIcon />
                                  </button>
                                )}
                              </span> */}
                            </TableCell>
                            {/* <TableCell className="min-w-50px">
                              Actions
                            </TableCell> */}
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("optionName")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {" "}
                                  {t("First Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "optionName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "optionName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("optionName")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {" "}
                                  {t("Last Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "optionName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "optionName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("optionName")}
                                className="d-flex justify-content-between cursor-pointer"
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {" "}
                                  {t("NPI #")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "optionName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "optionName"
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
                            <TableCell colSpan={4} className="padding-0">
                              <Loader />
                            </TableCell>
                          ) : (
                            rows.map((item: any, index) => {
                              return (
                                <Row
                                  row={item}
                                  rows={rows}
                                  setRows={setRows}
                                  loadGridData={loadGridData}
                                />
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Box>
              </div>

              {/* ==========================================================================================
              //====================================  PAGINATION START =====================================
              //============================================================================================ */}
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
                <p className="pagination-total-record mb-0">
                  {Math.min(pageSize * curPage, total) === 0 ? (
                    <span>
                      {t("Showing 0 to 0 of")} {total} {t("enteries")}
                    </span>
                  ) : (
                    <span>
                      {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
                      {Math.min(pageSize * curPage, total)} {t("of Total")}{" "}
                      <span> {total} </span> {t("entries")}{" "}
                    </span>
                  )}
                </p>
                <ul className="p-0 d-flex align-items-center justify-content-end custome-pagination mb-0">
                  <li
                    className="btn btn-lg p-2 h-33px"
                    onClick={() => showPage(1)}
                  >
                    <i className="fa fa-angle-double-left"></i>
                  </li>
                  <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
                    <i className="fa fa-angle-left"></i>
                  </li>

                  {pageNumbers.map((page) => (
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
                    <i className="fa fa-angle-double-right "></i>
                  </li>
                </ul>
              </div>
              {/* ==========================================================================================
              //====================================  PAGINATION END =====================================
              //============================================================================================ */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
