import { Box } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import InsuranceService from '../../../../Services/InsuranceService/InsuranceService';
import PermissionComponent from '../../../../Shared/Common/Permissions/PermissionComponent';
import { StringRecord } from '../../../../Shared/Type';
import usePagination from '../../../../Shared/hooks/usePagination';
import { SortingTypeI } from '../../../../Utils/consts';
import ManageOrdersGridData from './ManageOrdersGridData';
import useLang from 'Shared/hooks/useLanguage';

const Rejected = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>(() => []);
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
    status: 'rejected',
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
    rejectedReason: 'Rejected Reason',
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

  const RestoreRejectedOrders = () => {
    if (selectedBox.ids.length > 0) {
      const obj = {
        ids: selectedBox.ids,
      };
      InsuranceService.RestoreRejectedOrders(obj).then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          loadData(true, false);
          setSelectAll(false);
        } else {
          toast.error(res?.data?.message);
        }
      });
    } else {
      toast.error(t('Please select atleast one record'));
    }
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

  useEffect(() => {
    if (searchedTags.length === 1) resetSearch();
  }, [searchedTags.length]);

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
              id={`ManageOrderRejectedRecords`}
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
              moduleName="Supply Management"
              pageName="Manage Order"
              permissionIdentifier="Restore"
            >
              <button
                id={`ManageOrderRejectedRestore`}
                className="badge badge-pill badge-primary fw-400 fa-1x h-33px px-6 text-light border-0"
                onClick={e => RestoreRejectedOrders()}
              >
                <span>
                  <span>{t('Restore')}</span>
                </span>
              </button>
            </PermissionComponent>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 ">
          <button
            id={`ManageOrderRejectedSearch`}
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
            id={`ManageOrderRejectedReset`}
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
export default Rejected;
