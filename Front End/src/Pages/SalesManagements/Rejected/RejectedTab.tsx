import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Table } from 'react-bootstrap';

import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { salesRepRequestTable } from '../../../Services/Marketing/SalesRepRequestService';
import { Loader } from '../../../Shared/Common/Loader';
import useLang from 'Shared/hooks/useLanguage';
import usePagination from '../../../Shared/hooks/usePagination';
import { ArrowDown, ArrowUp } from '../../../Shared/Icons';
import { StringRecord } from '../../../Shared/Type';
import { sortById, SortingTypeI } from '../../../Utils/consts';
import Row from './Row';
import NoRecord from '../../../Shared/Common/NoRecord';
import useIsMobile from 'Shared/hooks/useIsMobile';

interface SearchRejectedRecords {
  fNameSearch: string;
  lNameSearch: string;
  positionSearch: string;
  salesRepNumberSearch: string;
  emailSearch: string;
  phoneSearch: string;
  address1Search: string;
  address2Search: string;
  citySearch: string;
  zipCodeSearch: string;
  actionBySearch: string;
  actionDateSearch: string;
}

const RejectedTab = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  /*~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~          ACTION BUTTON FUNCTION END
~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~~~~~~~~~~~~~~~~~~~*/

  // * LOADING STATE TO MANAGE LOADER / SET FALSE WHEN API LOADS
  const [loading, setLoading] = useState(true);

  // * Rejected GET ALL API DATA / Rejected Table/Tab Data
  const [rejectedTableData, setRejectedTableData] = useState<any[]>([]);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  // Search
  const [searchRejectedRecords, setSearchRejectedRecords] =
    useState<SearchRejectedRecords>({
      fNameSearch: '',
      lNameSearch: '',
      positionSearch: '',
      salesRepNumberSearch: '',
      emailSearch: '',
      phoneSearch: '',
      address1Search: '',
      address2Search: '',
      citySearch: '',
      zipCodeSearch: '',
      actionBySearch: '',
      actionDateSearch: '',
    });

  // * Pagination Hooks
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

  /*#########################----SORT STARTS------########################## */

  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const searchRef = useRef<any>(null);

  /////////////
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
    fetchRejectedTable();
  }, [sort]);
  /*#########################----SORT ENDS------########################## */

  const initialSearchQuery = {
    id: 0,
    userId: '',
    isApproved: false,
    isRejected: true,
    firstName: '',
    lastName: '',
    positionTitle: '',
    salesRepNumber: '',
    email: '',
    phoneNumber: '',
    address1: '',
    address2: '',
    city: '',
    zipCode: '',
    actionBy: '',
    actionDate: null,
  };

  const queryDisplayTagNames: StringRecord = {
    fNameSearch: 'First Name',
    lNameSearch: 'Last Name',
    positionSearch: 'Position Title',
    salesRepNumberSearch: 'Sales Rep No',
    emailSearch: 'Email',
    phoneSearch: 'Phone Number',
    actionBySearch: 'Rejected By',
    actionDateSearch: 'Rejected Date',
  };

  const fetchRejectedTable = async (
    queryModel = {},
    reset: boolean = false
  ) => {
    setLoading(true);
    try {
      const trimmedSearchRequest = Object.fromEntries(
        Object.entries(queryModel).map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ])
      );
      let obj = {
        pageNumber: curPage,
        pageSize: pageSize,
        queryModel: {
          ...initialSearchQuery,
          ...trimmedSearchRequest,
        },
        sortColumn: reset ? sortById.clickedIconData : sort.clickedIconData,
        sortDirection: reset ? sortById.sortingOrder : sort.sortingOrder,
      };
      const res = await salesRepRequestTable(obj);
      setRejectedTableData(res.data.result);

      // GETTING TOTAL NUMBER OF RECORDS FOR PAGINATION
      setTotal(res?.data?.total);
    } catch (error) {
      console.error('Error fetching pending table data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryModel = {
      ...initialSearchQuery,
      firstName: searchRejectedRecords.fNameSearch || '',
      lastName: searchRejectedRecords.lNameSearch || '',
      positionTitle: searchRejectedRecords.positionSearch || '',
      salesRepNumber: searchRejectedRecords.salesRepNumberSearch || '',
      email: searchRejectedRecords.emailSearch || '',
      phoneNumber: searchRejectedRecords.phoneSearch || '',
      address1: searchRejectedRecords.address1Search || '',
      address2: searchRejectedRecords.address2Search || '',
      city: searchRejectedRecords.citySearch || '',
      zipCode: searchRejectedRecords.zipCodeSearch || '',
      actionBy: searchRejectedRecords.actionBySearch || '',
      actionDate: searchRejectedRecords.actionDateSearch || null,
    };
    fetchRejectedTable(queryModel);
  }, [curPage, pageSize, triggerSearchData]);

  //  ? Handle search function
  const handleSearch = () => {
    // Parse the provided date using Moment.js
    const parsedDate = moment(
      searchRejectedRecords.actionDateSearch,
      'YYYY-MM-DD',
      true
    );

    // Check if the parsed date is valid
    const formattedDate = parsedDate.isValid()
      ? parsedDate.format('YYYY-MM-DD')
      : null;

    setCurPage(1);
    setTriggerSearchData(prev => !prev);
  };

  // ? Handle reset function
  const handleReset = () => {
    setSearchRejectedRecords({
      fNameSearch: '',
      lNameSearch: '',
      positionSearch: '',
      salesRepNumberSearch: '',
      emailSearch: '',
      phoneSearch: '',
      address1Search: '',
      address2Search: '',
      citySearch: '',
      zipCodeSearch: '',
      actionBySearch: '',
      actionDateSearch: '',
    });
    setCurPage(1);
    setPageSize(50);
    fetchRejectedTable(initialSearchQuery, true);
    setSorting(sortById);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRejectedRecords({
      ...searchRejectedRecords,
      [e.target.name]: e.target.value,
    });
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRejectedRecords(searchRejectedRecords => {
      return {
        ...searchRejectedRecords,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRejectedRecords)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRejectedRecords]);

  useEffect(() => {
    if (searchedTags.length === 0) handleReset();
  }, [searchedTags.length]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="d-flex gap-4 flex-wrap">
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
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="gap-2 mb-2 d-flex flex-wrap justify-content-between align-items-center col-12 responsive-flexed-actions mt-2">
          <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center p-0 ">
            <div className="d-flex align-items-center">
              <span className="fw-400 mr-3">{t('Records')}</span>
              <select
                className="form-select h-33px w-100px rounded-2 py-2"
                data-kt-select2="true"
                data-placeholder="Select option"
                data-dropdown-parent="#kt_menu_63b2e70320b73"
                data-allow-clear="true"
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-info btn-sm fw-500"
                aria-controls="Search"
                onClick={() => {
                  handleSearch();
                  setCurPage(1);
                }}
              >
                {t('Search')}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                id="kt_reset"
                onClick={handleReset}
              >
                <span>{t('Reset')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* <Box> */}
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 'auto !important',
              '& .MuiButtonBase-root': {
                textTransform: 'capitalize',
              },
              '& .Mui-selected': {
                background: '#fff',
                borderStartStartRadius: '8px',
                borderStartEndRadius: '8px',
                zIndex: 4,

                color: 'var(--bs-primary) !important',
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          ></TabList>
          <TabPanel value={value} style={{ padding: 0 }}>
            {/* TABLE */}
            <Box sx={{ height: 'auto', width: '100%' }}>
              <div className="table_bordered overflow-hidden">
                <TableContainer
                  sx={
                    
                    isMobile?
 
                    {}:
                    
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
                  component={Paper}
                  className="shadow-none"
                >
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                  >
                    <TableHead>
                      {/* Row of Searches */}
                      <TableRow className="h-40px">
                        <TableCell>
                          <input
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            value={searchRejectedRecords.fNameSearch}
                            onChange={handleInputChange}
                            name="fNameSearch"
                            placeholder={t('Search ...')}
                            type="text"
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            placeholder={t('Search ...')}
                            name="lNameSearch"
                            value={searchRejectedRecords.lNameSearch}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            placeholder={t('Search ...')}
                            name="positionSearch"
                            value={searchRejectedRecords.positionSearch}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            placeholder={t('Search ...')}
                            name="salesRepNumberSearch"
                            value={searchRejectedRecords.salesRepNumberSearch}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            placeholder={t('Search ...')}
                            name="emailSearch"
                            value={searchRejectedRecords.emailSearch}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            placeholder={t('Search ...')}
                            name="phoneSearch"
                            value={searchRejectedRecords.phoneSearch}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            placeholder={t('Search ...')}
                            name="actionBySearch"
                            value={searchRejectedRecords.actionBySearch}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="date"
                            name="actionDateSearch"
                            className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
                            value={searchRejectedRecords.actionDateSearch}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                      </TableRow>
                      {/* Row of Table Headings */}
                      <TableRow className="h-30px">
                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('firstName')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('First Name')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'firstName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'firstName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('lastName')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Last Name')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'lastName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'lastName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('positionTitle')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Position Title')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'positionTitle'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'positionTitle'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('salesRepNumber')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Sales Rep Number')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'salesRepNumber'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'salesRepNumber'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('email')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Email')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'email'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'email'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('phoneNumber')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Phone Number')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'phoneNumber'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'phoneNumber'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('actionBy')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Rejected By')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'actionBy'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'actionBy'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('actionDate')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Rejected Date')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'actionDate'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'actionDate'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={8}>
                          <Loader />
                        </TableCell>
                      ) : rejectedTableData.length ? (
                        rejectedTableData.map((item: any) => (
                          <Row key={item.id} userId={item.userId} item={item} />
                        ))
                      ) : (
                        <NoRecord />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </TabPanel>

          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          {/* ###############<-----PAGINATION START----->>############### */}
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
            <p className="pagination-total-record mb-0">
              <span>
                {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}{' '}
                {Math.min(pageSize * curPage, total)} {t('of Total')}
                <span> {total} </span> {t('entries')}
              </span>
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
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        </TabContext>
      </div>
    </>
  );
};

export default RejectedTab;
