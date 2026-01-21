import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import InsuranceService from "../../../Services/InsuranceService/InsuranceService";
import UserManagementService from "../../../Services/UserManagement/UserManagementService";
import NoRecord from "../../../Shared/Common/NoRecord";
import PermissionComponent, {
  PermissionObject,
} from "../../../Shared/Common/Permissions/PermissionComponent";
import { reactSelectStyle, styles } from "../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";

function ViewOrders() {
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = location.state || {};

  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [buttonsShow, setButtonsShow] = useState(false);
  const [supplyOrders, setSupplyOrders] = useState<any>({});
  const [dropdownStates, setDropdownStates] = useState([]);
  const shippingCourier = [
    { value: "UPS", label: "UPS" },
    { value: "FedEx", label: "FedEx" },
  ];
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

  const handleChangeShipping = (e: any, name?: string) => {
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

  const GetShippingInfoById = () => {
    InsuranceService.GetShippingInfoById(id)
      .then((res: AxiosResponse) => {
        setSupplyOrders(res?.data?.data);
        const obj = res?.data?.data;
        for (const [key, value] of Object.entries(obj)) {
          setValue(key, value);
        }
        setButtonsShow(true);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const loadFacilitiesLookUp = () => {
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setDropdown(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  // React hook form start
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      supplyOrder: [supplyOrders.supplyOrderItems], // Initialize with one row
    },
  });

  const handleKeyPress = (e: any) => {
    const keyCode = e.charCode || e.keyCode;
    const allowedKeyCodes = [8, 9, 37, 38, 39, 40, 46]; // 8: backspace, 9: tab, 37: left arrow, 38: up arrow, 39: right arrow, 40: down arrow

    if ((keyCode < 48 || keyCode > 57) && !allowedKeyCodes.includes(keyCode)) {
      e.preventDefault();
    }
  };

  const handleEnterPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  // React hook form end
  const reset = () => {
    navigate("/manage-order", {
      state: { shipped: supplyOrders.status.toLowerCase() },
    });
  };

  function formatDate(inputDate: any) {
    if (!inputDate) {
      return "";
    } else {
      const date = new Date(inputDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${month}-${day}-${year}`;
      return formattedDate;
    }
  }

  const handleChange = (e: any, name: string) => {
    setSupplyOrders((prev: any) => ({
      ...prev,
      [name]: e.value,
    }));
  };

  const handleItemChange = (index: number, key: any, value: any) => {
    const updatedItems = supplyOrders.supplyOrderItems.map(
      (item: any, i: number) => (i === index ? { ...item, [key]: value } : item)
    );

    setSupplyOrders((prevState: any) => ({
      ...prevState,
      supplyOrderItems: updatedItems,
    }));
    setValue(`supplyOrder.${index}.${key}`, `supplyOrder.${index}.${value}`);
    clearErrors(`supplyOrder.${index}.${key}`);
  };

  const onInputChange = (event: any) => {
    const { name, value } = event.target;
    setSupplyOrders({
      ...supplyOrders,
      [name]: value,
    });
    setValue(name, value);
    clearErrors(name);
  };

  const addShippingInfo = () => {
    InsuranceService.AddShippingInfo({ ...supplyOrders, status: "Viewed" })
      .then((res: any) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          reset();
        }
      })
      .catch((err: any) => {
        console.log(err, "err while creating Insurance Provide Assigment");
      });
  };

  const ShipNow = () => {
    const obj = {
      ids: [id],
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

    InsuranceService.saveShippingDetails(obj).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(res?.data?.message);
        setShow1(false);
        setShippingNow({ courierName: "", trackingNumber: "" });
        navigate("/manage-order");
      } else {
        toast.error(res?.data?.message);
      }
    });
  };

  const RejectNow = () => {
    const obj = {
      ids: [id],
      rejectedReason: supplyOrders.rejectedReason,
    };
    if (supplyOrders.rejectedReason) {
      InsuranceService.SaveRejectionDetail(obj).then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          setShow(false);
          navigate("/manage-order");
        } else {
          toast.error(res?.data?.message);
        }
      });
    } else {
      toast.error("Please fill the required details");
    }
  };

  const loadStatesLookUp = () => {
    InsuranceService.GetStatesLookup()
      .then((res: AxiosResponse) => {
        setDropdownStates(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const ModalhandleClose1 = () => setShow1(false);

  const ModalhandleClose = () => setShow(false);

  useEffect(() => {
    GetShippingInfoById();
    loadFacilitiesLookUp();
    loadStatesLookUp();
  }, []);

  const handleOpenModal = () => {
    const aprrovedQuantity = supplyOrders?.supplyOrderItems.filter(
      (item: any) => item.orderQuantityApproved > 0
    );
    if (aprrovedQuantity.length) {
      setShow1(true);
    } else {
      toast.error("Please approve quantity for atleast one record");
    }
  };

  return (
    <>
      <Modal show={show1} onHide={ModalhandleClose1} keyboard={false} size="lg">
        <Modal.Header closeButton className="m-0 p-6">
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
              <li>{supplyOrders?.facilityName}</li>
            </ul>
          </div>
          <div className="mt-5">
            <div className="fv-row mb-4">
              <label className="mb-2 fw-500 required">
                {t("Shipping Courier")}
              </label>
              <Select
                options={shippingCourier}
                theme={(theme: any) => styles(theme)}
                styles={reactSelectStyle}
                menuPortalTarget={document.body}
                placeholder="Shipping Courier"
                name="courierName"
                value={shippingCourier?.filter(
                  (item: any) => item.label === shippingNow.courierName
                )}
                onChange={(event: any) => {
                  handleChangeShipping(event, "courierName");
                }}
              />
            </div>
            <div className="fv-row mb-4">
              <label className="required mb-2 fw-500">{t("Tracking No")}</label>
              <input
                type="text"
                name="trackingNumber"
                onChange={(e) => handleChangeShipping(e)}
                className={`form-control `}
                placeholder="Tracking Number"
                value={shippingNow.trackingNumber}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-3 px-6">
          <button
            type="button"
            className="badge badge-pill badge-danger py-3 px-4 border-0 fw-400 fa-1x text-light"
            onClick={() => {
              ModalhandleClose1();
            }}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="badge badge-pill badge-primary py-3 px-4 border-0 fw-400 fa-1x text-light"
            onClick={ShipNow}
          >
            {t("Ship Now")}
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={show}
        onHide={ModalhandleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className="m-0 p-6">
          <h4>{t("Rejection Reason")}</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-5">
            <div className="fv-row mb-4">
              <label className="required mb-2 fw-500">
                {t("Rejection Reason")}
              </label>
              <input
                type="text"
                name="rejectedReason"
                onChange={(e) => onInputChange(e)}
                className={`form-control `}
                placeholder="Rejection Reason"
                value={supplyOrders.rejectedReason}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-3 px-6">
          <button
            type="button"
            className="badge badge-pill badge-secondary py-3 px-4 border-0 fw-400 fa-1x"
            onClick={() => {
              ModalhandleClose();
            }}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="badge badge-pill badge-danger py-3 px-4 border-0 fw-400 fa-1x text-light"
            onClick={RejectNow}
          >
            {t("Reject")}
          </button>
        </Modal.Footer>
      </Modal>
      <form
        onSubmit={handleSubmit(addShippingInfo)}
        onKeyDown={handleEnterPress}
      >
        <div id="kt_app_toolbar" className="app-toolbar py-2 pt-lg-3">
          <div
            id="kt_app_toolbar_container"
            className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
          >
            <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                <li className="breadcrumb-item text-muted">
                  <a href="" className="text-muted text-hover-primary">
                    {t("Home")}
                  </a>
                </li>

                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>

                <li className="breadcrumb-item text-muted">
                  {t("Supply Management")}
                </li>

                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>

                <li className="breadcrumb-item text-muted">
                  {t("Supply Orders")}
                </li>
              </ul>
            </div>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              {!buttonsShow ||
              supplyOrders.status.toLowerCase() === "shipped" ? null : (
                <PermissionComponent
                  moduleName="Supply Management"
                  pageName="Manage Order"
                  permissionIdentifier="Update"
                >
                  <button
                    className="btn btn-sm fw-bold btn-primary"
                    type="submit"
                  >
                    {t("Update")}
                  </button>
                </PermissionComponent>
              )}
              {/* {!buttonsShow || supplyOrders.status === "shipped" ? null : supplyOrders.status==="Viewed"? ( */}
              {!buttonsShow ||
              supplyOrders.status.toLowerCase() === "shipped" ? null : (
                <PermissionComponent
                  moduleName="Supply Management"
                  pageName="Manage Order"
                  permissionIdentifier="OrderViewShip"
                >
                  <button
                    className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-light"
                    type="button"
                    onClick={() => {
                      if (hasPermission) {
                        ShipNow();
                      } else {
                        handleOpenModal();
                      }
                    }}
                  >
                    {t("Ship")}
                  </button>
                </PermissionComponent>
              )}
              {!buttonsShow ||
              supplyOrders.status.toLowerCase() === "shipped" ? null : (
                <PermissionComponent
                  moduleName="Supply Management"
                  pageName="Manage Order"
                  permissionIdentifier="Reject"
                >
                  <button
                    className="btn btn-sm fw-bold btn-danger"
                    type="button"
                    onClick={() => setShow(true)}
                  >
                    {t("Reject")}
                  </button>
                </PermissionComponent>
              )}
              <button
                className="btn btn-secondary btn-sm fw-bold "
                aria-controls="SearchCollapse"
                aria-expanded="true"
                type="button"
                onClick={() => reset()}
              >
                <span>
                  <span>{t("Cancel")}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="app-container container-fluid">
          <div id="ModalCollapse" className="card mb-5">
            <div className="align-items-center card-header d-flex justify-content-center justify-content-sm-between gap-1">
              <h4 className="m-1">{t("Shipping Information")}</h4>
            </div>
            <div id="form-search" className=" card-body">
              <div className="mb-5">
                <span className="text-primary fw-700">{t("Shipping to:")}</span>{" "}
                <span className=" text-primary fw-500">
                  {supplyOrders?.shippingAddress}
                </span>
              </div>
              <div className="row">
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Date of Request")}
                    </label>
                    <input
                      {...register("dateofRequest", { required: true })}
                      type="date"
                      name="dateofRequest"
                      onChange={(e) => onInputChange(e)}
                      className={`form-control `}
                      placeholder="Date of Request"
                      value={moment(
                        formatDate(supplyOrders.dateofRequest),
                        "MM/DD/YYYY"
                      ).format("YYYY-MM-DD")}
                      // disabled={id > 0}
                    />
                    {errors.dateofRequest && (
                      <p className="text-danger px-2">
                        {t("Please enter the Date of Request.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Representative Name")}
                    </label>
                    <input
                      {...register("representativeName", { required: true })}
                      type="text"
                      name="representativeName"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Representative Name"
                      value={supplyOrders?.representativeName}
                    />
                    {errors.representativeName && (
                      <p className="text-danger px-2">
                        {t("Please enter the Representative Name.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Representative Phone Number")}
                    </label>
                    <InputMask
                      mask="(999) 999-9999"
                      value={supplyOrders?.representativePhone}
                      {...register("representativePhone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\(\d{3}\) \d{3}-\d{4}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      type="tel"
                      name="representativePhone"
                      onChange={onInputChange}
                      onKeyDown={handleKeyPress}
                      className={`form-control bg-transparent ${
                        errors.representativePhone ? "is-invalid" : ""
                      }`}
                      placeholder="(999) 999-9999"
                      inputMode="numeric"
                    />
                    <>{(inputProps: any) => <input {...inputProps} />}</>

                    {errors.representativePhone && (
                      <p className="text-danger px-2">
                        {t("Phone number must be 10 digits.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Shipping Address")}
                    </label>
                    <input
                      {...register("shippingAddress", { required: true })}
                      type="text"
                      name="shippingAddress"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Shipping Address"
                      value={supplyOrders?.shippingAddress}
                    />
                    {errors.shippingAddress && (
                      <p className="text-danger px-2">
                        {t("Please enter the Shipping Address.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">{t("City")}</label>
                    <input
                      {...register("city", { required: true })}
                      type="text"
                      name="city"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="City"
                      value={supplyOrders?.city}
                    />
                    {errors.city && (
                      <p className="text-danger px-2">
                        {t("Please enter city name.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500 required">{t("State")}</label>
                    <Select
                      menuPortalTarget={document.body}
                      {...register("stateId", { required: true })}
                      options={dropdownStates}
                      theme={(theme: any) => styles(theme)}
                      placeholder="State"
                      name="stateId"
                      value={dropdownStates?.filter(
                        (item: any) => item.value === supplyOrders.stateId
                      )}
                      onChange={(event: any) => {
                        handleChange(event, "stateId");
                      }}
                    />
                    {errors.stateId && (
                      <p className="text-danger px-2">
                        {t("Please select the State.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Zip Code")}
                    </label>
                    <input
                      {...register("zipCode", {
                        required: true,
                        pattern: {
                          value: /^\d{5}$/,
                          message: "Zip Code must be 5 digits",
                        },
                      })}
                      type="text"
                      name="zipCode"
                      onChange={(e) => onInputChange(e)}
                      onKeyDown={(e) => handleKeyPress(e)}
                      className="form-control bg-transparent"
                      placeholder="Zip Code"
                      value={supplyOrders?.zipCode}
                      maxLength={5}
                      inputMode="numeric"
                    />
                    {errors.zipCode && (
                      <p className="text-danger px-2">
                        {t("Zip Code must be 5 digits.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">{t("Phone")}</label>
                    <InputMask
                      mask="(999) 999-9999"
                      value={supplyOrders?.phoneNo}
                      {...register("phoneNo", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\(\d{3}\) \d{3}-\d{4}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      type="tel"
                      name="phoneNo"
                      onChange={onInputChange}
                      onKeyDown={handleKeyPress}
                      className={`form-control bg-transparent ${
                        errors.phoneNo ? "is-invalid" : ""
                      }`}
                      placeholder="(999) 999-9999"
                      inputMode="numeric"
                    />
                    <>{(inputProps: any) => <input {...inputProps} />}</>

                    {errors.phoneNo && (
                      <p className="text-danger px-2">
                        {t("Phone number must be 10 digits.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500 required">
                      {t("Facility Name")}
                    </label>
                    <Select
                      menuPortalTarget={document.body}
                      {...register("facilityId", { required: true })}
                      options={dropdown}
                      theme={(theme: any) => styles(theme)}
                      placeholder="Facility Name"
                      name="facilityId"
                      value={dropdown?.filter(
                        (item: any) => item.value === supplyOrders?.facilityId
                      )}
                      onChange={(event: any) => {
                        handleChange(event, "facilityId");
                      }}
                    />
                    {errors.facilityId && (
                      <p className="text-danger px-2">
                        {t("Please select the facility name.")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="app-container container-fluid">
          <div className="card">
            <div className="align-items-center card-header d-flex justify-content-center justify-content-sm-between gap-1">
              <h4 className="m-1">{t("Supplies Information")}</h4>
            </div>
            <div className="align-items-center card-header d-flex justify-content-center justify-content-sm-between gap-1 mt-5 pb-5">
              <Box sx={{ height: "auto", width: "100%" }}>
                <div className="table_bordered overflow-hidden">
                  <TableContainer
                    sx={{
                      maxHeight: "calc(100vh - 100px)",
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
                      className="table table-cutome-expend table-bordered table-sticky-header plate-mapping-table table-bg table-head-custom table-vertical-center border-0 mb-0 "
                    >
                      <TableHead style={{ zIndex: 0 }}>
                        <TableRow className="h-40px">
                          <TableCell>{t("Item Type")}</TableCell>
                          <TableCell>{t("QTY Requested")}</TableCell>
                          <TableCell>{t("QTY Approved")}</TableCell>
                          <TableCell>{t("Item")}</TableCell>
                          <TableCell>{t("Description")}</TableCell>
                          <TableCell>{t("Special Request")}</TableCell>
                          <TableCell>{t("Comments")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {supplyOrders?.supplyOrderItems?.length ? (
                          supplyOrders?.supplyOrderItems?.map(
                            (item: any, index: number) => (
                              <TableRow key={item.id}>
                                <TableCell>{item?.itemType}</TableCell>
                                <TableCell>
                                  <input
                                    {...register(
                                      `supplyOrder.${index}.orderQuantityRequested`
                                    )}
                                    type="text"
                                    name="orderQuantityRequested"
                                    // onChange={(e) => onInputChange(e)}
                                    className="form-control"
                                    placeholder="Order Quantity Requested"
                                    value={item.orderQuantityRequested}
                                    disabled={true}
                                  />
                                </TableCell>
                                <TableCell className="position-relative">
                                  <input
                                    {...register(
                                      `supplyOrder.${index}.orderQuantityApproved`,
                                      { required: true }
                                    )}
                                    onKeyDown={(e) => handleKeyPress(e)}
                                    type="text"
                                    name="orderQuantityApproved"
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "orderQuantityApproved",
                                        e.target.value
                                      )
                                    }
                                    className={`form-control ${
                                      (errors as any).supplyOrder?.[index]
                                        ?.orderQuantityApproved
                                        ? "border-danger"
                                        : ""
                                    }`}
                                    placeholder="Order Quantity Approved"
                                    value={item?.orderQuantityApproved}
                                  />
                                </TableCell>
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell>{item.itemDescription}</TableCell>
                                <TableCell>
                                  <textarea
                                    className="form-control fw-400 fs-7 p-2 rounded"
                                    name="specialRequest"
                                    placeholder="Special Request"
                                    rows={2}
                                    value={item?.specialRequest}
                                    // disabled={!row?.rowStatus}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "specialRequest",
                                        e.target.value
                                      )
                                    }
                                  ></textarea>
                                </TableCell>
                                <TableCell>
                                  <textarea
                                    className="form-control fw-400 fs-7 p-2 rounded"
                                    name="comments"
                                    placeholder="Comments"
                                    rows={2}
                                    value={item?.comments}
                                    onChange={(e) =>
                                      handleItemChange(
                                        index,
                                        "comments",
                                        e.target.value
                                      )
                                    }
                                  ></textarea>
                                </TableCell>
                              </TableRow>
                            )
                          )
                        ) : (
                          <NoRecord />
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default ViewOrders;
