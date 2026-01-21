import { Collapse, MenuItem, Tooltip, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { AxiosResponse } from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FacilitiesTable from "./FacilitiesTable";
import { useManageFacility } from "./FacilityListContext/useManageFacility";
import { base64ToExcel } from "Pages/DynamicGrid/bulkExportActions";
import FacilityService from "Services/FacilityService/FacilityService";
import ColumnSetup from "Shared/ColumnSetup/ColumnSetup";
import PermissionComponent, {
  AnyPermission,
} from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import usePagination from "Shared/hooks/usePagination";
import CustomPagination from "Shared/JsxPagination";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { emptyObjectValues, upsertArray } from "Utils/Common/Requisition";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";

export const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface FileData {
  fileName: string;
  contents: string;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export function a11yProps(index: string, sortorder: string) {
  return {
    id: index,
    sortorder,
    "aria-controls": `simple-tabpanel-${index}-${sortorder}`,
  };
}

const ManageFacility = () => {
  const {
    data,
    value,
    total,
    status,
    setValue,
    loadTabs,
    setStatus,
    filterData,
    selectedBox,
    searchValue,
    tabIdToSend,
    loadGridData,
    setFilterData,
    setSearchValue,
    setSelectedBox,
    setTabIdToSend,
    initialPageLoadApiCalls,
  } = useManageFacility();

  const { t } = useLang();

  const menus = useSelector((state: any) => state.Reducer.Menus);

  function isDynamicFacility(modules: any, targetUrl: any) {
    return modules.some((module: any) =>
      module.claims?.some((claim: any) => claim.linkUrl === targetUrl)
    );
  }

  const [message, setMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openalert, setOpenAlert] = React.useState(false);
  const [initialRender, setInitialRender] = useState(false);
  const [showSetupModal, setShowModalSetup] = useState(false);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  const [triggerSearchData, setTriggerSearchData] = useState(false);

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const {
    curPage,
    showPage,
    nextPage,
    pageSize,
    setTotal,
    prevPage,
    totalPages,
    setCurPage,
    setPageSize,
    pageNumbers,
  } = usePagination();

  useEffect(() => {
    setTotal(total);
  }, [total]);

  useEffect(() => {
    filterData.pageNumber = curPage;

    if (isInitialRender2) {
      loadGridData(true);
    } else {
      setIsInitialRender2(true);
    }
  }, [pageSize, curPage, triggerSearchData]);

  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
  });

  const openDrop = Boolean(anchorEl.dropdown1) || Boolean(anchorEl.dropdown2);

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(newValue);
    const Id: any = event.currentTarget.id;
    const _tabId = +(event.target as any).id;

    const thenum: any = Id.match(/\d+/)[0];
    if (filterData?.tabId !== thenum) {
      const emptySearchObj = emptyObjectValues(searchValue);
      setSearchValue(emptySearchObj);
      setCurPage(1);

      filterData.tabId = parseInt(thenum);
      filterData.filters = [];
      filterData.pageNumber = 1;
    }

    setTabIdToSend(_tabId);
    setSelectedBox([]);
  };

  const downloadAll = () => {
    const obj = {
      tabId: filterData.tabId,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: [],
    };

    FacilityService.facilityExportToExcel_V2(obj).then((res: AxiosResponse) => {
      if (res?.data?.statusCode === 200) {
        toast.success(t(res?.data?.message));
        base64ToExcel(res.data.data.fileContents, "facilities");
      } else {
        toast.error(t(res?.data?.message));
      }
    });
  };

  const resetSearch = () => {
    const emptySearchObj = emptyObjectValues(searchValue);
    const emptyObj = {
      tabId: tabIdToSend,
      pageSize: 50,
      pageNumber: 1,
      sortColumn: "",
      sortDirection: "",
      filters: [],
    };

    setFilterData(emptyObj);
    setSearchValue(emptySearchObj);
    setSearchedTags([]);
    setSelectedBox([]);
    loadGridData(true, emptyObj);
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  useEffect(() => {
    const filteredObject: any = {};

    filterData.filters?.forEach((filterData: any) => {
      filteredObject[filterData.label] = filterData.filterValue;
    });

    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(filteredObject)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [filterData?.filters?.length]);

  const handleTagRemoval = (clickedTag: string) => {
    const resultedTab = filterData.filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });
    const resulted = filterData.filters.find((tab: any) => {
      return tab.label === clickedTag;
    });
    setFilterData((prev: any) => ({
      ...prev,
      filters: [...resultedTab],
    }));
    setSearchValue((prevValue: any) => ({
      ...prevValue,
      [resulted.columnKey]: "",
    }));
  };

  useEffect(() => {
    if (initialRender) {
      const hasTags = searchedTags.length > 0;
      if (!hasTags) {
        resetSearch();
      }
    } else {
      setInitialRender(true);
    }
  }, [searchedTags.length]);

  // api calls on initial page load
  useEffect(() => {
    initialPageLoadApiCalls();

    return () => {
      resetSearch();
    };
  }, []);

  useEffect(() => {
    if (tabIdToSend !== null) {
      loadGridData(true);
    }
  }, [tabIdToSend]);

  const downloadTemplate = async () => {
    try {
      const res = await FacilityService.DownloadTemplate();
      const fileContent = res.data;
      const downloadLink = document.createElement("a");
      downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileContent}`;
      downloadLink.download = "Manage Facility Template.xlsx";
      downloadLink.click();
    } catch (error) {
      console.error("Error downloading template:", error);
    }
  };

  const triggerFileInput = () => {
    const inputElement = document.getElementById("excel-file");
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleClickOpen = (status: string) => {
    if (selectedBox.length === 0) {
      toast.error(t(t("Please select atleast one record")));
    } else {
      setOpenAlert(true);
      setStatus(status);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const byteArray = new Uint8Array(arrayBuffer);
          const base64String = btoa(String.fromCharCode(...byteArray));

          const filedata: FileData = {
            fileName: file.name,
            contents: base64String,
          };

          const res = await FacilityService.BulkFacilityUpload(filedata);
          if (res?.data?.statusCode === 200) {
            toast.success(t(res.data.message));
          } else {
            setMessage(res.data.message);
            setErrorAlert(true);
          }
        } catch (error) {
          console.error(t("Error during file upload:"), error);
          toast.error(t("An error occurred while uploading the file."));
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error(t("An error occurred while processing the file."));
    } finally {
      event.target.value = "";
    }
  };

  const tabsInfo = data?.gridHeaders[value]?.tabHeaders;

  const handleInputChange = (e: any, tabsDetail: any) => {
    let value = e.target.value;
    const type = e.target.type;
    if (type === "date" && value) {
      value = moment(value, "YYYY-MM-DD").format("MM/DD/YYYY");
    }
    setSearchValue((preVal: any) => {
      return {
        ...preVal,
        [tabsDetail?.columnKey]: value,
      };
    });
    const filterObj = {
      columnName: tabsDetail.filterColumns,
      filterValue: value,
      columnType: tabsDetail.filterColumnsType,
      label: tabsDetail.columnLabel,
      columnKey: tabsDetail.columnKey,
    };
    filterData.filters = upsertArray(
      filterData.filters,
      filterObj,
      (element: any) => element.columnName === filterObj.columnName
    );

    const newFilters = filterData.filters.filter(
      (element: any) => element.filterValue !== ""
    );
    setFilterData({ ...filterData, filters: newFilters });
  };

  const downloadSelected = () => {
    const objToSend = {
      tabId: filterData.tabId,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: filterData.filters,
      selectedRow: selectedBox,
    };
    if (selectedBox.length > 0) {
      FacilityService.facilityExportToExcel_V2(objToSend).then(
        (res: AxiosResponse) => {
          if (res?.data?.statusCode === 200) {
            toast.success(t(res?.data?.message));
            base64ToExcel(res.data.data.fileContents, "facilities");
          } else {
            toast.error(t(res?.data?.message));
          }
        }
      );
    } else {
      toast.error(t(t("Select atleast one record")));
    }
  };

  const changeFacilityStatusInBulk = async (status: string) => {
    try {
      const obj = {
        facilityIds: selectedBox,
        status: status,
      };

      const res = await FacilityService.updateFacilityStatusInBulk(obj);
      if (res.status === 200) {
        toast.success(t(res?.data?.title));
        setSelectedBox([]);
        handleCloseAlert();
        loadGridData(false);
      }
    } catch (err) {
      console.error(t("Error updating facility status:"), err);
    }
  };

  return (
    <>
      <ColumnSetup
        show={showSetupModal}
        closeSetupModal={() => setShowModalSetup(false)}
        loadData={loadTabs}
        dynamicGridLoad={loadGridData}
        columnsToUse={data?.gridHeaders[value]?.tabHeaders}
        value={tabIdToSend}
      />
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-toolbar py-2 py-lg-3">
          <div className="app-container container-fluid d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <PermissionComponent
                moduleName="Facility"
                pageName="Manage Facility"
                permissionIdentifier="Download"
              >
                <Tooltip title={t("Download Template")} arrow placement="top">
                  <button
                    id="ManageFacilityDownload"
                    className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                    title={t("Download Template")}
                    onClick={downloadTemplate}
                  >
                    <i className="bi bi-download"></i>
                  </button>
                </Tooltip>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Facility"
                pageName="Manage Facility"
                permissionIdentifier="Upload"
              >
                <Tooltip title={t("Upload")} arrow placement="top">
                  <button
                    id="ManageFacilityUpload"
                    className="btn btn-icon btn-sm fw-bold btn-warning "
                    onClick={triggerFileInput}
                  >
                    <i className="bi bi-cloud-upload"></i>
                  </button>
                </Tooltip>
              </PermissionComponent>
              <input
                type="file"
                id="excel-file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <button
                id="ManageFacilitySearch"
                className={`btn btn-info btn-sm fw-bold search ${
                  openSearch ? "d-none" : "d-block"
                }`}
                onClick={() => setOpenSearch(!openSearch)}
                aria-controls="SearchCollapse"
                aria-expanded={openSearch}
              >
                <i className="fa fa-search"></i>
                <span>{t("Search")}</span>
              </button>
              <button
                id="ManageFacilityCancel"
                className={`btn btn-info btn-sm fw-bold ${
                  openSearch ? "btn-icon" : "collapse"
                }`}
                onClick={() => setOpenSearch(!openSearch)}
                aria-controls="SearchCollapse"
                aria-expanded={openSearch ? "true" : "false"}
              >
                <i className="fa fa-times p-0"></i>
              </button>
              {isDynamicFacility(menus, "/dynamic-facility") ||
              isDynamicFacility(menus, "/addfacility") ? (
                <PermissionComponent
                  moduleName="Facility"
                  pageName="Manage Facility"
                  permissionIdentifier="AddaFacility"
                >
                  <Link
                    id="ManageFacilityAddAFacility"
                    to={
                      isDynamicFacility(menus, "/dynamic-facility") &&
                      isDynamicFacility(menus, "/addfacility")
                        ? "/addfacility"
                        : isDynamicFacility(menus, "/dynamic-facility")
                          ? "/dynamic-facility"
                          : "/addfacility"
                    }
                    className="btn btn-sm fw-bold btn-primary"
                  >
                    <span>
                      <i style={{ fontSize: "15px" }} className="fa">
                        &#xf067;
                      </i>
                      <span>{t("Add a Facility")}</span>
                    </span>
                  </Link>
                </PermissionComponent>
              ) : null}
              <Tooltip title={t("Setup")} arrow placement="top">
                <button
                  id="ViewRequisitionButtonSetup"
                  className="btn btn-icon btn-sm fw-bold btn-setting btn-icon-light"
                  onClick={() => setShowModalSetup(true)}
                >
                  <i className="fa fa-gear"></i>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <Collapse in={openSearch}>
              <div className="card mb-5">
                <div className=" card-body py-4">
                  <div className="row">
                    {tabsInfo?.map((tabsDetail: any) => {
                      if (
                        tabsDetail?.isShowOnUi &&
                        tabsDetail?.isShow &&
                        tabsDetail?.filterColumnsType
                      ) {
                        const label = tabsDetail?.columnLabel?.toLowerCase();

                        const handleKeyPress = (
                          event: React.KeyboardEvent<HTMLInputElement>
                        ) => {
                          if (event.key === "Enter") {
                            setCurPage(1);
                            setTriggerSearchData((prev) => !prev);
                          }
                          if (label === "city" || label === "state") {
                            // Allow only alphabets, numbers, space, and backspace
                            if (
                              !/^[a-zA-Z0-9 ]$/.test(event.key) &&
                              event.key !== "Backspace" &&
                              event.key !== "Tab"
                            ) {
                              event.preventDefault();
                            }
                          } else if (label === "zip code") {
                            const isCtrlOrCmd = event.ctrlKey || event.metaKey;

                            // Allow shortcuts like Ctrl+V, Ctrl+C, Ctrl+A, etc.
                            if (isCtrlOrCmd) return;
                            // Allow only numbers
                            if (
                              !/^[0-9]$/.test(event.key) &&
                              event.key !== "Backspace" &&
                              event.key !== "Tab"
                            ) {
                              event.preventDefault();
                            }
                          }
                        };
                        return (
                          <div
                            className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                            key={tabsDetail?.columnKey}
                          >
                            <div className="fv-row mb-3">
                              <label htmlFor="" className="mb-2 fw-500">
                                {tabsDetail?.columnLabel}
                              </label>
                              <input
                                id="txtfacilityName"
                                type="text"
                                name={tabsDetail?.columnKey}
                                onChange={(e) =>
                                  handleInputChange(e, tabsDetail)
                                }
                                className="form-control bg-transparent"
                                placeholder={t(tabsDetail?.columnLabel)}
                                onKeyDown={handleKeyPress}
                                value={searchValue[tabsDetail?.columnKey]}
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <div className="d-flex justify-content-end gap-2 gap-lg-3">
                    <button
                      id="ManageFacilityExpandSearch"
                      type="button"
                      onClick={() => {
                        setCurPage(1);
                        setTriggerSearchData((prev) => !prev);
                      }}
                      className="btn btn-primary btn-sm btn-primary--icon"
                    >
                      <span>
                        <i className="fa fa-search"></i>
                        <span>{t("Search")}</span>
                      </span>
                    </button>
                    <button
                      id="ManageFacilityReset"
                      onClick={resetSearch}
                      className="btn btn-secondary btn-sm btn-secondary--icon"
                    >
                      <span>
                        <i className="fa fa-times"></i>
                        <span>{t("Reset")}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Collapse>
            <div className="mb-5">
              <Tabs
                value={value}
                onChange={handleChange}
                className="min-h-auto"
                TabIndicatorProps={{
                  style: { background: "transparent", cursor: "pointer" },
                }}
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
                {Array.isArray(data.gridHeaders) &&
                  data?.gridHeaders?.map((items: any) => (
                    <TabSelected
                      data-test-id={items?.tabName?.replace(/\s/g, "")}
                      key={items?.tabID}
                      label={t(items?.tabName)}
                      {...a11yProps(items?.tabID, items.sortOrder)}
                      className="fw-bold text-capitalize"
                    />
                  ))}
              </Tabs>
              <div className="card tab-content-card">
                <div className="mb-2 mt-2 px-3 px-md-8">
                  <div className="d-flex gap-2 flex-wrap">
                    {searchedTags.map((tag: string, index: number) =>
                      tag === "isArchived" ? null : (
                        <div
                          className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                          onClick={() => handleTagRemoval(tag)}
                          key={tag + index}
                        >
                          <span className="fw-bold">{tag}</span>
                          <i className="bi bi-x"></i>
                        </div>
                      )
                    )}
                  </div>
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
                    <div className="d-flex gap-2 responsive-flexed-actions">
                      <div className="d-flex align-items-center">
                        <span className="fw-400 mr-3">{t("Records")}</span>
                        <select
                          id="ViewRequisitionRecord"
                          className="form-select w-100px h-33px rounded"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_63b2e70320b73"
                          data-allow-clear="true"
                          onChange={async (e) => {
                            const value = parseInt(e.target.value);
                            filterData.pageSize = value;
                            setPageSize(value);
                            await loadGridData();
                          }}
                          value={filterData.pageSize}
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>

                      <div className="border-0 d-flex justify-content-sm-start">
                        <div className="d-flex gap-1 gap-lg-1">
                          {tabIdToSend === 5 ? null : (
                            <div>
                              <StyledDropButton
                                id="ManageFacilityBulkAction"
                                aria-controls={
                                  openDrop ? "demo-positioned-menu1" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={openDrop ? "true" : undefined}
                                onClick={(event) =>
                                  handleClick(event, "dropdown1")
                                }
                                className="btn btn-info btn-sm"
                              >
                                {t("Bulk Action")}
                                <span className="svg-icon svg-icon-5 m-0">
                                  <ArrowBottomIcon />
                                </span>
                              </StyledDropButton>
                              <StyledDropMenu
                                id="ManageFacilityExportRecords"
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
                                {tabIdToSend === 1 ? (
                                  <PermissionComponent
                                    moduleName="Facility"
                                    pageName="Manage Facility"
                                    permissionIdentifier="Suspend"
                                  >
                                    <MenuItem
                                      id="ManageFacility_Suspend"
                                      onClick={() => {
                                        handleClose("dropdown1");
                                        handleClickOpen("Suspend");
                                      }}
                                      className="w-125px"
                                    >
                                      <i className="fa fa-pause text-danger mr-2  w-20px"></i>
                                      {t("Suspend")}
                                    </MenuItem>
                                  </PermissionComponent>
                                ) : null}
                                {tabIdToSend === 1 ? (
                                  <PermissionComponent
                                    moduleName="Facility"
                                    pageName="Manage Facility"
                                    permissionIdentifier="Inactive"
                                  >
                                    <MenuItem
                                      id="ManageFacility_InActive"
                                      onClick={() => {
                                        handleClose("dropdown1");
                                        handleClickOpen("InActive");
                                      }}
                                      className="w-125px"
                                    >
                                      <i className="fa fa-ban text-danger mr-2  w-20px"></i>
                                      {t("Inactive")}
                                    </MenuItem>
                                  </PermissionComponent>
                                ) : null}
                                {tabIdToSend === 1 ? (
                                  <PermissionComponent
                                    moduleName="Facility"
                                    pageName="Manage Facility"
                                    permissionIdentifier="Archived"
                                  >
                                    <MenuItem
                                      id="ManageFacility_Archived"
                                      onClick={() => {
                                        handleClose("dropdown1");
                                        handleClickOpen("Archived");
                                      }}
                                      className="w-125px"
                                    >
                                      <i className="fa fa-archive mr-2 text-success"></i>
                                      {t("Archived")}
                                    </MenuItem>
                                  </PermissionComponent>
                                ) : null}
                                {tabIdToSend === 2 ||
                                tabIdToSend === 3 ||
                                tabIdToSend === 4 ? (
                                  <PermissionComponent
                                    moduleName="Facility"
                                    pageName="Manage Facility"
                                    permissionIdentifier="Active"
                                  >
                                    <MenuItem
                                      id="ManageFacility_Active"
                                      onClick={() => {
                                        handleClose("dropdown1");
                                        handleClickOpen("Active");
                                      }}
                                    >
                                      <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                                      {t("Active")}
                                    </MenuItem>
                                  </PermissionComponent>
                                ) : null}
                              </StyledDropMenu>
                            </div>
                          )}

                          <div>
                            <AnyPermission
                              moduleName="Facility"
                              pageName="Manage Facility"
                              permissionIdentifiers={[
                                "ExportAllRecords",
                                "ExportSelectedRecords",
                              ]}
                            >
                              <StyledDropButton
                                id="ManageFacilityExportRecordButton"
                                aria-controls={
                                  openDrop ? "demo-positioned-menu2" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={openDrop ? "true" : undefined}
                                onClick={(event) =>
                                  handleClick(event, "dropdown2")
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
                              <StyledDropMenu
                                aria-labelledby="demo-positioned-button2"
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
                                <PermissionComponent
                                  moduleName="Facility"
                                  pageName="Manage Facility"
                                  permissionIdentifier="ExportAllRecords"
                                >
                                  <MenuItem
                                    id="ManageFacility_ExportAllRecords"
                                    onClick={() => {
                                      handleClose("dropdown2");
                                      downloadAll();
                                    }}
                                    // className="w-175px"
                                  >
                                    <i className="fa text-excle w-20px">
                                      &#xf1c3;
                                    </i>
                                    {t("Export All Records")}
                                  </MenuItem>
                                </PermissionComponent>
                                <PermissionComponent
                                  moduleName="Facility"
                                  pageName="Manage Facility"
                                  permissionIdentifier="ExportSelectedRecords"
                                >
                                  <MenuItem
                                    id="ManageFacility_ExportSelectedRecords"
                                    onClick={() => {
                                      handleClose("dropdown2");
                                      downloadSelected();
                                    }}
                                    // className="w-200px"
                                  >
                                    <i className="fa text-success mr-2 w-20px">
                                      &#xf15b;
                                    </i>
                                    {t("Export Selected Records")}
                                  </MenuItem>
                                </PermissionComponent>
                              </StyledDropMenu>
                            </AnyPermission>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <TabPanel value={value} index={value}>
                    <FacilitiesTable
                      tabsInfo={tabsInfo}
                      rowInfo={data?.gridData}
                    />
                  </TabPanel>
                  {!data?.gridHeaders[0]?.tabHeaders ? null : (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BootstrapModal
        show={errorAlert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
        className="modal-lg"
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Upload Error List")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <PrintStringByColonNewline inputString={message} />
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-danger py-2"
            onClick={() => setErrorAlert(false)}
          >
            {t("Close")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
      <BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Status")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to change status ?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("No")}
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => changeFacilityStatusInBulk(status)}
          >
            <span>{t("Yes")}</span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};

export default ManageFacility;

function PrintStringByColonNewline({ inputString }: any) {
  if (!inputString) return null;
  const splitStrings = inputString.split("\n");

  const sections = splitStrings.map((section: any, index: any) => {
    if (index === 0) {
      return (
        <React.Fragment key={index}>
          <span style={{ fontWeight: "bold" }}>{section}</span>
          <br /> <br />
        </React.Fragment>
      );
    } else if (index !== splitStrings.length - 1) {
      return (
        <div
          key={index}
          style={{
            border: "2px solid #FF0000",
            padding: "5px",
            marginBottom: "10px",
          }}
        >
          <ul>
            <li>{section}</li>
          </ul>
        </div>
      );
    } else {
      return null;
    }
  });

  return <div>{sections}</div>;
}
