import { Collapse, MenuItem, Paper, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import PatientSearchInput from "Pages/Patient/PatientDemographic/PatientSearchInput";
import PatientServices from "Services/PatientServices/PatientServices";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import ColumnSetup from "Shared/ColumnSetup/ColumnSetup";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import { ArrowDown, ArrowUp, CrossIcon, DoneIcon } from "Shared/Icons";
import CustomPagination from "Shared/JsxPagination";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import useLang from "Shared/hooks/useLanguage";
import usePagination from "Shared/hooks/usePagination";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import Row from "./Row";

export interface TabConfiguration {
  tabName: string;
  tabID: number;
}

const WorkLog = () => {
  const { t } = useLang();
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

  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [bulkIds, setBulkIds] = useState([]);
  const [value, setValue] = useState<number>(0);
  const [tabIdToSend, setTabIdToSend] = useState(1);
  const [spareTabId, setSpareTabId] = useState(1);
  const [apiData, setApiData] = useState<any>({});
  const [inputFields, setInputFields] = useState([]);
  const [tabData, setTabData] = useState<any>(initialTableData);
  const [tabPanels, setTabPanels] = useState<TabConfiguration[] | []>([]);

  const isFirstLoad = useRef(true);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const ModalhandleClose1 = () => setShow1(false);
  const [show1, setShow1] = useState(false);
  const [showSetupModal, showModalSetup] = useState(false);

  const searchRef = useRef<any>(null);

  const initalSortingObj = {
    clickedIconData: "",
    sortingOrder: "",
  };

  const [sort, setSorting] = useState(initalSortingObj);
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
  const [rows, setRows] = useState<any>([]);
  const [expandableColumnsHeader, setExpandableColumnsHeader] = useState<any>(
    []
  );

  let columnsHeader = tabData?.gridHeaders?.[value]?.tabHeaders;

  const initialSearchQueryPhelobotomyAssignment = {
    id: 0,
    facilityId: 0,
    primaryPhlebotomistId: "",
  };

  const initialSearchQueryRejectReason = {
    id: 0,
    rejectType: "",
    rejectReason: "",
  };

  const [searchQuery, setSearchQuery] = useState<any>({});

  useEffect(() => {
    // Check the value and set searchQuery accordingly
    setSearchQuery(
      value === 2
        ? initialSearchQueryPhelobotomyAssignment
        : initialSearchQueryRejectReason
    );
    setIsAddButtonDisabled(false);
    setRows(() => [
      { rowStatus: false, ...searchQuery }
    ]);
  }, [value]);

  console.log(searchQuery, "searchQuery");
  

  const DeletebyId = async (item: any) => {
    try {
      const response = await PatientServices?.deletebyid(item);
      toast.success(response.data.message);
      loadData(true);
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async (reset: boolean) => {
    if (tabIdToSend !== spareTabId) return;
    setLoading(true);
    RequisitionType.workLogGetAll(
      !reset
        ? {
            ...searchValue,
            tabId: tabIdToSend,
            sortColumn: sort.clickedIconData,
            sortDirection: sort.sortingOrder,
            pageNumber: curPage,
            pageSize: pageSize,
          }
        : {
            ...initialQueryObj,
            tabId: tabIdToSend,
            sortColumn: initalSortingObj.clickedIconData,
            sortDirection: initalSortingObj.sortingOrder,
            pageNumber: curPage,
            pageSize,
          }
    )
      .then((res: AxiosResponse) => {
        console.log(res, "resresres");

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

  const delayedCall = async () => {
    await loadData(false);
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
  const loadTabsForDynamicGrid = async () => {
    try {
      const response = await RequisitionType.viewRequisitionTabs();
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

      setInputFields(inputFields);
      setTabPanels(filteredTabData);
      if (isFirstLoad.current) {
        setValue(filteredTabData[0]?.sortOrder - 1);
        isFirstLoad.current = false;
      }

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

  const [anchorEl, setAnchorEl] = useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });

  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4);

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  // const handleClose1 = (dropdownName: string) => {
  //   setAnchorEl({ ...anchorEl, [dropdownName]: null });
  // };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleClickOpen = (ids: any) => {
    // if (selectedBox.requisitionId.length === 0) {
    //   toast.error("Please select atleast one record");
    // } else {
    //   setShow1(true);
    //   handleClose1("dropdown1");
    // }
  };

  const downloadSelected = () => {
    // if (selectedBox.requisitionId.length > 0) {
    //   const obj = {
    //     tabId: filterData.tabId,
    //     pageNumber: filterData.pageNumber,
    //     pageSize: filterData.pageSize,
    //     sortColumn: filterData.sortColumn,
    //     sortDirection: filterData.sortDirection,
    //     filters: filterData.filters,
    //     selectedRow: selectedBox.requisitionId.map(
    //       (item: any) => item.RequisitionId
    //     ),
    //   };
    //   RequisitionType.ToxresultDataExportToExcelV2(obj).then(
    //     (res: AxiosResponse) => {
    //       if (res?.data?.statusCode === 200) {
    //         toast.success(res?.data?.message);
    //         base64ToExcel(res.data.data.fileContents, "Result Data");
    //         setSelectedBox((prevState: any) => {
    //           return {
    //             ...prevState,
    //             requisitionId: [],
    //           };
    //         });
    //         setCheckedAll(false);
    //       } else {
    //         toast.error(res?.data?.message);
    //       }
    //     }
    //   );
    // } else {
    //   toast.error("Please Select Minimum 1 Record");
    // }
  };

  const fetchDataSequentially = async (reset: boolean = true) => {
    try {
      await loadTabsForDynamicGrid();
      await loadData(reset);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataSequentially();
  }, []);

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
  const handleTabChange = async (
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
  }, [sort, curPage, pageSize, triggerSearchData, value]);

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

  /**
   * The `handleSelectAll` function allows you to select all rows for bulk actions.
   *
   * description:
   * This function collects the IDs of all rows and updates the `bulkIds` state variable
   */
  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      setBulkIds([]);
    } else {
      setBulkIds(rows.map((row: any) => row.Id));
    }
  };

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

    let updatedRows = rows
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
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <ColumnSetup
        value={tabIdToSend}
        show={showSetupModal}
        columnsToUse={columnsHeader}
        closeSetupModal={closeSetupModal}
        loadData={fetchDataSequentially}
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
                      <div className="d-flex gap-lg-3 gap-2 justify-content-center">
                        <div>
                          {value === 0 || value === 1 ? (
                            <StyledDropButton
                              id="demo-positioned-button2"
                              aria-controls={
                                openDrop ? "demo-positioned-menu2" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? "true" : undefined}
                              onClick={(event) =>
                                handleClick(event, "dropdown1")
                              }
                              className="btn btn-excle btn-sm"
                            >
                              <i
                                style={{
                                  color: "white",
                                  fontSize: "20px",
                                  paddingLeft: "2px",
                                }}
                                className="fa"
                              >
                                &#xf1c3;
                              </i>
                              <span className="svg-icon svg-icon-5 m-0">
                                <ArrowBottomIcon />
                              </span>
                            </StyledDropButton>
                          ) : null}

                          <StyledDropMenu
                            id="demo-positioned-menu1"
                            aria-labelledby="demo-positioned-button1"
                            anchorEl={anchorEl.dropdown1}
                            open={Boolean(anchorEl.dropdown1)}
                            onClose={() => handleClose("dropdown1")}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <MenuItem
                              className="w-auto"
                              onClick={handleClickOpen}
                            >
                              {t("Export All Records")}
                            </MenuItem>
                            <MenuItem
                              className="w-auto"
                              onClick={() => {
                                handleClose("dropdown1");
                                downloadSelected();
                              }}
                            >
                              {t("Export Selected Records")}
                            </MenuItem>
                          </StyledDropMenu>
                        </div>
                        <div>
                          {value === 0 ? (
                            <StyledDropButton
                              id="demo-positioned-button1"
                              aria-controls={
                                openDrop ? "demo-positioned-menu1" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? "true" : undefined}
                              onClick={(event) =>
                                handleClick(event, "dropdown2")
                              }
                              className="btn btn-info btn-sm"
                            >
                              {t("Bulk Action")}
                              <span className="svg-icon svg-icon-5 m-0">
                                <ArrowBottomIcon />
                              </span>
                            </StyledDropButton>
                          ) : null}
                          <StyledDropMenu
                            id="demo-positioned-menu1"
                            aria-labelledby="demo-positioned-button1"
                            anchorEl={anchorEl.dropdown2}
                            open={Boolean(anchorEl.dropdown2)}
                            onClose={() => handleClose("dropdown2")}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                handleClose("dropdown2");
                                handleClickOpen("Suspend");
                              }}
                              className="w-150px"
                            >
                              {t("Complete Collection")}
                            </MenuItem>
                          </StyledDropMenu>
                        </div>
                        {value === 2 ? (
                          <div>
                            <button
                              disabled={isAddButtonDisabled}
                              onClick={() => {
                                if (!isAddButtonDisabled) {
                                  setRows((prevRows: any) => [
                                    { rowStatus: true, ...searchQuery },
                                    ...prevRows,
                                  ]);
                                  setIsAddButtonDisabled(true);
                                }
                              }}
                              className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
                            >
                              {t("Add New Phlebotomy Assignment")}
                            </button>
                          </div>
                        ) : null}
                        {value === 4 ? (
                          <div>
                            <button
                              disabled={isAddButtonDisabled}
                              onClick={() => {
                                if (!isAddButtonDisabled) {
                                  setRows((prevRows: any) => [
                                    { rowStatus: true, ...searchQuery },
                                    ...prevRows,
                                  ]);
                                  setIsAddButtonDisabled(true);
                                }
                              }}
                              className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
                            >
                              {t("Add New Rejection Reasons")}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <button
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
                          {!columnsHeader?.length ? null : tabsLoading &&
                            !columnsHeader?.length ? null : (
                            <TableHead className="h-40px">
                              <TableRow>
                                {value === 0 || value === 1 ? (
                                  <TableCell></TableCell>
                                ) : null}
                                {value === 0 || value === 1 ? (
                                  <TableCell></TableCell>
                                ) : null}
                                {value === 0 ||
                                value === 1 ||
                                value === 2 ||
                                value === 4 ? (
                                  <TableCell></TableCell>
                                ) : null}
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
                                {value === 0 || value === 1 ? (
                                  <TableCell></TableCell>
                                ) : null}
                                {value === 0 || value === 1 ? (
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
                                {value === 0 ||
                                value === 1 ||
                                value === 2 ||
                                value === 4 ? (
                                  <TableCell>{t("Actions")}</TableCell>
                                ) : null}
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
                                  rows={rows}
                                  item={item}
                                  searchQuery={searchQuery}
                                  tabId={value}
                                  setRows={setRows}
                                  bulkIds={bulkIds}
                                  apiData={apiData}
                                  loadData={loadData}
                                  setApiData={setApiData}
                                  setBulkIds={setBulkIds}
                                  tabIdToSend={tabIdToSend}
                                  columnsHeader={columnsHeader}
                                  inputFields={inputFields}
                                  delayedCall={delayedCall}
                                  setInputFields={setInputFields}
                                  expandableColumnsHeader={
                                    expandableColumnsHeader
                                  }
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

export default WorkLog;

export const TabSelected = styled(Tab)(AutocompleteStyle());

export function a11yProps(index: string, sortorder: string) {
  return {
    id: index,
    sortorder,
    "aria-controls": `simple-tabpanel-${index}-${sortorder}`,
  };
}
