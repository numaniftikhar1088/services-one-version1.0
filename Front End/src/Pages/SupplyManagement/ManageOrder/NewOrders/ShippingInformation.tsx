import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import UserManagementService from "../../../../Services/UserManagement/UserManagementService";
import { styles } from "../../../../Utils/Common";
import InputsRow from "./InputsRow";
import InputMask from "react-input-mask";
import { GetFacilityById } from "Services/UserManagement/ManageOrder";
import useLang from "Shared/hooks/useLanguage";
import { useSelector } from "react-redux";
import moment from "moment";
interface StateOption {
  value: number;
  label: string;
}
function ShippingInformation() {
  const { t } = useLang();

  const initailShippingInfo = {
    dateofRequest: "",
    representativeName: "",
    representativePhone: "",
    shippingAddress: "",
    city: "",
    stateId: 0,
    zipCode: "",
    phoneNo: "",
    facilityId: 0,
  };
  const [shippingInfo, setShippingInfo] = useState(initailShippingInfo);
  const itemTypes = [
    { value: "Testing Supplies", label: "Testing Supplies" },
    { value: "Shipping Supplies", label: "Shipping Supplies" },
  ];
  // console.log(shippingInfo, "shippingInfo");

  const initialSupplyOrders = {
    id: 0,
    itemDescription: "",
    supplyOrderId: 0,
    itemType: "",
    supplyItemId: 0,
    itemName: "",
    orderQuantityRequested: "",
    comments: "",
    orderQuantityApproved: 0,
    specialRequest: "",
  };
  const [supplyOrders, setSupplyOrders] = useState([initialSupplyOrders]);
  const [facilityGetData, setFacilityGetData] = useState<any>();
  const [dropdown, setDropdown] = useState([]);
  const [dropdownStates, setDropdownStates] = useState<StateOption[]>([]);
  // const [facilityUser, setFacilityUser] = useState();
  // const OneRec = () => {
  //   setFacilityUser(dropdown[0]);
  // };
  // useEffect(() => {
  //   if (dropdown.length === 1) {
  //     OneRec();
  //   }
  //   return;
  // }, []);

  // console.log(facilityUser, "facilityUser");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const AddNewRow = () => {
    const newOrder = { ...initialSupplyOrders };
    append(newOrder);
    setSupplyOrders((prev) => [...prev, newOrder]);
  };
  // React hook form start
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      supplyOrder: [initialSupplyOrders], // Initialize with one row
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "supplyOrder", // Name of the field array
  });

  const handleKeyPress = (e: any) => {
    const keyCode = e.charCode || e.keyCode;
    const allowedKeyCodes = [8, 9, 37, 38, 39, 40, 46]; // 8: backspace, 9: tab, 37: left arrow, 38: up arrow, 39: right arrow, 40: down arrow, 40: delete
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
    navigate("/manage-order");
  };

  // const onInputChange = (event: any, type?: string) => {
  //   const { name, value } = event.target;
  //   setShippingInfo({
  //     ...shippingInfo,
  //     [name]: value,
  //   });
  //   setValue(name, value);
  //   clearErrors(name);
  // };

  const handleChange = (e: any, name: string) => {
    setShippingInfo((prev) => ({
      ...prev,
      [name]: e.value,
    }));
    setValue(name, e.value);
    clearErrors(name);
  };

  const loadFacilitiesLookUp = () => {
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setDropdown(res?.data);
        if (res?.data?.length === 1) {
          setShippingInfo({
            ...shippingInfo,
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
  console.log(shippingInfo, "shippingInfo");

  const loadStatesLookUp = () => {
    InsuranceService.GetStatesLookup()
      .then((res: AxiosResponse) => {
        setDropdownStates(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const addShippingInfo = (e: any) => {
    clearErrors();
    setIsSubmitting(true);
    const obj = { ...shippingInfo, supplyOrderItems: supplyOrders };
    InsuranceService.AddShippingInfo(obj)
      .then((res: any) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          setIsSubmitting(false);
          reset();
        }
      })
      .catch((err: any) => {
        console.log(err, "err while creating Insurance Provide Assigment");
        setIsSubmitting(false);
      });
  };
  //   /*##############################  Start GetFacilityById  #################*/
  const showData = async () => {
    let resp = await GetFacilityById(shippingInfo.facilityId);
    const data = resp.data.data;
    setFacilityGetData(data);
    // console.log(data, "facilityGetData");

    const selectedState = dropdownStates.find((state) => {
      const stateAbbreviation = state.label.match(/\(([^)]+)\)/)?.[1];
      return stateAbbreviation === data.state;
    });
    const stateId: number = selectedState ? Number(selectedState.value) : 0;
    setShippingInfo({
      ...shippingInfo,
      dateofRequest: moment(data?.dateofRequest).format("YYYY-MM-DD"),
      representativeName: data.representativeName,
      representativePhone: data.contactPhone,
      shippingAddress: data.address,
      city: data.city,
      stateId: stateId,
      zipCode: data.zipCode,
      phoneNo: data.facilityPhone,
      facilityId: data.facilityId,
    });
  };

  useEffect(() => {
    if (shippingInfo.facilityId) {
      showData();
    }
  }, [shippingInfo.facilityId]);

  //   console.log(shippingInfo,"shippingInfo")
  //   /*##############################  End GetFacilityById  #################*/

  useEffect(() => {
    loadFacilitiesLookUp();
    loadStatesLookUp();
  }, []);

  return (
    <>
      <div>
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
                <button
                  id={`ManageOrderNewOrderCancel`}
                  className="btn btn-secondary btn-sm fw-bold "
                  aria-controls="SearchCollapse"
                  aria-expanded="true"
                  onClick={() => reset()}
                >
                  <span>
                    <span>{t("Cancel")}</span>
                  </span>
                </button>
                <button
                  id={`ManageOrderNewOrderSave`}
                  className="btn btn-sm fw-bold btn-primary"
                  type="submit"
                >
                  {t("Save")}
                </button>
              </div>
            </div>
          </div>
          <div className="app-container container-fluid">
            <div id="ModalCollapse" className="card mb-5">
              <div className="align-items-center card-header minh-42px d-flex justify-content-start justify-content-sm-between gap-1">
                <h4 className="m-1">{t("Shipping Information")}</h4>
              </div>
              <div id="form-search" className=" card-body py-2 py-md-3">
                <div className="row">
                  <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2 fw-500 required">
                        {t("Facility Name")}
                      </label>
                      <Select
                        inputId={`ManageOrderNewOrderFacilityName`}
                        menuPortalTarget={document.body}
                        {...register("facilityId", { required: true })}
                        options={dropdown}
                        theme={(theme: any) => styles(theme)}
                        placeholder={t("Facility Name")}
                        name="facilityId"
                        defaultValue={{
                          value: 774,
                          label: "Adil hospital - Township",
                        }}
                        value={
                          dropdown.length === 1
                            ? dropdown[0]
                            : dropdown?.filter(
                                (item: any) =>
                                  item.value == shippingInfo.facilityId
                              )
                        }
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
                  <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="  mb-2 fw-500">
                        {t("Date of Request")}
                      </label>
                      <input
                        id={`ManageOrderNewOrderDateOfRequest`}
                        // {...register("dateofRequest", { required: true })}
                        // type="date"
                        name="dateofRequest"
                        // onChange={(e) => onInputChange(e)}
                        className={`form-control `}
                        placeholder={t("Date of Request")}
                        value={shippingInfo?.dateofRequest}
                        min={new Date().toISOString().split("T")[0]}
                        disabled
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
                      <label className="  mb-2 fw-500">
                        {t("Representative Name")}
                      </label>
                      <input
                        id={`ManageOrderNewOrderRepersentativeName`}
                        type="text"
                        // {...register("representativeName", { required: true })}
                        name="representativeName"
                        // onChange={(e) => onInputChange(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Representative Name")}
                        value={shippingInfo?.representativeName}
                        disabled
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
                      <label className="  mb-2 fw-500">
                        {t("Representative Phone Number")}
                      </label>
                      <InputMask
                        id={`ManageOrderNewOrderRepersentativePhoneNUmber`}
                        mask="(999) 999-9999"
                        value={shippingInfo?.representativePhone}
                        // {...register("representativePhone", {
                        //   required: "Phone number is required",
                        //   pattern: {
                        //     value: /^\(\d{3}\) \d{3}-\d{4}$/,
                        //     message: "Phone number must be 10 digits",
                        //   },
                        // })}
                        type="tel"
                        name="representativePhone"
                        // onChange={onInputChange}
                        onKeyDown={handleKeyPress}
                        className={`form-control bg-transparent ${
                          errors.representativePhone ? "is-invalid" : ""
                        }`}
                        placeholder="(999) 999-9999"
                        inputMode="numeric"
                        disabled
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
                      <label className="  mb-2 fw-500">
                        {t("Shipping Address")}
                      </label>
                      <input
                        id={`ManageOrderNewOrderShippingAddress`}
                        // {...register("shippingAddress", { required: true })}
                        type="text"
                        name="shippingAddress"
                        // onChange={(e) => onInputChange(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Shipping Address")}
                        value={shippingInfo?.shippingAddress}
                        disabled
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
                      <label className="  mb-2 fw-500">{t("City")}</label>
                      <input
                        id={`ManageOrderNewOrderCity`}
                        // {...register("city", { required: true })}
                        type="text"
                        name="city"
                        // onChange={(e) => onInputChange(e)}
                        className="form-control bg-transparent"
                        placeholder={t("City")}
                        value={shippingInfo?.city}
                        disabled
                      />
                      {errors.city && (
                        <p className="text-danger px-2">
                          {t("Please enter city name.")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                    <label className="mb-2 fw-500  ">{t("State")}</label>
                    <input
                      id={`ManageOrderNewOrderState`}
                      // {...register("stateId", { required: true })}
                      type="text"
                      name="stateId"
                      // onChange={(e) => onInputChange(e)}
                      className="form-control bg-transparent"
                      placeholder={t("State")}
                      value={facilityGetData?.state}
                      disabled
                    />
                    {/* <div className="fv-row mb-4">
                      <Select
                        menuPortalTarget={document.body}
                        {...register("stateId", { required: true })}
                        options={dropdownStates}
                        theme={(theme: any) => styles(theme)}
                        placeholder="State"
                        name="stateId"
                        value={dropdownStates?.filter(
                          (item: any) => item.value == shippingInfo.stateId
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
                    </div> */}
                  </div>
                  <div className="col-xl-3 col-md-4 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="  mb-2 fw-500">{t("Zip Code")}</label>
                      <input
                        id={`ManageOrderNewOrderZipCode`}
                        // {...register("zipCode", {
                        //   required: true,
                        //   pattern: {
                        //     value: /^\d{5}$/,
                        //     message: "Zip Code must be 5 digits",
                        //   },
                        // })}
                        type="text"
                        name="zipCode"
                        // onChange={(e) => onInputChange(e)}
                        onKeyDown={(e) => handleKeyPress(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Zip Code")}
                        value={shippingInfo?.zipCode}
                        maxLength={5}
                        inputMode="numeric"
                        disabled
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
                      <label className="  mb-2 fw-500">{t("Phone")}</label>
                      <InputMask
                        id={`ManageOrderNewOrderPhoneNumber`}
                        mask="(999) 999-9999"
                        value={shippingInfo?.phoneNo}
                        // {...register("phoneNo", {
                        //   required: "Phone number is required",
                        //   pattern: {
                        //     value: /^\(\d{3}\) \d{3}-\d{4}$/,
                        //     message: "Phone number must be 10 digits",
                        //   },
                        // })}
                        type="tel"
                        name="phoneNo"
                        disabled
                        // onChange={onInputChange}
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
                </div>
              </div>
            </div>
          </div>
          <div className="app-container container-fluid">
            <div id="ModalCollapse" className="card mb-5">
              <div className="align-items-center card-header minh-42px d-flex justify-content-start justify-content-sm-between gap-1">
                <h4 className="m-1">{t("Supply Order")}</h4>
              </div>
              <div id="form-search" className="card-body py-2 py-md-3">
                {fields.map((field: any, i: any) => (
                  <InputsRow
                    itemTypes={itemTypes}
                    supplyOrders={supplyOrders}
                    i={i}
                    setSupplyOrders={setSupplyOrders}
                    register={register}
                    errors={errors}
                    remove={remove}
                    field={field}
                    clearErrors={clearErrors}
                    setValue={setValue} // setItemTypeChanged={setItemTypeChanged}
                    handleKeyPress={handleKeyPress}
                  />
                ))}
                <div>
                  <button
                    id={`ManageOrderNewOrderStateAddRows`}
                    className="btn btn-sm fw-bold btn-primary"
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={() => AddNewRow()}
                    type="button"
                  >
                    <span>
                      <span>{t("Add New Row")}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ShippingInformation;
