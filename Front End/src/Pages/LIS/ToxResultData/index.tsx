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
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import ArrowBottomIcon from "../../../Shared/SVG/ArrowBottomIcon";
import { useToxResultDataContext } from "../../../Shared/ToxResultDataContext";
import { StringRecord } from "../../../Shared/Type";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { emptyObjectValues } from "../../../Utils/Common/Requisition";
import { AutocompleteStyle } from "../../../Utils/MuiStyles/AutocompleteStyles";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../../Utils/Style/Dropdownstyle";
import ReqDataGrid from "./ResultDataGrid";
import ReqGridPagination from "./ResultDataGridPagination";
import usePagination from "Shared/hooks/usePagination";
import CustomPagination from "Shared/JsxPagination";
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
const ToxResultData = () => {
  const {
    data,
    total,
    loading,
    apiCalls,
    filterData,
    searchValue,
    selectedBox,
    getLisStatus,
    setCheckedAll,
    setFilterData,
    setSearchValue,
    setSelectedBox,
    getPanelLookup,
    setRowsToExpand,
    loadAllResultData,
    getFacilityLookup,
    setIsMasterExpandTriggered,
  } = useToxResultDataContext();

  const { t } = useLang();

  const [value, setValue] = useState(0);
  const [show1, setShow1] = useState(false);
  const [Duplicate, setDuplicate] = useState<any>(false);
  const [resetClicked, setResetClicked] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [showSetupModal, setShowModalSetup] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(false);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [triggerSearchData, setTriggerSearchData] = useState(false);

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
  }, [filterData.pageNumber, filterData.pageSize]);

  const resetFilterData = () => {
    filterData.filters = [];
    filterData.sortColumn = "";
    filterData.pageSize = 50;
    setCurPage(1);
    filterData.pageNumber = 1;
    filterData.sortDirection = "";
  };

  const getInitialApiData = async () => {
    await Promise.all([apiCalls(), getFacilityLookup(), getPanelLookup()]);
  };

  useEffect(() => {
    filterData.pageNumber = curPage;
    filterData.pageSize = pageSize;
    getInitialApiData();
  }, [pageSize, curPage, triggerSearchData]);

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

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    let Id: any = event.currentTarget.id;
    let thenum: any = Id.match(/\d+/)[0];
    if (filterData?.tabId !== thenum) {
      let emptySearchObj = emptyObjectValues(searchValue);
      setSearchValue(emptySearchObj);
      filterData.tabId = parseInt(thenum);
      filterData.filters = [];
      filterData.pageNumber = 1;
      await loadAllResultData();
    }
    setDuplicate(false);
    setCheckedAll(false);
    let initialVal = { requisitionId: [] };
    setSelectedBox(initialVal);
    setValue(newValue);
  };

  const handleClickOpen = (ids: any) => {
    if (selectedBox.requisitionId.length === 0) {
      toast.error(t("Please select atleast one record"));
    } else {
      setShow1(true);
      handleClose1("dropdown1");
    }
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

  const downloadSelected = () => {
    if (selectedBox.requisitionId.length > 0) {
      const obj = {
        tabId: filterData.tabId,
        pageNumber: filterData.pageNumber,
        pageSize: filterData.pageSize,
        sortColumn: filterData.sortColumn,
        sortDirection: filterData.sortDirection,
        filters: filterData.filters,
        selectedRow: selectedBox.requisitionId.map(
          (item: any) => item.RequisitionId
        ),
      };
      RequisitionType.ToxresultDataExportToExcelV2(obj).then(
        (res: AxiosResponse) => {
          if (res?.data?.statusCode === 200) {
            toast.success(t(res?.data?.message));
            base64ToExcel(res.data.data.fileContents, "Result Data");
            setSelectedBox((prevState: any) => {
              return {
                ...prevState,
                requisitionId: [],
              };
            });
            setCheckedAll(false);
          } else {
            toast.error(t(res?.data?.message));
          }
        }
      );
    } else {
      toast.error(t("Please Select Minimum 1 Record"));
    }
  };

  const RestoreResultData = () => {
    if (selectedBox.requisitionId.length === 0) {
      toast.error(t("Please select atleast one record"));
    } else {
      const selectedIds = selectedBox.requisitionId.map(
        (item: any) => item.RequisitionId
      );
      RequisitionType.RestoreToxResultData(selectedIds)
        .then((res: AxiosResponse) => {
          if (res?.data?.statusCode === 200) {
            toast.success(t(res.data.message));
            setSelectedBox((prevState: any) => {
              return {
                ...prevState,
                requisitionId: [],
              };
            });
            setCheckedAll(false);
            apiCalls();
          } else {
            toast.error(t(res.data.message));
          }
        })
        .catch((err: AxiosError) => {
          console.error(err);
        });
    }
  };

  const ModalhandleClose1 = () => setShow1(false);

  const ArchiveResultData = async () => {
    setDisabledButton(true);

    if (selectedBox.requisitionId.length === 0) {
      toast.error(t("Please select at least one record"));
      setDisabledButton(false);
      return;
    }

    const selectedIds = selectedBox.requisitionId.map(
      (item: any) => item.RequisitionOrderID
    );

    try {
      const res: AxiosResponse =
        await RequisitionType.ArchiveToxResultData(selectedIds);

      if (res.status === 200) {
        setSelectedBox((prevState: any) => ({
          ...prevState,
          requisitionId: [],
        }));
        apiCalls();
        ModalhandleClose1();
        setShow1(false);
        setCheckedAll(false);
        toast.success(t("Request Successfully Processed"));
      } else {
        toast.error(t(res.data.message));
      }
    } catch (err: AxiosError | any) {
      console.error(err);
      toast.error(t("An error occurred while processing the request"));
    } finally {
      setDisabledButton(false);
    }
  };

  const UnvalidateResultData = async () => {
    setDisabledButton(true);

    if (selectedBox.requisitionId.length === 0) {
      toast.error(t("Please select at least one record"));
      setDisabledButton(false);
      return;
    }

    const selectedIds = selectedBox.requisitionId.map(
      (item: any) => item.RequisitionOrderID
    );

    try {
      const res: AxiosResponse =
        await RequisitionType.UnvalidateResultData(selectedIds);

      if (res.status === 200) {
        setSelectedBox((prevState: any) => ({
          ...prevState,
          requisitionId: [],
        }));
        apiCalls();
        ModalhandleClose1();
        setShow1(false);
        setCheckedAll(false);
        toast.success(t("Request Successfully Processed"));
      } else {
        toast.error(t(res.data.message));
      }
    } catch (err: AxiosError | any) {
      console.error(err);
      toast.error(t("An error occurred while processing the request"));
    } finally {
      setDisabledButton(false);
    }
  };

  const resetSearch = () => {
    resetFilterData();
    setResetClicked(!resetClicked);
    let emptySearchObj = emptyObjectValues(searchValue);
    setSearchValue(emptySearchObj);
    loadAllResultData(true);
  };

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
      filters: [...resultedTab], // updating only the filters property
    }));
    setSearchValue((prevValue: any) => ({
      ...prevValue,
      [resulted.columnKey]: "",
    }));
  };

  useEffect(() => {
    const hasTags = searchedTags.length > 0;
    if (!hasTags) {
      resetSearch();
    }
  }, [searchedTags.length]);

  useEffect(() => {
    getLisStatus();
  }, []);

  useEffect(() => {
    if (isInitialRender) {
      loadAllResultData(true);
    } else {
      setIsInitialRender(true);
    }
  }, [resetClicked]);

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
                pageName="View Requisition"
                permissionIdentifier="Setup36"
              > */}
              <Tooltip title={t("Setup")} arrow placement="top">
                <button
                  id={`ToxResultDataSetup`}
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
                  <div className="d-flex gap-4 flex-wrap mb-2">
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
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
                    <div className="d-flex gap-2 responsive-flexed-actions">
                      <div className="d-flex align-items-center">
                        <>
                          <span className="fw-400 mr-3">{t("Records")}</span>
                          <select
                            id={`ToxResultDataRecords`}
                            className="form-select w-125px h-33px rounded py-2"
                            data-kt-select2="true"
                            data-placeholder="Select option"
                            data-dropdown-parent="#kt_menu_63b2e70320b73"
                            data-allow-clear="true"
                            onChange={async (e) => {
                              let value = parseInt(e.target.value);
                              setPageSize(value);
                              filterData.pageSize = value;
                              await loadAllResultData();
                            }}
                            value={filterData.pageSize}
                          >
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="150">150</option>
                            <option value="200">200</option>
                          </select>
                        </>
                      </div>

                      <div className="d-flex gap-lg-3 gap-2 justify-content-center">
                        <div>
                          <StyledDropButton
                            id={`ToxResultDataBulkActionButton`}
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
                            {t("bulk action")}
                            <span className="svg-icon svg-icon-5 m-0">
                              <ArrowBottomIcon />
                            </span>
                          </StyledDropButton>
                          {filterData.tabId === 1 ? (
                            <StyledDropMenu
                              aria-labelledby="demo-positioned-button1"
                              anchorEl={anchorEl.dropdown1}
                              open={Boolean(anchorEl.dropdown1)}
                              onClose={() => handleClose1("dropdown1")}
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
                              <PermissionComponent
                                moduleName="TOX LIS"
                                pageName="Result Data"
                                permissionIdentifier="ExportSelectedRecords"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id={`ToxResultDataExportSelectedRecords`}
                                    onClick={() => {
                                      handleClose1("dropdown1");
                                      downloadSelected();
                                    }}
                                    className="w-auto p-0 w-200px text-dark"
                                  >
                                    {t("Export Selected Records")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                              <PermissionComponent
                                moduleName="TOX LIS"
                                pageName="Result Data"
                                permissionIdentifier="Archive"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id={`ToxResultDataBulkArchive`}
                                    className=" w-auto p-0 w-100px text-dark"
                                    onClick={handleClickOpen}
                                  >
                                    {t("Archive")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                            </StyledDropMenu>
                          ) : filterData.tabId === 2 ? (
                            <StyledDropMenu
                              aria-labelledby="demo-positioned-button1"
                              anchorEl={anchorEl.dropdown1}
                              open={Boolean(anchorEl.dropdown1)}
                              onClose={() => handleClose1("dropdown1")}
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
                                moduleName="TOX LIS"
                                pageName="Result Data"
                                permissionIdentifier="ExportSelectedRecords"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id={`ToxResultData2ndTabExportSelectedRecords`}
                                    className="w-auto w-200px p-0 text-dark"
                                    onClick={() => {
                                      handleClose1("dropdown1");
                                      downloadSelected();
                                    }}
                                  >
                                    {t("Export Selected Records")}
                                  </a>
                                </MenuItem>
                                <PermissionComponent
                                  moduleName="TOX LIS"
                                  pageName="Result Data"
                                  permissionIdentifier="Archive"
                                >
                                  <MenuItem className="p-0">
                                    <a
                                      id={`ToxResultDataBulkUnalidate`}
                                      className="w-auto p-0 text-dark"
                                      onClick={handleClickOpen}
                                    >
                                      {t("Unvalidate")}
                                    </a>
                                  </MenuItem>
                                </PermissionComponent>
                              </PermissionComponent>
                            </StyledDropMenu>
                          ) : filterData.tabId === 3 ? (
                            <StyledDropMenu
                              aria-labelledby="demo-positioned-button1"
                              anchorEl={anchorEl.dropdown1}
                              open={Boolean(anchorEl.dropdown1)}
                              onClose={() => handleClose1("dropdown1")}
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
                                moduleName="TOX LIS"
                                pageName="Result Data"
                                permissionIdentifier="Restore"
                              >
                                <MenuItem className="p-0">
                                  <a
                                    id={`ToxResultDataBulkRestore`}
                                    className="w-150px p-0 text-dark"
                                    onClick={() => {
                                      RestoreResultData();
                                      handleClose1("dropdown1");
                                    }}
                                  >
                                    {t("Restore")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                            </StyledDropMenu>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <button
                        id={`ToxResultDataSearch`}
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
                        id={`ToxResultDataReset`}
                      >
                        <span>
                          <span>{t("Reset")}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                  <TabPanel value={value} index={value}>
                    {data.gridHeaders.length > 0 ? (
                      <ReqDataGrid
                        tabsInfo={data.gridHeaders[value]?.tabHeaders}
                        rowInfo={
                          (data.gridData && data?.gridData?.data?.data) ||
                          data.gridData
                        }
                        value={value}
                        Duplicate={Duplicate}
                        setDuplicate={setDuplicate}
                        setTriggerSearchData={setTriggerSearchData}
                        setCurPage={setCurPage}
                      />
                    ) : (
                      <div className="mt-14">
                        <Loader />
                      </div>
                    )}
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
              ? t("Are you sure you want to archive this record ?")
              : t("Are you sure you want to unvalidate this record?")}
          </Modal.Body>
          <Modal.Footer className="py-2">
            <button
              id={`ToxResultDataModalArchive_UnvalidateCancel`}
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={ModalhandleClose1}
            >
              {t("Cancel")}
            </button>
            <button
              id={`ToxResultDataModalUnvalidate_Archive`}
              type="button"
              className="btn btn-sm btn-danger"
              disabled={disabledButton}
              onClick={() =>
                filterData.tabId === 1
                  ? ArchiveResultData()
                  : UnvalidateResultData()
              }
            >
              {filterData.tabId === 1 ? t("Archive") : t("Unvalidate")}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default React.memo(ToxResultData);
