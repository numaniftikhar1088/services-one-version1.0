import { MenuItem, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { savePdfUrls } from '../../../../Redux/Actions/Index';
import RequisitionType from '../../../../Services/Requisition/RequisitionTypeService';
import ArrowBottomIcon from '../../../../Shared/SVG/ArrowBottomIcon';
import { InputChangeEvent, StringRecord } from '../../../../Shared/Type';
import { IDBatchQCTabsArr } from '../../../../Utils/Common';
import BreadCrumbs from '../../../../Utils/Common/Breadcrumb';
import { AutocompleteStyle } from '../../../../Utils/MuiStyles/AutocompleteStyles';
import {
  StyledDropButton,
  StyledDropMenu,
} from '../../../../Utils/Style/Dropdownstyle';
import { SortingTypeI } from '../../../../Utils/consts';
import IDBatchQCGrid from './IDBatchQCGrid';
import useLang from 'Shared/hooks/useLanguage';
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
export interface IRows {
  id: number;
  testName: string;
  testDisplayName: string;
  testCode: string;
  referenceLabId: number;
  referenceLabName: string;
  createDate: string;
  rowStatus: boolean | undefined;
}

const initialSorting = {
  clickedIconData: 'fileId',
  sortingOrder: 'desc',
};

const IDBatchQC = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(initialSorting);
  //============================================================================================
  //====================================  PAGINATION START Pending Tabs  =====================================
  //============================================================================================
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1);
    }
  };
  const showPage = (i: number) => {
    setCurPage(i);
  };

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
    const pgNumbers = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i);
      }
    }
    setPageNumbers(pgNumbers);
  }, [total, curPage, pageSize, totalPages]);

  useEffect(() => {
    loadData(value, false);
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const [idBatchQCList, setIdBatchQCList] = useState<any>([]);
  const [AllrequisitionList, setAllRequisitionList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [currentid, setCurrentid] = useState([]);
  const handleClose = () => setShow(false);

  const initialSearchQuery = {
    fileName: '',
    panelName: '',
    createdBy: '',
    createdDate: '',
  };
  const queryDisplayTagNames: StringRecord = {
    fileName: 'Batch ID',
    panelName: 'Test Type',
    createdBy: 'Created By',
    createdDate: 'Created Date',
  };
  let [searchRequest, setSearchRequest] = useState<any>(initialSearchQuery);
  const [dropDownValues, setDropDownValues] = useState({
    PerformingLabList: [],
    AssayDataList: [],
  });
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    searchRequest = {
      fileName: '',
      panelName: '',
      createdBy: '',
      createdDate: '',
    };
    setSearchRequest({
      fileName: '',
      panelName: '',
      createdBy: '',
      createdDate: '',
    });
    setSorting(initialSorting);
    loadData(value, false, initialSorting);
  }
  // const loadData = (reset: boolean) => {
  //   setLoading(true);

  //   const nullObj = {
  //     statusId: 1,
  //   };
  //   // setLoading(true)
  //   RequisitionType.getResultData({
  //     pageNumber: curPage,
  //     pageSize: pageSize,
  //     queryModel: reset ? nullObj : { ...searchRequest, statusId: 1 },
  //     sortColumn: filterData?.sortColumn,
  //     sortDirection: filterData?.sortDirection,
  //   }).then((res: AxiosResponse) => {
  //
  //     setResultDataList(res?.data?.data);
  //     setTotal(res.data.total);
  //     setLoading(false);
  //   });
  // };

  useEffect(() => {
    loadData(value, false);
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSearchRequest(initialSearchQuery);
  };
  const nullobj = {
    fileName: '',
    panelName: '',
    createdBy: '',
    createdDate: '',
  };
  let getIDBatchQCRequest: any = {
    pageNumber: curPage,
    pageSize: pageSize,
    queryModel: searchRequest,
  };
  const loadData = (key: number, reset: boolean, sortingState?: any) => {
    setLoading(true);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );

    getIDBatchQCRequest = {
      ...getIDBatchQCRequest,
      queryModel: reset
        ? nullobj
        : {
            ...trimmedSearchRequest,
            isArchived: IDBatchQCTabsArr[key]?.value,
            // isApproved: key == 1 ? true : key == 2 ? false : null,
          },
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    };
    RequisitionType.getIDBatchQC(getIDBatchQCRequest).then(
      (res: AxiosResponse) => {
        setIdBatchQCList(res?.data?.data);
        setSearchRequest((preVal: any) => {
          return {
            ...preVal,
            isArchived: IDBatchQCTabsArr[key]?.value,
          };
        });
        setTotal(res?.data?.total);
        setValue(key);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    loadData(value, false);
  }, []);
  // *********************** sorting ***************************************
  const searchRef = useRef<any>(null);

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === 'asc'
        ? (searchRef.current.id = 'desc')
        : (searchRef.current.id = 'asc')
      : (searchRef.current.id = 'asc');

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  useEffect(() => {
    loadData(value, false);
  }, [sort]);

  // *********************** sorting ***************************************

  // const { isLoading, data, refetch } = useQuery(
  //   'result-data-pending',
  //   () => loadData(false),
  //   {
  //     enabled: false,
  //   },
  // )

  const [selectedBox, setSelectedBox] = useState<any>({
    fileId: [],
  });

  const handleAllSelect = (checked: boolean, List: any) => {
    let selectedItems: any = [];

    if (checked) {
      selectedItems = List.map((item: any) => ({
        fileId: item?.fileId,
      }));
    }

    setSelectedBox((prev: any) => ({
      ...prev,
      fileId: selectedItems,
    }));
  };

  const handleSelectedResultDataIds = (checked: boolean, item: any) => {
    const { fileId } = item; // Destructure id and accessionNumber from item

    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          fileId: [...pre.fileId, { fileId }], // Add an object with id and accessionNumber
        };
      });
    } else {
      setSelectedBox((prev: any) => ({
        ...prev,
        fileId: prev.fileId.filter(
          (selectedItem: any) => selectedItem.fileId !== item.fileId
        ),
      }));
    }
  };
  const ArchiveResultData = () => {
    const selectedIds = selectedBox.fileId.map((item: any) => item.fileId); // Extract only the IDs from the selectedBox array

    RequisitionType.IDBatchQCArchive(selectedIds)
      .then((res: any) => {
        if (res.status === 200) {
          setSelectedBox((prevState: any) => {
            return {
              ...prevState,
              fileId: [], // Clear the array by setting it to an empty array
            };
          });
          loadData(value, false);
          ModalhandleClose1();
          setShow1(false);
          toast.success(t('Request Succesfully Processed'));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err, 'bulk request failure');
      });
  };

  const RestoreQCBatchSetup = () => {
    if (selectedBox.fileId.length === 0) {
      toast.error(t('Please select atleast one record'));
    } else {
      const selectedIds = selectedBox.fileId.map((item: any) => item.fileId); // Extract only the IDs from the selectedBox array
      RequisitionType.RestoreQCBatchSetup(selectedIds)
        .then((res: any) => {
          if (res.status === 200) {
            setSelectedBox((prevState: any) => {
              return {
                ...prevState,
                fileId: [], // Clear the array by setting it to an empty array
              };
            });
            loadData(value, false);
            ModalhandleClose1();
            setShow1(false);
            handleClose1('dropdown1');
            toast.success(t('Request Succesfully Processed'));
          }
        })
        .catch((err: AxiosError) => {
          console.log(err, 'bulk request failure');
        });
    }
  };
  const dispatch = useDispatch();
  const [isPreviewing, setIsPreviewing] = useState(false);
  const IDLISReportView = (id: number) => {
    setIsPreviewing(true);
    RequisitionType.GetReportAsync(id)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));

          setIsPreviewing(false);
          dispatch(savePdfUrls(res?.data?.data));
          window.open('/docs-viewer', '_blank', 'noreferrer');
        }
        if (res?.data.statusCode === 400) {
          toast.error(t(res?.data?.message));
          setIsPreviewing(false);
          // loadData()
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const [isSubmitting, setisSubmitting] = useState(false);

  const [show1, setShow1] = useState(false);

  const ModalhandleClose1 = () => setShow1(false);
  const handleClickOpen = (ids: any) => {
    if (selectedBox.fileId.length === 0) {
      toast.error(t('Please select atleast one record'));
    } else {
      setShow1(true);
      handleClose1('dropdown1');
    }
  };
  // *********** All Dropdown Function Show Hide ***********
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

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose1 = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  // *********** All Dropdown Function END ***********
  useEffect(() => {
    loadData(value, false);
  }, []);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    // debugger;
    if (searchedTags.includes('isArchived') && searchedTags.length === 2) {
      resetSearch();
    }
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      // if(key === "isArchived") return;
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-toolbar py-3 py-lg-6">
          <div className="container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
          </div>
        </div>
        <div>
          <Modal
            show={show1}
            onHide={ModalhandleClose1}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="py-4">
              <Modal.Title className="h5">{t('Archive Record')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {t('Are you sure you want to archive this record ?')}
            </Modal.Body>
            <Modal.Footer className="py-2">
              <button
                id={`IdBatchQcArchiveButtonCancel`}
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={ModalhandleClose1}
              >
                {t('Cancel')}
              </button>
              <button
                id={`IdBatchQcArchiveButton`}
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => ArchiveResultData()}
              >
                {t('Archive')}
              </button>
            </Modal.Footer>
          </Modal>
          <div className="app-content flex-column-fluid">
            <div className="app-container container-fluid">
              <Box sx={{ height: 'auto', width: '100%' }}>
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
                  {IDBatchQCTabsArr.map((items: any) => (
                    <TabSelected
                      data-test-id={items?.label?.replace(/\s/g, '')}
                      label={t(items.label)}
                      {...a11yProps(items.value)}
                      className="fw-bold text-capitalize"
                      //   disabled={loading}
                    />
                  ))}
                </Tabs>
                <div className="card rounded-top-0 shadow-none">
                  <div className="card-body py-2">
                    <TabPanel value={value} index={value}>
                      <div className="d-flex gap-4 flex-wrap mb-1">
                        {searchedTags.map(tag =>
                          tag === 'isArchived' ? null : (
                            <div
                              className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                              onClick={() => handleTagRemoval(tag)}
                            >
                              <span className="fw-bold">
                                {t(queryDisplayTagNames[tag])}
                              </span>
                              <i className="bi bi-x"></i>
                            </div>
                          )
                        )}
                      </div>
                      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
                        <div className="d-flex gap-2 responsive-flexed-actions">
                          <div className="d-flex align-items-center">
                            <span className="fw-400 mr-3">{t('Record')}</span>
                            <select
                              id={`IdBatchQcRecords`}
                              className="form-select w-125px h-33px rounded"
                              data-kt-select2="true"
                              data-placeholder="Select option"
                              data-dropdown-parent="#kt_menu_63b2e70320b73"
                              data-allow-clear="true"
                              onChange={e => {
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
                          <div className="d-flex gap-2 gap-lg-3 justify-content-center">
                            <StyledDropButton
                              id={`IdBatchQcBulkActionButton`}
                              aria-controls={
                                openDrop ? 'demo-positioned-menu1' : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? 'true' : undefined}
                              onClick={event => handleClick(event, 'dropdown1')}
                              className="btn btn-info btn-sm"
                            >
                              {t('Bulk Action')}
                              <span className="svg-icon svg-icon-5 m-0">
                                <ArrowBottomIcon />
                              </span>
                            </StyledDropButton>
                            {value == 0 ? (
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
                                <MenuItem className="p-0">
                                  <a
                                    id={`IdBatchQcBulkArchive`}
                                    className=" w-auto p-0 w-100 text-dark"
                                    onClick={handleClickOpen}
                                  >
                                    {t('Archive')}
                                  </a>
                                </MenuItem>
                              </StyledDropMenu>
                            ) : (
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
                                <MenuItem className="p-0">
                                  <a
                                    id={`IdBatchQcBulkRestore`}
                                    className=" w-200px p-0 text-dark"
                                    onClick={RestoreQCBatchSetup}
                                  >
                                    {t('Restore')}
                                  </a>
                                </MenuItem>
                              </StyledDropMenu>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                          <button
                            id={`IdBatchQcSearch`}
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
                            id={`IdBatchQcReset`}
                          >
                            <span>
                              <span>{t('Reset')}</span>
                            </span>
                          </button>
                        </div>
                      </div>

                      <IDBatchQCGrid
                        searchRequest={searchRequest}
                        loading={loading}
                        onInputChangeSearch={onInputChangeSearch}
                        resultDataList={idBatchQCList}
                        handleAllSelect={handleAllSelect}
                        selectedBox={selectedBox}
                        handleSelectedResultDataIds={
                          handleSelectedResultDataIds
                        }
                        IDLISReportView={IDLISReportView}
                        isSubmitting={isSubmitting}
                        isPreviewing={isPreviewing}
                        setSearchRequest={setSearchRequest}
                        handleKeyPress={handleKeyPress}
                        handleSort={handleSort}
                        searchRef={searchRef}
                        sort={sort}
                        value={value}
                      />

                      {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
                      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
                        {/* =============== */}
                        <p className="pagination-total-record mb-0">
                          {Math.min(pageSize * curPage, total) === 0 ? (
                            <span>
                              {t('Showing 0 to 0 of')} {total} {t('entries')}
                            </span>
                          ) : (
                            <span>
                              {t('Showing')} {pageSize * (curPage - 1) + 1}{' '}
                              {t('to')} {Math.min(pageSize * curPage, total)}{' '}
                              {t('of Total')} <span> {total} </span>{' '}
                              {t('entries')}{' '}
                            </span>
                          )}
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

                          {pageNumbers.map(page => (
                            <li
                              key={page}
                              className={`px-2 ${
                                page === curPage
                                  ? 'font-weight-bold bg-primary text-white h-33px'
                                  : ''
                              }`}
                              style={{ cursor: 'pointer' }}
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
                      {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
                    </TabPanel>
                  </div>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default IDBatchQC;
