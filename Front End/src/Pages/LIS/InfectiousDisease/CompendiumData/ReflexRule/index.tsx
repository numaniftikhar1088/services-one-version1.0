import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Loader } from "../../../../../Shared/Common/Loader";
import NoRecord from "../../../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../../../Shared/Icons";
import { StringRecord } from "../../../../../Shared/Type";
import usePagination from "../../../../../Shared/hooks/usePagination";
import { sortingObject } from "../../../../../Utils/consts";
import Row, { ReflexRuleRow } from "./Row";
import { reactSelectSMStyle, styles } from "Utils/Common";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";
import CustomPagination from "Shared/JsxPagination";
import {
  GetAllReflexRules,
  PanelsAgainstLabId,
} from "Services/InfectiousDisease/ReflexRules";
import PanelMappingService from "Services/InfectiousDisease/PanelMappingService";

type InputChangeEvent = HTMLInputElement | HTMLSelectElement;

const queryDisplayTagNames: StringRecord = {
  labId: "Performing Lab",
  panelId: "Reflex Panel Name",
  testName: "Organism",
  reflexRule: "Reflex Rule",
  sourcePanelId: "Source Panel",
  testConfigId: "Organism",
};

export default function ReflexRule() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);

  const initialSearchQuery = {
    labId: 0,
    panelId: 0,
    panelName: "",
    sourcePanelId: 0,
    testConfigId: 0,
    testName: "",
    reflexRule: "",
    isMainPanel: null,
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
    if (initialRender2) {
      loadGridData(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  const searchRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const [rows, setRows] = useState<ReflexRuleRow[]>(() => []);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [sort, setSorting] = useState<any>({
    sortingOrder: "",
    clickedIconData: "",
  });
  const [dropDownValues, setDropDownValues] = useState({
    PanelList: [],
    OrganismList: [],
    PanelSearchList: [],
    PerformingLabList: [],
    ReflexRuleList: [
      { label: "Detected", value: "Detected" },
      { label: "Not Detected", value: "Not Detected" },
    ],
  });

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortingObject);
    loadGridData(true, true, sortingObject);
  }

  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    setIsAddButtonDisabled(false);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    GetAllReflexRules({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.totalRecord);
        setRows(res?.data?.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

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
    if (initialRender) {
      loadGridData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [sort]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  const PerformingLabLookUp = () => {
    PanelMappingService.PerformingLabLookup()
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            PerformingLabList: res?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const PanelLookUp = (labId: number | null) => {
    PanelsAgainstLabId(labId)
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            [labId ? "PanelList" : "PanelSearchList"]: res?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  useEffect(() => {
    PerformingLabLookUp();
    PanelLookUp(null);
  }, []);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-1">
        {searchedTags.map((tag) => (
          <div
            className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
            onClick={() => handleTagRemoval(tag)}
            key={tag}
          >
            <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
            <i className="bi bi-x"></i>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              id={`IDCompendiumDataPharmDPreferenceRecords`}
              className="form-select w-sm-125px w-90px h-33px rounded py-2"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-allow-clear="true"
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurPage(1);
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
                pageName="Compendium Data"
                permissionIdentifier="AddNew"
              >
                <Button
                  id={`IDCompendiumDataPharmDPreferenceAddRow`}
                  onClick={() => {
                    if (!isAddButtonDisabled) {
                      setRows((prevRows: any) => [
                        {
                          ...initialSearchQuery,
                          rowStatus: true,
                          id: 0,
                        },
                        ...prevRows,
                      ]);
                      setIsAddButtonDisabled(true);
                    }
                  }}
                  variant="contained"
                  color="success"
                  className="btn btn-primary btn-sm text-capitalize fw-400"
                  disabled={loading}
                  sx={{
                    "&.Mui-disabled": {
                      opacity: "0.65",
                      backgroundColor: "#69A54B",
                      color: "white",
                    },
                  }}
                >
                  <i className="bi bi-plus-lg"></i>
                  {t("Add New Assignment")}
                </Button>
              </PermissionComponent>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <button
            id={`IDCompendiumDataPharmDPreferenceSearch`}
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
            id={`IDCompendiumDataPharmDPreferenceReset`}
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
                  ? {}
                  : {
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
                    }
              }
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
                      <Select
                        inputId="IDCompendiumDataPanelMapingPerformingLab"
                        menuPortalTarget={document.body}
                        className="my-1"
                        theme={(theme) => styles(theme)}
                        placeholder={t("Select...")}
                        options={dropDownValues?.PerformingLabList}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            labId: event.value,
                          });
                        }}
                        value={dropDownValues?.PerformingLabList.filter(
                          function (option: any) {
                            return option.value === searchRequest?.labId;
                          }
                        )}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId="IDCompendiumDataPanelMapingPerformingLab"
                        menuPortalTarget={document.body}
                        className="my-1"
                        theme={(theme) => styles(theme)}
                        placeholder={t("Select...")}
                        options={dropDownValues?.PanelSearchList}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            sourcePanelId: event.value,
                          });
                        }}
                        value={dropDownValues?.PanelSearchList.filter(function (
                          option: any
                        ) {
                          return option.value === searchRequest?.sourcePanelId;
                        })}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataPanelReportingRuleName`}
                        type="text"
                        name="testName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.testName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId="IDCompendiumDataPanelMapingPerformingLab"
                        menuPortalTarget={document.body}
                        className="my-1"
                        theme={(theme) => styles(theme)}
                        placeholder={t("Select...")}
                        options={dropDownValues?.PanelSearchList}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            panelId: event.value,
                          });
                        }}
                        value={dropDownValues?.PanelSearchList.filter(function (
                          option: any
                        ) {
                          return option.value === searchRequest?.panelId;
                        })}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId="IDCompendiumDataPanelMapingPerformingLab"
                        menuPortalTarget={document.body}
                        className="my-1"
                        theme={(theme) => styles(theme)}
                        placeholder={t("Select...")}
                        options={dropDownValues?.ReflexRuleList}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            reflexRule: event.value,
                          });
                        }}
                        value={dropDownValues?.ReflexRuleList.filter(function (
                          option: any
                        ) {
                          return option.value === searchRequest?.reflexRule;
                        })}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="h-30px">
                    <TableCell className="min-w-50px">{t("Actions")}</TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("labId")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Performing Lab")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "labId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "labId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("sourcePanelName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Source Panel")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "sourcePanelName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "sourcePanelName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("testName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Source Organism")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "testName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "testName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("panelName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Reflex Panel")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "panelName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "panelName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("reflexRule")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Reflex Rule")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "reflexRule"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "reflexRule"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-50px">
                      <div style={{ width: "max-content" }}>
                        {t("Main Panel")}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={7} className="">
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows.map((item: any, index) => {
                      return (
                        <Row
                          row={item}
                          rows={rows}
                          key={item.id}
                          index={index}
                          setRows={setRows}
                          PanelLookUp={PanelLookUp}
                          loadGridData={loadGridData}
                          dropDownValues={dropDownValues}
                          setDropDownValues={setDropDownValues}
                          queryDisplayTagNames={queryDisplayTagNames}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                        />
                      );
                    })
                  ) : (
                    <NoRecord colSpan={7} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
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
    </>
  );
}
