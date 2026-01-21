import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import useLang from 'Shared/hooks/useLanguage';
import { sortById, SortingTypeI } from 'Utils/consts';
import usePagination from 'Shared/hooks/usePagination';
import PermissionComponent from 'Shared/Common/Permissions/PermissionComponent';
import { ArrowDown, ArrowUp } from 'Shared/Icons';
import { Loader } from 'Shared/Common/Loader';
import TubeTypeRow from './row';
import { TubeTypeGetAll } from 'Services/BloodLisSetting/BloodLisSetting';
import  useIsMobile  from 'Shared/hooks/useIsMobile';

const TubeTypeIndex = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [apiGetData, setApiGetData] = useState<any[]>([]);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  const initialPostData = {
    id: 0,
    tubeTypeName: '',
    status: true,
  };
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

    showApiData();
  };
  /*#########################----SORT ENDS------########################## */
  /*##############################-----PAGINATION Start-----#################*/
  const {
    total,
    curPage,
    showPage,
    nextPage,
    prevPage,
    setTotal,
    pageSize,
    totalPages,
    pageNumbers,
    setPageSize,
    setCurPage,
  } = usePagination();

  /*##############################-----PAGINATION End-----#################*/
  const [reset, setReset] = useState(false);

  /*#########################----Search Function Start------########################## */

  const initialSearchCriteria = {
    tubeType: '',
  };
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  /*#########################----Search Function End------########################## */

  /*##############################-----Get Api Start-----#################*/
  let obj = {
    pageNumber: curPage,
    pageSize: pageSize,
    queryModel: {
      tubeTypeName: (searchCriteria.tubeType || '').trim(),
    },
    sortColumn: sort.clickedIconData || 'Id',
    sortDirection: sort.sortingOrder || 'Desc',
  };
  const showApiData = async () => {
    setLoading(true);
    try {
      let resp = await TubeTypeGetAll(obj);
      setApiGetData(resp?.data?.data);
      setTotal(resp?.data?.total);
    } catch (error) {
      console.error(t('Error fetching sales table data:'), error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    showApiData();
  }, [curPage, pageSize, triggerSearchData]);

  /*##############################-----HandleChangeSwitch for Status Active/Inactivet-----#################*/

  const handleChangeSwitch = (e: any, id: any) => {
    setApiGetData((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              status: e.target.checked,
            }
          : x
      )
    );
  };

  const handleReset = async () => {
    setSearchCriteria(initialSearchCriteria);
    setReset(!reset);
    setSorting(sortById);
  };

  const handleSearch = () => {
    setCurPage(1);
    setTriggerSearchData(prev => !prev);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    showApiData();
  }, [reset]);

  useEffect(() => {
    return () => setIsBtnDisabled(false);
  }, []);
  return (
    <>
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-2">{t('Records')}</span>
            <select
              id={`BloodLisTubeTypeRecords`}
              className="form-select w-100px h-33px rounded py-2"
              data-allow-clear="true"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-kt-select2="true"
              data-placeholder="Select option"
              value={pageSize}
              onChange={e => {
                setPageSize(parseInt(e.target.value));
                setCurPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <PermissionComponent
              moduleName="Blood LIS"
              pageName="LIS Setting"
              permissionIdentifier="AddTubeType"
            >
              <button
                id={`BloodLisTubeTypeAddNew`}
                className="btn btn-primary btn-sm btn-primary--icon px-7"
                onClick={() => {
                  if (!isBtnDisabled) {
                    setApiGetData((prevRows: any) => [
                      { rowStatus: true, ...initialPostData },
                      ...prevRows,
                    ]);
                    setIsBtnDisabled(true);
                  }
                }}
              >
                <i className="fa-solid fa-plus"></i>
                <span style={{ fontSize: 11 }}>{t('Add New Tube Type')}</span>
              </button>
            </PermissionComponent>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            id={`BloodLisTubeTypeSearch`}
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
            onClick={handleSearch}
          >
            {t('Search')}
          </button>
          <button
            id={`BloodLisTubeTypeReset`}
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            type="button"
            onClick={handleReset}
          >
            <span>{t('Reset')}</span>
          </button>
        </div>
      </div>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                
                  isMobile ?  {} :
                
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
                  <TableRow className="h-40px">
                    <TableCell className="w-50px"></TableCell>
                    <TableCell
                      style={{
                        width: 'max-content',
                        minWidth: '200px',
                      }}
                    >
                      <input
                        id={`BloodLisTubeTypeTitlesearch`}
                        type="text"
                        name="tubeType"
                        className="form-control bg-white min-w-150px w-100 rounded-2 fs-8 h-30px"
                        placeholder="Search ...."
                        value={searchCriteria.tubeType}
                        onKeyDown={handleKeyPress}
                        onChange={e =>
                          setSearchCriteria({
                            ...searchCriteria,
                            tubeType: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell>{t('Actions')}</TableCell>
                    <TableCell
                      style={{
                        width: 'max-content',
                        minWidth: '200px',
                      }}
                    >
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort('tubeType')}
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Tube Type Name')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'tubeType'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'tubeType'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: 'max-content' }}>
                          {t('Status')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableCell colSpan={5}>
                      <Loader />
                    </TableCell>
                  ) : apiGetData.length ? (
                    apiGetData.map((row: any, index: number) => (
                      <TubeTypeRow
                        row={row}
                        key={row.id}
                        index={index}
                        apiGetData={apiGetData}
                        showApiData={showApiData}
                        setApiGetData={setApiGetData}
                        setIsBtnDisabled={setIsBtnDisabled}
                        handleChangeSwitch={handleChangeSwitch}
                      />
                    ))
                  ) : // <NoRecord colSpan={3} />
                  null}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
        <p className="pagination-total-record mb-0">
          <span>
            {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}{' '}
            {Math.min(pageSize * curPage, total)} {t('of Total')}
            <span> {total} </span> {t('entries')}
          </span>
        </p>
        <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
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
    </>
  );
};

export default TubeTypeIndex;
