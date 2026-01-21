import React, { ChangeEventHandler, FocusEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Input from "../../../Shared/Common/Input/Input";
import Select from "../../../Shared/Common/Input/Select";
import { stateDropdownArray } from "../../../Utils/Common";
import TextMask from "react-text-mask";
import {
  genderChoices,
  raceChoices,
  ethnicityChoices,
  patientTypeChoices,
  subscriberRelation,
} from "../../../Utils/Common";
import LoadButton from "../../../Shared/Common/LoadButton";
import Input2 from "../../../Shared/Common/Input/Input2";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import useLang from "Shared/hooks/useLanguage";
interface IProps {
  onKeyUp?: FocusEventHandler<HTMLInputElement>;
  changeHandler: ChangeEventHandler;
  AddPatient: any;
  compData: any;
  path: string;
  errors: any;
  formData: any;
  setFormData: any;
  loading?: boolean;
  isSubmitting?: boolean;
  setInsuranceDataList: any;
  insuranceDataList: any;
  findNameById: any;
}
const todayDate = new Date();
const AddPatientDemographicsInputs: React.FC<IProps> = ({
  errors,
  onKeyUp,
  changeHandler,
  formData,
  setFormData,
  path,
  AddPatient,
  compData,
  loading,
  isSubmitting,
  setInsuranceDataList,
  insuranceDataList,
  findNameById,
}) => {
  const AlphaNumericMasking = [
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
    /[A-Za-z0-9]/,
  ];
  const [errormessage, setErrorMessage] = useState({
    weight: "",
    height: "",
    zipCode: "",
  });
  const heightRegex = /^(\d{1,2})['.]?(\d{0,2})$/;
  const handleChangeHeight = (event: any) => {
    const { name, value } = event.target;
    // Check if the value matches the height regex
    if (value === "" || heightRegex.test(value)) {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: {
          value: value,
        },
      }));
      setErrorMessage((prevError) => ({
        ...prevError,
        height: "", // Set the error message if the input is invalid
      }));
    } else {
      setErrorMessage((prevError) => ({
        ...prevError,
        height: "", // Set the error message if the input is invalid
      }));
    }
  };
  const handleChangefornumeric = (event: any) => {
    const { name, value } = event.target;

    if (name === "weight") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        [name]: {
          value: sanitizedValue,
        },
      }));
      if (
        sanitizedValue.length === 3 ||
        sanitizedValue.length === 2 ||
        sanitizedValue.length === 1
      ) {
        setErrorMessage((prevError) => ({
          ...prevError,
          weight: "",
        }));
      } else {
        setErrorMessage((prevError) => ({
          ...prevError,
          weight: "",
        }));
      }
    } else {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 5);
      setFormData((prev: any) => ({
        ...prev,
        [name]: {
          value: sanitizedValue,
        },
      }));
      if (sanitizedValue.length === 5) {
        setErrorMessage((prevError) => ({
          ...prevError,
          zipCode: "",
        }));
      } else {
        setErrorMessage((prevError) => ({
          ...prevError,
          zipCode: "Enter valid zip code!",
        }));
      }
    }
  };
  const handleAddInsurance = (e: any) => {
    e.preventDefault();
    setInsuranceDataList((prevData: any) => [
      ...prevData,
      {
        insurance: "",
        insuranceProvider: null,
        groupNumber: "",
        policyId: "",
        subscriberRelation: "",
        subscriberName: "",
        subscriberDateOfBirth: null,
        insurancePhone: "",
        billingType: "",
      },
    ]);
  };
  const handleCancel = (index: number) => {
    if (insuranceDataList.length > 1) {
      setInsuranceDataList((prevData: any) => {
        const newData = [...prevData];
        newData.splice(index, 1);
        return newData;
      });
    }
  };
  let { insuranceDropdown, insuranceDropdownProvider } = compData;
  const { t } = useLang();
  const [show, setShow] = useState<any>([]);
  const [selfCheck, setSelfCheck] = useState<any>(false);
  const showhidestatus = (index: any, choice: string) => {
    const updatedShow = [...show];
    updatedShow[index] = true;
    setShow(updatedShow);
    if (choice === "self") {
      setSelfCheck(true);
    } else {
      setSelfCheck(false);
    }
  };

  function findInsuranceName(insuranceId: number) {
    const foundInsurance = insuranceDropdown.find(
      (obj: any) => obj.insuranceId === insuranceId
    );
    return foundInsurance.insuranceName;
  }
  const handleChangeInsurance = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: string
  ) => {
    const updatedData = [...insuranceDataList];
    if (
      e.target.name === "insurance" &&
      findInsuranceName(parseInt(e.target.value)) !== "Self Pay"
    ) {
      updatedData[index][field] = parseInt(e.target.value);
      const billingType = findInsuranceName(parseInt(e.target.value));
      updatedData[index]["billingType"] = billingType;
    }
    if (
      (e.target.name === "insurance" &&
        findInsuranceName(parseInt(e.target.value)) === "SELFPAY") ||
      findInsuranceName(parseInt(e.target.value)) === "Selfpay" ||
      findInsuranceName(parseInt(e.target.value)) === "Self Pay"
    ) {
      const billingType = findInsuranceName(parseInt(e.target.value));
      updatedData[index][field] = parseInt(e.target.value);
      updatedData[index]["billingType"] = billingType;
      updatedData[index]["insuranceProvider"] = null;
      updatedData[index]["insurancePhone"] = "";
      updatedData[index]["policyNumber"] = "";
      updatedData[index]["groupNumber"] = "";
    }
    setInsuranceDataList(updatedData);
  };
  const handleForChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: string
  ) => {
    const updatedData = [...insuranceDataList];
    if (e?.target?.name === "insuranceProvider") {
      updatedData[index][field] = parseInt(e?.target?.value);
    } else {
      updatedData[index][field] = e?.target?.value;
    }
    setInsuranceDataList(updatedData);
  };
  console.log(insuranceDataList, "insuranceDataList");

  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <form onSubmit={AddPatient}>
        <div className="app-toolbar py-2 py-lg-3">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <Link
                to="/patient-demographics-list"
                className="btn btn-sm fw-bold btn-cancel"
              >
                {t("Cancel")}
              </Link>
              <LoadButton
                className="btn btn-sm fw-bold btn-primary"
                loading={isSubmitting}
                btnText={t("Save")}
                loadingText={t("Saving")}
              />
            </div>
          </div>
        </div>

        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            {/* ***************** Patient Information ****************** */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">{t("Patient Information")}</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <Input
                    type="text"
                    label="First Name"
                    name="firstName"
                    onBlur={onKeyUp}
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="First Name"
                    value={formData?.firstName?.value}
                    error={errors?.firstName}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="text"
                    label="Middle Name"
                    name="middleName"
                    onBlur={onKeyUp}
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Middle Name"
                    value={formData?.middleName?.value}
                    error={errors?.middleName}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="text"
                    label="Last Name"
                    name="lastName"
                    onBlur={onKeyUp}
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Last Name"
                    value={formData?.lastName?.value}
                    error={errors?.lastName}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="date"
                    label="Date of Birth"
                    name="dateOfBirth"
                    onBlur={onKeyUp}
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Date of Birth"
                    value={moment(
                      formData?.dateOfBirth?.value,
                      "YYYY-MM-DD"
                    ).format("YYYY-MM-DD")}
                    max={moment(todayDate, "YYYY-MM-DD").format("YYYY-MM-DD")}
                    error={errors?.dateOfBirth}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="required mb-2 fw-500">{t("Gender")}</label>
                    <div className="row m-0">
                      {genderChoices.map((choice: any) => (
                        <>
                          <label className="form-check form-check-sm align-items-start form-check-solid col-6 my-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id={choice.id}
                              onChange={changeHandler}
                              checked={formData?.gender.value === choice.value}
                              value={choice.value}
                            />
                            <span className="form-check-label text-break">
                              {choice.label}
                            </span>
                          </label>
                        </>
                      ))}
                      {errors.gender && (
                        <div className="form__error">
                          <span>{errors.gender}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="fw-500 required">Ethnicity </label>
                    <div className="row m-0">
                      {ethnicityChoices?.map((choice: any) => (
                        <>
                          <label className="form-check form-check-sm align-items-start form-check-solid col-6 my-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="ethnicity"
                              id={choice?.id}
                              onChange={changeHandler}
                              checked={
                                formData?.ethnicity?.value === choice?.value
                              }
                              value={choice?.value}
                            />
                            <span className="form-check-label text-break">
                              {choice?.label}
                            </span>
                          </label>
                        </>
                      ))}
                    </div>
                    {errors.ethnicity && (
                      <div className="form__error">
                        <span>{errors.ethnicity}</span>
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mb-2 fw-500 required">{t("Race")}</label>
                    <div className="row m-0">
                      {raceChoices.map((choice: any) => (
                        <>
                          <label className="form-check form-check-sm align-items-start form-check-solid col-6 my-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="race"
                              id={choice.id}
                              onChange={changeHandler}
                              checked={formData?.race.value === choice.value}
                              value={choice.value}
                            />
                            <span className="form-check-label text-break">
                              {choice.label}
                            </span>
                          </label>
                        </>
                      ))}
                    </div>
                    {errors.race && (
                      <div className="form__error">
                        <span>{errors.race}</span>
                      </div>
                    )}
                  </div>
                  <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="required fw-500">{t("Patient Type")}</label>
                    <div className="row m-0">
                      {patientTypeChoices.map((choice: any) => (
                        <>
                          <label className="form-check form-check-sm align-items-start form-check-solid col-6 my-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="patientType"
                              id={choice.id}
                              onChange={changeHandler}
                              checked={
                                formData?.patientType.value === choice.value
                              }
                              value={choice.value}
                            />
                            <span className="form-check-label text-break">
                              {choice.label}
                            </span>
                          </label>
                        </>
                      ))}
                    </div>
                    {errors.patientType && (
                      <div className="form__error">
                        <span>{errors.patientType}</span>
                      </div>
                    )}
                  </div>
                  <Input
                    type="text"
                    label="Social Security Number"
                    name="socialSecurityNumber"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Social Security Number"
                    value={formData?.socialSecurityNumber.value}
                    error={errors?.socialSecurityNumber}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />

                  <Input
                    type="text"
                    label="Passport Number"
                    name="passportNumber"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Passport Number"
                    value={formData?.passportNumber.value}
                    error={errors?.passportNumber}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="text"
                    label="DL/ID Number"
                    name="dlidNumber"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="DL/ID Number"
                    value={formData?.dlidNumber.value}
                    error={errors?.dlidNumber}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                </div>
              </div>
            </div>
            {/* ***************** Patient Current Address ****************** */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">{t("Patient Current Address")}</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <Input
                    type="text"
                    label="Address 1"
                    name="address1"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Address 1"
                    value={formData?.address1.value}
                    error={errors?.address1}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="text"
                    label="Address 2"
                    name="address2"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Address 2"
                    value={formData?.address2.value}
                    error={errors?.address2}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="text"
                    label="Zip Code"
                    name="zipCode"
                    onChange={handleChangefornumeric}
                    className="form-control bg-transparent"
                    placeholder="Zip Code"
                    value={formData?.zipCode.value}
                    error={errormessage.zipCode}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="text"
                    label="City"
                    name="city"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="City"
                    value={formData?.city.value}
                    error={errors?.city}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Select
                    menuPortalTarget={document.body}
                    label="State"
                    name="state"
                    id="statepatient"
                    options={stateDropdownArray}
                    value={formData?.state?.value}
                    onChange={changeHandler}
                    error={errors.state}
                    loading={loading}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  {/* <Input
                    type="text"
                    label="Country"
                    name="country"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Country"
                    value={formData?.country.value}
                    error={errors?.country}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  /> */}
                  <Input
                    type="text"
                    label="County"
                    name="county"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="County"
                    value={formData?.county.value}
                    error={errors?.county}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="tel"
                    label="Phone Number (Landline)"
                    name="landPhone"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="(999) 999-9999"
                    value={formData?.landPhone.value}
                    error={errors?.landPhone}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="tel"
                    label="Mobile Number"
                    name="mobile"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="(999) 999-9999"
                    value={formData?.mobile.value}
                    error={errors?.mobile}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="text"
                    label="Email"
                    name="email"
                    onChange={changeHandler}
                    className="form-control bg-transparent"
                    placeholder="Email"
                    value={formData?.email.value}
                    error={errors?.email}
                    loading={loading}
                    required={true}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />
                  <Input
                    type="text"
                    label="Weight (LBS)"
                    name="weight"
                    onChange={handleChangefornumeric}
                    className="form-control bg-transparent"
                    placeholder="Enter Weight (LBS) e.g 00"
                    value={formData?.weight.value}
                    error={errormessage.weight}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />

                  <Input
                    type="text"
                    label="Height"
                    name="height"
                    onChange={handleChangeHeight}
                    className="form-control bg-transparent"
                    placeholder="Enter height (e.g., 5'6 or 6.2)"
                    value={formData?.height.value}
                    error={errormessage.height}
                    loading={loading}
                    required={false}
                    parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                  />

                  <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mb-2 required fw-500">{t("Facility")}</label>
                    <select
                      className="form-select"
                      data-kt-select2="true"
                      data-placeholder="Select option"
                      data-dropdown-parent="#kt_menu_63b2e70320b73"
                      data-allow-clear="true"
                      name="facilityId"
                      onChange={changeHandler}
                      value={formData?.facilityId.value}
                    >
                      <option>--- select Option ---</option>
                      {compData?.dropdownData?.map((item: any) => (
                        <option value={item?.facilityId}>
                          {item?.facilityName}
                        </option>
                      ))}
                    </select>
                    {errors.facilityId && (
                      <div className="form__error">
                        <span>{errors.facilityId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* ***************** Patient Insurance ****************** */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">{t("Patient Insurance")}</h3>
                <button
                  className="btn btn-sm fw-bold btn-info"
                  onClick={handleAddInsurance}
                >
                  <i className="bi bi-plus-lg"></i>{t("Add another Insurance")}
                </button>
              </div>
              <div className="card-body py-4">
                {insuranceDataList.map((insuranceData: any, index: any) => (
                  <div key={index}>
                    <div className="d-flex justify-content-end align-items-end">
                      {index === 0 ? null : (
                        <div
                          style={{ fontSize: "24px", cursor: "pointer" }}
                          className="fa"
                          onClick={() => handleCancel(index)}
                        >
                          &#xf00d;
                        </div>
                      )}
                    </div>
                    <div className="row">
                      <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                        <label className="mb-2 required fw-500">
                          Insurance
                        </label>
                        <select
                          className="form-select"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_63b2e70320b73"
                          data-allow-clear="true"
                          name="insurance"
                          value={insuranceData.insurance}
                          onChange={(e) =>
                            handleChangeInsurance(e, index, "insurance")
                          }
                        >
                          <option>--- select Option ---</option>
                          {insuranceDropdown?.map(
                            ({ insuranceId, insuranceName }: any) => (
                              <option value={insuranceId}>
                                {insuranceName}
                              </option>
                            )
                          )}
                        </select>
                        {errors.insuranceId && (
                          <div className="form__error">
                            <span>{errors?.insuranceId}</span>
                          </div>
                        )}
                      </div>
                      <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                        <label className="mb-2 required fw-500">
                          Insurance Provider
                        </label>
                        <select
                          className="form-select"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_63b2e70320b73"
                          data-allow-clear="true"
                          name="insuranceProvider"
                          value={insuranceData.insuranceProvider}
                          onChange={(e) =>
                            handleForChange(e, index, "insuranceProvider")
                          }
                          disabled={
                            insuranceDataList[index].billingType ===
                              "SELFPAY" ||
                            insuranceDataList[index].billingType ===
                              "Self Pay" ||
                            insuranceDataList[index].insurance === 9
                          }
                        >
                          <option value="">--- select Option ---</option>
                          {insuranceDropdownProvider?.map(
                            ({ insuranceProviderId, providerName }: any) => (
                              <option value={insuranceProviderId}>
                                {providerName}
                              </option>
                            )
                          )}
                        </select>
                        {errors?.insuranceProviderId && (
                          <div className="form__error">
                            <span>{errors?.insuranceProviderId}</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                        <label className="mb-2 fw-500">Phone Number</label>
                        <TextMask
                          mask={[
                            "(",
                            /[1-9]/,
                            /\d/,
                            /\d/,
                            ")",
                            " ",
                            /\d/,
                            /\d/,
                            /\d/,
                            "-",
                            /\d/,
                            /\d/,
                            /\d/,
                            /\d/,
                          ]}
                          guide={true}
                          value={insuranceDataList[index].insurancePhone}
                          onChange={(e: any) =>
                            handleForChange(e, index, "insurancePhone")
                          }
                          className={
                            insuranceDataList[index].billingType ===
                              "Self Pay" ||
                            insuranceDataList[index].billingType === "SELFPAY"
                              ? "form-control bg-secondary"
                              : "form-control bg-transparent"
                          }
                          placeholder="(999) 999-9999"
                          disabled={
                            insuranceDataList[index].billingType ===
                              "SELFPAY" ||
                            insuranceDataList[index].billingType ===
                              "Self Pay" ||
                            insuranceDataList[index].insurance === 9
                          }
                        />
                      </div>
                      <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                        <label className="mb-2 required fw-500">
                          Group Number
                        </label>
                        <TextMask
                          mask={AlphaNumericMasking}
                          guide={false}
                          value={insuranceData.groupNumber}
                          onChange={(e: any) =>
                            handleForChange(e, index, "groupNumber")
                          }
                          className={
                            insuranceDataList[index].billingType ===
                              "Self Pay" ||
                            insuranceDataList[index].billingType === "SELFPAY"
                              ? "form-control bg-secondary"
                              : "form-control bg-transparent"
                          }
                          placeholder="Group Number"
                          disabled={
                            insuranceDataList[index].billingType ===
                              "SELFPAY" ||
                            insuranceDataList[index].billingType ===
                              "Self Pay" ||
                            insuranceDataList[index].insurance === 9
                          }
                        />
                      </div>
                      <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                        <label className="mb-2 required fw-500">
                          Policy Number
                        </label>
                        <TextMask
                          mask={AlphaNumericMasking}
                          guide={false}
                          type="text"
                          className={
                            insuranceDataList[index].billingType ===
                              "Self Pay" ||
                            insuranceDataList[index].billingType === "SELFPAY"
                              ? "form-control bg-secondary"
                              : "form-control bg-transparent"
                          }
                          placeholder="Policy Number"
                          value={insuranceData.policyNumber}
                          onChange={(e: any) =>
                            handleForChange(e, index, "policyNumber")
                          }
                          disabled={
                            insuranceDataList[index].billingType ===
                              "SELFPAY" ||
                            insuranceDataList[index].billingType ===
                              "Self Pay" ||
                            insuranceDataList[index].insurance === 9
                          }
                        />
                      </div>
                      <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                        <label className="mb-2 required fw-500">
                          Subscriber Relation
                        </label>
                        <div className="row m-0">
                          {subscriberRelation.map((choice: any) => (
                            <label
                              className="form-check form-check-sm align-items-start form-check-solid col-6 my-1"
                              key={choice.id}
                            >
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`subscriberRelation_${index}`}
                                onChange={(e: any) =>
                                  handleForChange(
                                    e,
                                    index,
                                    "subscriberRelation"
                                  )
                                }
                                checked={
                                  insuranceDataList[index]
                                    .subscriberRelation === choice.value
                                }
                                value={choice.value}
                                onClick={() =>
                                  showhidestatus(index, choice.value)
                                }
                              />
                              <span className="form-check-label text-break">
                                {choice?.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {insuranceDataList[index].subscriberRelation === "Self" ||
                      insuranceDataList[index].subscriberRelation ===
                        "self" ? null : (
                        <>
                          <Input2
                            type="text"
                            label="Subscriber Name"
                            name="subscriberName"
                            onChange={(e) =>
                              handleForChange(e, index, "subscriberName")
                            }
                            className="form-control bg-transparent"
                            placeholder="Subscriber Name"
                            value={insuranceData.subscriberName}
                            loading={loading}
                            required={true}
                            parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                          />
                          <Input2
                            type="date"
                            label="Subscriber Date of Birth"
                            name="subscriberDateOfBirth"
                            onChange={(e) =>
                              handleForChange(e, index, "subscriberDateOfBirth")
                            }
                            className="form-control bg-transparent"
                            placeholder="Subscriber Date of Birth"
                            value={moment(
                              insuranceData.subscriberDateOfBirth,
                              "YYYY-MM-DD"
                            ).format("YYYY-MM-DD")}
                            error={errors?.subscriberDateOfBirth}
                            loading={loading}
                            parentDivClassName="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12"
                            max={maxDate}
                            required={true}
                          />
                        </>
                      )}
                      <div className="mb-4 col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <hr className="text-muted" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* ***************** Patient User Login ****************** */}
            <div className="card mb-4 d-none">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Patient User Login</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mb-2">Email</label>
                    <input
                      type="text"
                      name=""
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="Email"
                      defaultValue=""
                    />
                  </div>
                  <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mb-2">Mobile</label>
                    <input
                      type="text"
                      name=""
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="Mobile"
                      defaultValue=""
                    />
                  </div>
                  <div className="mb-4 col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mb-2">Username</label>
                    <input
                      type="text"
                      name=""
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="Username"
                      defaultValue=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPatientDemographicsInputs;
