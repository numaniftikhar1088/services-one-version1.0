import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import PermissionComponent from 'Shared/Common/Permissions/PermissionComponent';
import useLang from 'Shared/hooks/useLanguage';
import {
  CannedAndRejectionGetAll,
  deleteCannedAndRejectionRecords,
} from '../../../../Services/BloodLisSetting/BloodLisSetting';
import { Loader } from '../../../../Shared/Common/Loader';
import NoRecord from '../../../../Shared/Common/NoRecord';
import usePagination from '../../../../Shared/hooks/usePagination';
import { ArrowDown, ArrowUp } from '../../../../Shared/Icons';
import CustomPagination from '../../../../Shared/JsxPagination';
import { StringRecord } from '../../../../Shared/Type';
import { sortById, SortingTypeI } from '../../../Compendium/TestType';
import RejectionRow from './RejectionRow';
import useIsMobile from 'Shared/hooks/useIsMobile';

const RejectionReasons = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] =
    useState<boolean>(false);

  const queryDisplayTagNames: StringRecord = {
    displayName: 'Rejection Name',
    displayText: 'Rejection Reason',
  };

  const initialSearchQuery = {
    displayName: '',
    displayText: '',
    displayType: 'Rejection',
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);

  /*#########################----SORT STARTS------########################## */
  const [triggerSearchData, setTriggerSearchData] = useState<boolean>(false);
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

    getCannedCommentsRejectionRecords();
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

  /*##############################-----Get Api Start-----#################*/
  const getCannedCommentsRejectionRecords = async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      setIsAddButtonDisabled(true);

      const trimmedSearchRequest = Object.fromEntries(
        Object.entries(searchRequest).map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ])
      );

      let initialQueryModel = {
        pageNumber: curPage,
        pageSize: pageSize,
        sortColumn: sort.clickedIconData || 'Id',
        sortDirection: sort.sortingOrder || 'Desc',
        queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      };

      const res = await CannedAndRejectionGetAll(initialQueryModel);
      if (res) {
        setRows(res?.data?.data);
        setTotal(res?.data?.total);
      }
    } catch (error) {
      console.error(
        'An error occurred while fetching Blood Tests setup:',
        error
      );
    } finally {
      setIsLoading(false);
      setIsAddButtonDisabled(false);
    }
  };

  useEffect(() => {
    getCannedCommentsRejectionRecords();
  }, [curPage, pageSize, triggerSearchData]);

  const onInputChangeSearch = (e: any) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };

  /*##############################-----Delete Api Start-----##############################*/
  const handleDelete = async (id: number) => {
    try {
      await deleteCannedAndRejectionRecords(id);
      getCannedCommentsRejectionRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  /*##############################-----Delete Api End-----##############################*/
  function handleReset() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    getCannedCommentsRejectionRecords(true);
    setPageSize(50);
    setIsAddButtonDisabled(false);
  }

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest(searchRequest => {
      return {
        ...searchRequest,
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
    if (searchedTags.length === 0) handleReset();
  }, [searchedTags.length]);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map(tag =>
          tag === 'groupId' || tag === 'displayType' ? null : (
            <div
              className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
              onClick={() => handleTagRemoval(tag)}
            >
              <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
              <i className="bi bi-x"></i>
            </div>
          )
        )}
      </div>
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t('Records')}</span>
            <select
              id={`BloodLisSettingRejectionReasonrecords`}
              className="form-select w-100px h-33px rounded"
              data-allow-clear="true"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-kt-select2="true"
              data-placeholder={t('Select option')}
              value={pageSize}
              onChange={e => setPageSize(parseInt(e.target.value))}
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
              permissionIdentifier="AddRejectionReason"
            >
              <button
                id={`BloodLisSettingRejectionReasonAddNew`}
                className="btn btn-primary btn-sm btn-primary--icon px-7"
                disabled={isAddButtonDisabled}
                onClick={() => {
                  if (!isAddButtonDisabled) {
                    setRows((prevRows: any) => [
                      { rowStatus: true, ...initialSearchQuery },
                      ...prevRows,
                    ]);
                    setIsAddButtonDisabled(true);
                  }
                }}
              >
                <i className="fa" style={{ fontSize: 11 }}>
                  
                </i>
                <span style={{ fontSize: 11 }}>
                  {t('Add New Rejection Reason')}
                </span>
              </button>
            </PermissionComponent>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            id={`BloodLisSettingRejectionReasonSearch`}
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
            onClick={() => {
              setCurPage(1);
              setTriggerSearchData((prev: any) => !prev);
            }}
          >
            {t('Search')}
          </button>
          <button
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id={`BloodLisSettingRejectionReasonReset`}
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
                    <TableCell className="w-300px">
                      <input
                        id={`BloodLisSettingRejectionReasonDisplayName`}
                        type="text"
                        name="displayName"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t('Search ....')}
                        value={searchRequest.displayName}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`BloodLisSettingRejectionReasonDisplayText`}
                        type="text"
                        name="displayText"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t('Search ....')}
                        value={searchRequest.displayText}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell>{t('Actions')}</TableCell>
                    <TableCell>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort('displayName')}
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Rejection Name')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'displayName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'displayName'
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
                        onClick={() => handleSort('displayText')}
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Rejection Reason')}
                        </div>
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'displayText'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'displayText'
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
                  {isLoading ? (
                    <TableCell colSpan={5}>
                      {' '}
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows.map((row: any, index: number) => (
                      <RejectionRow
                        row={row}
                        key={row.id}
                        index={index}
                        rows={rows}
                        onDelete={handleDelete}
                        setRows={setRows}
                        setIsAddButtonDisabled={setIsAddButtonDisabled}
                        getCannedCommentsRejectionRecords={
                          getCannedCommentsRejectionRecords
                        }
                      />
                    ))
                  ) : (
                    <NoRecord colSpan={3} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

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
    </>
  );
};

export default RejectionReasons;
