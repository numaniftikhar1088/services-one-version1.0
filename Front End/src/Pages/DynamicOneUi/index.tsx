import { Collapse, Paper, styled, Tooltip } from "@mui/material";
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
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FcInfo } from "react-icons/fc";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import MiscellaneousService from "../../Services/MiscellaneousManagement/MiscellaneousService";
import PatientServices from "../../Services/PatientServices/PatientServices";
import ColumnSetup from "../../Shared/ColumnSetup/ColumnSetup";
import { Loader } from "../../Shared/Common/Loader";
import NoRecord from "../../Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "../../Shared/Icons";
import CustomPagination from "../../Shared/JsxPagination";
import usePagination from "../../Shared/hooks/usePagination";
import { styles } from "../../Utils/Common";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "../../Utils/MuiStyles/AutocompleteStyles";
import PatientSearchInput from "../Patient/PatientDemographic/PatientSearchInput";
import useLang from "./../../Shared/hooks/useLanguage";
import Row from "./Row";
import BulkActions from "./bulkActions";
import BulkExportActions from "./bulkExportActions";
import TopButtonActions from "./topActions";

export interface TabConfiguration {
  tabName: string;
  tabID: number;
}

const DynamicOneUi = () => {
  const { t } = useLang();
  const { pageId } = useParams();

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

  const initialTableData = {
    gridHeaders: [],
    gridColumns: [],
    gridData: [],
    facilityLookup: [],
  };

  const [openCollapse, setOpenCollapse] = useState(false);
  const [bulkIds, setBulkIds] = useState([]);
  const [value, setValue] = useState<number>(0);
  const [tabIdToSend, setTabIdToSend] = useState(1);
  const [spareTabId, setSpareTabId] = useState(1);
  const [apiData, setApiData] = useState<any>({});
  const [inputFields, setInputFields] = useState([]);
  const [bulkActions, setBulkActions] = useState([]);
  const [columnActions, setColumnsActions] = useState([]);
  const [topButtonActions, setTopButtonActions] = useState([]);
  const [bulkExportActions, setBulkExportActions] = useState([]);
  const [tabData, setTabData] = useState<any>(initialTableData);
  const [tableId, setTableId] = useState<number>(0);
  const [tabPanels, setTabPanels] = useState<TabConfiguration[] | []>([]);
  const [columnDataActions, setColumnDataActions] = useState([]);

  const ModalhandleClose1 = () => setShow1(false);
  const [show1, setShow1] = useState(false);
  const [showSetupModal, showModalSetup] = useState(false);

  const searchRef = useRef<any>(null);

  const initalSortingObj = {
    clickedIconData: "",
    sortingOrder: "",
  };

  const [sort, setSorting] = useState(initalSortingObj);
  const [loading, setLoading] = useState(false);
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
  const [rows, setRows] = useState<any>([]);
  const [expandableColumnsHeader, setExpandableColumnsHeader] = useState<any>(
    []
  );

  let columnsHeader = tabData?.gridHeaders?.[value]?.tabHeaders;
  const isExpandable = () =>
    columnsHeader?.some((column: any) => column.isExpandData);

  const DeletebyId = async (item: any) => {
    try {
      const response = await PatientServices?.deletebyid(item);
      toast.success(response.data.message);
      loadData(true);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async (reset: boolean, tbId?: number) => {
    if (tabIdToSend !== spareTabId) return;
    setLoading(true);
    MiscellaneousService.getSingleUiDynamicGrid(
      !reset
        ? {
            ...searchValue,
            tableId: tbId || tableId,
            tabId: tabIdToSend,
            sortColumn: sort.clickedIconData,
            sortDirection: sort.sortingOrder,
            pageNumber: curPage,
            pageSize: pageSize,
          }
        : {
            ...initialQueryObj,
            tableId: tbId || tableId,
            tabId: tabIdToSend,
            sortColumn: initalSortingObj.clickedIconData,
            sortDirection: initalSortingObj.sortingOrder,
            pageNumber: curPage,
            pageSize,
          }
    )
      .then((res: AxiosResponse) => {
        setRows(res.data.data);
        setTotal(res?.data?.total);
      })
      .catch((err: AxiosError) => console.trace(err))
      .finally(() => setLoading(false));
  };

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

  const delayedCall = async (tableId: number) => {
    await loadData(false, tableId);
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

  const [tablesDropdown, setTablesDropDown] = useState([]);

  const getTablesSingleGrid = async () => {
    const response = await MiscellaneousService.getTablesSingleGrid();
    setTablesDropDown(response.data.data);
  };

  useEffect(() => {
    if (pageId) {
      setOpenCollapse(false);
      setBulkIds([]);
      setValue(0);
      setTabIdToSend(1);
      setSpareTabId(1);
      setApiData({});
      setInputFields([]);
      setBulkActions([]);
      setColumnsActions([]);
      setTopButtonActions([]);
      setBulkExportActions([]);
      setTabData(initialTableData);
      setTableId(0);
      setTabPanels([]);
      setColumnDataActions([]);
      setRows([]);
    }

    getTablesSingleGrid();
  }, [pageId]);

  const loadTabsForDynamicGrid = async (e: any, _tableId?: number) => {
    const tableId = e?.value ?? _tableId;

    try {
      const response = await MiscellaneousService.singleGridTabsConfiguration(
        tableId
      );
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
      let filteredTabData = response?.data?.data?.map((tab: any) => ({
        tabName: tab.tabName,
        tabID: tab.tabID,
        sortOrder: tab.sortOrder,
      }));

      setColumnsActions(response?.data?.data[0]?.tabActions);
      setBulkActions(response?.data?.data[0]?.bulkActions);
      setBulkExportActions(response?.data?.data[0]?.bulkExportActions);
      setTopButtonActions(response?.data?.data[0]?.topButtonAction);
      setColumnDataActions(response?.data?.data[0]?.columnAction);

      setInputFields(inputFields);
      setTabPanels(filteredTabData);
      setValue(filteredTabData[0]?.sortOrder - 1);
      setTabIdToSend(filteredTabData[0]?.tabID);
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
      await loadTabsForDynamicGrid(null, tableId);
      await loadData(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setCurPage(1);

    let Id: any = event.currentTarget.id;
    let thenum: any = Id.match(/\d+/)[0];
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
    setSpareTabId(_tabId);
    setBulkActions(_tabData?.bulkActions);
    setColumnsActions(_tabData?.tabActions);
    setColumnDataActions(_tabData?.columnAction);
    setTopButtonActions(_tabData?.topButtonAction);
    setBulkExportActions(_tabData?.bulkExportActions);
  };

  useEffect(() => {
    setTabIdToSend(spareTabId);
  }, [tabIdToSend]);

  const [isInitialRender, setIsInitialRender] = useState(false);

  useEffect(() => {
    if (isInitialRender) {
      loadData(false);
    } else {
      setIsInitialRender(true);
    }
  }, [sort, curPage, pageSize, value]);

  let _tablesDropdown = tablesDropdown.map((table: any, index: any) => ({
    value: table.TableId,
    label: table.TableName,
  }));

  const handleTableChange = async (e: any) => {
    setTableId(e.value);
    await loadTabsForDynamicGrid(e);
    loadData(true, e.value);
  };

  useEffect(() => {
    setSearchedTags([]);
  }, [tableId]);

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
    const hasTags = searchedTags.length > 0;
    setOpenCollapse(hasTags);

    if (!hasTags) {
      resetSearch();
    }
  }, [searchedTags.length]);

  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      setBulkIds([]);
    } else {
      setBulkIds(rows.map((row: any) => row.Id));
    }
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <ColumnSetup
        value={tabIdToSend}
        show={showSetupModal}
        columnsToUse={columnsHeader}
        closeSetupModal={closeSetupModal}
        loadData={fetchDataSequentially}
        isSingeUi={true}
        tableId={tableId}
      />
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex gap-4 justify-content-center justify-content-sm-between align-items-center">
          <div className="w-100">
            <BreadCrumbs />
          </div>
          <div className="d-flex justify-content-end align-items-center w-100 gap-4">
            <Select
              menuPortalTarget={document.body}
              theme={(theme) => styles(theme)}
              options={_tablesDropdown}
              value={
                _tablesDropdown.find((table: any) => table.value === tableId) ||
                null
              }
              onChange={handleTableChange}
              styles={{
                container: () => ({
                  width: 230,
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                  width: 230,
                }),
              }}
            />
            {tableId ? (
              <div className="d-flex align-items-center justify-content-end gap-2 gap-lg-3">
                <button
                  className="btn btn-icon btn-sm fw-bold btn-setting btn-icon-light"
                  onClick={() => showModalSetup(true)}
                >
                  <i className="fa fa-gear"></i>
                </button>
              </div>
            ) : null}
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
              TabIndicatorProps={{
                style: { background: "transparent", cursor: "pointer" },
              }}
              sx={{ p: 0 }}
              className="min-h-auto"
            >
              {Array.isArray(tabPanels) &&
                tabPanels?.map((items: any) => (
                  <TabSelected
                    key={items.tabID}
                    label={items.tabName}
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
                        >
                          <span className="fw-bold">{tag}</span>
                          <i className="bi bi-x"></i>
                        </div>
                      ))}
                    </div>
                  </Collapse>
                  <div className="d-flex align-items-center mb-2 justify-content-center justify-content-sm-between">
                    <div className="d-flex align-items-center">
                      <span className="fw-400 mr-3">{t("Records")}</span>
                      <select
                        className="form-select w-125px h-33px rounded mr-3"
                        data-kt-select2="true"
                        data-placeholder="Select option"
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
                          <BulkActions
                            bulkIds={bulkIds}
                            setBulkIds={setBulkIds}
                            loadData={loadData}
                            bulkActions={bulkActions}
                          />
                        )}
                        {bulkExportActions?.length > 0 && (
                          <BulkExportActions
                            bulkIds={bulkIds}
                            setBulkIds={setBulkIds}
                            tabId={tabIdToSend}
                            tableId={tableId}
                            loadData={loadData}
                            bulkActions={bulkExportActions}
                            filters={filters}
                          />
                        )}
                        {topButtonActions?.length > 0 && (
                          <TopButtonActions
                            rows={rows}
                            tableId={tableId}
                            tabID={tabIdToSend}
                            setRows={setRows}
                            loadData={loadData}
                            setApiData={setApiData}
                            inputFields={inputFields}
                            buttons={topButtonActions}
                          />
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <button
                        onClick={() => loadData(false)}
                        className="btn btn-info btn-sm fw-500"
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
                          <>
                            {!columnsHeader?.length ? null : tabsLoading &&
                              !columnsHeader?.length ? null : (
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
                                  {bulkActions?.length ? (
                                    <TableCell>
                                      <label className="form-check form-check-sm form-check-solid">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={
                                            bulkIds.length === rows.length
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
                                            <div className="d-flex gap-2">
                                              <span
                                                style={{ minWidth: "100px" }}
                                              >
                                                {column.columnLabel}
                                              </span>
                                              {column.infoDescription ? (
                                                <Tooltip
                                                  title={
                                                    <span
                                                      style={{
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      {column.infoDescription}
                                                    </span>
                                                  }
                                                >
                                                  <span
                                                    style={{ cursor: "help" }}
                                                  >
                                                    <FcInfo />
                                                  </span>
                                                </Tooltip>
                                              ) : null}
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                              <ArrowUp
                                                CustomeClass={`${
                                                  sort.sortingOrder ===
                                                    "desc" &&
                                                  sort.clickedIconData ===
                                                    column.columnKey
                                                    ? "text-danger fs-6"
                                                    : "text-gray-700 fs-7"
                                                }  p-0 m-0 "`}
                                              />
                                              <ArrowDown
                                                CustomeClass={`${
                                                  sort.sortingOrder === "asc" &&
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
                              ) : !rows.length ? (
                                <NoRecord />
                              ) : (
                                rows?.map((item: any) => (
                                  <Row
                                    rows={rows}
                                    item={item}
                                    setRows={setRows}
                                    bulkIds={bulkIds}
                                    apiData={apiData}
                                    loadData={loadData}
                                    setApiData={setApiData}
                                    setBulkIds={setBulkIds}
                                    columnsHeader={columnsHeader}
                                    columnActions={columnActions}
                                    inputFields={inputFields}
                                    delayedCall={delayedCall}
                                    tableId={tableId}
                                    setInputFields={setInputFields}
                                    tabIdToSend={tabIdToSend}
                                    expandableColumnsHeader={
                                      expandableColumnsHeader
                                    }
                                    bulkActionLength={bulkActions?.length}
                                    columnDataActions={columnDataActions}
                                    setColumnDataActions={setColumnDataActions}
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

export default DynamicOneUi;

export const TabSelected = styled(Tab)(AutocompleteStyle());

export function a11yProps(index: string, sortorder: string) {
  return {
    id: index,
    sortorder,
    "aria-controls": `simple-tabpanel-${index}-${sortorder}`,
  };
}
