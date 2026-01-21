import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import FacilityService from "../../Services/FacilityService/FacilityService";
import { Loader } from "../../Shared/Common/Loader";
import NoRecord from "../../Shared/Common/NoRecord";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../Shared/Icons";
import { StringRecord } from "../../Shared/Type";
import { SortingTypeI } from "../../Utils/consts";
import Row from "./Row";
import useIsMobile from "Shared/hooks/useIsMobile";
export interface IRows {
  labId: number;
  templateName: string;
  rowStatus: boolean | undefined;
  templateId: number;
  isActive?: boolean;
}

interface DropDownValues {
  referenceLab: Array<{
    value: number;
    label: string;
  }>;
}

interface ValidationState {
  TemplateName: string;
  Lab: string;
}

interface SearchRequest {
  labId: number;
  templateName: string;
  LabName: string;
}

// Constants
const INITIAL_SORTING_TYPE = {
  clickedIconData: "labId",
  sortingOrder: "desc",
} as const;

const INITIAL_SEARCH_QUERY = {
  labId: 0,
  templateName: "",
  LabName: "",
} as const;

const QUERY_DISPLAY_TAG_NAMES: StringRecord = {
  labId: "Lab",
  templateName: "Template Name",
  LabName: "Lab Name",
} as const;

const PAGE_SIZE_OPTIONS = [5, 10, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 50;
const REQ_TYPE_ID = 4;

export default function TestingSetting() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [searchRequest, setSearchRequest] =
    useState<SearchRequest>(INITIAL_SEARCH_QUERY);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  // Sorting state
  const [sort, setSorting] = useState<SortingTypeI>(INITIAL_SORTING_TYPE);

  // Pagination states
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [buttonLoaded, setButtonLoaded] = useState<boolean>(false);
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

  // Data states
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IRows[]>([]);
  const [dropDownValues, setDropDownValues] = useState<DropDownValues>({
    referenceLab: [],
  });

  // API call tracking to prevent concurrent calls
  const isApiCallInProgress = useRef(false);

  // Simple cache to avoid duplicate requests
  const lastRequestParams = useRef<string>("");

  // Helper function to force refresh data (clears cache)
  const forceRefreshData = () => {
    lastRequestParams.current = "";
    loadGridData(true, false);
  };

  // Form states
  const [request, setRequest] = useState(false);
  const [check, setCheck] = useState(false);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [errors, setErrors] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    TemplateName: "",
    Lab: "",
  });

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize data on component mount
  useEffect(() => {
    loadData();
    loadGridData(true, true);
  }, []);

  // Consolidated effect for data loading - debounced to prevent multiple rapid calls
  useEffect(() => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced API call
    debounceTimer.current = setTimeout(() => {
      loadGridData(true, false);
    }, 300); // 300ms debounce

    // Cleanup timer on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [curPage, pageSize, triggerSearchData, sort]);

  const validateRow = (row: IRows): boolean => {
    const newValidation = { TemplateName: "", Lab: "" };
    let isValid = true;

    if (!row.templateName) {
      newValidation.TemplateName = "Fill the required template Name";
      isValid = false;
    }
    if (!row.labId) {
      newValidation.Lab = "Select required Lab";
      isValid = false;
    }

    setValidation(newValidation);
    return isValid;
  };
  const handleChange = (name: string, value: string, templateId: number) => {
    setErrors(false);
    setCheck(true);

    // Clear validation for the specific field
    setValidation((prev) => ({
      ...prev,
      [name === "templateName" ? "TemplateName" : "Lab"]: "",
    }));

    setRows((curr: IRows[]) =>
      curr.map((x: IRows) =>
        x.templateId === templateId ? { ...x, [name]: value } : x
      )
    );
  };
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  const resetSearch = () => {
    setSearchRequest(INITIAL_SEARCH_QUERY);
    setSorting(INITIAL_SORTING_TYPE);
    // Force refresh with reset parameters
    lastRequestParams.current = "";
    loadGridData(true, true, INITIAL_SORTING_TYPE);
  };

  const searchQuery = {
    labId: searchRequest.labId,
    ReqTypeId: REQ_TYPE_ID,
    templateName: searchRequest.templateName,
  };
  const loadData = () => {
    FacilityService.referenceLabLookup()
      .then((res: AxiosResponse) => {
        const referenceArray =
          res?.data?.data?.map((val: any) => ({
            value: val?.labId,
            label: val?.labDisplayName,
          })) || [];

        setDropDownValues((prev) => ({
          ...prev,
          referenceLab: referenceArray,
        }));
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    // Prevent concurrent API calls
    if (isApiCallInProgress.current) {
      return;
    }

    const nullObj = {
      labId: 0,
      ReqTypeId: REQ_TYPE_ID,
      templateName: "",
    };

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );

    // Ensure queryModel has the correct structure with ReqTypeId
    const queryModel = reset
      ? nullObj
      : {
          labId: trimmedSearchRequest.labId || 0,
          templateName: trimmedSearchRequest.templateName || "",
          LabName: trimmedSearchRequest.LabName || "",
          ReqTypeId: REQ_TYPE_ID,
        };

    const requestObj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: queryModel,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    };

    // Create cache key to avoid duplicate requests
    const cacheKey = JSON.stringify(requestObj);

    // Skip API call if same parameters as last request
    if (lastRequestParams.current === cacheKey && !reset) {
      return;
    }

    lastRequestParams.current = cacheKey;
    isApiCallInProgress.current = true;

    if (loader) {
      setLoading(true);
    }

    FacilityService.GetTemplateSetting(requestObj)
      .then((res: AxiosResponse) => {
        setRows(res?.data?.data);
        setTotal(res?.data?.total);
        setButtonLoaded(true);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => {
        setLoading(false);
        isApiCallInProgress.current = false;
      });
  };
  const handleSubmit = async (row: IRows) => {
    if (!validateRow(row)) return;

    setErrors(row.templateId < 0);

    const queryModel = {
      templateId: row.templateId,
      labId: row.labId,
      templateName: row.templateName,
      isActive: row.isActive,
      ReqTypeId: REQ_TYPE_ID,
    };

    try {
      setRequest(true);
      const res = await FacilityService.AddTemplateSetting(queryModel);
      setErrors(false);

      if (res?.data.statusCode === 200) {
        toast.success(t(res?.data?.message));
        // Close the row and refresh data
        setRows((curr: IRows[]) =>
          curr.map((r: IRows) =>
            r.templateId === row.templateId ? { ...r, rowStatus: false } : r
          )
        );
        // Force refresh data after adding/updating record
        forceRefreshData();
        setValidation({ TemplateName: "", Lab: "" });
      }
    } catch (err) {
      console.trace(err);
    } finally {
      setRequest(false);
      setCheck(false);
    }
  };

  const handleAddTemplate = () => {
    if (buttonClicked) return;

    setButtonClicked(true);
    setRows((prevRows: IRows[]) => [
      {
        labId: 0,
        templateName: "",
        rowStatus: true,
        templateId: 0,
        isActive: true,
      },
      ...prevRows,
    ]);
  };

  const searchRef = useRef<any>(null);

  const handleSort = (columnName: any) => {
    const currentOrder = searchRef.current.id;
    const newOrder = currentOrder === "asc" ? "desc" : "asc";
    searchRef.current.id = newOrder;

    setSorting({
      sortingOrder: newOrder,
      clickedIconData: columnName,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Clear debounce timer and trigger immediate search
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      loadGridData(true, false);
    }
  };

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prev) => ({
      ...prev,
      [clickedTag]: (INITIAL_SEARCH_QUERY as any)[clickedTag],
    }));
  };

  useEffect(() => {
    const activeTags = Object.entries(searchRequest)
      .filter(([, value]) => value)
      .map(([key]) => key);
    setSearchedTags(activeTags);
  }, [searchRequest]);

  // Removed automatic resetSearch to prevent unintended search parameter resets
  // The resetSearch function should only be called explicitly by user action

  return (
    <>
      <div className="app-content flex-column-fluid p-0">
        <div className="card-body py-2">
          <div className="d-flex gap-4 flex-wrap mb-1">
            {searchedTags.map((tag) =>
              tag === "isArchived" ? null : (
                <div
                  className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                  onClick={() => handleTagRemoval(tag)}
                >
                  <span className="fw-bold">
                    {t(QUERY_DISPLAY_TAG_NAMES[tag])}
                  </span>
                  <i className="bi bi-x"></i>
                </div>
              )
            )}
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
            <div className="d-flex gap-2 responsive-flexed-actions">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  id={`IDResultDataPreconfTemplateSettingRecords`}
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
              <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
                <div className="mt-0">
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Result Data Pre-Configuration"
                    permissionIdentifier="AddNewTemplate"
                  >
                    <button
                      id={`IDResultDataPreconfTemplateSettingAddNew`}
                      onClick={handleAddTemplate}
                      className="btn btn-primary btn-sm fw-bold mr-sm-3  text-capitalize"
                      disabled={!buttonLoaded || buttonClicked}
                    >
                      <i style={{ fontSize: "16px" }} className="fa">
                        &#xf067;
                      </i>
                      {t("Add New Template")}
                    </button>
                  </PermissionComponent>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id={`IDResultDataPreconfTemplateSettingSearch`}
                onClick={() => {
                  setCurPage(1);
                  setTriggerSearchData((prev) => !prev);
                }}
                className="btn btn-linkedin btn-sm fw-500 py-2 rounded-3"
                aria-controls="Search"
              >
                {t("Search")}
              </button>
              <button
                onClick={resetSearch}
                type="button"
                className="btn btn-secondary btn-sm btn-secondary--icon fw-bold py-2 rounded-3"
                id={`IDResultDataPreconfTemplateSettingReset`}
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
                  sx={
                    isMobile
                      ? {
                          overflowY: "hidden",
                        }
                      : {}
                  }
                  // sx={{
                  //   maxHeight: 800,
                  //   "&::-webkit-scrollbar": {
                  //     width: 7,
                  //   },
                  //   "&::-webkit-scrollbar-track": {
                  //     backgroundColor: "#fff",
                  //   },
                  //   "&:hover": {
                  //     "&::-webkit-scrollbar-thumb": {
                  //       backgroundColor: "var(--kt-gray-400)",
                  //       borderRadius: 2,
                  //     },
                  //   },
                  //   "&::-webkit-scrollbar-thumb": {
                  //     backgroundColor: "var(--kt-gray-400)",
                  //     borderRadius: 2,
                  //   },
                  // }}
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
                      <TableRow className="h-40px">
                        <TableCell></TableCell>
                        <TableCell className="min-w-50px"></TableCell>
                        <TableCell>
                          <input
                            id={`IDResultDataPreconfTemplateSettingTemplateName`}
                            type="text"
                            name="templateName"
                            className="form-control bg-white rounded-2 fs-8 h-30px"
                            placeholder={t("Search...")}
                            value={searchRequest.templateName}
                            onChange={onInputChangeSearch}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <select
                            id={`IDResultDataPreconfTemplateSettingLab`}
                            name="labId"
                            className="form-select bg-white rounded-2 fs-8 h-30px py-2"
                            value={searchRequest.labId}
                            onChange={onInputChangeSearch}
                            //onKeyDown={handleKeyPress}
                          >
                            <option value="">{t("Select an option")}</option>
                            {dropDownValues.referenceLab.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow className="h-30px">
                        <TableCell className="w-20px min-w-20px"></TableCell>
                        <TableCell className="w-50px min-w-50px text-center">
                          {t("Actions")}
                        </TableCell>
                        <TableCell
                          className="min-w-300px w-300px"
                          sx={{ width: "max-content" }}
                        >
                          <div
                            onClick={() => handleSort("templateName")}
                            className="d-flex justify-content-between cursor-pointer"
                            id=""
                            ref={searchRef}
                          >
                            <div style={{ width: "max-content" }}>
                              {t("Template Name")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === "templateName"
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === "templateName"
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="min-w-300px w-300px"
                          sx={{ width: "max-content" }}
                        >
                          <div
                            onClick={() => handleSort("labName")}
                            className="d-flex justify-content-between cursor-pointer"
                            id=""
                            ref={searchRef}
                          >
                            <div style={{ width: "max-content" }}>
                              {t("Lab")}
                            </div>

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
                        <TableCell
                          className="min-w-100px w-100px"
                          sx={{ width: "max-content" }}
                        >
                          <div
                            onClick={() => handleSort("labName")}
                            className="d-flex justify-content-between cursor-pointer"
                            id=""
                            ref={searchRef}
                          >
                            <div style={{ width: "max-content" }}>
                              {t("Inactive/Active")}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={9} className="padding-0">
                          <Loader />
                        </TableCell>
                      ) : !rows.length ? (
                        <NoRecord message={"No data found for this table"} />
                      ) : (
                        rows.map((item: any, index: any) => {
                          return (
                            <Row
                              row={item}
                              index={index}
                              rows={rows}
                              setRows={setRows}
                              dropDownValues={dropDownValues}
                              handleChange={handleChange}
                              handleSubmit={handleSubmit}
                              setErrors={setErrors}
                              errors={errors}
                              request={request}
                              setRequest={setRequest}
                              check={check}
                              setCheck={setCheck}
                              loadGridData={loadGridData}
                              setButtonClicked={setButtonClicked}
                              validation={validation}
                              setValidation={setValidation}
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

          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
            <p className="pagination-total-record mb-0">
              {Math.min(pageSize * curPage, total) === 0 ? (
                <span>
                  {t("Showing 0 to 0 of")} {total} {t("entries")}
                </span>
              ) : (
                <span>
                  {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
                  {Math.min(pageSize * curPage, total)} {t("of Total")}{" "}
                  <span> {total} </span> {t("entries")}{" "}
                </span>
              )}
            </p>
            <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
              <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
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
                <i className="fa fa-angle-double-right"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
