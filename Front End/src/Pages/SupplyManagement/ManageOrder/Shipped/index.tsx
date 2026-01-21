import { Box, MenuItem } from '@mui/material';
import { AxiosResponse } from 'axios';
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import InsuranceService from '../../../../Services/InsuranceService/InsuranceService';
import PermissionComponent, { AnyPermission } from '../../../../Shared/Common/Permissions/PermissionComponent';
import ArrowBottomIcon from '../../../../Shared/SVG/ArrowBottomIcon';
import { StringRecord } from '../../../../Shared/Type';
import usePagination from '../../../../Shared/hooks/usePagination';
import {
  StyledDropButton,
  StyledDropMenu,
} from '../../../../Utils/Style/Dropdownstyle';
import { SortingTypeI } from '../../../../Utils/consts';
import ManageOrdersGridData from './ManageOrdersGridData';
import useLang from 'Shared/hooks/useLanguage';

const Shipped = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const [show1, setShow1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>(() => []);
  const navigate = useNavigate();
  const shippingCourier = [
    { value: 'UPS', label: 'UPS' },
    { value: 'FedEx', label: 'FedEx' },
  ];
  const [selectedBox, setSelectedBox] = useState<any>({
    ids: [],
  });
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const initialSearchQuery = {
    dateofRequest: null,
    representativeName: '',
    representativePhone: '',
    shippingAddress: '',
    facilityName: '',
    courierName: '',
    trackingNumber: '',
    status: 'shipped',
    createdBy: '',
    isRejected: false,
    rejectedReason: '',
    rejectedDate: null,
  };
  const queryDisplayTagNames: StringRecord = {
    facilityName: 'Facility Name',
    createdBy: 'Requested By',
    representativeName: 'Representative Name',
    dateofRequest: 'Date of Request',
    trackingNumber: 'Tracking Number',
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
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
      loadData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  //Sorting Start
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
      loadData(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [sort]);

  useEffect(() => {
    setCurPage(1);
  }, [pageSize]);
  //Sorting End
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };
  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadData(true, true, sortById);
  }
  // *********** All Dropdown Function Show Hide ***********
  const [anchorEl, setAnchorEl] = useState({
    dropdown1: null,
    dropdown2: null,
  });
  const openDrop = Boolean(anchorEl.dropdown1) || Boolean(anchorEl.dropdown2);

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  // *********** All Dropdown Function END ***********
  /////Start Selected Box
  const handleAllSelect = (checked: boolean, rows: any) => {
    setSelectAll(checked);
    let idsArr: any = [];
    rows.forEach((item: any) => {
      idsArr.push(item?.id);
    });
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: [],
        };
      });
    }
  };
  const handleChangeSelectedIds = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: [...selectedBox.ids, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: selectedBox.ids.filter((item: any) => item !== id),
        };
      });
    }
  };
  /////End Selected Box
  const loadData = (loader: boolean, reset: boolean, sortingState?: any) => {
    setLoading(true);

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    InsuranceService.getOrderAllData({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: any) => {
        setRows(res?.data?.data);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
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
  const downloadAll = () => {
    const obj = {
      status: 'shipped',
      selectedRows: [],
      queryModel: searchRequest,
    };
    InsuranceService.NewOrdersExportToExcel(obj).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(res?.data?.message);
        base64ToExcel(res.data.data.fileContents, 'shipped');
      } else {
        toast.error(res?.data?.message);
      }
    });
  };

  const downloadSelected = () => {
    const obj = {
      status: 'shipped',
      selectedRows: selectedBox.ids,
      queryModel: searchRequest,
    };
    if (selectedBox.ids.length > 0) {
      InsuranceService.NewOrdersExportToExcel(obj).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            base64ToExcel(res.data.data.fileContents, 'shipped');
            setSelectAll(false);
            setSelectedBox([]);
          } else {
            toast.error(res?.data?.message);
          }
        }
      );
    } else {
      toast.error(t('Select atleast one record'));
    }
  };
  useEffect(() => {
    loadData(false, false);
  }, []);
  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
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
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map(tag =>
          tag === 'status' ? (
            ''
          ) : (
            <div
              className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light pe-1"
              onClick={() => handleTagRemoval(tag)}
            >
              <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
              <i className="bi bi-x"></i>
            </div>
          )
        )}
      </div>
      <div className="mb-2 d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center">
        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t('Records:')}</span>
            <select
              id={`ManageOrderShipedRecords`}
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
            <AnyPermission
              moduleName="Supply Management"
              pageName="Manage Order"
              permissionIdentifiers={[
                "ExportAllRecords",
                "ExportSelectedRecords",
              ]}
            >
              <StyledDropButton
                id={`ManageOrderShipedBulkExport`}
                aria-controls={openDrop ? 'demo-positioned-menu2' : undefined}
                aria-haspopup="true"
                aria-expanded={openDrop ? 'true' : undefined}
                onClick={event => handleClick(event, 'dropdown2')}
                className="btn btn-excle btn-sm"
              >
                <i
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    paddingLeft: '2px',
                  }}
                  className="fa"
                >
                  &#xf1c3;
                </i>
                <span className="svg-icon svg-icon-5 m-0">
                  <ArrowBottomIcon />
                </span>
              </StyledDropButton>
              <StyledDropMenu
                id={`ManageOrderShipedBulkExportMenu`}
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
                <PermissionComponent
                  moduleName="Supply Management"
                  pageName="Manage Order"
                  permissionIdentifier="ExportAllRecords"
                >
                  {' '}
                  <MenuItem className="p-0">
                    <a
                      id={`ManageOrderShipedExportAll`}
                      className="p-0 w-200px text-dark"
                      onClick={() => {
                        handleClose('dropdown2');
                        downloadAll();
                      }}
                    >
                      <i className="fa text-excle mr-2  w-20px">&#xf1c3;</i>
                      {t('Export All Records')}
                    </a>
                  </MenuItem>
                </PermissionComponent>
                <PermissionComponent
                  moduleName="Supply Management"
                  pageName="Manage Order"
                  permissionIdentifier="ExportSelectedRecords"
                >
                  <MenuItem className="p-0">
                    <a
                      id={`ManageOrderShipedExportSelected`}
                      className="p-0 text-dark w-200px"
                      onClick={() => {
                        handleClose('dropdown2');
                        downloadSelected();
                      }}
                    >
                      <i className="fa text-success mr-2 w-20px">&#xf15b;</i>
                      {t('Export Selected Records')}
                    </a>
                  </MenuItem>
                </PermissionComponent>
              </StyledDropMenu>
            </AnyPermission>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            id={`ManageOrderShipedSearch`}
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
            id={`ManageOrderShipedReset`}
          >
            <span>
              <span>{t('Reset')}</span>
            </span>
          </button>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
          <ManageOrdersGridData
            rows={rows}
            loading={loading}
            sort={sort}
            searchRef={searchRef}
            handleSort={handleSort}
            setRows={setRows}
            handleChangeSelectedIds={handleChangeSelectedIds}
            selectedBox={selectedBox}
            searchRequest={searchRequest}
            onInputChangeSearch={onInputChangeSearch}
            handleKeyPress={handleKeyPress}
            handleAllSelect={handleAllSelect}
            selectAll={selectAll}
          />

          {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
          <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
            {/* =============== */}
            <p className="pagination-total-record mb-0">
              {Math.min(pageSize * curPage, total) === 0 ? (
                <span>{t('Showing 0 of Total 0 Entries')}</span>
              ) : (
                <span>
                  {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}{' '}
                  {Math.min(pageSize * curPage, total)} {t('of Total')}{' '}
                  <span> {total} </span> {t('entries')}{' '}
                </span>
              )}
            </p>
            {/* =============== */}
            <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
              <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
                <i className="fa fa-angle-double-left"></i>
              </li>
              <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
                <i className="fa fa-angle-left"></i>
              </li>

              {pageNumbers.map((page: any) => (
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
        </Box>
      </div>
    </>
  );
};
export default Shipped;
