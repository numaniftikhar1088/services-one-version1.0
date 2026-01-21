import { MenuItem, Tooltip, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { Option } from "@wcj/generate-password";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import ReqDataGrid from "./ReqDataGrid";
import { useWorkLogDataContext } from "./WorkLogContext/useWorkLogContext";
import { base64ToExcel } from "Pages/DynamicGrid/bulkExportActions";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import ColumnSetup from "Shared/ColumnSetup/ColumnSetup";
import PermissionComponent, { AnyPermission } from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import usePagination from "Shared/hooks/usePagination";
import { ExportAllRecords, ExportIcon, SelectedRecords } from "Shared/Icons";
import CustomPagination from "Shared/JsxPagination";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { reactSelectSMStyle2, styles } from "Utils/Common";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import useIsMobile from "Shared/hooks/useIsMobile";

const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

const WorkLogV2 = () => {
  const { state } = useLocation();
  const isMobile = useIsMobile();

  const {
    data,
    setData,
    filterData,
    selectedBox,
    setSelectedBox,
    loadGridData,
    setFilterData,
    initialPageLoadApiCalls,
    value,
    setValue,
    tabIdToSend,
    setTabIdToSend,
    loadTabs,
    total,
    setInputFields,
    inputFields,
  } = useWorkLogDataContext();

  const { t } = useLang();

  const [filters, setFilters] = useState<any>([]);
  const [showSetupModal, setShowModalSetup] = useState(false);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  const [phlebotomistsValue, setPhlebotomistsValue] = useState<any>(0);
  const [phlebotomistsLookup, setPhlebotomistsLookup] = useState<Option[]>([]);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const {
    curPage,
    nextPage,
    pageNumbers,
    pageSize,
    prevPage,
    setCurPage,
    setPageSize,
    setTotal,
    showPage,
    totalPages,
  } = usePagination();

  useEffect(() => {
    setTotal(total);
  }, [total]);

  useEffect(() => {
    filterData.pageNumber = curPage;
    filterData.pageSize = pageSize;
    if (isInitialRender2) {
      loadGridData(true);
    } else {
      setIsInitialRender2(true);
    }
  }, [pageSize, curPage, triggerSearchData]);

  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  useEffect(() => {
    setSelectedBox({ requisitionOrderId: [] });
    setFilterData((prev: any) => ({
      ...prev,
      pageSize: 50,
      sortColumn: "", // Reset sort column
      sortDirection: "", // Reset sort direction
    }));
  }, [value]);

  const [anchorEl, setAnchorEl] = React.useState({
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

  const handleCloseDropDown = (dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleClose = () => {
    setShowModalSetup(false);
  };
  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
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
      _tabData = data?.gridHeaders?.[sortOrder];
    } else {
      _tabData = data?.gridHeaders?.[sortOrder - 1];
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
    setFilters([]);
    setCurPage(1);
    setValue(newValue);
    const Id: any = event.currentTarget.id;
    const thenum: any = Id.match(/\d+/)[0];
    if (filterData?.tabId !== thenum) {
      // let emptySearchObj = emptyObjectValues(searchValue);
      // setSearchValue(emptySearchObj);

      filterData.tabId = parseInt(thenum);
      filterData.filters = [];
      filterData.pageNumber = 1;
      filterData.sortColumn = ""; // Reset sort column
      filterData.sortDirection = ""; // Reset sort direction
    }

    setTabIdToSend(_tabId);
  };

  // api calls on initial page load
  useEffect(() => {
    if (state?.callFrom !== "dashboard") {
      initialPageLoadApiCalls();
    }
  }, []);

  useEffect(() => {
    if (tabIdToSend !== null && state?.callFrom !== "dashboard") {
      loadGridData(true);
    }
  }, [tabIdToSend]);

  const downloadAll = () => {
    const obj = {
      tabId: filterData.tabId,
      pageNumber: filterData.pageNumber,
      pageSize: total,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: filterData.filters,
    };

    RequisitionType.workLogExportToExcel(obj).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(t(res?.data?.message));
        base64ToExcel(res.data.data.fileContents, "Work Log");
      } else {
        toast.error(t(res?.data?.message));
      }
    });
  };

  const downloadSelected = () => {
    if (selectedBox.requisitionOrderId.length > 0) {
      const obj = {
        tabId: filterData.tabId,
        pageNumber: filterData.pageNumber,
        pageSize: filterData.pageSize,
        sortColumn: filterData.sortColumn,
        sortDirection: filterData.sortDirection,
        filters: filterData.filters,
        selectedRow: selectedBox.requisitionOrderId,
      };
      RequisitionType.workLogExportToExcel(obj).then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          base64ToExcel(res.data.data.fileContents, "Work Log");
        } else {
          toast.error(t(res?.data?.message));
        }
      });
    } else {
      toast.error(t("Please Select Minimum 1 Record"));
    }
  };

  const completeCollection = () => {
    if (selectedBox.requisitionOrderId.length > 0) {
      const obj = {
        requisitionOrderIds: selectedBox.requisitionOrderId,
      };
      RequisitionType.workLogCompleteCollection(obj).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            loadGridData();
            toast.success(t(res?.data?.message));
          } else {
            toast.error(t(res?.data?.message));
          }
        }
      );
    } else {
      toast.error(t("Please Select Minimum 1 Record"));
    }
  };

  const resetSearch = () => {
    // let emptySearchObj = emptyObjectValues(searchValue);
    setFilterData({
      tabId: 1,
      pageSize: 50,
      pageNumber: 1,
      sortColumn: "",
      sortDirection: "",
      filters: [],
    });
    setFilters([]);
    // setSearchValue(emptySearchObj);
    setSearchedTags([]);
    loadGridData(true, true);
  };

  const handleChangePhlebotomist = (value: string) => {
    setPhlebotomistsValue(value);
  };

  const assignPhlebotomist = async () => {
    if (!phlebotomistsValue) {
      toast.error(t("Please select a Phlebotomist"));
      return;
    }
    try {
      if (phlebotomistsValue) {
        const obj = {
          phlebotomistId: phlebotomistsValue,
          requisitionOrderIds: selectedBox.requisitionOrderId,
        };
        const response = await RequisitionType.saveAssignPhlebotomist(obj);
        if (response?.data?.httpStatusCode === 200) {
          toast.success(t(response.data?.message));
          setPhlebotomistsValue(0);
          loadGridData(true, false);
          setSelectedBox({ requisitionOrderId: [] });
        } else {
          toast.error(t(response.data?.message));
        }
      } else {
        toast.error(t(`Please select Phlebotomist.`));
      }
    } catch (error) {
      console.error(t("Error saving Re-Draw:"), error);
    }
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  // Handling searchedTags
  const handleTagRemoval = (clickedTag: string) => {
    const workLogTab = filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });

    const workLogTabs = filterData.filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });

    setFilters(() => [...workLogTab]);
    setFilterData((prevValue: any) => ({
      ...prevValue,
      filters: workLogTabs,
    }));
  };

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

  const [initialRender, setInitialRender] = useState(false);
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

  useEffect(() => {
    return () => {
      setData((prev: any) => ({
        ...prev,
        gridHeaders: [],
        gridColumns: [],
        gridData: [],
      }));
    };
  }, []);

  const getPhlebotomistsLookup = async () => {
    const response = await RequisitionType.getPhlebotomistsLookup();
    setPhlebotomistsLookup(response?.data);
  };

  useEffect(() => {
    getPhlebotomistsLookup();
  }, []);

  return (
    <>
      <ColumnSetup
        show={showSetupModal}
        closeSetupModal={handleClose}
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
              {/* <PermissionComponent
                moduleName="Requisition"
                pageName="View Requisition"
                permissionIdentifier="Setup"
              > */}
              <Tooltip title="Setup" arrow placement="top">
                <button
                  className="btn btn-icon btn-sm fw-bold btn-setting btn-icon-light"
                  onClick={() => setShowModalSetup(true)}
                >
                  <i className="fa fa-gear"></i>
                </button>
              </Tooltip>
              {/* </PermissionComponent> */}
            </div>
          </div>
        </div>

        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
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
                      key={items?.tabID} // Add a unique key for each tab
                      label={t(items?.tabName)}
                      {...a11yProps(items?.tabID, items.sortOrder)}
                      className="fw-bold text-capitalize"
                    // disabled={loading.header}
                    />
                  ))}
              </Tabs>
              <div className="card tab-content-card">
                <div className="mb-2 mt-2 px-3 px-md-8">
                  <div className="d-flex gap-2 flex-wrap mb-2">
                    {searchedTags.map((tag) =>
                      tag === "isArchived" ? null : (
                        <div
                          className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                          onClick={() => handleTagRemoval(tag)}
                          key={tag + Math.random()}
                        >
                          <span className="fw-bold">{tag}</span>
                          <i className="bi bi-x"></i>
                        </div>
                      )
                    )}
                  </div>
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2">
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      {/* Export buttons section */}
                      {value === 0 || value === 1 ? (
                        isMobile && (
                            <div>
                            <AnyPermission
                              moduleName="Requisition"
                              pageName="View Requisition"
                              permissionIdentifiers={[
                                "ExportAllRecords",
                                "ExportSelectedRecords",
                              ]}
                            >
                              <StyledDropButton
                                id="demo-positioned-button2"
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
                                <ExportIcon />
                                <span className="svg-icon svg-icon-5 m-0">
                                  <ArrowBottomIcon />
                                </span>
                              </StyledDropButton>
                              <StyledDropMenu
                                id="demo-positioned-menu2"
                                aria-labelledby="demo-positioned-button2"
                                anchorEl={anchorEl.dropdown2}
                                open={Boolean(anchorEl.dropdown2)}
                                onClose={() => handleCloseDropDown("dropdown2")}
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
                                  moduleName="Requisition"
                                  pageName="View Requisition"
                                  permissionIdentifier="ExportAllRecords"
                                >
                                  <MenuItem
                                    onClick={() => {
                                      handleCloseDropDown("dropdown2");
                                      downloadAll();
                                    }}
                                  >
                                    <ExportAllRecords />
                                    {t("Export All Records")}
                                  </MenuItem>
                                </PermissionComponent>
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="View Requisition"
                                  permissionIdentifier="ExportSelectedRecords"
                                >
                                  <MenuItem
                                    onClick={() => {
                                      handleCloseDropDown("dropdown2");
                                      downloadSelected();
                                    }}
                                  >
                                    <SelectedRecords />
                                    {t("Export Selected Records")}
                                  </MenuItem>
                                </PermissionComponent>
                              </StyledDropMenu>
                            </AnyPermission>
                          </div>)
                      ) : null}

                      {/* Records and bulk action section */}
                      <div className="d-flex gap-2 align-items-center">
                        <div className="d-flex align-items-center">
                          <span className="fw-400 mr-3">{t("Records")}</span>
                          <select
                            className="form-select w-100px h-33px rounded"
                            data-kt-select2="true"
                            data-placeholder="Select option"
                            data-dropdown-parent="#kt_menu_63b2e70320b73"
                            data-allow-clear="true"
                            onChange={async (e) => {
                              const value = parseInt(e.target.value);
                              setPageSize(value);
                              filterData.pageSize = value;
                              await loadGridData();
                            }}
                            value={filterData.pageSize}
                          >
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="150">150</option>
                            <option value="200">200</option>
                          </select>
                        </div>

                        {value === 0 || value === 1
                          ? !isMobile && (
                              <div>
                                <StyledDropButton
                                  id="demo-positioned-button2"
                                  aria-controls={
                                    openDrop
                                      ? "demo-positioned-menu2"
                                      : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={openDrop ? "true" : undefined}
                                  onClick={(event) =>
                                    handleClick(event, "dropdown2")
                                  }
                                  className="btn btn-excle btn-sm"
                                >
                                  <ExportIcon />
                                  <span className="svg-icon svg-icon-5 m-0">
                                    <ArrowBottomIcon />
                                  </span>
                                </StyledDropButton>
                                <StyledDropMenu
                                  id="demo-positioned-menu2"
                                  aria-labelledby="demo-positioned-button2"
                                  anchorEl={anchorEl.dropdown2}
                                  open={Boolean(anchorEl.dropdown2)}
                                  onClose={() =>
                                    handleCloseDropDown("dropdown2")
                                  }
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
                                    moduleName="Requisition"
                                    pageName="View Requisition"
                                    permissionIdentifier="ExportAllRecords"
                                  >
                                    <MenuItem
                                      onClick={() => {
                                        handleCloseDropDown("dropdown2");
                                        downloadAll();
                                      }}
                                    >
                                      <ExportAllRecords />
                                      {t("Export All Records")}
                                    </MenuItem>
                                  </PermissionComponent>
                                  <PermissionComponent
                                    moduleName="Requisition"
                                    pageName="View Requisition"
                                    permissionIdentifier="ExportSelectedRecords"
                                  >
                                    <MenuItem
                                      onClick={() => {
                                        handleCloseDropDown("dropdown2");
                                        downloadSelected();
                                      }}
                                    >
                                      <SelectedRecords />
                                      {t("Export Selected Records")}
                                    </MenuItem>
                                  </PermissionComponent>
                                </StyledDropMenu>
                              </div>
                            )
                          : null}

                        {!(
                          value === 1 ||
                          value === 2 ||
                          value === 3 ||
                          value === 4
                        ) && (
                          <div className="d-flex gap-lg-3 gap-2 align-items-center justify-content-around">
                            <StyledDropButton
                              id="demo-positioned-button1"
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
                              {t("bulk action")}
                              <span className="svg-icon svg-icon-5 m-0">
                                <ArrowBottomIcon />
                              </span>
                            </StyledDropButton>
                            <StyledDropMenu
                              id="demo-positioned-menu1"
                              aria-labelledby="demo-positioned-button1"
                              anchorEl={anchorEl.dropdown1}
                              open={Boolean(anchorEl.dropdown1)}
                              onClose={() => handleCloseDropDown("dropdown1")}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <div className="row m-0 p-0">
                                <div className=" px-0 ">
                                  <PermissionComponent
                                    moduleName="Requisition"
                                    pageName="View Requisition"
                                    permissionIdentifier="Completed"
                                  >
                                    <MenuItem
                                      onClick={() => {
                                        handleCloseDropDown("dropdown1");
                                        completeCollection();
                                      }}
                                    >
                                      {t("Complete Collection")}
                                    </MenuItem>
                                  </PermissionComponent>
                                </div>
                              </div>
                            </StyledDropMenu>
                          </div>
                        )}
                      </div>

                      {/* Phlebotomist selection section */}
                      {value === 0 && (
                        <div className="d-flex">
                          <Select
                            menuPortalTarget={document.body}
                            theme={(theme: any) => styles(theme)}
                            options={phlebotomistsLookup}
                            styles={{
                              ...reactSelectSMStyle2(""),
                              control: (base) => ({
                                ...base,
                                minHeight: "33px",
                                borderRadius: ".475rem 0 0 .475rem",
                                width: "200px",
                              }),
                            }}
                            name="phlebotomist"
                            placeholder={t("--- Select ---")}
                            onChange={(event: any) =>
                              handleChangePhlebotomist(event.value)
                            }
                            value={phlebotomistsLookup.filter(
                              (gender: any) =>
                                gender.value === phlebotomistsValue
                            )}
                            isSearchable={true}
                            isClearable={true}
                          />
                          <button
                            onClick={assignPhlebotomist}
                            className="btn btn-sm fw-500 px-sm-6 px-2 text-white"
                            style={{
                              backgroundColor: "#3e88f0",
                              borderTopLeftRadius: "0px",
                              borderBottomLeftRadius: "0px",
                            }}
                            aria-controls="Assign Phlebotomist"
                            disabled={
                              selectedBox.requisitionOrderId.length === 0
                            }
                          >
                            {t("Assign Phlebotomist")}
                          </button>
                        </div>
                      )}

                      {/* Add New buttons section */}
                      {value === 2 && (
                        <div>
                          <button
                            onClick={() => {
                              const result = inputFields.reduce(
                                (acc: any, item: any) => {
                                  if (item && item.name) {
                                    acc[item.name] = "";
                                  }
                                  return acc;
                                },
                                {}
                              );

                              const rowKeys = Object.keys(result);
                              const emptyValuesObject = rowKeys.reduce(
                                (acc: any, key) => {
                                  acc[key] = "";
                                  return acc;
                                },
                                {}
                              );
                              setInputFields(
                                inputFields.map((field: any) => ({
                                  ...field,
                                  show: field?.isIndividualEditable,
                                }))
                              );
                              setData((prev: any) => ({
                                ...prev,
                                gridData: [
                                  {
                                    rowStatus: true,
                                    PhlAssignmentId: 0,
                                    ...emptyValuesObject,
                                  }, // Append new object at index 0
                                  ...prev.gridData, // Keep existing gridData
                                ],
                              }));
                            }}
                            className="btn btn-success btn-sm fw-bold mr-3 px-10 text-capitalize"
                          >
                            {t("Add New Phlebotomy Assignment")}
                          </button>
                        </div>
                      )}
                      {value === 4 ? (
                        <div>
                          <button
                            onClick={() => {
                              const rowKeys = Object?.keys(data?.gridData[0]);
                              const emptyValuesObject = rowKeys?.reduce(
                                (acc: any, key) => {
                                  acc[key] = "";
                                  return acc;
                                },
                                {}
                              );
                              setInputFields(
                                inputFields.map((field: any) => ({
                                  ...field,
                                  show: field?.isIndividualEditable,
                                }))
                              );
                              setData((prev: any) => ({
                                ...prev,
                                gridData: [
                                  {
                                    rowStatus: true,
                                    ...emptyValuesObject,
                                    show: true,
                                  }, // Append new object at index 0
                                  ...prev.gridData, // Keep existing gridData
                                ],
                              }));
                              // setIsAddButtonDisabled(true);
                              // }
                            }}
                            className="btn btn-success btn-sm fw-bold mr-3 px-10 text-capitalize"
                          >
                            {t("Add New Rejection Reasons")}
                          </button>
                        </div>
                      ) : null}
                    </div>

                    {/* Search and Reset buttons - Now will stay in line */}
                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={async () => await loadGridData()}
                        className="btn btn-linkedin btn-sm fw-500"
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
                  <TabPanel value={value} index={value}>
                    <ReqDataGrid
                      tabsInfo={data?.gridHeaders[value]?.tabHeaders}
                      rowInfo={data?.gridData}
                      filters={filters}
                      setFilters={setFilters}
                      setTriggerSearchData={setTriggerSearchData}
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
    </>
  );
};

export default WorkLogV2;
