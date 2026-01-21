import { MenuItem, Tooltip, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import ColumnSetup from "../../../Shared/ColumnSetup/ColumnSetup";
import PermissionComponent, {
  AnyPermission,
} from "../../../Shared/Common/Permissions/PermissionComponent";
import ArrowBottomIcon from "../../../Shared/SVG/ArrowBottomIcon";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { emptyObjectValues } from "../../../Utils/Common/Requisition";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../../Utils/Style/Dropdownstyle";
import ReqDataGrid from "./ResultDataGrid";
import CustomPagination from "Shared/JsxPagination";
import { ExportAllRecords, ExportIcon, SelectedRecords } from "Shared/Icons";
import usePagination from "Shared/hooks/usePagination";
import useLang from "Shared/hooks/useLanguage";
import {
  BloodResultDataBulkValidate,
  BloodResultDataExportToExcelV2,
  BloodResultDataReportTest,
} from "Services/BloodLisResultData";
import { ZebraMultiPrint } from "Pages/Printing/ZebraMultiPrint";
import { DymoMultiPrint } from "Pages/Printing/DymoMultiPrint";
import { useBloodResultDataContext } from "Pages/Blood/BloodResultData/BloodResultDataContext";
import useIsMobile from "Shared/hooks/useIsMobile";
import BrotherPrint from "Pages/Printing/BrotherPrint";

const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
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
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const BloodResultData = () => {
  const {
    data,
    filterData,
    setFilterData,
    searchValue,
    setSearchValue,
    selectedBox,
    setSelectedBox,
    loadGridData,
    apiCalls,
    loading,
    GetPrintersInfo,
    setCheckedAll,
    total,
    value,
    setValue,
    setRowsToExpand,
    setIsMasterExpandTriggered,
  } = useBloodResultDataContext();

  // Add this hook at the top of your file (or in a utils/hooks file)

  const { t } = useLang();
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<any>([]);
  const [resetClicked, setResetClicked] = useState(false);
  const [showSetupModal, setShowModalSetup] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(false);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  const [triggerSearchData, setTriggerSearchData] = useState<boolean>(false);
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
    setRowsToExpand([]);
    setIsMasterExpandTriggered(false);
  }, [curPage, pageSize]);

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

  const resetFilterData = () => {
    filterData.filters = [];
    filterData.sortColumn = "";
    filterData.pageSize = 50;
    filterData.pageNumber = 1;
    filterData.sortDirection = "";
  };
  const getInitialApiData = async () => {
    await Promise.all([apiCalls(), GetPrintersInfo()]);
  };

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

  const handleClose = () => {
    setShowModalSetup(false);
  };

  const TestReport = () => {
    const selectedRow = selectedBox.requisitionId.map(
      (item: any) => item.requisitionOrderId
    );
    const list = [];
    if (selectedRow.length > 0) {
      selectedBox?.requisitionId?.map((record: any) => {
        const foundRecord = data?.gridData?.find(
          (item: any) => item.RequisitionOrderId === record.requisitionOrderId
        );
        if (foundRecord?.RequisitionStatus === "On Hold") {
          list.push(foundRecord);
        }
      });
      if (list?.length > 0) {
        return toast.error(
          t(
            "Some requisitions are still on hold. Please complete all tests before proceeding."
          )
        );
      } else {
        BloodResultDataReportTest(selectedRow)
          .then((res: AxiosResponse) => {
            if (res?.data.statusCode === 200) {
              toast.success(t(res?.data?.message));
              loadGridData();
              setSelectedBox((prevState: any) => {
                return {
                  ...prevState,
                  requisitionId: [], // Clear the array by setting it to an empty array
                };
              });
            } else {
              toast.error(t(res?.data?.message));
            }
          })
          .catch((err: any) => {
            console.trace(err);
          });
      }
    } else {
      toast.error(t("Please select at least one record"));
    }
  };

  const BulkTestValidate = () => {
    const selectedRow = selectedBox.requisitionId.map(
      (item: any) => item.requisitionOrderId
    );
    const list = [];
    if (selectedRow.length > 0) {
      selectedBox?.requisitionId?.map((record: any) => {
        const foundRecord = data?.gridData?.find(
          (item: any) => item.RequisitionOrderId === record.requisitionOrderId
        );
        if (foundRecord?.LisStatus !== "Ready to Validate") {
          list.push(foundRecord);
        }
      });
      if (list?.length > 0) {
        return toast.error(
          "Please select records with the status 'Ready to Validate'."
        );
      } else {
        BloodResultDataBulkValidate({ requisitionOrderIds: selectedRow })
          .then((res: AxiosResponse) => {
            if (res?.data.statusCode === 200) {
              toast.success(res?.data?.message);
              loadGridData();
              setSelectedBox((prevState: any) => {
                return {
                  ...prevState,
                  requisitionId: [], // Clear the array by setting it to an empty array
                };
              });
            } else {
              toast.error(res?.data?.message);
            }
          })
          .catch((err: any) => {
            console.trace(err);
          });
      }
    } else {
      toast.error("Please select at least one record");
    }
  };

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    const Id: any = event.currentTarget.id;
    const thenum: any = Id.match(/\d+/)[0];
    setValue(newValue);
    if (filterData?.tabId !== thenum) {
      const emptySearchObj = emptyObjectValues(searchValue);
      setSearchValue(emptySearchObj);
      filterData.tabId = parseInt(thenum);
      setCurPage(1);
      setRowsToExpand([]);
      filterData.filters = [];
      filterData.pageNumber = 1;
      setFilters([]);
      await loadGridData();
    }
    const initialVal = { requisitionId: [] };
    setSelectedBox(initialVal);
    setCheckedAll(false);
  };

  // Code for Bulk action for Pending
  const handleClose1 = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const base64ToExcel = (base64: string, filename: string) => {
    const decodedBase64 = atob(base64);
    const workbook = XLSX.read(decodedBase64, { type: "binary" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelBlob, `${filename}.xlsx`);
  };

  const downloadAll = () => {
    const obj = {
      tabId: filterData.tabId,
      // pageNumber: filterData.pageNumber,
      // pageSize: filterData.pageSize,
      sortColumn: filterData.sortColumn,
      sortDirection: filterData.sortDirection,
      filters: filterData.filters,
    };
    BloodResultDataExportToExcelV2(obj).then((res: AxiosResponse) => {
      if (res?.data?.statusCode === 200) {
        toast.success(t(res?.data?.message));
        base64ToExcel(res.data.data.fileContents, "Blood Result Data");
        setCheckedAll(false);
        setSelectedBox((prevState: any) => {
          return {
            ...prevState,
            requisitionId: [], // Clear the array by setting it to an empty array
          };
        });
      } else {
        toast.error(t(res?.data?.message));
      }
    });
  };

  const downloadSelected = () => {
    if (selectedBox.requisitionId.length > 0) {
      const obj = {
        tabId: filterData.tabId,
        // pageNumber: filterData.pageNumber,
        // pageSize: filterData.pageSize,
        sortColumn: filterData.sortColumn,
        sortDirection: filterData.sortDirection,
        filters: filterData.filters,
        selectedRow: selectedBox.requisitionId.map((item: any) =>
          filterData.tabId === 4 ? item.id : item.requisitionOrderId
        ),
      };
      BloodResultDataExportToExcelV2(obj).then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          base64ToExcel(res.data.data.fileContents, "Blood Result Data");
          setCheckedAll(false);
          setSelectedBox((prevState: any) => {
            return {
              ...prevState,
              requisitionId: [], // Clear the array by setting it to an empty array
            };
          });
        } else {
          toast.error(t(res?.data?.message));
        }
      });
    } else {
      toast.error(t("Please Select Minimum 1 Record"));
    }
  };
  //End Bulk action for pending and completed
  //Modal Function to archive row in Bulk action
  const [show1, setShow1] = useState(false);
  const ModalhandleClose1 = () => setShow1(false);
  const ArchiveResultData = () => {
    if (selectedBox.requisitionId.length === 0) {
      toast.error(t("Please select atleast one record"));
    } else {
      const selectedIds = selectedBox.requisitionId.map(
        (item: any) => item.requisitionId
      );
      RequisitionType.ArchiveResultData(selectedIds)
        .then((res: any) => {
          if (res.status === 200) {
            setSelectedBox((prevState: any) => {
              return {
                ...prevState,
                requisitionId: [], // Clear the array by setting it to an empty array
              };
            });
            apiCalls();
            ModalhandleClose1();
            setShow1(false);
            toast.success(t("Request Succesfully Processed"));
          }
        })
        .catch((err: AxiosError) => {
          console.error(err);
        });
    }
  };
  //Archive data for modal ended.
  //Unvalidate Completed data
  const UnvalidateResultData = () => {
    if (selectedBox.requisitionId.length === 0) {
      toast.error(t("Please select atleast one record"));
    } else {
      const selectedIds = selectedBox.requisitionId.map(
        (item: any) => item.requisitionOrderId
      );
      RequisitionType.UnvalidateResultData(selectedIds)
        .then((res: any) => {
          if (res.status === 200) {
            setSelectedBox((prevState: any) => {
              return {
                ...prevState,
                requisitionOrderId: [],
              };
            });
            apiCalls();
            ModalhandleClose1();
            setShow1(false);
            toast.success(t("Request Succesfully Processed"));
          }
        })
        .catch((err: AxiosError) => {
          console.error(err);
        });
    }
  };
  //unvaldated function ended.
  const handleSearch = () => {
    setCurPage(1);
    setTriggerSearchData((prev) => !prev);
  };

  const resetSearch = () => {
    setSelectedBox((prevState: any) => {
      return {
        ...prevState,
        requisitionId: [],
      };
    });
    resetFilterData();
    setFilters([]);
    setResetClicked(!resetClicked);
    const emptySearchObj = emptyObjectValues(searchValue);
    setSearchValue(emptySearchObj);
    loadGridData(true);
  };

  const handleClickForBulkPrint = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleCloseForBulkPrint = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const getPrinterContentData = async (payload: any) => {
    try {
      const printerContent = await RequisitionType.getPrinterContent(payload);
      return printerContent?.data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const printLabel = async (option: string, printerId: number) => {
    const objToSend = {
      printerId: printerId,
      contentList: selectedBox.requisitionId.map((_, index: number) => ({
        requisitionOrderId: selectedBox.requisitionId[index].requisitionOrderId,
        requisitionId: selectedBox.requisitionId[index].requisitionId || "",
      })),
    };
    if (selectedBox.requisitionId.length !== 0) {
      const content = await getPrinterContentData(objToSend);
      if (option?.includes("zebra") || option?.includes("Zebra")) {
        ZebraMultiPrint(content);
        handleCloseForBulkPrint("dropdown4");
        return;
      }
      if (option.includes("dymo") || option.includes("Dymo")) {
        DymoMultiPrint(content);
        handleCloseForBulkPrint("dropdown4");
        return;
      }
      if (option.includes("brother") || option.includes("Brother")) {
        BrotherPrint(content);
        handleCloseForBulkPrint("dropdown4");
      }
    } else {
      toast.error(t("Please select atleast one record"));
    }
  };

  // Handling searchedTags
  const handleTagRemoval = (clickedTag: string) => {
    const resultedTab = filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });

    const resultedTabs = filterData.filters.filter((tab: any) => {
      return tab.label !== clickedTag;
    });

    setFilters(() => [...resultedTab]);
    setSearchValue((prevValue: any) => ({
      ...prevValue,
      filters: resultedTab,
    }));
    setFilterData((prevValue: any) => ({
      ...prevValue,
      filters: resultedTabs,
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

  useEffect(() => {
    if (isInitialRender) {
      if (searchedTags.length === 0) {
        resetSearch();
      }
    } else {
      setIsInitialRender(true);
    }
  }, [searchedTags.length]);

  useEffect(() => {
    filterData.tabId = 1;
    getInitialApiData();
  }, []);

  return (
    <>
      <ColumnSetup
        show={showSetupModal}
        closeSetupModal={handleClose}
        loadData={apiCalls}
        value={filterData.tabId}
        columnsToUse={data.gridHeaders[value]?.tabHeaders}
      />

      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-toolbar py-3 py-lg-3">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              {/* <PermissionComponent
                moduleName="Blood LIS"
                pageName="Result Data"
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
        <div className="d-flex flex-column flex-column-fluid">
          <div className="app-content flex-column-fluid">
            <div className="app-container container-fluid">
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
                {Array.isArray(data.gridHeaders) &&
                  data?.gridHeaders?.map((items: any) => (
                    <TabSelected
                      data-test-id={items?.tabName?.replace(/\s/g, "")}
                      key={items.tabID}
                      label={t(items.tabName)}
                      {...a11yProps(items.tabID)}
                      className="fw-bold text-capitalize"
                      disabled={loading}
                    />
                  ))}
              </Tabs>
              <div className="card tab-content-card">
                <div className="card-body py-2">
                  <div className="d-flex gap-4 flex-wrap mb-1">
                    {searchedTags.map((tag) => (
                      <div
                        className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                        onClick={() => handleTagRemoval(tag)}
                        key={tag}
                      >
                        <span className="fw-bold">{tag}</span>
                        <i className="bi bi-x"></i>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
                    <div className="d-flex gap-2 responsive-flexed-actions">
                      <div className="d-flex align-items-center">
                        <span className="fw-400 mr-3">{t("Records")}</span>
                        <select
                          id={`BloodResultDataRecords`}
                          className="form-select w-125px h-33px rounded py-2"
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
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="150">150</option>
                          <option value="200">200</option>
                        </select>
                      </div>

                      <div className="d-flex justify-content-center gap-2">
                        <div>
                          <AnyPermission
                            moduleName="Blood LIS"
                            pageName="Result Data"
                            permissionIdentifiers={[
                              "ExportAllRecord",
                              "ExportSelectedRecords",
                            ]}
                          >
                            <StyledDropButton
                              id={`BloodResultDataBulkExport`}
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
                              id={`BloodResultDataBulkExportMenu`}
                              aria-labelledby="demo-positioned-button2"
                              anchorEl={anchorEl.dropdown2}
                              open={Boolean(anchorEl.dropdown2)}
                              onClose={() => handleClose1("dropdown2")}
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
                                moduleName="Blood LIS"
                                pageName="Result Data"
                                permissionIdentifier="ExportAllRecord"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id={`BloodResultDataExportAll`}
                                    className="p-0 w-200px text-dark"
                                    onClick={() => {
                                      handleClose1("dropdown2");
                                      downloadAll();
                                    }}
                                  >
                                    <ExportAllRecords />
                                    {t("Export All Records")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                              <PermissionComponent
                                moduleName="Blood LIS"
                                pageName="Result Data"
                                permissionIdentifier="ExportSelectedRecords"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id={`BloodResultDataExportSelected`}
                                    className="p-0 w-200px text-dark"
                                    onClick={() => {
                                      handleClose1("dropdown2");
                                      downloadSelected();
                                    }}
                                  >
                                    <SelectedRecords />
                                    {t("Export Selected Records")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                            </StyledDropMenu>
                          </AnyPermission>
                        </div>
                        {filterData.tabId === 1 ||
                        filterData.tabId === 2 ||
                        filterData.tabId === 3 ? (
                          <PermissionComponent
                            moduleName="Blood LIS"
                            pageName="Result Data"
                            permissionIdentifier="PrintSelectedLabel"
                          >
                            <div>
                              <StyledDropButton
                                id={`BloodResultDataBulkLabelPrint`}
                                aria-controls={
                                  openDrop ? "demo-positioned-menu4" : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={openDrop ? "true" : undefined}
                                onClick={(event) =>
                                  handleClickForBulkPrint(event, "dropdown4")
                                }
                                className="btn btn-warning btn-sm"
                              >
                                {t("Bulk Label Print")}
                                <span className="svg-icon svg-icon-5 m-0">
                                  <ArrowBottomIcon />
                                </span>
                              </StyledDropButton>
                              <StyledDropMenu
                                id={`BloodResultDataLabelPrintMenu`}
                                aria-labelledby="demo-positioned-button4"
                                anchorEl={anchorEl.dropdown4}
                                open={Boolean(anchorEl.dropdown4)}
                                onClose={() =>
                                  handleCloseForBulkPrint("dropdown4")
                                }
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                transformOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                className="w-auto"
                              >
                                {data?.printersInfo?.map((option: any) => (
                                  <MenuItem
                                    id={`BloodResultData_${option.value}`}
                                    className="w-auto"
                                    key={option.value}
                                    value={t(option.value)}
                                    onClick={() =>
                                      printLabel(option?.label, option.value)
                                    }
                                  >
                                    <i className="fa fa fa-print text-warning mr-2 w-20px"></i>
                                    {t(option?.label)}
                                  </MenuItem>
                                ))}
                              </StyledDropMenu>
                            </div>{" "}
                          </PermissionComponent>
                        ) : null}

                        {filterData.tabId === 1 && !isMobile ? (
                          <>
                            <StyledDropButton
                              id={`BloodResultDataBulkAction`}
                              aria-controls={
                                openDrop ? "demo-positioned-menu1" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? "true" : undefined}
                              onClick={(event: any) =>
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
                              id={`BloodResultDataBulkActionMenu`}
                              aria-labelledby="demo-positioned-button1"
                              anchorEl={anchorEl.dropdown1}
                              open={Boolean(anchorEl.dropdown1)}
                              onClose={() => handleClose1("dropdown1")}
                              sx={{
                                padding: 0,
                              }}
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
                                moduleName="Blood LIS"
                                pageName="Result Data"
                                permissionIdentifier="BulkReport"
                              >
                                <MenuItem className=" p-0">
                                  <a
                                    id={`BloodResultDataBulkReport`}
                                    className="w-100 text-dark"
                                    onClick={() => {
                                      handleClose1("dropdown1");
                                      TestReport();
                                    }}
                                  >
                                    {t("Report")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                              <PermissionComponent
                                moduleName="Blood LIS"
                                pageName="Result Data"
                                permissionIdentifier="BulkValidate"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id={`BloodResultDataBulkReport`}
                                    className="w-100 text-dark"
                                    onClick={() => {
                                      handleClose1("dropdown1");
                                      BulkTestValidate();
                                    }}
                                  >
                                    {t("Validate")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                            </StyledDropMenu>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      {filterData.tabId === 1 && isMobile ? (
                        <StyledDropButton
                          id={`BloodResultDataBulkAction`}
                          aria-controls={
                            openDrop ? "demo-positioned-menu1" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={openDrop ? "true" : undefined}
                          onClick={(event: any) =>
                            handleClick(event, "dropdown1")
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
                        id={`BloodResultDataBulkActionMenu`}
                        aria-labelledby="demo-positioned-button1"
                        anchorEl={anchorEl.dropdown1}
                        open={Boolean(anchorEl.dropdown1)}
                        onClose={() => handleClose1("dropdown1")}
                        sx={{
                          padding: 0,
                        }}
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
                          moduleName="Blood LIS"
                          pageName="Result Data"
                          permissionIdentifier="BulkReport"
                        >
                          <MenuItem className=" p-0">
                            <a
                              id={`BloodResultDataBulkReport`}
                              className="w-100 text-dark"
                              onClick={() => {
                                handleClose1("dropdown1");
                                TestReport();
                              }}
                            >
                              {t("Report")}
                            </a>
                          </MenuItem>
                        </PermissionComponent>
                        <PermissionComponent
                          moduleName="Blood LIS"
                          pageName="Result Data"
                          permissionIdentifier="BulkValidate"
                        >
                          <MenuItem className="p-0">
                            <a
                              id={`BloodResultDataBulkReport`}
                              className="w-100 text-dark"
                              onClick={() => {
                                handleClose1("dropdown1");
                                BulkTestValidate();
                              }}
                            >
                              {t("Validate")}
                            </a>
                          </MenuItem>
                        </PermissionComponent>
                      </StyledDropMenu>

                      <button
                        id={`BloodResultDataSearch`}
                        onClick={() => handleSearch()}
                        className="btn btn-linkedin btn-sm fw-500"
                        aria-controls="Search"
                      >
                        {t("Search")}
                      </button>
                      <button
                        onClick={resetSearch}
                        type="button"
                        className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                        id={`BloodResultDataReset`}
                      >
                        <span>
                          <span>{t("Reset")}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                  <TabPanel value={value} index={value}>
                    <ReqDataGrid
                      tabsInfo={data.gridHeaders[value]?.tabHeaders}
                      value={value}
                      filters={filters}
                      setFilters={setFilters}
                      setCurPage={setCurPage}
                    />
                  </TabPanel>
                  {loading ? null : (
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
        <Modal
          show={show1}
          onHide={ModalhandleClose1}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton className="py-4">
            <Modal.Title className="h5">
              {filterData.tabId === 1 ? "Archive Record" : "Unvalidate Record"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filterData.tabId === 1
              ? "Are you sure you want to archive this record ?"
              : "Are you sure you want to unvalidate this record?"}
          </Modal.Body>
          <Modal.Footer className="py-2">
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={ModalhandleClose1}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() =>
                filterData.tabId === 1
                  ? ArchiveResultData()
                  : UnvalidateResultData()
              }
            >
              {filterData.tabId === 1 ? "Archive" : "Unvalidate"}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default React.memo(BloodResultData);
