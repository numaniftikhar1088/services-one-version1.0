import { Collapse } from "@mui/material";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import Select from "react-select";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import LoadButton from "../../../../Shared/Common/LoadButton";
import { useCourierContext } from "../../../../Shared/CourierContext";
import { styles } from "../../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";
import UserManagementService from "Services/UserManagement/UserManagementService";
import { GetFacilityById } from "Services/UserManagement/ManageOrder";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";

function AddNewPickup(props: { modalShow: boolean; setModalShow: any }) {
  const { t } = useLang();

  const { modalShow, setModalShow } = props;

  const courierName = useParams().courierName;
  const { loadData, tabs } = useCourierContext();
  const [pickupStartTime, setPickUpStartTime] = useState<any>(null);
  const [pickupEndTime, setPickUpEndTime] = useState<any>(null);
  const [pickupError, setPickupError] = useState(false);
  const [dropdownStates, setDropdownStates] = useState<any>([]);
  const [dropdownFacility, setDropdownFacility] = useState([]);

  const initialSchedulePickup = {
    courierName: courierName,
    contactName: "",
    facilityId: "",
    address: "",
    address2: "",
    city: "",
    stateId: "",
    zipCode: "",
    phoneNumber: "",
    pickupDate: null,
    startPickupTime: null,
    endPickupTime: null,
    packagesCount: "",
    packageWeight: "",
    remarks: "",
    dispatchConfirmationNo: "",
    location: "",
    trackingNumber: "",
  };

  const [schedulePickup, setSchedulePickup] = useState<any>(
    initialSchedulePickup
  );

  const handlePickupStart = (value: string) => {
    const pickupStartTimeInSecs = convertTimeToSeconds(value);
    setPickUpStartTime(+pickupStartTimeInSecs);
  };
  const handlePickupEnd = (value: string) => {
    const pickupEndTimeInSecs = convertTimeToSeconds(value);
    setPickUpEndTime(+pickupEndTimeInSecs);
  };

  const loadFacilitiesLookUp = () => {
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setDropdownFacility(res?.data);
        if (res?.data?.length === 1) {
          setSchedulePickup({
            ...schedulePickup,
            facilityId: res?.data[0]?.value,
          });
          setValue("facilityId", res?.data[0]?.value);

          clearErrors();
        }
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const convertTimeToSeconds = (timeString: string) => {
    const timeMoment = moment(timeString, "HH:mm");

    const totalSeconds = timeMoment.hours() * 3600 + timeMoment.minutes() * 60;
    return totalSeconds;
  };

  const {
    contactName,
    facilityId,
    address,
    address2,
    city,
    stateId,
    zipCode,
    phoneNumber,
    pickupDate,
    startPickupTime,
    endPickupTime,
    packagesCount,
    packageWeight,
    remarks,
    trackingNumber,
  } = schedulePickup;
  console.log("pickupDatesssss", pickupDate);

  const addSchedulePickup = () => {
    const pickupDateFormatted = moment(pickupDate).format("YYYY-MM-DD");
    InsuranceService.SavePickup({
      ...schedulePickup,
      startPickupTime: `${pickupDateFormatted}T${startPickupTime}`,
      endPickupTime: `${pickupDateFormatted}T${endPickupTime}`,
      pickupDate: pickupDateFormatted,
      packagesCount: parseInt(packagesCount),
      packageWeight: parseFloat(packageWeight),
    })
      .then((res: any) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          reset();
          loadData();
        } else {
          toast.error(t(res?.data?.message));
          reset();
          loadData();
        }
      })
      .catch((err: any) => {
        console.log(err, t("err while creating Insurance Provide Assigment"));
      });
  };
  // React hook form start
  const {
    register,
    handleSubmit,
    clearErrors,
    control,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const handleKeyPressed = (e: any) => {
    const keyCode = e.charCode || e.keyCode;
    const allowedKeyCodes = [
      8, // Backspace
      9, // Tab
      37, // Left arrow
      38, // Up arrow
      39, // Right arrow
      40, // Down arrow
      46, // Delete
      190, // Period (.)
      110, // Numpad decimal (.)
    ];

    const isNumberKey =
      (keyCode >= 48 && keyCode <= 57) || // Top row numbers
      (keyCode >= 96 && keyCode <= 105); // Numpad numbers

    if (!isNumberKey && !allowedKeyCodes.includes(keyCode)) {
      e.preventDefault();
    }
  };

  const onInputChange = (event: any) => {
    const { name, value } = event.target;
    console.log("input change", name, value);
    setSchedulePickup({
      ...schedulePickup,
      [name]: value,
    });
    setValue(name, value);
    clearErrors(name);
  };

  const handleChange = (e: any, name: string) => {
    console.log("selected option", e, name);
    setSchedulePickup((prev: any) => ({
      ...prev,
      [name]: e.value,
    }));
    setValue(name, e.value);
    clearErrors(name);
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

  const handleEnterPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const showData = async () => {
    const resp = await GetFacilityById(schedulePickup.facilityId);
    const data = resp.data.data;

    const selectedState = dropdownStates.find(
      (state: any) => state.value === data?.stateId
    );
    const stateId = selectedState ? selectedState.value : 0;
    const hh = (new Date().getHours() + 2) % 24;
    const formattedHours = hh.toString().padStart(2, "0");
    const mm = new Date().getMinutes().toString().padStart(2, "0");

    const pickupData = {
      ...schedulePickup,
      courierName: courierName,
      contactName: data.representativeName,
      address: data.address,
      city: data.city,
      stateId: stateId,
      zipCode: data.zipCode,
      phoneNumber: data.contactPhone.replace(/-/g, " "),
      pickupDate: moment(new Date()).format("MM/DD/YYYY"),
      startPickupTime: moment(new Date()).format("HH:mm"),
      endPickupTime: `${formattedHours}:${mm}`,
    };

    Object.entries(pickupData).forEach(([key, value]) => {
      setValue(key, value);
      if (value) clearErrors(key);
    });
    setSchedulePickup(pickupData);
  };

  const reset = () => {
    setModalShow(false);
    setSchedulePickup(initialSchedulePickup);
    clearErrors();
    Object.entries(initialSchedulePickup).forEach(([key, value]) => {
      setValue(key, value);
    });
  };

  useEffect(() => {
    if (schedulePickup.facilityId) {
      showData();
    }
  }, [schedulePickup.facilityId]);

  useEffect(() => {
    loadStatesLookUp();
    loadFacilitiesLookUp();
  }, []);

  useEffect(() => {
    if (pickupStartTime && pickupEndTime) {
      if (pickupEndTime < pickupStartTime) {
        setPickupError(true);
      } else {
        setPickupError(false);
      }
    }
  }, [pickupEndTime, pickupStartTime]);

  useEffect(() => {
    setSchedulePickup({
      ...schedulePickup,
      courierName,
    });
  }, [courierName]);

  useEffect(() => {
    setSchedulePickup(initialSchedulePickup);
  }, [courierName, tabs]);

  return (
    <>
      <Collapse in={modalShow}>
        <form
          onSubmit={handleSubmit(addSchedulePickup)}
          onKeyDown={handleEnterPress}
        >
          <div id="ModalCollapse" className="card mb-5">
            <div className="align-items-center bg-light-warning card-header minh-42px d-flex justify-content-center justify-content-sm-between gap-1">
              <h4 className="m-1">{t("Schedule a Pickup")}</h4>
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <button
                  id={`ShipingAndPickupPickupCancel`}
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
                  id={`ShipingAndPickupPickupSave`}
                  className="btn btn-sm fw-bold btn-primary"
                  // loading={isSubmitting}
                  btnText="Save"
                  loadingText={t("Saving")}
                />
              </div>
            </div>

            <div id="form-search" className=" card-body py-2 py-md-3">
              <div className="row">
                <span className="text-danger fw-bold my-3">
                  {t(
                    "Attention: Pickups must be scheduled by Noon of the pickup date"
                  )}
                </span>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Company Name")}
                    </label>
                    <Select
                      inputId={`ShipingAndPickupPickupCompenyName`}
                      menuPortalTarget={document.body}
                      {...register("facilityId", { required: true })}
                      options={dropdownFacility}
                      theme={(theme: any) => styles(theme)}
                      placeholder={t("Company Name")}
                      name="facilityId"
                      value={dropdownFacility?.filter(
                        (item: any) => item.value === facilityId
                      )}
                      onChange={(event: any) => {
                        handleChange(event, "facilityId");
                      }}
                    />
                    {errors.facilityId && (
                      <p className="text-danger px-2">
                        {t("Please enter the Company Name")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Contact Name")}
                    </label>
                    <input
                      id={`ShipingAndPickupPickupContectName`}
                      {...register("contactName", { required: true })}
                      type="text"
                      name="contactName"
                      onChange={(e) => onInputChange(e)}
                      className={`form-control
                        "bg-transparent"
                      `}
                      placeholder={t("Contact Name")}
                      value={contactName}
                    />
                    {errors.contactName && (
                      <p className="text-danger px-2">
                        {t("Please enter the Contact Name.")}
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
                      id={`ShipingAndPickupPickupAddress`}
                      {...register("address", {
                        required: true,
                      })}
                      type="text"
                      name="address"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder={t("Address")}
                      value={address}
                    />
                    {errors.address && (
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
                      id={`ShipingAndPickupPickupAddress2`}
                      type="text"
                      name="address2"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder={t("address2")}
                      value={address2}
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">{t("City")}</label>
                    <input
                      id={`ShipingAndPickupPickupCity`}
                      {...register("city", {
                        required: true,
                      })}
                      type="text"
                      name="city"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder={t("City")}
                      value={city as any}
                    />
                    {errors.city && (
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
                      inputId={`ShipingAndPickupPickupState`}
                      menuPortalTarget={document.body}
                      {...register("stateId", { required: true })}
                      options={dropdownStates}
                      theme={(theme: any) => styles(theme)}
                      placeholder={t("State")}
                      name="stateId"
                      value={dropdownStates?.filter(
                        (item: any) => item.value === stateId
                      )}
                      onChange={(event: any) => {
                        handleChange(event, "stateId");
                      }}
                    />
                    {errors.stateId && (
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
                      id={`ShipingAndPickupPickupZipCode`}
                      {...register("zipCode", {
                        required: true,
                        pattern: {
                          value: /^\d{5}$/,
                          message: "Issue",
                        },
                      })}
                      type="text"
                      name="zipCode"
                      onChange={(e) => onInputChange(e)}
                      onKeyDown={(e) => handleKeyPressed(e)}
                      className="form-control bg-transparent"
                      placeholder={t("Zip Code")}
                      value={zipCode}
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
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Phone Number")}
                    </label>
                    <InputMask
                      id={`ShipingAndPickupPickupPhoneNumber`}
                      mask="(999) 999 9999"
                      value={phoneNumber}
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\(\d{3}\) \d{3} \d{4}$/,
                          message: "Phone number must be 10 digits",
                        },
                      })}
                      type="tel"
                      name="phoneNumber"
                      onChange={onInputChange}
                      onKeyDown={handleKeyPressed}
                      className={`form-control bg-transparent ${
                        errors.phoneNumber ? "is-invalid" : ""
                      }`}
                      placeholder={t("(999) 999 9999")}
                      inputMode="numeric"
                    />
                    <>{(inputProps: any) => <input {...inputProps} />}</>

                    {errors.phoneNumber && (
                      <p className="text-danger px-2">
                        {t("Phone number must be 10 digits.")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Pickup Date")}
                    </label>
                    <Controller
                      name="pickupDate"
                      control={control}
                      rules={{
                        required: "Please select a valid date",
                        validate: (value) => {
                          console.log("pickupDate value:", value);

                          // If empty, null, undefined → error
                          if (!value) return "Please select a valid date";

                          // Must be valid moment date
                          const date = moment(
                            value,
                            ["MM/DD/YYYY", "YYYY-MM-DD"],
                            true
                          );
                          if (!date.isValid())
                            return "Please select a valid date";

                          // Must NOT be in the past
                          if (date.isBefore(moment(), "day"))
                            return "Pickup date cannot be in the past";

                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <SearchDatePicker
                          customClass="form-control bg-transparent"
                          borderRadius="11.05px"
                          name="pickupDate"
                          value={field.value}
                          onChange={(e: any) => field.onChange(e.target.value)} // 🔥 FIXED
                        />
                      )}
                    />

                    {errors.pickupDate && (
                      <p className="text-danger px-2">
                        {t(errors.pickupDate.message as string)}
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
                      id={`ShipingAndPickupPickupStartPickupTime`}
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
                      placeholder={t("Start Pickup Time")}
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
                      id={`ShipingAndPickupPickupEndPickupTime`}
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
                      placeholder={t("End Pickup Time")}
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
                    <label className="required mb-2 fw-500">
                      {t("Packages Count")}
                    </label>
                    <input
                      id={`ShipingAndPickupPickupPackageCount`}
                      {...register("packagesCount", {
                        required: true,
                        validate: {
                          positive: (value) =>
                            value > 0 ||
                            t("Packages Count must be greater than 0"),
                        },
                      })}
                      type="text"
                      name="packagesCount"
                      onChange={(e) => onInputChange(e)}
                      onKeyDown={(e) => handleKeyPressed(e)}
                      className="form-control bg-transparent"
                      placeholder={t("Packages Count")}
                      value={packagesCount}
                    />
                    {errors.packagesCount && (
                      <p className="text-danger px-2">
                        {t("Please enter the Packages Count")}
                      </p>
                    )}
                  </div>
                </div>
                {courierName === "UPS" && (
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="required mb-2 fw-500">
                        {t("Package Weight")}
                      </label>
                      <input
                        id={`ShipingAndPickupPickupInternalIdentity`}
                        {...register("packageWeight", {
                          required: true,
                          validate: {
                            positive: (value) =>
                              value > 0 ||
                              t("Packages Weight must be greater than 0"),
                          },
                        })}
                        type="text"
                        name="packageWeight"
                        onChange={(e) => onInputChange(e)}
                        onKeyDown={(e) => handleKeyPressed(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Packages Weight")}
                        value={packageWeight}
                      />
                      {errors.packageWeight && (
                        <p className="text-danger px-2">
                          {t("Please enter the Packages Weight")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Remarks")}</label>
                    <input
                      id={`ShipingAndPickupPickupRemarks`}
                      type="text"
                      name="remarks"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder={t("Packages Count")}
                      value={remarks}
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">
                      {t("Tracking Number")}
                    </label>
                    <input
                      id={`ShipingAndPickupPickupTrackingNumber`}
                      type="text"
                      name="trackingNumber"
                      onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder={t("Tracking Number")}
                      value={trackingNumber}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Collapse>
    </>
  );
}

export default AddNewPickup;
