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
import MiscellaneousService from '../../Services/MiscellaneousManagement/MiscellaneousService';
import { Loader } from '../../Shared/Common/Loader';
import NoRecord from '../../Shared/Common/NoRecord';
import { ArrowDown, ArrowUp } from '../../Shared/Icons';
import { InputChangeEvent, StringRecord } from '../../Shared/Type';
import usePagination from '../../Shared/hooks/usePagination';
import BreadCrumbs from '../../Utils/Common/Breadcrumb';
import { sortById } from '../../Utils/consts';
import LookupsFunctions from './LookupsFunctions';
import Row from './Row';
import PermissionComponent from '../../Shared/Common/Permissions/PermissionComponent';
import useLang from 'Shared/hooks/useLanguage';

export type SearchQuery = {
  notificationType: string;
  notificationMessage: string;
  notificationTypeId: number;
  notificationSubject: string;
  notificationUserIds: string[];
  id: number;
};

function ManageNotification() {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [initialRender, setInitialRender] = useState(false);
  const [initialRender2, setInitialRender2] = useState(false);
  const initialSearchQuery: SearchQuery = {
    id: 0,
    notificationType: '',
    notificationTypeId: 0,
    notificationMessage: '',
    notificationSubject: '',
    notificationUserIds: [''],
  };

  const queryDisplayTagNames: StringRecord = {
    notificationType: 'Notification Type',
    notificationMessage: 'Notification Message',
    notificationSubject: 'Notification Subject',
  };

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] =
    useState<SearchQuery>(initialSearchQuery);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [sort, setSorting] = useState(sortById);

  const {
    getNotificationTypes,
    userLookup,
    getUserLookup,
    notificationTypeLookup,
    userTypeLookUp,
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
    if (initialRender) {
      getAllNotification();
    } else {
      setInitialRender(true);
    }
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

  const getAllNotification = async (reset?: boolean) => {
    setLoading(true);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchQuery).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    const queryModel = {
      pageSize: pageSize,
      pageNumber: curPage,
      sortColumn: reset ? sortById?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortById?.sortingOrder : sort?.sortingOrder,
      queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
    };
    try {
      let response = await MiscellaneousService.GetAllNotification(queryModel);
      if (response?.data?.data) {
        setRows(response.data.data);
        setTotal(response?.data?.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
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
    if (searchedTags.length === 1) {
      setSearchQuery(initialSearchQuery);
      setSorting(sortById);
      getAllNotification(true);
      setIsAddButtonDisabled(false);
    }
  }, [searchedTags.length]);

  useEffect(() => {
    if (initialRender2) {
      getAllNotification();
    } else {
      setInitialRender2(true);
    }
  }, [sort]);

  useEffect(() => {
    getUserLookup(1);
    getNotificationTypes();
  }, []);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="app-container container-fluid">
        <div className="card">
          <div className="card-body px-3 px-md-8">
            <div className="d-flex gap-4 flex-wrap mb-2">
              {searchedTags.map((tag) =>
                tag === "notificationUserIds" ? null : (
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
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    id={`AdminManageNotificationRecords`}
                    className="form-select w-125px h-33px rounded py-2"
                    data-kt-select2="true"
                    data-placeholder="Select option"
                    data-dropdown-parent="#kt_menu_63b2e70320b73"
                    data-allow-clear="true"
                    onChange={(e) => {
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
                    moduleName="Admin"
                    pageName="Manage Notification"
                    permissionIdentifier="Add"
                  >
                    <button
                      id={`AdminManageNotificationAddNew`}
                      disabled={loading ? true : false}
                      onClick={() => {
                        if (!isAddButtonDisabled) {
                          setRows((prevRows: any) => [
                            {
                              rowStatus: true,
                              isActive: true,
                              ...initialSearchQuery,
                            },
                            ...prevRows,
                          ]);
                          setIsAddButtonDisabled(true);
                        }
                      }}
                      className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
                    >
                      {t("Add Notification")}
                    </button>
                  </PermissionComponent>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 gap-lg-3 ">
                <button
                  id={`AdminManageNotificationSearch`}
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
                  id={`AdminManageNotificationReset`}
                  onClick={() => {
                    setSearchQuery(initialSearchQuery);
                    setSorting(sortById);
                    getAllNotification(true);
                    setIsAddButtonDisabled(false);
                  }}
                  type="button"
                  className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                >
                  <span>
                    <span>{t("Reset")}</span>
                  </span>
                </button>
              </div>
            </div>
            <Box sx={{ height: "auto", width: "100%" }}>
              <div className="table_bordered overflow-hidden">
                <TableContainer
                  sx={{
                    maxHeight: 800,
                    "&::-webkit-scrollbar": {
                      width: 7,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#fff",
                    },
                    "&:hover": {
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--kt-gray-400)",
                        borderRadius: 2,
                      },
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "var(--kt-gray-400)",
                      borderRadius: 2,
                    },
                  }}
                  className="shadow-none"
                >
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                  >
                    <TableHead>
                      <TableRow className="h-40px">
                        <TableCell></TableCell>
                        <TableCell>
                          <input
                            id={`AdminManageNotificationSearchNotificationType`}
                            type="text"
                            name="notificationType"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder={t("Search ...")}
                            value={searchQuery.notificationType}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            id={`AdminManageNotificationSearchNotificationSubject`}
                            type="text"
                            name="notificationSubject"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder={t("Search ...")}
                            value={searchQuery.notificationSubject}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            id={`AdminManageNotificationSearchMessage`}
                            type="text"
                            name="notificationMessage"
                            className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                            placeholder={t("Search ...")}
                            value={searchQuery.notificationMessage}
                            onChange={onInputChangeSearch}
                            onKeyDown={(e) => handleKeyPress(e)}
                          />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      <TableRow className="h-30px">
                        <TableCell className="w-50px min-w-50px">
                          {t("Actions")}
                        </TableCell>
                        <TableCell className="min-w-250px">
                          <div
                            onClick={() => handleSort("notificationType")}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: "max-content" }}>
                              {t("Notification Type")}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === "notificationType"
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === "notificationType"
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('notificationSubject')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Notification Subject')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'notificationSubject'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'notificationSubject'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('notificationMessage')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Notification Message')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'notificationMessage'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'notificationMessage'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-250px">
                          <div style={{ width: 'max-content' }}>
                            {t('Notification Users')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            onClick={() => handleSort('isActive')}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Inactive/Active')}
                            </div>
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'isActive'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'isActive'
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
                        <TableCell colSpan={6} className="padding-0">
                          <Loader />
                        </TableCell>
                      ) : rows.length ? (
                        rows?.map((item: any, index: number) => {
                          return (
                            <Row
                              row={item}
                              rows={rows}
                              index={index}
                              key={item.id}
                              setRows={setRows}
                              lookups={{
                                notificationTypeLookup,
                                userLookup,
                                userTypeLookUp,
                              }}
                              searchQuery={searchQuery}
                              setSearchQuery={setSearchQuery}
                              initialSearchQuery={initialSearchQuery}
                              getAllNotification={getAllNotification}
                              queryDisplayTagNames={queryDisplayTagNames}
                              setIsAddButtonDisabled={setIsAddButtonDisabled}
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
            <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
              <p className="pagination-total-record">
                <span>
                  Showing {pageSize * (curPage - 1) + 1} to{' '}
                  {Math.min(pageSize * curPage, total)} of Total
                  <span> {total} </span> entries
                </span>
              </p>
              <ul className="d-flex align-items-center justify-content-end custome-pagination">
                <li
                  className="btn btn-lg p-2 h-33px"
                  onClick={() => showPage(1)}
                >
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageNotification;
