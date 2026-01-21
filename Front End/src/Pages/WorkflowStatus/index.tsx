import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import RequisitionType from '../../Services/Requisition/RequisitionTypeService';
import { Loader } from '../../Shared/Common/Loader';
import NoRecord from '../../Shared/Common/NoRecord';
import { ArrowDown, ArrowUp } from '../../Shared/Icons';
import { InputChangeEvent, StringRecord } from '../../Shared/Type';
import usePagination from '../../Shared/hooks/usePagination';
import BreadCrumbs from '../../Utils/Common/Breadcrumb';
import LookupsFunctions from './LookupsFunctions';
import Row from './Row';
import useLang from 'Shared/hooks/useLanguage';
import useIsMobile from 'Shared/hooks/useIsMobile';
import PermissionComponent from 'Shared/Common/Permissions/PermissionComponent';

export type SearchQuery = {
  id: number;
  labId: number;
  labName: string;
  isActive: boolean;
  reqTypeId: number;
  reqTypeName: string;
  portalTypeId: number;
  nextWorkFlowId: number;
  portalTypeName: string;
  actionPerformed: string;
  nextWorkFlowName: string;
  currentWorkFlowId: number;
  currentWorkFlowName: string;
};

function WorkflowStatusMain() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const initialSearchQuery: SearchQuery = {
    id: 0,
    labId: 0,
    labName: '',
    reqTypeId: 0,
    isActive: true,
    portalTypeId: 0,
    reqTypeName: '',
    nextWorkFlowId: 0,
    portalTypeName: '',
    actionPerformed: '',
    nextWorkFlowName: '',
    currentWorkFlowId: 0,
    currentWorkFlowName: '',
  };

  const queryDisplayTagNames: StringRecord = {
    labName: 'Lab Name',
    reqTypeName: 'Requisition Type Name',
    portalTypeName: 'Portal Type Name',
    currentWorkFlowName: 'Status',
    actionPerformed: 'Action Performed',
    nextWorkFlowName: 'Next Step',
  };

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] =
    useState<SearchQuery>(initialSearchQuery);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const initialSorting = {
    clickedIconData: '',
    sortingOrder: '',
  };
  const [sort, setSorting] = useState(initialSorting);

  const {
    labLookup,
    portalType,
    workflowStatus,
    requisitionType,
    getLabLookupWorkflowStatus,
    getRequisitionTypesLookupWorkflowStatus,
    getPortalTypesLookupWorkflowStatus,
    getWorkFlowStatusLookup,
  } = LookupsFunctions();

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

  useEffect(() => {
    getAllWorkflowStatus();
  }, [pageSize, curPage, triggerSearchData]);

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

  const getAllWorkflowStatus = async (reset?: boolean) => {
    try {
      setLoading(true);
      setIsAddButtonDisabled(true);
      const trimmedSearchRequest = Object.fromEntries(
        Object.entries(searchQuery).map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ])
      );

      const queryModel = {
        pageSize: pageSize,
        pageNumber: curPage,
        sortDirection: reset ? initialSorting.sortingOrder : sort?.sortingOrder,
        sortColumn: reset
          ? initialSorting.clickedIconData
          : sort?.clickedIconData,
        queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      };

      let response = await RequisitionType.getAllWorkflowStatus(queryModel);
      if (response?.data?.data) {
        setRows(response.data.data);
        setTotal(response?.data?.total);
      }
    } catch (error) {
      console.error(
        t('An error occurred while fetching workflow statuses:'),
        error
      );
      // You can add additional error handling logic here, such as showing a toast notification.
    } finally {
      setLoading(false);
      setIsAddButtonDisabled(false);
    }
  };

  const fetchData = async () => {
    await Promise.all([
      getAllWorkflowStatus(),
      getLabLookupWorkflowStatus(),
      getRequisitionTypesLookupWorkflowStatus(),
      getPortalTypesLookupWorkflowStatus(),
      getWorkFlowStatusLookup(),
    ]);
  };

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchQuery((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchQuery)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchQuery]);

  useEffect(() => {
    if (searchedTags.length === 1 && searchedTags.includes('isActive')) {
      setSearchQuery(initialSearchQuery);
      getAllWorkflowStatus(true);
    }
  }, [searchedTags.length]);

  useEffect(() => {
    getAllWorkflowStatus();
  }, [sort]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="app-container container-fluid">
        <div className="card">
          <div className="card-body py-2">
            <div className="d-flex gap-4 flex-wrap">
              {searchedTags.map(tag =>
                tag === 'isActive' ? null : (
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
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
              <div className="d-flex gap-2 responsive-flexed-actions">
                <div className="d-flex align-items-center">
                  <span className="fw-400 mr-3">{t('Records')}</span>
                  <select
                    id={`WorkflowStatusRecords`}
                    className="form-select w-125px h-33px rounded py-2"
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
                <div className="d-flex justify-content-center justify-content-sm-start">
                  <PermissionComponent
                    moduleName="Setup"
                    pageName="Workflow Status"
                    permissionIdentifier="AddNew"
                  >
                    <button
                      id={`WorkflowStatusAddNew`}
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
                      className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
                    >
                      {t('Add Workflow Status')}
                    </button>
                  </PermissionComponent>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 ">
                <button
                  id={`WorkflowStatusSearch`}
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
                  onClick={() => {
                    setSearchQuery(initialSearchQuery);
                    setIsAddButtonDisabled(false);
                    getAllWorkflowStatus(true);
                    setSorting(initialSorting);
                  }}
                  type="button"
                  className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                  id={`WorkflowStatusReset`}
                >
                  <span>
                    <span>{t('Reset')}</span>
                  </span>
                </button>
              </div>
            </div>
            <Box sx={{ height: 'auto', width: '100%' }}>
              <div className="table_bordered overflow-hidden">
                <TableContainer
                  sx={
                    
                    isMobile ?  {} :
                    
                    {
                    maxHeight: 800,
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
                  className="shadow-none"
                >
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                  >
                    <TableHead>
                      <TableRow className="h-40px">
                        <TableCell></TableCell>
                        <TableCell>
                          <input
                            id={`WorkflowStatusSearchLabName`}
                            type="text"
                            name="labName"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder={t('Search ...')}
                            value={searchQuery.labName}
                            onChange={onInputChangeSearch}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            id={`WorkflowStatusSearchReqTypeName`}
                            type="text"
                            name="reqTypeName"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 min-w-225px"
                            placeholder={t('Search ...')}
                            value={searchQuery.reqTypeName}
                            onChange={onInputChangeSearch}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            id={`WorkflowStatusSearchPortalTypeName`}
                            type="text"
                            name="portalTypeName"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder={t('Search ...')}
                            value={searchQuery.portalTypeName}
                            onChange={onInputChangeSearch}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            id={`WorkflowStatusSearchStatus`}
                            type="text"
                            name="currentWorkFlowName"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder={t('Search ...')}
                            value={searchQuery.currentWorkFlowName}
                            onChange={onInputChangeSearch}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            id={`WorkflowStatusSearchActionPerformed`}
                            type="text"
                            name="actionPerformed"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder={t('Search ...')}
                            value={searchQuery.actionPerformed}
                            onChange={onInputChangeSearch}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            id={`WorkflowStatusSearchNextStep`}
                            type="text"
                            name="nextWorkFlowName"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder={t('Search ...')}
                            value={searchQuery.nextWorkFlowName}
                            onChange={onInputChangeSearch}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow className="h-30px">
                        <TableCell>{t('Actions')}</TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('labName')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Lab Name')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'labName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'labName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('reqTypeName')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Requisition Type')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'reqTypeName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'reqTypeName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('portalTypeName')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Portal Type')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'portalTypeName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'portalTypeName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('currentWorkFlowName')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Status')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'currentWorkFlowName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'currentWorkFlowName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('actionPerformed')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Action Performed')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'actionPerformed'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'actionPerformed'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('nextWorkFlowName')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Next Step')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'nextWorkFlowName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'nextWorkFlowName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{t('Active/Inactive')}</TableCell>
                        <TableCell>{t('Include/Skip')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={9} className="padding-0">
                          <Loader />
                        </TableCell>
                      ) : rows.length ? (
                        rows?.map((item: any, index: number) => {
                          return (
                            <Row
                              row={item}
                              rows={rows}
                              index={index}
                              setRows={setRows}
                              searchQuery={searchQuery}
                              setSearchQuery={setSearchQuery}
                              initialSearchQuery={initialSearchQuery}
                              getAllWorkflowStatus={getAllWorkflowStatus}
                              queryDisplayTagNames={queryDisplayTagNames}
                              setIsAddButtonDisabled={setIsAddButtonDisabled}
                              lookups={{
                                labLookup,
                                requisitionType,
                                portalType,
                                workflowStatus,
                              }}
                            />
                          );
                        })
                      ) : (
                        <NoRecord />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
              <p className="pagination-total-record mb-0">
                <span>
                  {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}{' '}
                  {Math.min(pageSize * curPage, total)} {t('of Total')}
                  <span> {total} </span> {t('entries')}
                </span>
              </p>
              <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
                <li className="btn btn-lg p-2" onClick={() => showPage(1)}>
                  <i className="fa fa-angle-double-left"></i>
                </li>
                <li className="btn btn-lg p-2" onClick={prevPage}>
                  <i className="fa fa-angle-left"></i>
                </li>
                {pageNumbers.map(page => (
                  <li
                    key={page}
                    className={`px-2 ${
                      page === curPage
                        ? 'font-weight-bold bg-primary text-white'
                        : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => showPage(page)}
                  >
                    {page}
                  </li>
                ))}
                <li className="btn btn-lg p-2" onClick={nextPage}>
                  <i className="fa fa-angle-right"></i>
                </li>
                <li
                  className="btn btn-lg p-2"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkflowStatusMain;
