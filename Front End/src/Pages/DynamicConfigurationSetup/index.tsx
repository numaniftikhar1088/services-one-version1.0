import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useLang from 'Shared/hooks/useLanguage';
import { UserType } from 'Utils/Common/Enums/Enums';
import RequisitionType from '../../Services/Requisition/RequisitionTypeService';
import { Loader } from '../../Shared/Common/Loader';
import NoRecord from '../../Shared/Common/NoRecord';
import { StringRecord } from '../../Shared/Type';
import BreadCrumbs from '../../Utils/Common/Breadcrumb';
import CustomPagination from './../../Shared/JsxPagination/index';
import Row from './Row';
import useIsMobile from 'Shared/hooks/useIsMobile';

export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>(() => []);
  const [request, setRequest] = useState(false);
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
  useEffect(() => {
    loadGridData(true, true);
  }, []);
  const handleChange = (value: any, name: any, id: any) => {
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

  let intialSearchQuery = {
    id: 0,
    configIdentifier: '',
    configurationValues: '',
  };
  const queryDisplayTagNames: StringRecord = {
    configIdentifier: 'Identifier',
    configurationValues: 'Values',
  };

  let [searchRequest, setSearchRequest] = useState(intialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    setSearchRequest({
      id: 0,
      configIdentifier: '',
      configurationValues: '',
    });
    loadGridData(true, true);
  }

  const userType = useSelector(
    (reducers: any) =>
      reducers.Reducer.selectedTenantInfo.infomationOfLoggedUser.userType
  );

  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (loader: boolean, reset: boolean) => {
    if (loader) {
      setLoading(true);
    }

    const nullObj = {
      id: 0,
      configIdentifier: '',
      configurationValues: '',
    };

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );

    RequisitionType.LoadDataDynamicConfiguration({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : trimmedSearchRequest,
    })
      .then((res: AxiosResponse) => {
        console.log(res, 'Dynamic Config');
        setTotal(res?.data?.total);

        if (UserType.Master != userType) {
          const filteredValue = res?.data?.data.filter(
            (data: any) => data.configIdentifierType !== 'System'
          );
          setRows(filteredValue);
          setTotal(filteredValue.length);
        } else {
          setRows(res?.data?.data);
        }

        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };
  ////////////-----------------Save a Row-------------------///////////////////
  const handleSubmit = (row: any) => {
    setRequest(true);
    const queryModel = {
      id: row.id,
      configIdentifier: row?.configIdentifier,
      configurationValues: row?.configurationValues,
    };
    RequisitionType.UpdateDynamicConfiguration(queryModel)
      .then((res: AxiosResponse) => {
        console.log(res, 'response dunamic');
        if (res?.data.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(true, false);
          setRequest(false);
        } else {
          toast.error(t(res?.data?.message));
          setRequest(false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      })
      .finally(() => {
        setRequest(false);
      });
  };
  // *********** All Dropdown Function END ***********
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
        [clickedTag]: (intialSearchQuery as any)[clickedTag],
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
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid py-5">
          <div className="mb-5">
            <BreadCrumbs />
          </div>
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-body py-2">
              <div className="d-flex gap-4 flex-wrap">
                {searchedTags.map(tag => (
                  <div
                    className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                    onClick={() => handleTagRemoval(tag)}
                  >
                    <span className="fw-bold">
                      {t(queryDisplayTagNames[tag])}
                    </span>
                    <i className="bi bi-x"></i>
                  </div>
                ))}
              </div>
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
                <div className="d-flex gap-2 responsive-flexed-actions">
                  <div className="d-flex align-items-center">
                    <span className="fw-400 mr-3">{t('Records')}</span>
                    <select
                      id={`DynamicConfigurationRecords`}
                      className="form-select w-125px rounded fs-8 h-33px"
                      data-kt-select2="true"
                      data-placeholder={t('Select option')}
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
                </div>
                <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <Link
                      id={`DynamicConfigurationCancel`}
                      to="/MyFavorites"
                      className="btn btn-sm fw-bold btn-cancel"
                    >
                      {t('Cancel')}
                    </Link>
                    <button
                      id={`DynamicConfigurationSearch`}
                      onClick={() => {
                        setCurPage(1);
                        setTriggerSearchData(prev => !prev);
                      }}
                      className="btn btn-info btn-sm fw-500"
                      aria-controls="Search"
                    >
                      {t('Search')}
                    </button>
                    <button
                      onClick={resetSearch}
                      type="button"
                      className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                      id={`DynamicConfigurationReset`}
                    >
                      <span>
                        <span>{t('Reset')}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <Box sx={{ height: 'auto', width: '100%' }}>
                <div className="table_bordered overflow-hidden">
                  <TableContainer
                    sx={
                      
                      isMobile
                        ? {
                            overflowY: 'hidden',
                          }
                        :
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
                          <TableCell>
                            <input
                              id={`DynamicConfigurationConfigIdentifire`}
                              type="text"
                              name="configIdentifier"
                              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                              placeholder={t('Search ...')}
                              value={searchRequest.configIdentifier}
                              onChange={onInputChangeSearch}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell> </TableCell>
                        </TableRow>

                        <TableRow className="h-30px">
                          <TableCell className="min-w-20px w-20px text-center">
                            {t('Actions')}
                          </TableCell>
                          <TableCell
                            sx={{ width: 'max-content' }}
                            className="min-w-200px w-200px"
                          >
                            {t('Configuration Identifier')}
                          </TableCell>
                          <TableCell
                            // sx={{ width: "max-content" }}
                            className="min-w-375px"
                          >
                            {t('Configuration Value')}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={13}>
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
                                handleChange={handleChange}
                                handleSubmit={handleSubmit}
                                loadGridData={loadGridData}
                                request={request}
                                setRequest={setRequest}
                              />
                            );
                          })
                        ) : (
                          <NoRecord colSpan={3} />
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Box>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
