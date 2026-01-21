import { MenuItem, Tooltip, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { savePdfUrls } from 'Redux/Actions/Index';
import CustomPagination from 'Shared/JsxPagination';
import useLang from 'Shared/hooks/useLanguage';
import usePagination from 'Shared/hooks/usePagination';
import { AxiosError, AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import ColumnSetup from '../../../Shared/ColumnSetup/ColumnSetup';
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent';
import { useResultDataContext } from '../../../Shared/ResultDataContext';
import ArrowBottomIcon from '../../../Shared/SVG/ArrowBottomIcon';
import BreadCrumbs from '../../../Utils/Common/Breadcrumb';
import { emptyObjectValues } from '../../../Utils/Common/Requisition';
import { AutocompleteStyle } from '../../../Utils/MuiStyles/AutocompleteStyles';
import {
  StyledDropButton,
  StyledDropMenu,
} from '../../../Utils/Style/Dropdownstyle';
import ReqDataGrid from './ResultDataGrid';

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const ResultData = () => {
  const {
    data,
    total,
    loading,
    apiCalls,
    filterData,
    searchValue,
    selectedBox,
    loadGridData,
    setFilterData,
    setCheckedAll,
    getPanelLookup,
    setSelectedBox,
    setSearchValue,
    setRowsToExpand,
    getFacilityLookup,
    setIsMasterExpandTriggered,
  } = useResultDataContext();

  const { t } = useLang();

  const [value, setValue] = useState(0);
  const [show1, setShow1] = useState<boolean>(false);
  const [resetClicked, setResetClicked] = useState<boolean>(false);
  const [initialRender, setInitialRender] = useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState<boolean>(false);
  const [showSetupModal, setShowModalSetup] = useState<boolean>(false);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(false);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [isInitialRender2, setIsInitialRender2] = useState<boolean>(false);
  const [triggerSearchData, setTriggerSearchData] = useState<boolean>(false);

  const dispatch = useDispatch();

  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const {
    curPage,
    pageSize,
    setTotal,
    nextPage,
    showPage,
    prevPage,
    setCurPage,
    totalPages,
    pageNumbers,
    setPageSize,
  } = usePagination();

  useEffect(() => {
    setRowsToExpand([]);
    setIsMasterExpandTriggered(false);
  }, [curPage, pageSize]);

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

  const resetFilterData = () => {
    filterData.filters = [];
    filterData.sortColumn = '';
    filterData.pageSize = 50;
    filterData.pageNumber = 1;
    filterData.sortDirection = '';
  };

  const getInitialApiData = async () => {
    await Promise.all([apiCalls(), getFacilityLookup(), getPanelLookup()]);
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

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    dropdownName: string
  ) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = () => {
    setShowModalSetup(false);
  };

  const handleChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    const Id: any = event.currentTarget.id;
    const thenum: any = Id.match(/\d+/)[0];
    if (filterData?.tabId !== thenum) {
      const emptySearchObj = emptyObjectValues(searchValue);
      setSearchValue(emptySearchObj);
      setCurPage(1);
      setRowsToExpand([]);

      filterData.tabId = parseInt(thenum);
      filterData.filters = [];
      filterData.pageNumber = 1;
      await loadGridData();
    }
    setSelectedBox({
      requisitionOrderId: [],
    });
    setCheckedAll(false);
    setValue(newValue);
  };

  const handleClickOpen = () => {
    if (selectedBox.requisitionOrderId.length === 0) {
      toast.error(t('Please select atleast one record'));
    } else {
      setShow1(true);
      handleClose1('dropdown1');
    }
  };

  // Code for Bulk action for Pending
  const handleClose1 = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const base64ToExcel = (base64: string, filename: string) => {
    const decodedBase64 = atob(base64);
    const workbook = XLSX.read(decodedBase64, { type: 'binary' });
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelBlob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(excelBlob, `${filename}.xlsx`);
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
        selectedRow: selectedBox.requisitionOrderId.map(
          (item: any) => item.requisitionOrderId
        ),
      };
      RequisitionType.resultDataExportToExcelV2(obj).then(
        (res: AxiosResponse) => {
          if (res?.data?.statusCode === 200) {
            toast.success(t(res?.data?.message));
            base64ToExcel(res.data.data.fileContents, 'Result Data');
          } else {
            toast.error(t(res?.data?.message));
          }
        }
      );
    } else {
      toast.error(t('Please Select Minimum 1 Record'));
    }
  };
  //Multiple PDF Reports Function
  const MultiplePDFReports = () => {
    const pdfFiles = selectedBox.requisitionOrderId
      .filter(
        (item: any) =>
          item.resultFile &&
          typeof item.resultFile === 'string' &&
          item.resultFile.trim().toLowerCase().endsWith('.pdf')
      )
      .map((item: any) => item.resultFile);
    dispatch(savePdfUrls(pdfFiles));
  };

  const RestoreResultData = () => {
    if (selectedBox.requisitionOrderId.length === 0) {
      toast.error(t('Please select atleast one record'));
    } else {
      const selectedIds = selectedBox.requisitionOrderId.map(
        (item: any) => item.requisitionOrderId
      );
      RequisitionType.RestoreResultData(selectedIds)
        .then((res: AxiosResponse) => {
          if (res?.data?.statusCode === 200) {
            toast.success(t(res.data.message));
            setSelectedBox((prevState: any) => {
              return {
                ...prevState,
                requisitionOrderId: [], // Clear the array by setting it to an empty array
              };
            });
            loadGridData(true);
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

    if (selectedBox.requisitionOrderId.length === 0) {
      toast.error(t('Please select at least one record'));
      setDisabledButton(false);
      return;
    }

    const selectedIds = selectedBox.requisitionOrderId.map(
      (item: any) => item.requisitionOrderId
    );

    try {
      const res: any = await RequisitionType.ArchiveResultData(selectedIds);

      if (res.status === 200) {
        setSelectedBox((prevState: any) => ({
          ...prevState,
          requisitionOrderId: [],
        }));
        loadGridData(true);
        ModalhandleClose1();
        setShow1(false);
        toast.success(t('Request Successfully Processed'));
      } else {
        toast.error(t(res.data.message));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(t('An error occurred while processing the request'));
    } finally {
      setDisabledButton(false);
    }
  };

  const UnvalidateResultData = async () => {
    setDisabledButton(true);

    if (selectedBox.requisitionOrderId.length === 0) {
      toast.error(t('Please select at least one record'));
      setDisabledButton(false);
      return;
    }

    const selectedIds = selectedBox.requisitionOrderId.map(
      (item: any) => item.requisitionOrderId
    );

    try {
      const res: any = await RequisitionType.UnvalidateResultData(selectedIds);

      if (res.status === 200) {
        setSelectedBox((prevState: any) => ({
          ...prevState,
          requisitionOrderId: [],
        }));
        loadGridData(true);
        ModalhandleClose1();
        setShow1(false);
        toast.success(t('Request Successfully Processed'));
      } else {
        toast.error(t(res.data.message));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(t('An error occurred while processing the request'));
    } finally {
      setDisabledButton(false);
    }
  };

  const resetSearch = () => {
    resetFilterData();
    setResetClicked(!resetClicked);
    const emptySearchObj = emptyObjectValues(searchValue);
    setSearchValue(emptySearchObj);
  };

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
      [resulted.columnKey]: '',
    }));
  };

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
    filterData.tabId = 1;
    getInitialApiData();
  }, []);

  useEffect(() => {
    if (isInitialRender) {
      loadGridData(true);
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
                moduleName="ID LIS"
                pageName="Result Data"
                permissionIdentifier="Setup"
              > */}
              <Tooltip title="Setup" arrow placement="top">
                <button
                  id={`IDResultDataSetup`}
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
                TabIndicatorProps={{ style: { background: 'transparent' } }}
                className="min-h-auto"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTabs-scrollButtons': {
                    width: 0,
                    transition: 'width 0.7s ease',
                    '&:not(.Mui-disabled)': {
                      width: '48px',
                    },
                  },
                }}
              >
                {Array.isArray(data.gridHeaders) &&
                  data?.gridHeaders?.map((items: any) => (
                    <TabSelected
                      key={items.tabID}
                      label={t(items.tabName)}
                      {...a11yProps(items.tabID)}
                      className="fw-bold text-capitalize"
                      data-test-id={items?.tabName?.replace(/\s/g, '')}
                      disabled={loading}
                    />
                  ))}
              </Tabs>
              <div className="card tab-content-card">
                <div className="card-body py-2">
                  <div className="d-flex gap-2 flex-wrap">
                    {searchedTags.map((tag, index: number) =>
                      tag === 'isArchived' ? null : (
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
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
                    <div className="d-flex gap-2 responsive-flexed-actions">
                      <div className="d-flex align-items-center">
                        <span className="fw-400 mr-3">{t('Records')}</span>
                        <select
                          id={`IDResultDataRecords`}
                          className="form-select w-125px h-33px rounded py-2"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_63b2e70320b73"
                          data-allow-clear="true"
                          onChange={async e => {
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

                      <div className="d-flex justify-content-center">
                        <StyledDropButton
                          id={`IDResultDataBulkAction`}
                          aria-controls={
                            openDrop ? 'demo-positioned-menu1' : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={openDrop ? 'true' : undefined}
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => handleClick(event, 'dropdown1')}
                          className="btn btn-info btn-sm"
                        >
                          {t('bulk action')}
                          <span className="svg-icon svg-icon-5 m-0">
                            <ArrowBottomIcon />
                          </span>
                        </StyledDropButton>
                        {filterData.tabId === 1 ? (
                          <StyledDropMenu
                            aria-labelledby="demo-positioned-button1"
                            anchorEl={anchorEl.dropdown1}
                            open={Boolean(anchorEl.dropdown1)}
                            onClose={() => handleClose1('dropdown1')}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                          >
                            <PermissionComponent
                              moduleName="ID LIS"
                              pageName="Result Data"
                              permissionIdentifier="ExportSelectedRecords"
                            >
                              <MenuItem className="p-0">
                                <a
                                  id={`IDResultDataExportSelectedRecords`}
                                  className="w-auto p-0  text-dark"
                                  onClick={() => {
                                    handleClose1('dropdown1');
                                    downloadSelected();
                                  }}
                                >
                                  {t('Export Selected Records')}
                                </a>
                              </MenuItem>
                            </PermissionComponent>
                            <PermissionComponent
                              moduleName="ID LIS"
                              pageName="Result Data"
                              permissionIdentifier="Archive"
                            >
                              <MenuItem className="p-0">
                                <a
                                  id={`IDResultDataArchiveBUlk`}
                                  className="w-auto p-0 text-dark"
                                  onClick={handleClickOpen}
                                >
                                  {t('Archive')}
                                </a>
                              </MenuItem>
                            </PermissionComponent>
                          </StyledDropMenu>
                        ) : filterData.tabId === 2 ? (
                          <StyledDropMenu
                            aria-labelledby="demo-positioned-button1"
                            anchorEl={anchorEl.dropdown1}
                            open={Boolean(anchorEl.dropdown1)}
                            onClose={() => handleClose1('dropdown1')}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                          >
                            <PermissionComponent
                              moduleName="ID LIS"
                              pageName="Result Data"
                              permissionIdentifier="ExportSelectedRecords"
                            >
                              <MenuItem className="p-0">
                                <a
                                  id={`IDResultDataExportSelectedRecords`}
                                  onClick={() => {
                                    handleClose1('dropdown1');
                                    downloadSelected();
                                  }}
                                  className=" w-200px p-0 text-dark w-200px"
                                >
                                  {t('Export Selected Records')}
                                </a>
                              </MenuItem>
                            </PermissionComponent>
                            <PermissionComponent
                              moduleName="ID LIS"
                              pageName="Result Data"
                              permissionIdentifier="ExportSelectedPDF"
                            >
                              <MenuItem className="p-0">
                                <Link
                                  to="/docs-viewer"
                                  target="_blank"
                                  id="IDResultDataExportSelectedPDF"
                                  className="w-auto p-0 text-dark"
                                  onClick={e => {
                                    // Check if no records are selected
                                    if (
                                      selectedBox.requisitionOrderId.length ===
                                      0
                                    ) {
                                      e.preventDefault(); // Prevent link from opening
                                      toast.error(
                                        t('Please Select Minimum 1 Record')
                                      );
                                    } else {
                                      handleClose1('dropdown1');
                                      MultiplePDFReports();
                                      // Link will open because we don't call preventDefault here
                                    }
                                  }}
                                >
                                  {t('Export Selected PDF')}
                                </Link>
                              </MenuItem>
                            </PermissionComponent>
                            <PermissionComponent
                              moduleName="ID LIS"
                              pageName="Result Data"
                              permissionIdentifier="Archive"
                            >
                              <MenuItem className="p-0">
                                <a
                                  id={`IDResultDataUnvalidateBulk`}
                                  className=" w-200px p-0 w-200px text-dark"
                                  onClick={handleClickOpen}
                                >
                                  {t('Unvalidate')}
                                </a>
                              </MenuItem>
                            </PermissionComponent>
                          </StyledDropMenu>
                        ) : filterData.tabId === 3 ? (
                          <StyledDropMenu
                            aria-labelledby="demo-positioned-button1"
                            anchorEl={anchorEl.dropdown1}
                            open={Boolean(anchorEl.dropdown1)}
                            onClose={() => handleClose1('dropdown1')}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                          >
                            <PermissionComponent
                              moduleName="ID LIS"
                              pageName="Result Data"
                              permissionIdentifier="Restore"
                            >
                              <MenuItem className="p-0">
                                <a
                                  id={`IDResultDataRestoreBulk`}
                                  onClick={() => {
                                    RestoreResultData();
                                    handleClose1('dropdown1');
                                  }}
                                  className=" w-200px p-0 text-dark"
                                >
                                  {t('Restore')}
                                </a>
                              </MenuItem>
                            </PermissionComponent>
                          </StyledDropMenu>
                        ) : null}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <button
                        id={`IDResultDataSearch`}
                        onClick={() => {
                          setCurPage(1);
                          setTriggerSearchData(prev => !prev);
                        }}
                        className="btn btn-linkedin btn-sm fw-500"
                        aria-controls="Search"
                      >
                        {t('Search')}
                      </button>
                      <button
                        onClick={resetSearch}
                        type="button"
                        className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                        id={`IDResultDataReset`}
                      >
                        <span>
                          <span>{t('Reset')}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                  <TabPanel value={value} index={value}>
                    <ReqDataGrid
                      tabsInfo={data.gridHeaders[value]?.tabHeaders}
                      rowInfo={data.gridData && data?.gridData?.data?.data}
                      value={value}
                      setCurPage={setCurPage}
                      setTriggerSearchData={setTriggerSearchData}
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
              {filterData.tabId === 1
                ? t('Archive Record')
                : t('Unvalidate Record')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filterData.tabId === 1
              ? t('Are you sure you want to archive this record ?')
              : t('Are you sure you want to unvalidate this record?')}
          </Modal.Body>
          <Modal.Footer className="py-2">
            <button
              id={`IDResultDataModalCanselUnvalidate_Archive`}
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={ModalhandleClose1}
            >
              {t('Cancel')}
            </button>
            <button
              id={`IDResultDataModalUnvalidate_Archive`}
              type="button"
              className="btn btn-sm btn-danger"
              disabled={disabledButton}
              onClick={() =>
                filterData.tabId === 1
                  ? ArchiveResultData()
                  : UnvalidateResultData()
              }
            >
              {filterData.tabId === 1 ? t('Archive') : t('Unvalidate')}
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default React.memo(ResultData);
