import {
  Box,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import InsuranceService from '../../../../Services/InsuranceService/InsuranceService';
import { Loader } from '../../../../Shared/Common/Loader';
import { ArrowDown, ArrowUp } from '../../../../Shared/Icons';
import CustomPagination from '../../../../Shared/JsxPagination';
import { StringRecord } from '../../../../Shared/Type';
import usePagination from '../../../../Shared/hooks/usePagination';
import { StyledDropMenu } from '../../../../Utils/Style/Dropdownstyle';
import { SortingTypeI } from '../../../../Utils/consts';
import Row from './Row';
import { TBL_HEADERS } from './tableHeaders';
import PermissionComponent from '../../../../Shared/Common/Permissions/PermissionComponent';
import useLang from 'Shared/hooks/useLanguage';

function ManageInventory() {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const initialSearchQuery = {
    id: 0,
    courierName: 'fedex',
    userName: '',
    password: '',
    clientSecretKey: '',
    accountNumber: '',
    clientId: '',
    grantType: '',
    apiKey: '',
    pathName: '',
    isDefault: null,
    isActive: null,
  };

  const queryDisplayTagNames: StringRecord = {
    courierName: 'Courier Name',
    userName: 'User Name',
    password: 'Password',
    clientSecretKey: 'Client Secret Key',
    accountNumber: 'Account Number',
    clientId: 'Client Id',
    grantType: 'Grant Type',
    apiKey: 'Api Key',
    pathName: 'Path Name',
  };

  let [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [rows, setRows] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddButtonDisabled, setIsAddButtonDisabled] =
    useState<boolean>(false);

  const [initialRender, setinitialRender] = useState<boolean>(false);
  const [initialRender2, setinitialRender2] = useState<boolean>(false);

  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };

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
      loadData(false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  const sortById = {
    clickedIconData: 'Id',
    sortingOrder: 'desc',
  };
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
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
    if (initialRender2) {
      loadData(true);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);

  useEffect(() => {
    setCurPage(1);
  }, [pageSize]);

  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
  });

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  function resetSearch() {
    setSearchQuery(initialSearchQuery);
    setSorting(sortById);
    loadData(true);
  }

  const loadData = async (reset: boolean) => {
    setLoading(true);
    try {
      const trimmedSearchRequest = Object.fromEntries(
        Object.entries(searchQuery).map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ])
      );
      const queryModel = {
        pageSize: pageSize,
        pageNumber: curPage,
        sortDirection: sort?.sortingOrder,
        sortColumn: sort?.clickedIconData,
        queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      };

      const response =
        await InsuranceService.getShippingAndSchedulePreconfiguration(
          queryModel
        );
      setTotal(response?.data?.total);
      setRows(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

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
    if (searchedTags.length === 1) resetSearch();
  }, [searchedTags.length]);

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
      <div className="card-body py-md-4 py-3">
        <div className=" py-1 py-lg-2">
          <div className="d-flex gap-4 flex-wrap">
            {searchedTags.map(tag =>
              tag === 'isDefault' ||
              tag === 'isActive' ||
              tag === 'courierName' ? null : (
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
          <div className="d-flex flex-wrap gap-3 justify-content-center mb-2 justify-content-sm-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t('Records:')}</span>
                <select
                  id={`ShippingPreConfigrationFedExRecords`}
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
              <div className="d-flex align-items-center gap-2">
                <PermissionComponent
                  moduleName="Shipping and Pickup"
                  pageName="Pre-Configuration Setup"
                  permissionIdentifier="AddNew"
                >
                  <button
                    id={`ShippingPreConfigrationFedExAddNew`}
                    className="btn btn-primary btn-sm btn-primary--icon px-7"
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
                    <span>
                      <i style={{ fontSize: '15px' }} className="fa">
                        &#xf067;
                      </i>
                      <span>{t('Add New')}</span>
                    </span>
                  </button>
                </PermissionComponent>
                <StyledDropMenu
                  id={`ShippingPreConfigrationFedExBulkExport`}
                  aria-labelledby="demo-positioned-button2"
                  anchorEl={anchorEl.dropdown2}
                  open={Boolean(anchorEl.dropdown2)}
                  onClose={() => handleClose('dropdown2')}
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
                      id={`ShippingPreConfigrationFedExExportAll`}
                      className="p-0 w-200px text-dark"
                      onClick={() => {
                        handleClose('dropdown2');
                      }}
                    >
                      <i className="fa text-excle mr-2  w-20px">&#xf1c3;</i>
                      {t('Export All Records')}
                    </a>
                  </MenuItem>
                  <MenuItem className="p-0">
                    <a
                      id={`ShippingPreConfigrationFedExExportSelected`}
                      className="p-0 w-200px text-dark"
                      onClick={() => {
                        handleClose('dropdown2');
                      }}
                    >
                      <i className="fa text-success mr-2 w-20px">&#xf15b;</i>
                      {t('Export Selected Records')}
                    </a>
                  </MenuItem>
                </StyledDropMenu>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2">
              <button
                id={`ShippingPreConfigrationFedExSearch`}
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
                id={`ShippingPreConfigrationFedExReset`}
              >
                <span>
                  <span>{t('Reset')}</span>
                </span>
              </button>
            </div>
          </div>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={{
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
                        id={`ShippingPreConfigrationFedExSearchUserName`}
                        type="text"
                        name="userName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.userName}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`ShippingPreConfigrationFedExSearchPassword`}
                        type="text"
                        name="password"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.password}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`ShippingPreConfigrationFedExSearchClintsecretKey`}
                        type="text"
                        name="clientSecretKey"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.clientSecretKey}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`ShippingPreConfigrationFedExSearchAccountNumber`}
                        type="text"
                        name="accountNumber"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.accountNumber}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`ShippingPreConfigrationFedExSearchPathName`}
                        type="text"
                        name="pathName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.pathName}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="h-30px">
                    {TBL_HEADERS.map(header =>
                      header.name === '' ? (
                        <TableCell>{t('Actions')}</TableCell>
                      ) : (
                        <TableCell className="min-w-50px">
                          <div
                            onClick={() => handleSort(header.variable)}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t(header.name)}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === header.variable
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === header.variable
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={9}>
                      <Loader />
                    </TableCell>
                  ) : (
                    rows.map((row: any, index: number) => (
                      <Row
                        row={row}
                        rows={rows}
                        key={index}
                        index={index}
                        setRows={setRows}
                        loadData={loadData}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        initialSearchQuery={initialSearchQuery}
                        setIsAddButtonDisabled={setIsAddButtonDisabled}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="card">
            <Box sx={{ height: 'auto', width: '100%' }}>
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
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageInventory;
