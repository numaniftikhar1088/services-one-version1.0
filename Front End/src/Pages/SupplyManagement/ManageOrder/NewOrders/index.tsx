import { Box, MenuItem } from "@mui/material";
import CustomPagination from "Shared/JsxPagination";
import useLang from "Shared/hooks/useLanguage";
import { AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import PermissionComponent, {
  AnyPermission,
  PermissionObject,
} from "../../../../Shared/Common/Permissions/PermissionComponent";
import ArrowBottomIcon from "../../../../Shared/SVG/ArrowBottomIcon";
import { StringRecord } from "../../../../Shared/Type";
import usePagination from "../../../../Shared/hooks/usePagination";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../../../Utils/Style/Dropdownstyle";
import { SortingTypeI } from "../../../../Utils/consts";
import ManageOrdersGridData from "./ManageOrdersGridData";

const initialSearchQuery = {
  facilityName: "",
  representativeName: "",
  createdBy: "",
  representativePhone: "",
  shippingAddress: "",
  courierName: "",
  trackingNumber: "",
  status: "NewOrders",
  isRejected: false,
  rejectedReason: "",
  rejectedDate: null,
  dateofRequest: null,
};

const queryDisplayTagNames: StringRecord = {
  facilityName: "Facility Name",
  createdBy: "Requested By",
  representativeName: "Representative Name",
  dateofRequest: "Date of Request",
};

const sortById = {
  clickedIconData: "Id",
  sortingOrder: "desc",
};

const shippingCourier = [
  { value: "UPS", label: "UPS" },
  { value: "FedEx", label: "FedEx" },
];

const NewOrders = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const searchRef = useRef<any>(null);

  const [show1, setShow1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>(() => []);
  const [facilityName, setFacilityName] = useState();
  const [initialRender, setinitialRender] = useState(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [initialRender2, setinitialRender2] = useState(false);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [selectedBox, setSelectedBox] = useState<any>({
    ids: [],
  });
  const [shippingNow, setShippingNow] = useState({
    courierName: "",
    trackingNumber: "",
  });

  const permissions = useSelector(
    (state: any) =>
      state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.permissions ||
      []
  );

  const hasPermission = permissions.some(
    (permission: PermissionObject) =>
      permission.subject.replace(/\n/g, "").toLowerCase() ===
      "Manage Order".replace(/\n/g, "").toLowerCase() &&
      permission.moduleName.replace(/\n/g, "").toLowerCase() ===
      "Supply Management".replace(/\n/g, "").toLowerCase() &&
      permission.action.replace(/\n/g, "").toLowerCase() ===
      "HideShippingDetail".replace(/\n/g, "").toLowerCase()
  );

  const ModalhandleClose1 = () => setShow1(false);

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

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

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
    if (e.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
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

  const handleClickOpen = () => {
    const val = rows.filter((item: any) => selectedBox.ids.includes(item.id));
    const value = val.every(
      (item: any) => item.facilityName === val[0].facilityName
    );
    if (selectedBox.ids.length > 0) {
      if (value) {
        setShow1(true);
        setFacilityName(val[0].facilityName);
      } else {
        toast.error(t("Please select the same facility"));
      }
    } else {
      toast.error(t("Please select atleast one record"));
    }
  };
  // *********** All Dropdown Function END ***********
  /////Start Selected Box
  const handleAllSelect = (checked: boolean, rows: any) => {
    setSelectAll(checked);
    const idsArr: any = [];
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

  const loadData = (loader: boolean, reset: boolean, sortingState?: any) => {
    setLoading(loader);

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
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
        console.trace(err, "err");
        setLoading(false);
      });
  };

  const base64ToExcel = (base64: string, filename: string) => {
    const decodedBase64 = atob(base64);
    const workbook = XLSX.read(decodedBase64, { type: "binary" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelBlob, `${filename}.xlsx`);
  };

  const downloadAll = () => {
    const obj = {
      status: "NewOrders",
      selectedRows: [],
      queryModel: searchRequest,
    };
    InsuranceService.NewOrdersExportToExcel(obj).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(res?.data?.message);
        base64ToExcel(res.data.data.fileContents, "New Orders");
      } else {
        toast.error(res?.data?.message);
      }
    });
  };

  const downloadSelected = () => {
    const obj = {
      status: "NewOrders",
      selectedRows: selectedBox.ids,
      queryModel: searchRequest,
    };
    if (selectedBox.ids.length > 0) {
      InsuranceService.NewOrdersExportToExcel(obj).then(
        (res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            base64ToExcel(res.data.data.fileContents, "New Orders");
            setSelectAll(false);
            setSelectedBox([]);
          } else {
            toast.error(res?.data?.message);
          }
        }
      );
    } else {
      toast.error(t("Select atleast one record"));
    }
  };

  const AddNew = () => {
    navigate("/supply-order");
  };

  const ShipNow = () => {
    const obj = {
      ids: selectedBox.ids,
      courierName: shippingNow.courierName,
      trackingNumber: shippingNow.trackingNumber,
    };

    // If hasPermission is false, run validation
    if (!hasPermission) {
      if (shippingNow.courierName === "" || shippingNow.trackingNumber === "") {
        toast.error(t("Please fill the required details"));
        return; // stop execution
      }
    }

    // if (shippingNow.courierName !== "" && shippingNow.trackingNumber !== "") {
    InsuranceService.saveShippingDetails(obj).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(res?.data?.message);
        loadData(true, false);
        setShow1(false);
        setShippingNow({ courierName: "", trackingNumber: "" });
      } else {
        toast.error(res?.data?.message);
      }
    });
  };

  const handleChange = (e: any, name?: string) => {
    if (name) {
      setShippingNow((prev) => ({
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

  // useEffect(() => {
  //   loadData(false, false);
  // }, []);

  return (
    <>
      <Modal show={show1} onHide={ModalhandleClose1} keyboard={false}>
        <Modal.Header closeButton className="m-0 py-3 px-6">
          <h4>{t("Shipping Detail")}</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-5">
            <p className="text-primary fw-500">
              {t("Specimens selected for shipment")}
            </p>
          </div>
          <div className="border-bottom">
            <ul>
              <li>{facilityName}</li>
            </ul>
          </div>
          <div className="mt-5 d-flex gap-5">
            <div className="w-50">
              <label className="mb-2 fw-500 required">
                {t("Shipping Courier")}
              </label>
              <Select
                inputId={`ManageOrderNewOrderModalShippingCourier`}
                menuPortalTarget={document.body}
                styles={reactSelectSMStyle}
                options={shippingCourier}
                theme={(theme: any) => styles(theme)}
                placeholder={t("Shipping Courier")}
                name="courierName"
                value={shippingCourier?.filter(
                  (item: any) => item.label === shippingNow.courierName
                )}
                onChange={(event: any) => {
                  handleChange(event, "courierName");
                }}
              />
            </div>
            <div className="w-50">
              <label className="required mb-2 fw-500">{t("Tracking No")}</label>
              <input
                id={`ManageOrderNewOrderModalTrackingNumber`}
                type="text"
                name="trackingNumber"
                onChange={(e) => handleChange(e)}
                className={`form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-33px `}
                placeholder={t("Tracking Number")}
                value={shippingNow.trackingNumber}
              // disabled={id > 0}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-2 px-6">
          <button
            id={`ManageOrderNewOrderModalCancel`}
            type="button"
            className="badge badge-pill badge-danger py-3 px-4 border-0 fw-400 fa-1x text-light"
            onClick={() => {
              ModalhandleClose1();
            }}
          >
            {t("Cancel")}
          </button>
          <button
            id={`ManageOrderNewOrderModalShipNow`}
            type="button"
            className="badge badge-pill badge-primary py-3 px-4 border-0 fw-400 fa-1x text-light"
            onClick={ShipNow}
          >
            {t("Ship Now")}
          </button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map((tag) =>
          tag === "status" ? (
            ""
          ) : (
            <div
              className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light pe-1"
              onClick={() => handleTagRemoval(tag)}
              key={tag}
            >
              <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
              <i className="bi bi-x"></i>
            </div>
          )
        )}
      </div>
      <div className="mb-2 d-flex flex-wrap gap-2 justify-content-center justify-content-md-between align-items-center">
        <div className="d-flex align-items-center  gap-2 flex-wrap justify-content-center">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t("Records:")}</span>
            <select
              id={`ManageOrderNewOrderRecords`}
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
          <div className="d-flex align-items-center gap-2">
            <PermissionComponent
              moduleName="Supply Management"
              pageName="Manage Order"
              permissionIdentifier="AddNew"
            >
              <button
                id={`ManageOrderNewOrderAddNew`}
                className="btn btn-primary btn-sm btn-primary--icon px-7"
                onClick={AddNew}
              >
                <span>
                  <i style={{ fontSize: "15px" }} className="fa">
                    &#xf067;
                  </i>
                  <span>{t("Add New")}</span>
                </span>
              </button>
            </PermissionComponent>
            <PermissionComponent
              moduleName="Supply Management"
              pageName="Manage Order"
              permissionIdentifier="Ship"
            >
              <button
                id={`ManageOrderNewOrderShip`}
                className="badge badge-pill badge-warning fw-400 fa-1x h-33px px-6 text-light border-0"
                onClick={() => {
                  if (hasPermission) {
                    ShipNow();
                  } else {
                    handleClickOpen();
                  }
                }}
              >
                <span>
                  <span>{t("Ship")}</span>
                </span>
              </button>
            </PermissionComponent>
            <AnyPermission
              moduleName="Supply Management"
              pageName="Manage Order"
              permissionIdentifiers={[
                "ExportAllRecords",
                "ExportSelectedRecords",
              ]}
            >
              <StyledDropButton
                id={`ManageOrderNewOrderBUlkExport`}
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
                id={`ManageOrderNewOrderBulkExportMenu`}
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
                      id={`ManageOrderNewOrderExportAll`}
                      className="w-200px p-0 text-dark"
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
                      id={`ManageOrderNewOrderExportSelected`}
                      className="w-200px p-0 text-dark"
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
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <button
            id={`ManageOrderNewOrderSearch`}
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
            onClick={resetSearch}
            type="button"
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id={`ManageOrderNewOrderReset`}
          >
            <span>
              <span>{t("Reset")}</span>
            </span>
          </button>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: "auto", width: "100%" }}>
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
          {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
        </Box>
      </div>
    </>
  );
};
export default NewOrders;
