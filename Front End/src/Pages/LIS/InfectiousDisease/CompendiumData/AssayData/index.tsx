import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import AssayDataService from '../../../../../Services/InfectiousDisease/AssayDataService';
import { Loader } from '../../../../../Shared/Common/Loader';
import NoRecord from '../../../../../Shared/Common/NoRecord';
import PermissionComponent from '../../../../../Shared/Common/Permissions/PermissionComponent';
import { ArrowDown, ArrowUp } from '../../../../../Shared/Icons';
import { StringRecord } from '../../../../../Shared/Type';
import { SortingTypeI, sortById } from '../../../../../Utils/consts';
import Row, { ITableObj } from './Row';
import useLang from 'Shared/hooks/useLanguage';
import PanelMappingService from 'Services/InfectiousDisease/PanelMappingService';
import useIsMobile from 'Shared/hooks/useIsMobile';

interface IReferenceLab {
  referenceLabId: number;
  referenceLabName: string;
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

export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  //============================================================================================
  //====================================  PAGINATION START =====================================
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
    loadGridData(true, false);
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const [dropDownValues, setDropDownValues] = useState({
    ReferenceLabsList: [],
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IRows[]>(() => []);

  useEffect(() => {
    loadData();
    loadGridData(true, true);
  }, []);

  const handleChange = (name: string, value: string, id: number) => {
    setRows(curr =>
      curr.map(x =>
        x.id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };
  ////////////-----------------Section For Searching-------------------///////////////////

  const initialSearchQuery = {
    testName: '',
    testDisplayName: '',
    testCode: '',
    referenceLabName: '',
  };
  const queryDisplayTagNames: StringRecord = {
    testName: 'Assay Name',
    testDisplayName: 'Display Name',
    testCode: 'Test Code',
    referenceLabName: 'Performing Lab',
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    searchRequest = {
      testName: '',
      testDisplayName: '',
      testCode: '',
      referenceLabName: '',
    };
    setSearchRequest({
      testName: '',
      testDisplayName: '',
      testCode: '',
      referenceLabName: '',
    });
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }
  ////////////-----------------Section For Searching-------------------///////////////////

  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  const loadData = () => {
    PanelMappingService.PerformingLabLookup()
      .then((res: AxiosResponse) => {
        // let ReferenceLabsArray: any = [];

        // res?.data?.data?.forEach((val: IReferenceLab) => {
        //   let ReferenceLabsDetails = {
        //     value: val?.referenceLabId,
        //     label: val?.referenceLabName,
        //   };
        //   ReferenceLabsArray.push(ReferenceLabsDetails);
        // });
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            ReferenceLabsList: res?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    setIsAddButtonDisabled(false);
    const nullObj = {
      testName: '',
      testDisplayName: '',
      testCode: '',
      referenceLabName: '',
    };
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    AssayDataService.getAssayData({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.totalRecord);

        setRows(res?.data?.result);
        setLoading(false);
        // setIsAddButtonDisabled(false)
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };
  ////////////-----------------Get All Data-------------------//////////////////

  ////////////-----------------Save a Row-------------------///////////////////
  const handleSubmit = (row: ITableObj) => {
    if (
      row?.testName != '' &&
      row?.referenceLabId != 0 &&
      row?.testDisplayName != '' &&
      row?.testCode != ''
    ) {
      const queryModel = {
        id: row.id,
        testName: row.testName,
        referenceLabId: row.referenceLabId,
        testDisplayName: row?.testDisplayName,
        testCode: row?.testCode,
      };
      AssayDataService.createOrUpdateAssayData(queryModel)
        .then((res: AxiosResponse) => {
          if (res?.data.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            loadGridData(true, false);
            setIsAddButtonDisabled(false);
          } else {
            toast.error(t(res?.data?.message));
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    } else {
      toast.error(t('Please Enter The Required Fields'));
      // setRequest(false)
    }
  };
  ////////////-----------------Save a Row-------------------///////////////////

  ////////////-----------------Update a Row-------------------///////////////////
  const updateRow = (row: any) => {
    const queryModel = {
      id: row?.id,
      testName: row?.testName,
      referenceLabId: row.referenceLabId,
      testDisplayName: row?.testDisplayName,
      testCode: row?.testCode,
    };
    AssayDataService.createOrUpdateAssayData(queryModel)
      .then((res: AxiosResponse) => {
        if (res?.data.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(false, false);
        }
      })
      .catch((err: AxiosError) => {
        console.trace(err);
      });
  };
  ////////////-----------------Updata a Row-------------------///////////////////

  ////////////-----------------Delete a Row-------------------///////////////////
  const deleteRow = (id: number) => {
    // TestSetUpService?.deleteRecord(id)
    //   .then((res: AxiosResponse) => {
    //
    //     if (res?.data?.status === 200) {
    //       toast.success(res?.data?.title);
    //       loadGridData(false);
    //     }
    //   })
    //   .catch((err: AxiosError) => {
    //
    //   });
  };
  ////////////-----------------Delete a Row-------------------///////////////////
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);

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
    loadGridData(true, false);
  }, [sort]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest(prevSearchRequest => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
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
      <div className="d-flex gap-4 flex-wrap pb-1">
        {searchedTags.map(tag => (
          <div
            className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
            onClick={() => handleTagRemoval(tag)}
          >
            <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
            <i className="bi bi-x"></i>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t('Records')}</span>
            <select
              id={`IDCompendiumDataAssayDataRecords`}
              className="form-select w-sm-125px w-90px h-33px rounded"
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
          <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
            <div className="mt-0">
              <PermissionComponent
                moduleName="ID LIS"
                pageName="Compendium Data"
                permissionIdentifier="AddNew"
              >
                <Button
                  id={`IDCompendiumDataAssayDataAddRow`}
                  onClick={() => {
                    if (!isAddButtonDisabled) {
                      setRows((prevRows: any) => [
                        //createData("", "", "", "--select", "", "", "--select", "", true),
                        {
                          id: 0,
                          testName: '',
                          testDisplayName: '',
                          testCode: '',
                          referenceLabId: 0,
                          referenceLabName: '',
                          rowStatus: true,
                        },
                        ...prevRows,
                      ]);
                      setIsAddButtonDisabled(true);
                    }
                  }}
                  variant="contained"
                  color="success"
                  className="btn btn-primary btn-sm text-capitalize fw-400"
                  disabled={loading}
                  sx={{
                    '&.Mui-disabled': {
                      opacity: '0.65',
                      backgroundColor: '#69A54B',
                      color: 'white',
                    },
                  }}
                >
                  <i className="bi bi-plus-lg"></i>
                  {t('Add New')}
                </Button>
              </PermissionComponent>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <button
            id={`IDCompendiumDataAssayDataSearch`}
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
            id={`IDCompendiumDataAssayDataReset`}
          >
            <span>
              <span>{t('Reset')}</span>
            </span>
          </button>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                
                isMobile ?{}:
                {
                maxHeight: 'calc(100vh - 100px)',
                '&::-webkit-scrollbar': {
                  width: 7,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#fff',
                },
                '&:hover': {
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--kt-gray-400)',
                    borderRadius: 2,
                  },
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'var(--kt-gray-400)',
                  borderRadius: 2,
                },
              }}
              // component={Paper}
              className="shadow-none"
              // sx={{ maxHeight: 'calc(100vh - 100px)' }}
            >
              <Table
                // stickyHeader
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataAssayDataTestName`}
                        type="text"
                        autoComplete="off"
                        name="testName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.testName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataAssayDataTestDisplayName`}
                        type="text"
                        autoComplete="off"
                        name="testDisplayName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.testDisplayName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataAssayDataTestCode`}
                        type="text"
                        autoComplete="off"
                        name="testCode"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.testCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataAssayDataReferenceLabName`}
                        type="text"
                        autoComplete="off"
                        name="referenceLabName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.referenceLabName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell className="w-20px min-w-20px" />
                    <TableCell className="min-w-50">{t('Actions')}</TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('testName')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Assay Name')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'testName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'testName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('testDisplayName')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Display Name')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'testDisplayName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'testDisplayName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('testCode')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Test Code')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'testCode'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'testCode'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('referenceLabName')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Performing Lab')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'referenceLabName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'referenceLabName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={6} className="">
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows.map((item: any, index) => {
                      return (
                        <Row
                          row={item}
                          index={index}
                          rows={rows}
                          setRows={setRows}
                          dropDownValues={dropDownValues}
                          handleChange={handleChange}
                          updateRow={updateRow}
                          handleDelete={deleteRow}
                          handleSubmit={handleSubmit}
                          loadGridData={loadGridData}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                        />
                      );
                    })
                  ) : (
                    <NoRecord colSpan={6} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
      <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
        <p className="pagination-total-record mb-0">
          {Math.min(pageSize * curPage, total) === 0 ? (
            <span>
              {t('Showing 0 to 0 of')} {total} {t('entries')}
            </span>
          ) : (
            <span>
              {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}
              {Math.min(pageSize * curPage, total)} {t('of Tota')}l
              <span> {total} </span> {t('entries')}
            </span>
          )}
        </p>
        <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
          <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
            <i className="fa fa-angle-double-left"></i>
          </li>
          <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
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

          <li className="btn btn-lg p-2 h-33px" onClick={nextPage}>
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
    </>
  );
}
