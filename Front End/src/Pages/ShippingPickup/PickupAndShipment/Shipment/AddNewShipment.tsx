import { Collapse } from "@mui/material";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import Radio from "../../../../Shared/Common/Input/Radio";
import LoadButton from "../../../../Shared/Common/LoadButton";
import { useCourierContext } from "../../../../Shared/CourierContext";
import { styles } from "../../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";

function AddNewShipment(props: { modalShow: boolean; setModalShow: any }) {
  const { modalShow, setModalShow } = props;
  const { courierName, loadDataShipment, tabs } = useCourierContext();
  const [pickupStartTime, setPickUpStartTime] = useState<any>(null);
  const [pickupEndTime, setPickUpEndTime] = useState<any>(null);
  const [dropdownStates, setDropdownStates] = useState([]);
  const [dropdownAccount, setDropdownAccount] = useState([]);
  const [pickupError, setPickupError] = useState(false);
  const dropdownPackageType = [
    { value: "UPS Letter", label: "UPS Letter" },
    { value: "My Packaging", label: "My Packaging" },
    { value: "UPS Tube", label: "UPS Tube" },
    { value: "UPS PAK", label: "UPS PAK" },
    { value: "UPS Express Box(Small)", label: "UPS Express Box(Small)" },
    { value: "UPS Express Box(Medium)", label: "UPS Express Box(Medium)" },
    { value: "UPS Express Box(Large)", label: "UPS Express Box(Large)" },
  ];
  const dropdownServiceType = [
    { value: "Next Day Air", label: "Next Day Air" },
    { value: "2nd Day Air", label: "2nd Day Air" },
    { value: "Ground", label: "Ground" },
    { value: "Express", label: "Express" },
    { value: "3 Day Select", label: "3 Day Select" },
    { value: "Next Day Air Saver", label: "Next Day Air Saver" },
    { value: "UPS Next Day Air® Early", label: "UPS Next Day Air® Early" },
    { value: "2nd Day Air A.M.", label: "2nd Day Air A.M." },
  ];

  const handlePickupStart = (value: string) => {
    let pickupStartTimeInSecs = convertTimeToSeconds(value);
    setPickUpStartTime(+pickupStartTimeInSecs);
  };
  const handlePickupEnd = (value: string) => {
    let pickupEndTimeInSecs = convertTimeToSeconds(value);
    setPickUpEndTime(+pickupEndTimeInSecs);
  };

  const convertTimeToSeconds = (timeString: string) => {
    const timeMoment = moment(timeString, "HH:mm");

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams().courierName;
  const initialScheduleShipment = {
    id: 0,
    courierName: params,
    accountName: "",
    senderName: "",
    senderCompanyName: "",
    senderAddress: "",
    senderAddress2: "",
    senderCity: "",
    senderStateId: 0,
    senderZipCode: "",
    senderPhoneNumber: "",
    recipentName: "",
    recipentCompanyName: "",
    recipentAddress: "",
    recipentAddress2: "",
    recipentCity: "",
    recipentStateId: 0,
    recipentZipCode: "",
    recipentPhoneNumber: "",
    shipmentDate: null,
    packageType: "",
    serviceType: "",
    packagesCount: null,
    packageWeight: null,
    packageDescription: "",
    schedulePickup: "false",
    pickupDate: null,
    startPickupTime: null,
    endPickupTime: null,
    remarks: "",
    trackingNumber: "",
  };
  const [scheduleShipment, setScheduleShipment] = useState(
    initialScheduleShipment
  );
  const {
    id,
    accountName,
    senderName,
    senderCompanyName,
    senderAddress,
    senderAddress2,
    senderCity,
    senderStateId,
    senderZipCode,
    senderPhoneNumber,
    recipentName,
    recipentCompanyName,
    recipentAddress,
    recipentAddress2,
    recipentCity,
    recipentStateId,
    recipentZipCode,
    recipentPhoneNumber,
    shipmentDate,
    packageType,
    serviceType,
    packagesCount,
    packageWeight,
    packageDescription,
    schedulePickup,
    pickupDate,
    startPickupTime,
    endPickupTime,
    remarks,
    trackingNumber,
  } = scheduleShipment;

  const { t } = useLang();

  const addScheduleShipment = (e: any) => {
    setIsSubmitting(true);
    InsuranceService.SaveShipment({
      ...scheduleShipment,
      packagesCount: parseInt(packagesCount as any),
      packageWeight: parseInt(packageWeight as any),
      schedulePickup: schedulePickup === "true" ? true : false,
      startPickupTime:
        schedulePickup === "true" ? `${pickupDate}T${startPickupTime}` : null,
      endPickupTime:
        schedulePickup === "true" ? `${pickupDate}T${endPickupTime}` : null,
    })
      .then((res: any) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          reset();
          setIsSubmitting(false);
          loadDataShipment(true, false);
        }
      })
      .catch((err: any) => {
        console.log(err, "err while creating Insurance Provide Assigment");
        setIsSubmitting(false);
      });
  };
  // React hook form start
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    reset: HookFormReset,
    formState: { errors },
  } = useForm<any>();

  const handleKeyPressed = (e: any) => {
    const keyCode = e.charCode || e.keyCode;
    const allowedKeyCodes = [8, 9, 37, 38, 39, 40, 46]; // 8: backspace, 9: tab, 37: left arrow, 38: up arrow, 39: right arrow, 40: down arrow, 40: delete
    if ((keyCode < 48 || keyCode > 57) && !allowedKeyCodes.includes(keyCode)) {
      e.preventDefault();
    }
  };

  const onInputChange = (event: any) => {
    const { name, value } = event.target;
    setScheduleShipment({
      ...scheduleShipment,
      [name]: value,
    });
    setValue(name, value);
    clearErrors(name);
  };

  const handleChange = (e: any, name: string) => {
    setScheduleShipment((prev) => ({
      ...prev,
      [name]: e.value,
    }));
    setValue(name, e.value);
    clearErrors(name);
  };

  const handleEnterPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  // React hook form end
  const reset = () => {
    setModalShow(false);
    setScheduleShipment(initialScheduleShipment);
    clearErrors();
    HookFormReset(initialScheduleShipment);
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
  const GetAccountName = () => {
    InsuranceService.GetAccountName(courierName)
      .then((res: AxiosResponse) => {
        setDropdownAccount(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  useEffect(() => {
    loadStatesLookUp();
  }, []);

  useEffect(() => {
    setScheduleShipment(initialScheduleShipment);
  }, [params, tabs]);

  useEffect(() => {
    if (!courierName) return;
    GetAccountName();
  }, [courierName]);

  return (
    <>
      <Collapse in={modalShow}>
        <form
          onSubmit={handleSubmit(addScheduleShipment)}
          onKeyDown={handleEnterPress}
        >
          <div id="ModalCollapse" className="card mb-5">
            <div className="align-items-center bg-light-warning card-header minh-42px d-flex justify-content-center justify-content-sm-between gap-1">
              <h4 className="m-1">{t("Schedule a Shipment")}</h4>
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <button
                  className="btn btn-secondary btn-sm fw-bold "
                  aria-controls="SearchCollapse"
                  aria-expanded="true"
                  onClick={() => reset()}
                  type="button"
                >
                  <span>
                    <span>{t("Cancel")}</span>
                  </span>
                </button>
                <LoadButton
                  className="btn btn-sm fw-bold btn-primary"
                  // loading={isSubmitting}
                  btnText="Save"
                  loadingText={t("Saving")}
                />
              </div>
            </div>

            <div id="form-search" className="card-body py-2 py-md-3">
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500 required">
                    {t("Select Account")}
                  </label>
                  <Select
                    menuPortalTarget={document.body}
                    {...register("accountName", { required: true })}
                    options={dropdownAccount}
                    theme={(theme: any) => styles(theme)}
                    placeholder="Account Name"
                    name="accountName"
                    value={dropdownAccount?.filter(
                      (item: any) => item.value === accountName
                    )}
                    onChange={(event: any) => {
                      handleChange(event, "accountName");
                    }}
                  />
                  {errors.accountName && (
                    <p className="text-danger px-2">
                      {t("Please select a account")}
                    </p>
                  )}
                </div>
              </div>
              <div className="row">
                <p className="text-primary fw-bold">{t("Sender Address")}</p>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">{t("Name")}</label>
                    <span className="fs-9">
                      {t("(Or doctor name consider as contact name)")}
                    </span>
                    <input
                      {...register("senderName", { required: true })}
                      type="text"
                      name="senderName"
                      onChange={(e) => onInputChange(e)}
                      className={`form-control
                        "bg-transparent"
                      `}
                      placeholder="Sender Name"
                      value={senderName}
                    />
                    {errors.senderName && (
                      <p className="text-danger px-2">
                        {t("Please enter the Contact Name.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Company Name")}
                    </label>
                    <input
                      {...register("senderCompanyName", { required: true })}
                      type="text"
                      name="senderCompanyName"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Company Name"
                      value={senderCompanyName}
                    />
                    {errors.senderCompanyName && (
                      <p className="text-danger px-2">
                        {t("Please enter the Company Name")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Address")}
                    </label>
                    <input
                      {...register("senderAddress", {
                        required: true,
                      })}
                      type="text"
                      name="senderAddress"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Address"
                      value={senderAddress}
                    />
                    {errors.senderAddress && (
                      <p className="text-danger px-2">
                        {t("Please enter the address")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Address 2")}</label>
                    <input
                      type="text"
                      name="senderAddress2"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Sender Address 2"
                      value={senderAddress2}
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">{t("City")}</label>
                    <input
                      {...register("senderCity", {
                        required: true,
                      })}
                      type="text"
                      name="senderCity"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="City"
                      value={senderCity as any}
                    />
                    {errors.senderCity && (
                      <p className="text-danger px-2">
                        {t("Please enter the city name")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500 required">{t("State")}</label>
                    <Select
                      menuPortalTarget={document.body}
                      {...register("senderStateId", { required: true })}
                      options={dropdownStates}
                      theme={(theme: any) => styles(theme)}
                      placeholder="State"
                      name="senderStateId"
                      value={dropdownStates?.filter(
                        (item: any) => item.value == senderStateId
                      )}
                      onChange={(event: any) => {
                        handleChange(event, "senderStateId");
                      }}
                    />
                    {errors.senderStateId && (
                      <p className="text-danger px-2">
                        {t("Please select the state")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Zip Code")}
                    </label>
                    <input
                      {...register("senderZipCode", {
                        required: true,
                        pattern: {
                          value: /^\d{5}$/,
                          message: "Issue",
                        },
                      })}
                      type="text"
                      name="senderZipCode"
                      onChange={(e) => onInputChange(e)}
                      onKeyDown={(e) => handleKeyPressed(e)}
                      className="form-control bg-transparent"
                      placeholder="Zip Code"
                      value={senderZipCode as any}
                      maxLength={5}
                      inputMode="numeric"
                    />
                    {errors.senderZipCode && (
                      <p className="text-danger px-2">
                        {t("Zip Code must be 5 digits.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Phone Number")}
                    </label>
                    <InputMask
                      mask="(999) 999-9999"
                      value={senderPhoneNumber}
                      {...register("senderPhoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\(\d{3}\) \d{3}-\d{4}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      type="tel"
                      name="senderPhoneNumber"
                      onChange={onInputChange}
                      onKeyDown={handleKeyPressed}
                      className={`form-control bg-transparent ${
                        errors.senderPhoneNumber ? "is-invalid" : ""
                      }`}
                      placeholder="(999) 999-9999"
                      inputMode="numeric"
                    />
                    {errors.senderPhoneNumber && (
                      <p className="text-danger px-2">
                        {t("Phone number must be 10 digits.")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <p className="text-primary fw-bold">{t("Recipient Address")}</p>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">{t("Name")}</label>
                    <span className="fs-9">
                      {t("(Or doctor name consider as contact name)")}
                    </span>
                    <input
                      {...register("recipentName", { required: true })}
                      type="text"
                      name="recipentName"
                      onChange={(e) => onInputChange(e)}
                      className={`form-control
                        "bg-transparent"
                      `}
                      placeholder="Contact Name"
                      value={recipentName}
                    />
                    {errors.recipentName && (
                      <p className="text-danger px-2">
                        {t("Please enter the Contact Name.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Company Name")}
                    </label>
                    <input
                      {...register("recipentCompanyName", { required: true })}
                      type="text"
                      name="recipentCompanyName"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Company Name"
                      value={recipentCompanyName}
                    />
                    {errors.recipentCompanyName && (
                      <p className="text-danger px-2">
                        {t("Please enter the Company Name")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Address")}
                    </label>
                    <input
                      {...register("recipentAddress", {
                        required: true,
                      })}
                      type="text"
                      name="recipentAddress"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Address"
                      value={recipentAddress}
                    />
                    {errors.recipentAddress && (
                      <p className="text-danger px-2">
                        {t("Please enter the address")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Address 2")}</label>
                    <input
                      type="text"
                      name="recipentAddress2"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Recipent Address 2"
                      value={recipentAddress2}
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">{t("City")}</label>
                    <input
                      {...register("recipentCity", {
                        required: true,
                      })}
                      type="text"
                      name="recipentCity"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="City"
                      value={recipentCity as any}
                    />
                    {errors.recipentCity && (
                      <p className="text-danger px-2">
                        {t("Please enter the city name")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500 required">{t("State")}</label>
                    <Select
                      menuPortalTarget={document.body}
                      {...register("recipentStateId", { required: true })}
                      options={dropdownStates}
                      theme={(theme: any) => styles(theme)}
                      placeholder="State"
                      name="recipentStateId"
                      value={dropdownStates?.filter(
                        (item: any) => item.value == recipentStateId
                      )}
                      onChange={(event: any) => {
                        handleChange(event, "recipentStateId");
                      }}
                    />
                    {errors.recipentStateId && (
                      <p className="text-danger px-2">
                        {t("Please select the state")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Zip Code")}
                    </label>
                    <input
                      {...register("recipentZipCode", {
                        required: true,
                        pattern: {
                          value: /^\d{5}$/,
                          message: "Issue",
                        },
                      })}
                      type="text"
                      name="recipentZipCode"
                      onChange={(e) => onInputChange(e)}
                      onKeyDown={(e: any) => handleKeyPressed(e)}
                      className="form-control bg-transparent"
                      placeholder="Zip Code"
                      value={recipentZipCode as any}
                      maxLength={5}
                      inputMode="numeric"
                    />
                    {errors.recipentZipCode && (
                      <p className="text-danger px-2">
                        {t("Zip Code must be 5 digits.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Phone Number")}
                    </label>
                    <InputMask
                      mask="(999) 999-9999"
                      value={recipentPhoneNumber}
                      {...register("recipentPhoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\(\d{3}\) \d{3}-\d{4}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      type="tel"
                      name="recipentPhoneNumber"
                      onChange={onInputChange}
                      onKeyDown={handleKeyPressed}
                      className={`form-control bg-transparent ${
                        errors.recipentPhoneNumber ? "is-invalid" : ""
                      }`}
                      placeholder="(999) 999-9999"
                      inputMode="numeric"
                    />
                    <>{(inputProps: any) => <input {...inputProps} />}</>
                    {errors.recipentPhoneNumber && (
                      <p className="text-danger px-2">
                        {t("Phone number must be 10 digits.")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <p className="text-primary fw-bold">{t("Shipment Info")}</p>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Shipment Date")}
                    </label>
                    <input
                      {...register("shipmentDate", {
                        required: true,
                      })}
                      type="date"
                      name="shipmentDate"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Shipment Date"
                      value={shipmentDate ?? ""}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.shipmentDate && (
                      <p className="text-danger px-2">
                        {t("Please enter the Pickup Date")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500 required">
                      {t("Package Type")}
                    </label>
                    <Select
                      menuPortalTarget={document.body}
                      {...register("packageType", { required: true })}
                      options={dropdownPackageType}
                      theme={(theme: any) => styles(theme)}
                      placeholder="Package Type"
                      name="packageType"
                      value={dropdownPackageType?.filter(
                        (item: any) => item.value == packageType
                      )}
                      onChange={(event: any) => {
                        handleChange(event, "packageType");
                      }}
                    />
                    {errors.packageType && (
                      <p className="text-danger px-2">
                        {t("Please select the package type")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500 required">
                      {t("Service Type")}
                    </label>
                    <Select
                      menuPortalTarget={document.body}
                      {...register("serviceType", { required: true })}
                      options={dropdownServiceType}
                      theme={(theme: any) => styles(theme)}
                      placeholder="Service Type"
                      name="serviceType"
                      styles={{
                        // Fixes the overlapping problem of the component
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
                      value={dropdownServiceType?.filter(
                        (item: any) => item.value == serviceType
                      )}
                      onChange={(event: any) => {
                        handleChange(event, "serviceType");
                      }}
                    />
                    {errors.serviceType && (
                      <p className="text-danger px-2">
                        {t("Please select the service type")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Packages Count")}
                    </label>
                    <input
                      {...register("packagesCount", {
                        required: true,
                        validate: (value) => {
                          // Ensure the value is not zero
                          if (value === "0" || value === 0) {
                            return "Packages count cannot be zero";
                          }
                          return true; // Validation passes
                        },
                      })}
                      type="text"
                      name="packagesCount"
                      onChange={(e) => onInputChange(e)}
                      onKeyDown={(e) => handleKeyPressed(e)}
                      className="form-control bg-transparent"
                      placeholder="Package Count"
                      value={packagesCount ?? ""}
                    />
                    {errors.packagesCount && (
                      <p className="text-danger px-2">
                        {errors.packagesCount?.type === "required"
                          ? t("Please enter the packages count")
                          : t(errors.packagesCount?.message as string)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Package Weight")}</label>
                    <span className="fs-9">{t("(--in pounds)")}</span>
                    <input
                      {...register("packageWeight", {
                        validate: (value) => {
                          // Ensure the value is not zero
                          if (value === "0" || value === 0) {
                            return "Package Weight cannot be zero";
                          }
                          return true; // Validation passes
                        },
                      })}
                      type="number"
                      name="packageWeight"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Package Weight"
                      value={packageWeight ?? ""}
                    />
                    <p className="text-danger px-2">
                      {t(errors.packageWeight?.message as string)}
                    </p>
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">
                      {t("Package Description")}
                    </label>
                    <input
                      type="text"
                      name="packageDescription"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder="Package Description"
                      value={packageDescription}
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row">
                    <Radio
                      label="Schedule Pickup"
                      name="schedulePickup"
                      onChange={onInputChange}
                      choices={[
                        {
                          id: "0",
                          label: "Yes",
                          value: "true",
                        },
                        {
                          id: "1",
                          label: "No",
                          value: "false",
                        },
                      ]}
                      checked={schedulePickup.toString()}
                    />
                  </div>
                </div>
                {schedulePickup == "true" ? (
                  <>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row">
                        <label className="required mb-2 fw-500">
                          {t("Pickup Date")}
                        </label>
                        <input
                          {...register("pickupDate", {
                            required: true,
                          })}
                          type="date"
                          name="pickupDate"
                          onChange={(e) => onInputChange(e)}
                          className="form-control bg-transparent"
                          placeholder="Pickup Date"
                          value={pickupDate ?? ""}
                        />
                        {errors.pickupDate && (
                          <p className="text-danger px-2">
                            {t("Please enter the Pickup Date")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-4">
                        <label className="required mb-2 fw-500">
                          {t("Start Pickup Time")}
                        </label>
                        <input
                          {...register("startPickupTime", {
                            required: true,
                          })}
                          type="time"
                          name="startPickupTime"
                          onChange={(e) => {
                            handlePickupStart(e.target.value);
                            onInputChange(e);
                          }}
                          className="form-control bg-transparent"
                          placeholder="Start Pickup Time"
                          value={startPickupTime ?? ""}
                        />
                        {errors.startPickupTime && (
                          <p className="text-danger px-2">
                            {t("Please enter the Start Pickup Time")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-4">
                        <label className="required mb-2 fw-500">
                          {t("End Pickup Time")}
                        </label>
                        <input
                          {...register("endPickupTime", {
                            required: true,
                          })}
                          type="time"
                          name="endPickupTime"
                          onChange={(e) => {
                            handlePickupEnd(e.target.value);
                            onInputChange(e);
                          }}
                          className={`form-control `}
                          placeholder="End Pickup Time"
                          value={endPickupTime ?? ""}
                        />
                        {errors.endPickupTime && (
                          <p className="text-danger px-2">
                            {t("Please enter the end Pickup Time")}
                          </p>
                        )}
                        {pickupError ? (
                          <span className="text-danger p-2">
                            {t("End time should be greater than start time")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <div className="fv-row mb-4">
                        <label className="mb-2 fw-500">{t("Remarks")}</label>
                        <input
                          type="text"
                          name="remarks"
                          onChange={(e) => onInputChange(e)}
                          className="form-control bg-transparent"
                          placeholder="Packages Count"
                          value={remarks}
                        />
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </form>
      </Collapse>
    </>
  );
}

export default AddNewShipment;
