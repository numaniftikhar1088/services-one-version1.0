import { Paper, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PatientService from "../../Services/PatientService/PatientService";
import PatientServices from "../../Services/PatientServices/PatientServices";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import ColumnSetup from "../../Shared/ColumnSetup/ColumnSetup";
import { Loader } from "../../Shared/Common/Loader";
import NoRecord from "../../Shared/Common/NoRecord";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import usePagination from "../../Shared/hooks/usePagination";
import { ArrowDown, ArrowUp } from "../../Shared/Icons";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import { checkPermissions } from "../../Utils/Common/CommonMethods";
import { a11yProps, TabConfiguration, TabSelected } from "../DynamicGrid";
import PatientSearchInput from "./PatientDemographic/PatientSearchInput";
import Row from "./Row";
import MiscellaneousService from "Services/MiscellaneousManagement/MiscellaneousService";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

const PatientDemographicsList = (props: any) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [bulkActions, setBulkActions] = useState([]);
  const [columnActions, setColumnsActions] = useState([]);
  const [topButtonActions, setTopButtonActions] = useState([]);
  const [bulkExportActions, setBulkExportActions] = useState([]);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
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

  const [isInitialRender2, setIsInitialRender2] = useState(false);

  useEffect(() => {
    if (isInitialRender2) {
      loadData(true);
    } else {
      setIsInitialRender2(true);
    }
  }, []);

  const initialTableData = {
    gridHeaders: [],
    gridColumns: [],
  };

  const [recordToDelete, setRecordToDelete] = useState<any>({
    action: "",
    patientId: null,
  });
  const [value, setValue] = useState<any>(null);
  const ModalhandleClose1 = () => setShow1(false);
  const [show1, setShow1] = useState(false);
  const [tabsLoading, setTabsLoading] = useState(true);
  const [showSetupModal, showModalSetup] = useState(false);
  const [tabPanels, setTabPanels] = useState<TabConfiguration[] | []>([]);
  const [tabIdToSend, setTabIdToSend] = useState(1);
  const [tabData, setTabData] = useState<any>(initialTableData);

  const searchRef = useRef<any>(null);

  const initalSortingObj = {
    clickedIconData: "patbasicinfo.PatientId",
    sortingOrder: "desc",
  };

  const [sort, setSorting] = useState(initalSortingObj);
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [filters, setFilters] = useState<any>([]);

  const initialQueryObj = {
    tabId: 1,
    pageNumber: 1,
    pageSize: 50,
    sortColumn: sort.clickedIconData,
    sortDirection: sort.sortingOrder,
    filters: [],
  };

  const [searchValue, setSearchValue] =
    useState<Record<string, any>>(initialQueryObj);
  const [expandableColumnsHeader, setExpandableColumnsHeader] = useState<any>(
    []
  );
  const [PatientDemoList, setPatientDemoList] = useState<any>([]);

  let columnsHeader = tabData?.gridHeaders?.[value]?.tabHeaders;

  const [isInitialRender3, setIsInitialRender3] = useState(false);

  const DeletebyId = async (item: any) => {
    await PatientServices?.deletebyid(item);
    toast.success(t("Patient Successfully deleted"));
    loadData(false);
  };

  const loadData = async (reset: boolean) => {
    const baseRequest: any = !reset
      ? {
          ...searchValue,
          sortColumn: sort.clickedIconData,
          sortDirection: sort.sortingOrder,
          pageNumber: curPage,
          pageSize: pageSize,
        }
      : {
          ...initialQueryObj,
          sortColumn: initalSortingObj.clickedIconData,
          sortDirection: initalSortingObj.sortingOrder,
          pageNumber: curPage,
          pageSize,
        };

    const trimmedRequest = {
      ...baseRequest,
      filters:
        baseRequest?.filters?.map((filter: any) => ({
          ...filter,
          filterValue:
            typeof filter.filterValue === "string"
              ? filter.filterValue.trim()
              : filter.filterValue,
        })) || [],
    };

    PatientService.getPatientDemographicsList(trimmedRequest)
      .then((res: AxiosResponse) => {
        setPatientDemoList(res.data.responseModel);
        setTotal(res?.data?.total);
      })
      .catch((err: AxiosError) => {
        console.trace(err);
        setPatientDemoList([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isInitialRender3) {
      loadData(false);
    } else {
      setIsInitialRender3(true);
    }
  }, [pageSize, curPage, triggerSearchData]);

  const resetSearch = async () => {
    setFilters([]);
    setClicked(!clicked);
    setSorting(initalSortingObj);
    setSearchValue((prev) => ({
      ...prev,
      ...initialQueryObj,
      tabId: value,
    }));
  };

  const closeSetupModal = () => {
    showModalSetup(false);
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
    if (columnsHeader?.length) {
      setExpandableColumnsHeader(
        columnsHeader
          ?.map((item: any) => {
            if (item.isShowOnUi && item.isExpandData) {
              return item;
            } else return null;
          })
          .filter((item: any) => item !== null)
      );
    }
  }, [columnsHeader]);

  const [isInitialRender, setIsInitialRender] = useState(false);

  useEffect(() => {
    if (isInitialRender) {
      loadData(false);
    } else {
      setIsInitialRender(true);
    }
  }, [sort]);

  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  useEffect(() => {
    let filteredObject: any = {};

    filters?.forEach((filterData: any) => {
      filteredObject[filterData.label] = filterData.filterValue;
    });

    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(filteredObject)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [filters]);

  const handleTagRemoval = (clickedTag: string) => {
    let resultedTab = filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });

    setFilters(() => [...resultedTab]);
    setSearchValue((prevValue) => ({
      ...prevValue,
      filters: resultedTab,
    }));
  };

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    let Id: any = event.currentTarget.id;
    let thenum: any = Id.match(/\d+/)[0];
    if (searchValue?.tabId !== thenum) {
      setSearchValue(() => {
        return {
          ...initialQueryObj,
          tabId: +thenum,
        };
      });
    }

    const _tabId = +(event.target as any).id;
    const _tabData = tabData?.gridHeaders?.[_tabId - 1];

    setValue(newValue);
    setTabIdToSend(_tabId);
    setColumnsActions(_tabData?.tabActions);
    setBulkActions(_tabData?.bulkActions);
    setBulkExportActions(_tabData?.bulkExportActions);
    setTopButtonActions(_tabData?.topButtonAction);
  };

  const loadTabsForDynamicGrid = async () => {
    try {
      const response = await MiscellaneousService.dynamicGridTabs();
      let filteredTabData = response?.data?.data?.map((tab: any) => ({
        tabName: tab.tabName,
        tabID: tab.tabID,
        sortOrder: tab.sortOrder,
      }));

      setColumnsActions(response?.data?.data[0]?.tabActions);
      setBulkActions(response?.data?.data[0]?.bulkActions);
      setBulkExportActions(response?.data?.data[0]?.bulkExportActions);
      setTopButtonActions(response?.data?.data[0]?.topButtonAction);

      setTabPanels(filteredTabData);
      setValue(filteredTabData[0]?.sortOrder - 1);
      setTabIdToSend(filteredTabData[0]?.tabID);
      setSearchValue(() => {
        return {
          ...initialQueryObj,
          tabId: filteredTabData?.[0]?.tabID,
        };
      });
      setTabData((preVal: any) => {
        return {
          ...preVal,
          gridHeaders: response?.data?.data,
        };
      });
    } catch (error) {
      return error;
    } finally {
      setTabsLoading(false);
    }
  };

  const fetchDataSequentially = async () => {
    try {
      await loadTabsForDynamicGrid();
      await loadData(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataSequentially();
  }, []);

  const handlePatientDelete = async () => {
    await PatientServices.makeApiCall(
      recordToDelete.action.actionUrl,
      recordToDelete.patientId,
      recordToDelete.action.methodType ?? null
    );
    await loadData(true);
    setShow1(false);
  };

  const isExpandable = () =>
    columnsHeader?.some((column: any) => column.isExpandData);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <ColumnSetup
        value={tabIdToSend}
        show={showSetupModal}
        columnsToUse={columnsHeader}
        loadData={fetchDataSequentially}
        closeSetupModal={closeSetupModal}
      />
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-icon btn-sm fw-bold btn-setting btn-icon-light"
              onClick={() => showModalSetup(true)}
            >
              <i className="fa fa-gear"></i>
            </button>
            {checkPermissions(props.User.Menus, "/patient") && (
              <PermissionComponent
                moduleName="Patient"
                pageName="Patient Demographic"
                permissionIdentifier="AddaPatient"
              >
                <Link
                  id={`PatientDemoGraphicAddNew`}
                  to="/patient"
                  className="btn btn-sm fw-bold btn-primary"
                >
                  {t("Add a Patient")}
                </Link>
              </PermissionComponent>
            )}
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="mb-5 hover-scroll-x">
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{ style: { background: "transparent" } }}
              className="min-h-auto"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-scrollButtons": {
                  width: 0,
                  transition: "width 0.7s ease",
                  "&:not(.Mui-disabled)": {
                    width: "48px",
                  },
                },
              }}
            >
              {Array.isArray(tabPanels) &&
                tabPanels?.map((items: any) => (
                  <TabSelected
                    data-test-id={items?.tabName?.replace(/\s/g, "")}
                    key={items.tabID}
                    label={t(items.tabName)}
                    {...a11yProps(items.tabID, items.sortOrder)}
                    className="fw-bold text-capitalize"
                    disabled={loading}
                  />
                ))}
            </Tabs>
            <div className="tab-pane" id="activetab" role="tabpanel">
              <div className="card tab-content-card">
                <div className="card-toolbar">
                  <div className="p-0 del-before"></div>
                </div>
                <div className="card-body py-2">
                  <div className="d-flex gap-2 flex-wrap pb-2">
                    {searchedTags.map((tag) => (
                      <div
                        className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                        onClick={() => handleTagRemoval(tag)}
                      >
                        <span className="fw-bold">{tag}</span>
                        <i className="bi bi-x"></i>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center">
                    <div className="d-flex align-items-center mb-2 gap-2">
                      <div className="d-flex align-items-center">
                        <span className="fw-400 mr-2">{t("Records")}</span>
                        <select
                          id={`PatientDemoGraphicRecords`}
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
                    <div className="d-flex align-items-center mb-2 gap-2 ps-3">
                      <button
                        id={`PatientDemoGraphicSearch`}
                        onClick={() => {
                          setCurPage(1);
                          setTriggerSearchData((prev) => !prev);
                        }}
                        className="btn btn-info btn-sm fw-500"
                        aria-controls="Search"
                      >
                        {t("Search")}
                      </button>
                      <button
                        onClick={resetSearch}
                        type="button"
                        className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                        id={`PatientDemoGraphicReset`}
                      >
                        <span>
                          <span>{t("Reset")}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                  <Box sx={{ height: "auto", width: "100%" }}>
                    <div className="table_bordered overflow-hidden">
                      <TableContainer
                        sx={
                          isMobile
                            ? {} // 👉 if mobile, apply no styles
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
                        component={Paper}
                        className="shadow-none"
                      >
                        <Table
                          aria-label="sticky table collapsible"
                          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                        >
                          <>
                            {tabsLoading && !columnsHeader?.length ? null : (
                              <TableHead className="h-40px">
                                <TableRow>
                                  {bulkActions?.length ? (
                                    <TableCell></TableCell>
                                  ) : null}
                                  {isExpandable() ? (
                                    <TableCell></TableCell>
                                  ) : null}
                                  {!columnActions?.length ? null : (
                                    <TableCell></TableCell>
                                  )}
                                  {columnsHeader?.map(
                                    (column: any) =>
                                      column.isShowOnUi &&
                                      !column.isExpandData &&
                                      column.isShow && (
                                        <TableCell>
                                          {column?.columnKey && (
                                            <PatientSearchInput
                                              loadData={loadData}
                                              column={column}
                                              searchValue={searchValue}
                                              filters={filters}
                                              setFilters={setFilters}
                                              setSearchValue={setSearchValue}
                                            />
                                          )}
                                        </TableCell>
                                      )
                                  )}
                                </TableRow>
                                <TableRow className="h-30px">
                                  {bulkActions?.length ? (
                                    <TableCell></TableCell>
                                  ) : null}
                                  {isExpandable() ? (
                                    <TableCell></TableCell>
                                  ) : null}
                                  {!columnActions?.length ? null : (
                                    <TableCell>{t("Actions")}</TableCell>
                                  )}
                                  {columnsHeader?.map((column: any) => {
                                    return (
                                      column.isShowOnUi &&
                                      !column.isExpandData &&
                                      column.isShow && (
                                        <TableCell
                                          sx={{ width: "max-content" }}
                                        >
                                          <div
                                            className="d-flex justify-content-between cursor-pointer"
                                            ref={searchRef}
                                            onClick={() =>
                                              handleSort(column.columnKey)
                                            }
                                          >
                                            <span style={{ minWidth: "100px" }}>
                                              {t(column.columnLabel)}
                                            </span>
                                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                              <ArrowUp
                                                CustomeClass={`${
                                                  sort.sortingOrder === "asc" &&
                                                  sort.clickedIconData ===
                                                    column.columnKey
                                                    ? "text-danger fs-6"
                                                    : "text-gray-700 fs-7"
                                                }  p-0 m-0 "`}
                                              />
                                              <ArrowDown
                                                CustomeClass={`${
                                                  sort.sortingOrder ===
                                                    "desc" &&
                                                  sort.clickedIconData ===
                                                    column.columnKey
                                                    ? "text-danger fs-6"
                                                    : "text-gray-700 fs-7"
                                                }  p-0 m-0`}
                                              />
                                            </div>
                                          </div>
                                        </TableCell>
                                      )
                                    );
                                  })}
                                </TableRow>
                              </TableHead>
                            )}
                            <TableBody>
                              {loading ? (
                                <TableCell colSpan={9}>
                                  <Loader />
                                </TableCell>
                              ) : !PatientDemoList?.length ? (
                                <NoRecord />
                              ) : (
                                PatientDemoList?.map((item: any) => (
                                  <Row
                                    item={item}
                                    setShow1={setShow1}
                                    loadData={loadData}
                                    bulkActions={bulkActions}
                                    columnsHeader={columnsHeader}
                                    handlePatientDelete={handlePatientDelete}
                                    setRecordToDelete={setRecordToDelete}
                                    expandableColumnsHeader={
                                      expandableColumnsHeader
                                    }
                                    columnActions={columnActions}
                                  />
                                ))
                              )}
                            </TableBody>
                          </>
                        </Table>
                      </TableContainer>
                      <Modal
                        show={show1}
                        onHide={ModalhandleClose1}
                        backdrop="static"
                        keyboard={false}
                      >
                        <Modal.Header
                          closeButton
                          className="bg-light-primary m-0 p-5"
                        >
                          <h4>Delete Record</h4>
                        </Modal.Header>
                        <Modal.Body>
                          Are you sure you want to delete this record ?
                        </Modal.Body>
                        <Modal.Footer className="p-0">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={ModalhandleClose1}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger m-2"
                            onClick={() => {
                              handlePatientDelete();
                            }}
                          >
                            Delete
                          </button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                    {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
                    <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
                      {/* =============== */}
                      <p className="pagination-total-record mb-0">
                        <span>
                          Showing {pageSize * (curPage - 1) + 1} to{" "}
                          {Math.min(pageSize * curPage, total)} of Total{" "}
                          <span> {total} </span> entries{" "}
                        </span>
                      </p>
                      {/* =============== */}
                      <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={() => showPage(1)}
                        >
                          <i className="fa fa-angle-double-left"></i>
                        </li>
                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={prevPage}
                        >
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

                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={nextPage}
                        >
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
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(PatientDemographicsList);
