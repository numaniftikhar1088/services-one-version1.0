import { MenuItem, Tooltip, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { AxiosResponse } from "axios";
import { base64ToExcel } from "Pages/DynamicGrid/bulkExportActions";
import { DymoMultiPrint } from "Pages/Printing/DymoMultiPrint";
import { ZebraMultiPrint } from "Pages/Printing/ZebraMultiPrint";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import ColumnSetup from "Shared/ColumnSetup/ColumnSetup";
import PermissionComponent, { AnyPermission } from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import usePagination from "Shared/hooks/usePagination";
import { ExportAllRecords, ExportIcon, SelectedRecords } from "Shared/Icons";
import CustomPagination from "Shared/JsxPagination";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { emptyObjectValues } from "Utils/Common/Requisition";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import ReqDataGrid from "./ReqDataGrid";
import { useBillingContext } from "./useReqContext";

export const TabSelected = styled(Tab)(AutocompleteStyle());
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

const ViewReq = () => {
  const [isInitialRender2, setIsInitialRender2] = useState(false);

  const portalType = useSelector(
    (state: any) =>
      state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.portalType
  );

  const {
    data,
    setData,
    filterData,
    searchValue,
    setSearchValue,
    selectedBox,
    setSelectedBox,
    loadGridData,
    initialPageLoadApiCalls,
    setFilterData,
    value,
    setValue,
    tabIdToSend,
    setTabIdToSend,
    loadTabs,
    total,
  } = useBillingContext();

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

  const navigate = useNavigate();
  const { t } = useLang();

  const [initialRender, setInitialRender] = useState(false);
  const [showSetupModal, setShowModalSetup] = useState(false);

  useEffect(() => {
    setSelectedBox({ requisitionOrderId: [] });
    setFilterData((prev: any) => ({
      ...prev,
      pageSize: 50,
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
    setValue(newValue);
    let Id: any = event.currentTarget.id;
    const _tabId = +(event.target as any).id;

    let thenum: any = Id.match(/\d+/)[0];
    if (filterData?.tabId !== thenum) {
      let emptySearchObj = emptyObjectValues(searchValue);
      setSearchValue(emptySearchObj);

      filterData.tabId = parseInt(thenum);
      filterData.filters = [];
      filterData.pageNumber = 1;
      setCurPage(1);
      filterData.pageSize = 50;
    }

    setTabIdToSend(_tabId);
  };

  const downloadAll = () => {
    const obj = {
      tabId: filterData.tabId,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: filterData.filters,
    };
    RequisitionType.BillingRequisitionExportToExcelV2(obj).then(
      (res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));

          base64ToExcel(
            res.data.data.fileContents,
            `${data?.gridHeaders[value]?.tabName}_billing`
          );
        } else {
          toast.error(t(res?.data?.message));
        }
      }
    );
  };

  const downloadSelected = () => {
    if (selectedBox.requisitionOrderId.length > 0) {
      const obj = {
        tabId: filterData.tabId,
        sortColumn: filterData.sortColumn,
        sortDirection: filterData.sortDirection,
        filters: filterData.filters,
        selectedRow: selectedBox.requisitionOrderId,
      };
      RequisitionType.BillingRequisitionExportToExcelV2(obj).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            base64ToExcel(
              res.data.data.fileContents,
              `${data?.gridHeaders[value]?.tabName}_billing`
            );
          } else {
            toast.error(t(res?.data?.message));
          }
        }
      );
    } else {
      toast.error(t("Please Select Minimum 1 Record"));
    }
  };

  function filterRecordsById(records: any, ids: any) {
    return records.filter((record: any) => ids.includes(record.RequisitionId));
  }

  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };

  const PrintSelectedReports = () => {
    const requisitionIds = selectedBox?.requisitionOrderId;

    if (!requisitionIds?.length) return;

    const hasMissingReport = requisitionIds.some((id) => {
      const row = data?.gridData.find(
        (template: any) =>
          template?.RequisitionOrderId === id ||
          template?.RequisitionOrderID === id
      );
      return !row?.ResultFile;
    });

    if (hasMissingReport) {
      toast.error(t("Please Select Records That Contain Reports"));
      return;
    }

    RequisitionType.PrintSelectedReports(requisitionIds).then(
      (res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res.data.message));
          ShowBlob(res.data.data);
        } else {
          toast.error(t(res.data.message));
        }
      }
    );
  };

  const PrintSelectedRecords = () => {
    if (selectedBox.requisitionOrderId.length > 0) {
      RequisitionType.PrintSelectedRecords(
        selectedBox?.requisitionOrderId
      ).then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          ShowBlob(res?.data?.data);
        } else {
          toast.error(t(res?.data?.message));
        }
      });
    } else {
      toast.error(t("Please Select Minimum 1 Record"));
    }
  };

  const PrintingFunctionArray = (label: any) => {
    if (label === "Print Selected Label") {
      if (selectedBox?.requisitionOrderId.length === 0) {
        toast.error(t("Select atleast one record ..."));
      } else {
        let filteredRecords = filterRecordsById(
          data?.gridData,
          selectedBox?.requisitionOrderId
        );
        const defaultPrinter = data.printersInfo.find(
          (printer: any) => printer.isDefault === true
        );
        if (defaultPrinter.label === "Dymo Printer") {
          DymoMultiPrint(filteredRecords);
        }
        if (defaultPrinter.label === "Zebra Printer") {
          ZebraMultiPrint(filteredRecords);
        }

        setSelectedBox({
          requisitionOrderId: [],
        });
      }
    }
    if (label === "Print Selected Records") {
      if (selectedBox?.requisitionOrderId.length === 0) {
        toast.error(t("Select atleast one record ..."));
      } else {
        PrintSelectedRecords();
      }
    }
    if (label === "Print Selected Reports") {
      if (selectedBox?.requisitionOrderId.length === 0) {
        toast.error(t("Select atleast one record ..."));
      } else {
        PrintSelectedReports();
      }
    }
  };

  const resetSearch = () => {
    let emptySearchObj = emptyObjectValues(searchValue);
    let emptyObj = {
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
    setSelectedBox({ requisitionOrderId: [] });
    loadGridData(true, emptyObj);
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  useEffect(() => {
    let filteredObject: any = {};

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
    let resultedTab = filterData.filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });
    let resulted = filterData.filters.find((tab: any) => {
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

  // api calls on initial page load
  useEffect(() => {
    initialPageLoadApiCalls();
  }, []);

  useEffect(() => {
    if (tabIdToSend !== null) {
      loadGridData(true);
    }
  }, [tabIdToSend]);

  useEffect(() => {
    setSelectedBox({ requisitionOrderId: [] });
    setFilterData((prev: any) => ({
      ...prev,
      pageSize: 50,
    }));
  }, [value]);

  async function ChangeBillingStatus(action: string) {
    if (
      !selectedBox?.requisitionOrderId ||
      selectedBox.requisitionOrderId.length === 0
    ) {
      toast.error(t("Select at least one record ..."));
      return;
    }
    handleCloseDropDown("dropdown1");
    const payload = {
      billingStatus: action,
      requisitionOrderIds: selectedBox.requisitionOrderId,
    };
    let resp = await RequisitionType.ChangeBillingStatus(payload);
    if (resp.data.httpStatusCode === 200) {
      toast.success(t(resp.data.message));
      loadGridData();
    } else {
      toast.error(t("Something Went Wrong..."));
    }
  }

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
                pageName="Billing"
                permissionIdentifier="Setup"
              > */}
              <Tooltip title={t("Setup")} arrow placement="top">
                <button
                  id="ViewRequisitionButtonSetup"
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
                      data-test-id={items?.tabName?.replace(/\s/g, "")}
                      key={items?.tabID}
                      label={t(items?.tabName)}
                      {...a11yProps(items?.tabID, items.sortOrder)}
                      className="fw-bold text-capitalize"
                    // disabled={loading.header}
                    />
                  ))}
              </Tabs>
              <div className="card tab-content-card">
                <div className="mb-2 mt-2 px-3 px-md-8">
                  <div className="d-flex gap-2 flex-wrap">
                    {searchedTags.map((tag: any) =>
                      tag === "isArchived" ? null : (
                        <div
                          className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                          onClick={() => handleTagRemoval(tag)}
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
                            let value = parseInt(e.target.value);
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
                      <div className="d-flex gap-lg-3 gap-2 justify-content-around">
                        {filterData?.tabId === 4 ||
                          filterData?.tabId === 6 ? null : (
                          <>
                            <div>
                              <StyledDropButton
                                id="BillingRequisitionBulkActionButton"
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
                                  <div className="col-12 col-sm-6 px-0">
                                    {/* Conditionally Render MenuItems */}
                                    {filterData?.tabId === 1 && (
                                      <>
                                        <PermissionComponent
                                          moduleName="Requisition"
                                          pageName="Billing"
                                          permissionIdentifier="PrintSelectedRecords"
                                        >
                                          <MenuItem
                                            className="p-0"
                                            style={{ width: "230px" }}
                                          >
                                            <a
                                              className=" p-0 text-dark"
                                              id="BillingRequisitionPrintSelectedRecord"
                                              onClick={() => {
                                                PrintingFunctionArray(
                                                  "Print Selected Records"
                                                );
                                                handleCloseDropDown(
                                                  "dropdown1"
                                                );
                                              }}
                                            >
                                              {t("Print Selected Records")}
                                            </a>
                                          </MenuItem>
                                        </PermissionComponent>
                                        <PermissionComponent
                                          moduleName="Requisition"
                                          pageName="Billing"
                                          permissionIdentifier="PrintSelectedReports"
                                        >
                                          <MenuItem
                                            className=" p-0"
                                            style={{ width: "230px" }}
                                          >
                                            <a
                                              className=" p-0 text-dark"
                                              id="BillingRequisitionPrintReports"
                                              onClick={() => {
                                                PrintingFunctionArray(
                                                  "Print Selected Reports"
                                                );
                                                handleCloseDropDown(
                                                  "dropdown1"
                                                );
                                              }}
                                            >
                                              {t("Print Selected Reports")}
                                            </a>
                                          </MenuItem>
                                        </PermissionComponent>
                                      </>
                                    )}
                                    {filterData?.tabId === 2 && (
                                      <>
                                        <PermissionComponent
                                          moduleName="Requisition"
                                          pageName="Billing"
                                          permissionIdentifier="SendtoBilling"
                                        >
                                          <MenuItem
                                            className=" p-0"
                                            style={{ width: "170px" }}
                                          >
                                            <a
                                              className=" p-0 text-dark"
                                              id="BillingRequisitionSendToBillingBulk"
                                              onClick={() => {
                                                ChangeBillingStatus(
                                                  "Send To Billing"
                                                );
                                              }}
                                            >
                                              {t("Send To Billing")}
                                            </a>
                                          </MenuItem>
                                        </PermissionComponent>
                                        <PermissionComponent
                                          moduleName="Requisition"
                                          pageName="Billing"
                                          permissionIdentifier="DoNotBill"
                                        >
                                          <MenuItem
                                            className=" p-0"
                                            style={{ width: "170px" }}
                                          >
                                            <a
                                              className=" p-0 text-dark"
                                              id="BillingRequisitionDoNotBillBulk"
                                              onClick={() => {
                                                ChangeBillingStatus(
                                                  "Do Not Bill"
                                                );
                                              }}
                                            >
                                              {t("Do Not Bill")}
                                            </a>
                                          </MenuItem>
                                        </PermissionComponent>
                                      </>
                                    )}
                                    {filterData?.tabId === 3 && (
                                      <>
                                        <PermissionComponent
                                          moduleName="Requisition"
                                          pageName="Billing"
                                          permissionIdentifier="Complete"
                                        >
                                          <MenuItem className="w-100px p-0">
                                            <a
                                              className=" p-0 text-dark"
                                              id="BillingRequisitionCompleteBulk"
                                              onClick={() => {
                                                ChangeBillingStatus(
                                                  "Billing Collected"
                                                );
                                              }}
                                            >
                                              {t("Complete")}
                                            </a>
                                          </MenuItem>
                                        </PermissionComponent>
                                      </>
                                    )}
                                    {(filterData?.tabId === 5 ||
                                      filterData?.tabId === 3) && (
                                        <>
                                          <PermissionComponent
                                            moduleName="Requisition"
                                            pageName="Billing"
                                            permissionIdentifier="Restore"
                                          >
                                            <MenuItem className="w-100px p-0">
                                              <a
                                                className="p-0 text-dark"
                                                id="BillingRequisitionRestoreBulk"
                                                onClick={() => {
                                                  ChangeBillingStatus("Restore");
                                                }}
                                              >
                                                {t("Restore")}
                                              </a>
                                            </MenuItem>
                                          </PermissionComponent>
                                        </>
                                      )}
                                  </div>
                                </div>
                              </StyledDropMenu>
                            </div>
                          </>
                        )}
                        {/* Export Button */}
                        <div>
                          <AnyPermission
                            moduleName="Requisition"
                            pageName="Billing"
                            permissionIdentifiers={[
                              "ExportAllRecords",
                              "ExportSelectedRecords",
                            ]}
                          >
                            <StyledDropButton
                              id="BillingRequisitionExportRecord"
                              aria-controls={
                                openDrop ? "demo-positioned-menu2" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? "true" : undefined}
                              onClick={(event) => handleClick(event, "dropdown2")}
                              className="btn btn-excle btn-sm"
                            >
                              <ExportIcon />
                              <span className="svg-icon svg-icon-5 m-0">
                                <ArrowBottomIcon />
                              </span>
                            </StyledDropButton>
                            <StyledDropMenu
                              id="BillingRequisitionExportRecordButton"
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
                                pageName="Billing"
                                permissionIdentifier="ExportAllRecords"
                              >
                                <MenuItem className=" p-0">
                                  <a
                                    className=" p-0 text-dark"
                                    id="BillingRequisitionExportAllRecord"
                                    onClick={() => {
                                      handleCloseDropDown("dropdown2");
                                      downloadAll();
                                    }}
                                  >
                                    <ExportAllRecords />
                                    {t("Export All Records")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                              <PermissionComponent
                                moduleName="Requisition"
                                pageName="Billing"
                                permissionIdentifier="ExportSelectedRecords"
                              >
                                <MenuItem className=" p-0">
                                  <a
                                    className=" p-0 text-dark"
                                    id="BillingRequisitionExportSelectedRecord"
                                    onClick={() => {
                                      handleCloseDropDown("dropdown2");
                                      downloadSelected();
                                    }}
                                  >
                                    <SelectedRecords />
                                    {t(" Export Selected Records")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                            </StyledDropMenu>
                          </AnyPermission>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <button
                        id="ViewRequisitionSearchButton"
                        onClick={() => {
                          setCurPage(1);
                          setTriggerSearchData((prev) => !prev);
                        }}
                        className="btn btn-linkedin btn-sm fw-500"
                        aria-controls="Search"
                      >
                        {" "}
                        {t("Search")}
                      </button>
                      <button
                        onClick={resetSearch}
                        type="button"
                        className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                        id="ViewRequisitionResetButton"
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
                      portalType={portalType}
                      setCurPage={setCurPage}
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

export default ViewReq;
