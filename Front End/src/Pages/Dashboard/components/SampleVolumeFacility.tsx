import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { base64ToExcel } from "Pages/DynamicGrid/bulkExportActions";
import { RefLabDetails } from "Pages/ICD10Assigment/ICD10Assigment";
import { ReferenceLab } from "Pages/Insurance/LabSelection";
import AssigmentService from "Services/AssigmentService/AssigmentService";
import {
  getDashboardFacilityDataToExcel,
  getFacilityDataForDashboard,
} from "Services/Dashboard";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import CustomPagination from "Shared/JsxPagination";
import { InputChangeEvent } from "Shared/Type";
import useLang from "Shared/hooks/useLanguage";
import usePagination from "Shared/hooks/usePagination";
import { reactSelectStyle, styles } from "Utils/Common";
import { formatFileName } from "Utils/Common/CommonMethods";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { SearchQuery } from "../dashboard.types";
import { useSelector } from "react-redux";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";

const initialDataState = {
  facilityName: "",
  state: "",
};

function SampleVolumeFacility() {
  const { t } = useLang();
  const initialSorting = {
    clickedIconData: "",
    sortingOrder: "",
  };

  const [sort, setSorting] = useState(initialSorting);

  const [state, setState] = useState<SearchQuery>(initialDataState);
  const [rows, setRows] = useState<any[]>([]);
  const [headersData, setHeadersData] = useState<any[]>([]);
  const [referenceLabList, setReferenceLabList] = useState<ReferenceLab[]>([]);
  const [selectedLab, setSelectedLab] = useState<null>(null);
  const [loading, setLoading] = useState(true);

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
  } = usePagination(0, 5);

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      getFacilityDashboardData();
    }
  };

  const getFacilityDashboardData = async () => {
    try {
      const queryModel = {
        pageNumber: curPage,
        pageSize: pageSize,
        sortColumn: sort.clickedIconData,
        sortOrder: sort.sortingOrder,
        filterData: state,
        referenceLabId: selectedLab ?? 0,
      };

      setLoading(true);
      const response = await getFacilityDataForDashboard(queryModel);

      // Extract rows and headers data
      const responseData = response.data.data.data;
      const columnHeader = response.data.data.columnHeader;
      setRows(responseData);

      const sortedHeaders = columnHeader.sort(
        (a: any, b: any) => a.sortOrder - b.sortOrder
      );

      setHeadersData(sortedHeaders);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportFacilityData = async () => {
    try {
      const response = await getDashboardFacilityDataToExcel(selectedLab ?? 0);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(response?.data?.message);
        base64ToExcel(
          response.data.data.fileContents,
          formatFileName("dashboard-facility")
        );
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setSorting(initialSorting);
    setState(initialDataState);
    setCurPage(1);
    getFacilityDashboardData();
  };

  useEffect(() => {
    getFacilityDashboardData();
  }, [sort, pageSize, curPage]);

  useEffect(() => {
    getFacilityDashboardData();
  }, [selectedLab]);

  useEffect(() => {
    getReferenceLabs();
  }, []);

  const getReferenceLabs = () => {
    AssigmentService.ReferenceLabLookUp().then((res: any) => {
      let RefLabArray: ReferenceLab[] = [];
      res?.data?.data?.map(({ labId, labDisplayName }: RefLabDetails) => {
        let RefLabDetails: ReferenceLab = {
          value: labId,
          label: labDisplayName,
        };
        RefLabArray.push(RefLabDetails);
      });

      setReferenceLabList(RefLabArray);
    });
  };

  const onReferenceSelect = (e: any) => {
    setSelectedLab(e);
  };

  const portalType = useSelector(
    (state: any) =>
      state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.portalType
  );

  return (
    <div className="mt-4">
      <div className="card shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="mb-2 p-4">
          <h5 className="card-title">
            {t("Sample Volume Count Last 6 Months")}
          </h5>
          <Divider />
        </div>
        <div className="row pb-4">
          <div className="px-10">
            <div className="d-flex gap-4">
              <Button
                onClick={() => exportFacilityData()}
                variant="contained"
                color="success"
                sx={{ textTransform: "none" }} // 🟢 Disable automatic uppercase
              >
                {t("Export")}
              </Button>
              {portalType === PortalTypeEnum.Sales && (
                <Select
                  inputId={`AssignedICD10ReferenceLab`}
                  menuPortalTarget={document.body}
                  className="z-index-3"
                  styles={reactSelectStyle}
                  theme={(theme: any) => styles(theme)}
                  options={referenceLabList}
                  name="refLabId"
                  placeholder={t("Select Reference Lab")}
                  onChange={(e: any) => onReferenceSelect(e?.value)}
                  isSearchable={true}
                  isClearable={true}
                />
              )}
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
              <div className="d-flex gap-2 responsive-flexed-actions">
                <div className="d-flex align-items-center">
                  <span className="fw-400 mr-3">{t("Records")}</span>
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
                    <option value="5" selected>
                      5
                    </option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 ">
                <button
                  onClick={() => getFacilityDashboardData()}
                  className="btn btn-linkedin btn-sm fw-500"
                  aria-controls="Search"
                >
                  {t("Search")}
                </button>
                <button
                  onClick={() => handleReset()}
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
            <Box sx={{ height: "auto", width: "100%", mt: 4 }}>
              <div className="table_bordered overflow-hidden">
                <TableContainer
                  sx={{
                    maxHeight: 800,
                    "&::-webkit-scrollbar": { width: 7 },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "var(--kt-gray-400)",
                      borderRadius: 2,
                    },
                  }}
                  className="shadow-none"
                >
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                  >
                    <TableHead>
                      <TableRow>
                        {headersData.map((header, index) =>
                          header.key === "FacilityName" ? (
                            <TableCell key={header.key + index}>
                              <input
                                type="text"
                                name="facilityName"
                                className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                                placeholder={t("Search ...")}
                                value={state.facilityName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                          ) : header.key === "State" ? (
                            <TableCell key={header.key + index}>
                              <input
                                type="text"
                                name="state"
                                className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                                placeholder={t("Search ...")}
                                value={state.state}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                          ) : (
                            <TableCell></TableCell>
                          )
                        )}
                      </TableRow>
                      <TableRow>
                        {headersData.map((header) => (
                          <TableCell key={header.key}>
                            <div
                              onClick={() => handleSort(header.key)}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t(header.label)}
                              </div>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === header.key
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === header.key
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={headersData.length}>
                          <Loader />
                        </TableCell>
                      ) : rows.length ? (
                        rows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {headersData.map((header) => {
                              const cellContent = row[header.key];

                              if (containsHTMLUsingDOMParser(cellContent)) {
                                return (
                                  <TableCell key={header.key}>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: cellContent,
                                      }}
                                    />
                                  </TableCell>
                                );
                              } else {
                                return (
                                  <TableCell key={header.key}>
                                    {cellContent}{" "}
                                  </TableCell>
                                );
                              }
                            })}
                          </TableRow>
                        ))
                      ) : (
                        <NoRecord colSpan={headersData.length} />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Pagination */}
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

export default SampleVolumeFacility;

const containsHTMLUsingDOMParser = (str: string): boolean => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");

  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};
