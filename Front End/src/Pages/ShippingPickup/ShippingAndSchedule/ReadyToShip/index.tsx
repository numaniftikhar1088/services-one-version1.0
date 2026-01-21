import { Box } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import ReadyToShipGridData from './ReadyToShipGridData';
import moment from 'moment';
import { StringRecord } from '../../../../Shared/Type';
import usePagination from '../../../../Shared/hooks/usePagination';
import { SortingTypeI } from '../../../../Utils/consts';
import InsuranceService from '../../../../Services/InsuranceService/InsuranceService';
import { reactSelectStyle, styles } from '../../../../Utils/Common';
import PermissionComponent from '../../../../Shared/Common/Permissions/PermissionComponent';
import useLang from 'Shared/hooks/useLanguage';

const ReadyToShip = () => {
  const { t } = useLang();

  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>(() => []);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const shippingCourier = [
    { value: 'UPS', label: 'UPS' },
    { value: 'FedEx', label: 'FedEx' },
  ];

  const [selectedBox, setSelectedBox] = useState<any>({
    ids: [],
    requisitionOrderId: [],
  });

  const initialSearchQuery = {
    status: '',
    labId: 0,
    labName: '',
    requisitionId: 0,
    requisitionOrderId: 0,
    requsitionType: '',
    orderNumber: '',
    facilityId: 0,
    facilityName: '',
    firstName: '',
    lastName: '',
    dob: null,
    dateReceived: null,
    dateofCollection: null,
    collectedBy: '',
    courierName: '',
    trackingNumber: '',
    pickupDate: null,
    startPickupTime: null,
    timeofCollection: null,
    endPickupTime: null,
    tabName: '0',
  };
  const queryDisplayTagNames: StringRecord = {
    labName: 'Lab Name',
    facilityName: 'Facility Name',
    requsitionType: 'Requsition Type',
    orderNumber: 'Order Number',
    dateofCollection: 'Date of Collection',
    timeofCollection: 'Time of Collection',
    firstName: 'First Name',
    lastName: 'Last Name',
    dob: 'Date of Birth',
    status: 'Status',
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);

  const ModalhandleClose1 = () => {
    setShippingNow(initialShippingNow);
    setShow1(false);
  };
  const ModalhandleClose = () => {
    setShow(false);
  };
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
    clickedIconData: 'RequisitionOrderId',
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
      setTriggerSearchData(prev => !prev);
      setCurPage(1);
    }
  };
  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadData(true, true, sortById);
  }
  const [facilityName, setFacilityName] = useState();
  const handleClickOpen = () => {
    const val = rows.filter((item: any) =>
      selectedBox.requisitionOrderId.includes(item.requisitionOrderId)
    );
    const value = val.every(
      (item: any) => item.facilityName === val[0].facilityName
    );
    if (selectedBox.requisitionOrderId.length > 0) {
      if (value) {
        setShow1(true);
        setFacilityName(val[0].facilityName);
      } else {
        toast.error(t('Please select the same facility'));
      }
    } else {
      toast.error(t('Please select atleast one record'));
    }
  };
  const handleClickOpen1 = () => {
    if (selectedBox.requisitionOrderId.length > 0) {
      setShow(true);
    } else {
      toast.error(t('Please select atleast one record'));
    }
  };
  // *********** All Dropdown Function END ***********
  /////Start Selected Box
  const handleAllSelect = (checked: boolean, rows: any) => {
    let idsArr: any = [];
    rows.forEach((item: any) => {
      idsArr.push(item?.requisitionOrderId);
    });
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          // ids: idsArr,
          requisitionOrderId: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionOrderId: [],
        };
      });
    }
  };
  const handleChangeSelectedIds = (
    checked: boolean,
    id: number,
    orderId: number
  ) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: [...selectedBox.ids, id],
          requisitionOrderId: [...selectedBox.requisitionOrderId, orderId],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          ids: selectedBox.ids.filter((item: any) => item !== id),
          requisitionOrderId: selectedBox.requisitionOrderId.filter(
            (item: any) => item !== orderId
          ),
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
    InsuranceService.ShippingandScheduleGetAll({
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
  const initialShippingNow = {
    courierName: '',
    trackingNumber: '',
    startPickupTime: null,
    endPickupTime: null,
    pickupDate: null,
  };
  const [shippingNow, setShippingNow] = useState(initialShippingNow);

  const ShipNow = (isTrackingNumberRequired: boolean) => {
    if (pickupError) return;
    const obj = {
      courierName: shippingNow.courierName,
      trackingNumber: isTrackingNumberRequired
        ? shippingNow.trackingNumber
        : '',
      pickupDate: shippingNow.pickupDate,
      startPickupTime: `${shippingNow.startPickupTime}:00`,
      endPickupTime: `${shippingNow.endPickupTime}:00`,
      requisitionOrderDetails: selectedBox?.requisitionOrderId?.map(
        (id: number) => ({
          status: '',
          requisitionOrderId: id,
          orderNumber: '',
          requisitionId: 0,
        })
      ),
    };
    if (
      shippingNow.courierName !== '' &&
      (!isTrackingNumberRequired ||
        (isTrackingNumberRequired && shippingNow.trackingNumber !== '')) &&
      shippingNow.startPickupTime !== null &&
      shippingNow.endPickupTime !== null &&
      shippingNow.pickupDate !== null
    ) {
      InsuranceService.saveShippingSchedule(obj).then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t('Record shipped successfully...'));
          loadData(true, false);
          setShow1(false);
          setShippingNow(initialShippingNow);
        } else {
          toast.error(res?.data?.message);
        }
      });
    } else {
      toast.error(t('Please fill the required details'));
    }
  };
  const handleChange = (e: any, name?: string) => {
    if (name) {
      setShippingNow(prev => ({
        ...prev,
        [name]: e.value,
      }));
    } else {
      setShippingNow({
        ...shippingNow,
        [e.target.name]: e.target.value,
      });
    }
  };

  useEffect(() => {
    loadData(false, false);
  }, []);
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

  const [pickupStartTime, setPickUpStartTime] = useState<any>(null);
  const [pickupEndTime, setPickUpEndTime] = useState<any>(null);
  const [pickupError, setPickupError] = useState(false);

  const handlePickupStart = (value: string) => {
    let pickupStartTimeInSecs = convertTimeToSeconds(value);
    setPickUpStartTime(+pickupStartTimeInSecs);
  };
  const handlePickupEnd = (value: string) => {
    let pickupEndTimeInSecs = convertTimeToSeconds(value);
    setPickUpEndTime(+pickupEndTimeInSecs);
  };

  const convertTimeToSeconds = (timeString: string) => {
    const timeMoment = moment(timeString, 'HH:mm');

    const totalSeconds = timeMoment.hours() * 3600 + timeMoment.minutes() * 60;
    return totalSeconds;
  };

  useEffect(() => {
    if (pickupStartTime && pickupEndTime) {
      if (pickupEndTime < pickupStartTime) {
        setPickupError(true);
      } else {
        setPickupError(false);
      }
    }
  }, [pickupEndTime, pickupStartTime]);

  return (
    <>
      <Modal
        show={show1}
        onHide={ModalhandleClose1}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="m-0 p-6">
          <h4>{t('Shipping Detail')}</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-5">
            <p className="text-primary fw-500">
              {t('Specimens selected for shipment')}
            </p>
          </div>
          <div className="border-bottom">
            <ul>
              <li>{facilityName}</li>
            </ul>
          </div>
          <div className="mt-5 d-flex justify-content-between">
            <div className="fv-row mb-4" style={{ minWidth: '47%' }}>
              <label className="mb-2 fw-500 required">
                {t('Shipping Courier')}
              </label>
              <Select
                id={`ReadyToShipModal`}
                menuPortalTarget={document.body}
                styles={reactSelectStyle}
                options={shippingCourier}
                theme={(theme: any) => styles(theme)}
                placeholder="Shipping Courier"
                name="courierName"
                value={shippingCourier?.filter(
                  (item: any) => item.label == shippingNow.courierName
                )}
                onChange={(event: any) => {
                  handleChange(event, 'courierName');
                }}
              />
            </div>
            <div className="fv-row mb-4" style={{ minWidth: '47%' }}>
              <label className="required mb-2 fw-500">{t('Tracking No')}</label>
              <input
                id={`ReadyToShipModalTrackingNumber`}
                type="text"
                name="trackingNumber"
                onChange={e => handleChange(e)}
                className={`form-control `}
                placeholder="Tracking Number"
                value={shippingNow.trackingNumber}
                // disabled={id > 0}
              />
            </div>
          </div>
          <div className="mt-5 d-flex justify-content-between">
            <div className="fv-row mb-4" style={{ minWidth: '47%' }}>
              <label className="required mb-2 fw-500">{t('Pickup Date')}</label>
              <input
                id={`ReadyToShipModalPickUpDate`}
                type="date"
                name="pickupDate"
                onChange={e => handleChange(e)}
                className={`form-control `}
                placeholder="Pickup Time"
                value={
                  shippingNow.pickupDate === null ? '' : shippingNow.pickupDate
                }
                min={new Date().toISOString().split('T')[0]}
                // disabled={id > 0}
              />
            </div>
            <div className="fv-row mb-4" style={{ minWidth: '47%' }}>
              <label className="required mb-2 fw-500">{t('Pickup Time')}</label>
              <input
                id={`ReadyToShipModalStartPickupTime`}
                type="time"
                name="startPickupTime"
                onChange={e => {
                  handleChange(e);
                  handlePickupStart(e.target.value);
                }}
                className={`form-control `}
                placeholder="Pickup Time"
                value={
                  shippingNow.startPickupTime === null
                    ? ''
                    : shippingNow.startPickupTime
                }
                // disabled={id > 0}
              />
            </div>
          </div>
          <div className="mt-5 d-flex justify-content-between">
            <div className="fv-row mb-4" style={{ minWidth: '47%' }}>
              <label className="required mb-2 fw-500">
                {t('End Pickup Time')}
              </label>
              <input
                id={`ReadyToShipModalEndPickUpTime`}
                type="time"
                name="endPickupTime"
                onChange={e => {
                  handlePickupEnd(e.target.value);
                  handleChange(e);
                }}
                className={`form-control `}
                placeholder="End Pickup Time"
                value={
                  shippingNow.endPickupTime === null
                    ? ''
                    : shippingNow.endPickupTime
                }
                // disabled={id > 0}
              />
              {pickupError ? (
                <span className="text-danger p-2">
                  {t('End pickup time should be greater than pickup time')}
                </span>
              ) : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-3 px-6">
          <div className="d-flex justify-content-between w-100">
            <p
              id={`ReadyToShipModalShipWithoutTracking`}
              className="text-primary"
              style={{ cursor: 'pointer' }}
              onClick={() => ShipNow(false)}
            >
              <u> {t('Ship without Tracking')}</u>
            </p>
            <div className="d-flex gap-5">
              <button
                id={`ReadyToShipModalCancelShip`}
                type="button"
                className="badge badge-pill badge-danger py-3 px-4 border-0 fw-400 fa-1x text-light mr-10"
                onClick={() => {
                  ModalhandleClose1();
                }}
              >
                {t('Cancel')}
              </button>
              <button
                id={`ReadyToShipModalShipNow`}
                type="button"
                className="badge badge-pill badge-primary py-3 px-4 border-0 fw-400 fa-1x text-light"
                onClick={() => ShipNow(true)}
              >
                {t('Ship Now')}
              </button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={show}
        onHide={ModalhandleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        top
      >
        <Modal.Header closeButton className="m-0 p-6">
          <h4>{t('Shipping Detail')}</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-5">
            <div className="fv-row mb-4">
              <label className="required mb-2 fw-500">
                {t('Date for Shipping Manifest')}
              </label>
              <input
                id={`ReadyToShipModalTrackingNumber`}
                type="Date"
                name="trackingNumber"
                onChange={e => handleChange(e)}
                className={`form-control `}
                placeholder="Tracking Number"
                value={shippingNow.trackingNumber}
                // disabled={id > 0}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-3 px-6">
          <button
            id={`ReadyToShipModalCancelPrint`}
            type="button"
            className="badge badge-pill badge-danger py-3 px-4 border-0 fw-400 fa-1x text-light mr-10"
            onClick={() => {
              // handleDelete(value);
              ModalhandleClose();
            }}
          >
            {t('Cancel')}
          </button>
          <button
            id={`ReadyToShipModalPrint`}
            type="button"
            className="badge badge-pill badge-primary py-3 px-4 border-0 fw-400 fa-1x text-light"
            // onClick={()=>ShipNow()}
          >
            {t('Print')}
          </button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map(tag =>
          tag === 'tabName' ? null : (
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
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t('Records')}</span>
            <select
              id={`ReadyToShipRecords`}
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
          <div className="d-flex gap-2 justify-content-center justify-content-sm-start">
            <div className="mt-0">
              <PermissionComponent
                moduleName="Shipping and Pickup"
                pageName="Ready to Ship"
                permissionIdentifier="Ship"
              >
                <button
                  id={`ReadyToShipShipButton`}
                  className="btn btn-sm  fw-400 h-30px px-6 text-light border-0"
                  style={{ backgroundColor: '#145388' }}
                  onClick={e => handleClickOpen()}
                >
                  {t('Ship')}
                </button>
              </PermissionComponent>
            </div>
            <div>
              <PermissionComponent
                moduleName="Shipping and Pickup"
                pageName="Ready to Ship"
                permissionIdentifier="Print"
              >
                <button
                  id={`ReadyToShipPrintButton`}
                  className="btn btn-sm btn-dark-brown fw-400 h-30px px-6 border-0"
                  onClick={e => handleClickOpen1()}
                  // disabled={true}
                >
                  {t('Print Manifest')}
                </button>
              </PermissionComponent>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <button
            id={`ReadyToShipPrint`}
            onClick={() => {
              setTriggerSearchData(prev => !prev);
              setCurPage(1);
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
            id={`ReadyToShipReset`}
          >
            <span>
              <span>{t('Reset')}</span>
            </span>
          </button>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
          <ReadyToShipGridData
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
          />

          {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
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
export default ReadyToShip;
