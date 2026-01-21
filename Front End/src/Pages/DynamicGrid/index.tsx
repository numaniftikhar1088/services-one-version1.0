import { Collapse, Paper, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import { AxiosError, AxiosResponse } from "axios";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PatientServices from "../../Services/PatientServices/PatientServices";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import ColumnSetup from "../../Shared/ColumnSetup/ColumnSetup";
import { Loader } from "../../Shared/Common/Loader";
import NoRecord from "../../Shared/Common/NoRecord";
import { ArrowDown, ArrowUp, CrossIcon, DoneIcon } from "../../Shared/Icons";
import CustomPagination from "../../Shared/JsxPagination";
import usePagination from "../../Shared/hooks/usePagination";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "../../Utils/MuiStyles/AutocompleteStyles";
import PatientSearchInput from "../Patient/PatientDemographic/PatientSearchInput";
import useLang from "./../../Shared/hooks/useLanguage";
import { useDynamicGrid } from "./Context/useDynamicGrid";
import Row from "./Row";
import BulkActions from "./bulkActions";
import BulkExportActions from "./bulkExportActions";
import TopButtonActions from "./topActions";
import MiscellaneousService from "Services/MiscellaneousManagement/MiscellaneousService";

export interface TabConfiguration {
  tabName: string;
  tabID: number;
}

const DynamicGrid = () => {
  const { t } = useLang();
  const { pageId } = useParams();

  const {
    inputFields,
    handleSelectAll,
    setBulkIds,
    setTabPanels,
    setColumnsActions,
    setColumnDataActions,
    setBulkActions,
    setBulkExportActions,
    setTopButtonActions,
    setIsBulkEdit,
    searchRef,
    value,
    setValue,
    tabPanels,
    bulkActions,
    bulkExportActions,
    topButtonActions,
    bulkIds,
    isBulkEdit,
    columnActions,
    setInputFields,
    apiData,
    setTabIdToSend,
    tabIdToSend,
    setExpandableColumnsHeader,
    tabData,
    setTabData,
    rows,
    setRows,
    isExpandable,
    columnsHeader,
  } = useDynamicGrid();

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

  const isFirstLoad = useRef(true);
  const [show1, setShow1] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [showSetupModal, showModalSetup] = useState(false);
  const [triggerSearchData, setTriggerSearchData] = useState(false);

  const ModalhandleClose1 = () => setShow1(false);

  const initialSortingObj = {
    clickedIconData: "",
    sortingOrder: "",
  };

  const [sort, setSorting] = useState(initialSortingObj);
  const [loading, setLoading] = useState(true);
  const [tabsLoading, setTabsLoading] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [filters, setFilters] = useState<any>([]);

  const initialQueryObj = {
    tabId: 1,
    pageNumber: curPage,
    pageSize: pageSize,
    sortColumn: sort.clickedIconData,
    sortDirection: sort.sortingOrder,
    filters: [],
  };

  const [searchValue, setSearchValue] =
    useState<Record<string, any>>(initialQueryObj);

  const DeletebyId = async (item: any) => {
    try {
      const response = await PatientServices?.deletebyid(item);
      toast.success(t(response.data.message));
      loadData(true);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async (reset: boolean = true) => {
    // Early return if tabId is not available
    if (tabIdToSend === null) return;

    setLoading(true);

    try {
      // Build base request object
      const baseRequest: any = reset
        ? {
            ...initialQueryObj,
            tabId: tabIdToSend,
            sortColumn: initialSortingObj.clickedIconData,
            sortDirection: initialSortingObj.sortingOrder,
            pageNumber: curPage,
            pageSize,
          }
        : {
            ...searchValue,
            tabId: tabIdToSend,
            sortColumn: sort.clickedIconData,
            sortDirection: sort.sortingOrder,
            pageNumber: curPage,
            pageSize: pageSize,
          };

      // Trim filterValue in all filters before sending
      const sanitizedRequest = {
        ...baseRequest,
        filters:
          baseRequest.filters?.map((filter: any) => ({
            ...filter,
            filterValue:
              typeof filter.filterValue === "string"
                ? filter.filterValue.trim()
                : filter.filterValue,
          })) || [],
      };

      const response = await RequisitionType.dynamicGrid(sanitizedRequest);

      // Update state with response data
      setRows(response.data.data);
      setTotal(response?.data?.total);
    } catch (error) {
      console.error("Error loading data:", error);
      setRows([]);
      // Optional: Add toast notification for user feedback
      // toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = async () => {
    setFilters([]);
    setClicked(!clicked);
    setSorting(initialSortingObj);
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
          .map((item: any) => {
            if (item.isShowOnUi && item.isExpandData) {
              return item;
            } else return null;
          })
          .filter((item: any) => item !== null)
      );
    }
  }, [columnsHeader]);

  /**
   * Loads tab data and configurations for the dynamic grid.
   *
   * This asynchronous function fetches data from an API, processes it, and updates various state variables
   * with the retrieved tab information and configurations. It handles the following tasks:
   *
   * 1. Fetches tab data using `RequisitionType.getViewReqGridData()`.
   * 2. Extracts and processes input fields based on visibility and configuration.
   * 3. Filters and structures the tab data.
   * 4. Updates state variables related to column actions, bulk actions, and other configurations.
   * 5. Initializes the selected tab on the first load.
   *
   * This function includes error handling and ensures that loading states are properly managed.
   *
   * @async
   * @function
   * @returns {Promise<void>} Resolves when the data has been successfully loaded and state updated.
   */
  const loadTabsForDynamicGrid = async (callFrom?: string) => {
    try {
      const response = await MiscellaneousService.dynamicGridTabs();
      const data = response?.data?.data?.[value];

      const inputFields = data?.tabHeaders?.map((column: any) => {
        if (column.isShowOnUi && !column.isExpandData && column.isShow) {
          return {
            inputType: column.filterColumnsType,
            name: column.columnKey,
            jsonOptionData: column.jsonOptionData,
            fieldName: column.fieldName,
            isIndividualEditable: column.isIndividualEditable,
          };
        }
      });
      const filteredTabData = response?.data?.data?.map((tab: any) => ({
        tabName: tab.tabName,
        tabID: tab.tabID,
        sortOrder: tab.sortOrder,
      }));

      setColumnsActions(response?.data?.data[0]?.tabActions);
      setColumnDataActions(response?.data?.data[0]?.columnAction);
      setBulkActions(response?.data?.data[0]?.bulkActions);
      setBulkExportActions(response?.data?.data[0]?.bulkExportActions);
      setTopButtonActions(response?.data?.data[0]?.topButtonAction);

      setInputFields(inputFields);
      setTabPanels(filteredTabData);
      if (isFirstLoad.current) {
        setValue(filteredTabData[0]?.sortOrder - 1);
        isFirstLoad.current = false;
      }

      if (callFrom !== "columnSetup") {
        setTabIdToSend(filteredTabData[0]?.tabID);
      }

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

  useEffect(() => {
    if (tabIdToSend !== null) {
      loadData(true);
    }
  }, [tabIdToSend]);

  useEffect(() => {
    setTabIdToSend(null);
    loadTabsForDynamicGrid();

    return () => {
      setValue(0);
      setRows([]);
      setSearchedTags([]);
      setBulkIds([]);
    };
  }, [pageId]);

  /**
   * Handles the tab change event and updates the state accordingly.
   *
   * This asynchronous function is triggered when a tab is changed.
   * It performs the following actions:
   *
   * 1. Extracts the ID from the event target and determines the tab number.
   * 2. Retrieves the tab data based on the `sortOrder`.
   * 3. Maps over the tab headers to extract input field information and sets `inputFields`.
   * 4. Updates various state variables including `value`, `tabIdToSend`, `spareTabId`, `bulkActions`, `columnsActions`, `topButtonActions`, and `bulkExportActions`.
   *
   * @param {React.SyntheticEvent} event - The event object from the tab change action.
   * @param {number} newValue - The new tab index or value.
   */
  const handleTabChange = async (event: SyntheticEvent, newValue: number) => {
    setCurPage(1);

    const Id: any = event.currentTarget.id;
    const thenum: any = Id.match(/\d+/)[0];
    if (searchValue?.tabId !== thenum) {
      setSearchValue(() => {
        return {
          ...initialQueryObj,
          tabId: +thenum,
        };
      });
      setFilters(() => []);
    }

    const _tabId = +(event.target as any).id;

    const ariaControls: string | null =
      event.currentTarget.getAttribute("aria-controls");

    let sortOrder: any = null;
    if (ariaControls) {
      const parts = ariaControls.split("-");
      sortOrder = +parts[parts.length - 1];
    }

    let _tabData: any = null;
    if (sortOrder === 0) {
      _tabData = tabData?.gridHeaders?.[sortOrder];
    } else {
      _tabData = tabData?.gridHeaders?.[sortOrder - 1];
    }

    const inputFields = _tabData?.tabHeaders?.map((column: any) => {
      if (column.isShowOnUi && !column.isExpandData && column.isShow) {
        return {
          inputType: column.filterColumnsType,
          name: column.columnKey,
          jsonOptionData: column.jsonOptionData,
          fieldName: column.fieldName,
          isIndividualEditable: column.isIndividualEditable,
        };
      }
    });
    setInputFields(inputFields);

    setValue(newValue);
    setTabIdToSend(_tabId);
    setBulkActions(_tabData?.bulkActions);
    setColumnsActions(_tabData?.tabActions);
    setTopButtonActions(_tabData?.topButtonAction);
    setBulkExportActions(_tabData?.bulkExportActions);
  };

  const [isInitialRender, setIsInitialRender] = useState(false);

  useEffect(() => {
    if (isInitialRender) {
      loadData(false);
    } else {
      setIsInitialRender(true);
    }
  }, [sort, curPage, pageSize, triggerSearchData, value]);

  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  useEffect(() => {
    const filteredObject: any = {};

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
    const resultedTab = filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });

    setFilters(() => [...resultedTab]);
    setSearchValue((prevValue) => ({
      ...prevValue,
      filters: resultedTab,
    }));
  };

  useEffect(() => {
    const hasTags = searchedTags.length > 0;
    setOpenCollapse(hasTags);

    if (!hasTags) {
      resetSearch();
    }
  }, [searchedTags.length]);

  /**
   * The `handleSelectAll` function allows you to select all rows for bulk actions.
   *
   * description:
   * This function collects the IDs of all rows and updates the `bulkIds` state variable
   */

  /**
   * `handleBulkUpdate` is asynchronous function used to handle bulk Edit
   *
   */
  const handleBulkUpdate = async () => {
    const nameToFieldMap = inputFields.reduce((map: any, item: any) => {
      if (item && item.fieldName !== undefined && !item.show) {
        map[item.name] = item.fieldName;
      }
      return map;
    }, {});

    const updatedRows = rows
      .map((item: any) => {
        const updatedData = Object.keys(item).reduce(
          (result: any, key: any) => {
            const fieldName = nameToFieldMap[key];

            if (fieldName) {
              result[fieldName] = item[key];
            }
            return result;
          },
          {}
        );

        if (item.rowStatus) {
          updatedData.rowStatus = item.rowStatus;
        }

        // appending Id in object
        if (Object.keys(updatedData).length > 0) {
          updatedData.Id = item.Id;
        }

        return updatedData;
      })
      .filter((item: any) => item.rowStatus === true) // filtering out objects with rowStatus as they are not editable
      .map((item: any) => {
        delete item.rowStatus;
        return item;
      });

    const payload = {
      tableId: 0,
      tabId: tabIdToSend,
      jsonFields: JSON.stringify(updatedRows),
    };
    await PatientServices.makeApiCallForDynamicGrid(
      apiData.url,
      apiData.method ?? null,
      payload
    );
    loadData(false);
    setIsBulkEdit(false);
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <ColumnSetup
        value={tabIdToSend}
        show={showSetupModal}
        columnsToUse={columnsHeader}
        closeSetupModal={closeSetupModal}
        loadData={loadTabsForDynamicGrid}
        dynamicGridLoad={loadData}
      />
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id={`PatientDynaminGridSetup`}
              className="btn btn-icon btn-sm fw-bold btn-setting btn-icon-light"
              onClick={() => showModalSetup(true)}
            >
              <i className="fa fa-gear"></i>
            </button>
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
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: { background: "transparent", cursor: "pointer" },
              }}
              sx={{ p: 0 }}
              className="min-h-auto"
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
                <div className="card-body py-md-4 py-3">
                  <Collapse in={openCollapse}>
                    <div
                      className="d-flex gap-2 flex-wrap pb-2"
                      style={{ height: "40px" }}
                    >
                      {searchedTags.map((tag) => (
                        <div
                          className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                          onClick={() => handleTagRemoval(tag)}
                          key={tag}
                        >
                          <span className="fw-bold">{t(tag)}</span>
                          <i className="bi bi-x"></i>
                        </div>
                      ))}
                    </div>
                  </Collapse>
                  <div className="d-flex align-items-center mb-2 justify-content-center justify-content-sm-between">
                    <div className="d-flex align-items-center">
                      <span className="fw-400 mr-3">{t("Records")}</span>
                      <select
                        id={`PatientDynaminGridRecords`}
                        className="form-select w-125px h-33px rounded mr-3"
                        data-kt-select2="true"
                        data-placeholder={t("Select option")}
                        data-dropdown-parent="#kt_menu_63b2e70320b73"
                        data-allow-clear="true"
                        onChange={(e) => {
                          setBulkIds([]);
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
                      <div className="d-flex gap-2 flex-wrap">
                        {bulkActions?.length > 0 && (
                          <BulkActions loadData={loadData} rows={rows} />
                        )}
                        {bulkExportActions?.length > 0 && (
                          <BulkExportActions filters={filters} />
                        )}
                        {topButtonActions?.length > 0 && (
                          <TopButtonActions
                            loadData={loadData}
                            rows={rows}
                            loadTabsForDynamicGrid={loadTabsForDynamicGrid}
                          />
                        )}
                        {isBulkEdit && (
                          <div className="gap-1 d-flex">
                            <button
                              id={`PatientDynaminGridSave`}
                              onClick={() => handleBulkUpdate()}
                              className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                            >
                              <DoneIcon />
                            </button>
                            <button
                              id={`PatientDynaminGridCancel`}
                              onClick={() => {
                                loadData(false);
                                setIsBulkEdit(false);
                              }}
                              className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                            >
                              <CrossIcon />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <button
                        id={`PatientDynaminGridSearch`}
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
                        id={`PatientDynaminGridReset`}
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
                          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                        >
                          {!columnsHeader?.length ? null : tabsLoading &&
                            !columnsHeader?.length ? null : (
                            <TableHead className="h-40px">
                              <TableRow>
                                {bulkActions?.length ||
                                bulkExportActions?.length ? (
                                  <TableCell></TableCell>
                                ) : null}
                                {isExpandable() ? (
                                  <TableCell></TableCell>
                                ) : null}
                                {!columnActions?.length ? null : (
                                  <TableCell></TableCell>
                                )}
                                {columnsHeader?.map(
                                  (column: any, index: number) =>
                                    column.isShowOnUi &&
                                    !column.isExpandData &&
                                    column.isShow && (
                                      <TableCell
                                        key={column?.columnName + index}
                                      >
                                        {column?.filterColumns && (
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
                                {bulkActions?.length ||
                                bulkExportActions?.length ? (
                                  <TableCell>
                                    <label className="form-check form-check-sm form-check-solid">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={
                                          bulkIds.length === rows.length &&
                                          bulkIds.length !== 0
                                            ? true
                                            : false
                                        }
                                        onChange={(e) =>
                                          handleSelectAll(e.target.checked)
                                        }
                                      />
                                    </label>
                                  </TableCell>
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
                                      <TableCell sx={{ width: "max-content" }}>
                                        <div
                                          className={`d-flex justify-content-between ${
                                            column.filterColumns &&
                                            "cursor-pointer"
                                          }`}
                                          ref={searchRef}
                                          onClick={() =>
                                            column.filterColumns
                                              ? handleSort(column.filterColumns)
                                              : null
                                          }
                                        >
                                          <span style={{ minWidth: "100px" }}>
                                            {t(column.columnLabel)}
                                          </span>
                                          {column.filterColumns ? (
                                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                              <ArrowUp
                                                CustomeClass={`${
                                                  sort.sortingOrder === "asc" &&
                                                  sort.clickedIconData ===
                                                    column.filterColumns
                                                    ? "text-danger fs-6"
                                                    : "text-gray-700 fs-7"
                                                }  p-0 m-0 "`}
                                              />
                                              <ArrowDown
                                                CustomeClass={`${
                                                  sort.sortingOrder ===
                                                    "desc" &&
                                                  sort.clickedIconData ===
                                                    column.filterColumns
                                                    ? "text-danger fs-6"
                                                    : "text-gray-700 fs-7"
                                                }  p-0 m-0`}
                                              />
                                            </div>
                                          ) : null}
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
                            ) : !rows.length ? (
                              <NoRecord />
                            ) : (
                              rows?.map((item: any) => (
                                <Row
                                  key={item?.Id}
                                  rows={rows}
                                  item={item}
                                  loadData={loadData}
                                />
                              ))
                            )}
                          </TableBody>
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
                          <h4>{t("Delete Record")}</h4>
                        </Modal.Header>
                        <Modal.Body>
                          {t("Are you sure you want to delete this record ?")}
                        </Modal.Body>
                        <Modal.Footer className="p-0">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={ModalhandleClose1}
                          >
                            {t("Cancel")}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger m-2"
                            onClick={() => {
                              ModalhandleClose1();
                              DeletebyId(value);
                            }}
                          >
                            {t("Delete")}
                          </button>
                        </Modal.Footer>
                      </Modal>
                    </div>
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
        </div>
      </div>
    </div>
  );
};

export default DynamicGrid;

export const TabSelected = styled(Tab)(AutocompleteStyle());

export function a11yProps(index: string, sortorder: string) {
  return {
    id: index,
    sortorder,
    "aria-controls": `simple-tabpanel-${index}-${sortorder}`,
  };
}
