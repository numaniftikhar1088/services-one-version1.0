import { AxiosError, AxiosResponse } from "axios";
import HttpClient from "HttpClient";
import React, { FormEvent, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import routes from "../../Routes/Routes.json";
import Commonservice from "../../Services/CommonService";
import LabManagementService from "../../Services/LabManagement/LabManagementService";
import { InputChangeEvent } from "../../Shared/Type";

const CreateLab = (props: any) => {
  const { t } = useLang()
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const [labNameError, setLabNameError] = useState(false);
  const [labDisplayNameError, setLabDisplayNameError] = useState(false);
  const [cliaError, setCliaError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneFormatError, setPhoneFormatError] = useState("");
  const [address1Error, setAddress1Error] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailAddressError, setEmailAddressError] = useState(false);
  const [directorAddressError, setDirectorAddressError] = useState(false);
  const [directorCityError, setDirectorCityError] = useState(false);
  const [directorStateError, setDirectorStateError] = useState(false);
  const [directorMobileNoError, setDirectorMobileNoError] = useState(false);
  const [directorMobileNoFormatError, setDirectorMobileNoFormatError] =
    useState("");
  const [labInformation, setLabInformation] = useState({
    logo: "",
    labId: 0,
    fax: "",
    labName: "",
    labDisplayName: "",
    clia: "",
    email: "",
    phone: "",
    isReferenceLab: true,
    isActive: true,
    address: {
      address1: "",
      address2: "",
      zipCode: "",
      state: "",
      city: "",
    },
    labDirector: {
      firstName: "",
      middleName: "",
      lastName: "",
      emailAddress: "",
      mobile: "",
      phone: "",
      address: {
        address1: "",
        state: "",
        city: "",
        address2: "/",
        zipCode: "/",
      },
    },
  });
  const { fax, labName, labDisplayName, clia, email, phone, logo } =
    labInformation;
  const { address1, address2, zipCode, state, city } = labInformation.address;
  const { labDirector } = labInformation;
  const onInputChange = (e: React.ChangeEvent<InputChangeEvent>) => {
    let value = e.target.value;
    let name = e.target.name;
    if (count === 1) {
      if (
        name === "fax" ||
        name === "labName" ||
        name === "labDisplayName" ||
        name === "clia" ||
        name === "email" ||
        name === "phone"
      ) {
        setLabInformation({ ...labInformation, [name]: value });
        if (name === "labName" && value.length > 0) {
          setLabNameError(false);
        }
        if (name === "labDisplayName" && value.length > 0) {
          setLabDisplayNameError(false);
        }
        if (name === "clia" && value.length > 0) {
          setCliaError(false);
        }
        if (name === "email" && value.length > 0) {
          setEmailError(false);
          let validEmail = Commonservice.isValidEmailFormat(e.target.value);
          if (!validEmail) {
            setEmailFormatError("Invalid Email");
          } else {
            setEmailFormatError("");
          }
        }
        if (name === "phone" && value.length > 0) {
          setPhoneError(false);
          let validPhoneNo = Commonservice.isValidPhoneNo(e.target.value);
          if (!validPhoneNo) {
            setPhoneFormatError("Only Digit Accepted");
          } else {
            setPhoneFormatError("");
          }
        }
      } else {
        if (
          name === "address1" ||
          name === "address2" ||
          name === "state" ||
          name === "city" ||
          name === "zipCode"
        ) {
          setLabInformation({
            ...labInformation,
            address: {
              ...labInformation.address,
              [name]: value,
            },
          });

          if (name === "address1" && value.length > 0) {
            setAddress1Error(false);
          }

          if (name === "state" && value.length > 0) {
            setStateError(false);
          }
          if (name === "city" && value.length > 0) {
            setCityError(false);
          }
          if (name === "zipCode" && value.length > 0) {
            setZipCodeError(false);
          }
        }
      }
    }
    if (count === 2) {
      if (name === "city" || name === "state" || name === "address1") {
        setLabInformation({
          ...labInformation,
          labDirector: {
            ...labInformation.labDirector,
            address: {
              ...labInformation.labDirector.address,
              [name]: value,
            },
          },
        });
        if (name === "state" && value.length > 0) {
          setDirectorStateError(false);
        }
        if (name === "city" && value.length > 0) {
          setDirectorCityError(false);
        }
        if (name === "address1" && value.length > 0) {
          setDirectorAddressError(false);
        }
      }
    }
    if (count === 2) {
      if (
        name === "firstName" ||
        name === "middleName" ||
        name === "lastName" ||
        name === "mobile" ||
        name === "phone" ||
        name === "emailAddress"
      ) {
        setLabInformation({
          ...labInformation,
          labDirector: {
            ...labInformation.labDirector,
            [name]: value,
          },
        });

        if (name === "firstName" && value.length > 0) {
          setFirstNameError(false);
        }

        if (name === "lastName" && value.length > 0) {
          setLastNameError(false);
        }
        // if (name === "state" && value.length > 0) {
        //   setStateError(false);
        // }
        if (name === "phone" && value.length > 0) {
          let validPhoneNo = Commonservice.isValidPhoneNo(value);
          if (!validPhoneNo) {
            setPhoneFormatError("Only Digit Accepted");
          } else {
            setPhoneFormatError("");
          }
        }
        if (name === "mobile" && value.length > 0) {
          let validPhoneNo = Commonservice.isValidPhoneNo(value);
          if (!validPhoneNo) {
            setDirectorMobileNoFormatError("Only Digit Accepted");
          } else {
            setDirectorMobileNoFormatError("");
          }
        }
        if (name === "emailAddress" && value.length > 0) {
          setEmailAddressError(false);
          let validEmail = Commonservice.isValidEmailFormat(value);
          if (!validEmail) {
            setEmailFormatError("Invalid Email");
          } else {
            setEmailFormatError("");
          }
        }
        if (name === "mobile" && value.length > 0) {
          setDirectorMobileNoError(false);
        }
      }
    }
  };
  const validateLabInformationFields = () => {
    if (count === 1) {
      if (labName.length === 0) {
        setLabNameError(true);
      }
      if (labDisplayName.length === 0) {
        setLabDisplayNameError(true);
      }
      if (clia.length === 0) {
        setCliaError(true);
      }
      if (email.length === 0) {
        setEmailError(true);
      }
      if (phone.length === 0) {
        setPhoneError(true);
      }
      if (address1.length === 0) {
        setAddress1Error(true);
      }

      if (city.length === 0) {
        setCityError(true);
      }
      if (state.length === 0) {
        setStateError(true);
      }
      if (zipCode.length === 0) {
        setZipCodeError(true);
      }
    }
  };
  const validateLabDirectorInfoFields = () => {
    if (count === 2) {
      if (labDirector.firstName.length === 0) {
        setFirstNameError(true);
      }

      if (labDirector.lastName.length === 0) {
        setLastNameError(true);
      }
      if (labDirector.mobile.length === 0) {
        setDirectorMobileNoError(true);
      }
      if (labDirector.emailAddress.length === 0) {
        setEmailAddressError(true);
      }
      if (labDirector.address.address1.length === 0) {
        setDirectorAddressError(true);
      }
      if (labDirector.address.city.length === 0) {
        setDirectorCityError(true);
      }
      if (labDirector.address.state.length === 0) {
        setDirectorStateError(true);
      }
    }
  };
  const countIncrement = () => {
    if (count === 1) {
      validateLabInformationFields();
      if (
        labName.length > 0 &&
        labDisplayName.length > 0 &&
        clia.length > 0 &&
        email.length > 0 &&
        phone.length > 0 &&
        address1.length > 0 &&
        city.length > 0 &&
        state.length > 0 &&
        zipCode.length > 0 &&
        emailFormatError === "" &&
        phoneFormatError === "" &&
        fileExtensionError === false
      ) {
        setCount(count + 1);
      }
    }
  };
  const countDecrement = () => {
    setCount(count - 1);
  };
  const options1 = {
    headers: {
      Authorization: `Bearer ${props.User.userInfo.token}`,
      "X-Portal-Key": "DemoApp",
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  };
  const [file, setFile] = useState(
    `${process.env.PUBLIC_URL + "/media/avatars/300-1.jpg"}`
  );
  const [fileExtensionError, setFileExtensionError] = useState(false);

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let fileExtension = e.target.files![0].type.split("/")[1];
    if (
      fileExtension === "jpeg" ||
      fileExtension === "jpg" ||
      fileExtension === "png"
    ) {
      setFileExtensionError(false);
      setFile(URL.createObjectURL(e.target.files![0]));
      var formData = new FormData();
      formData.append("file", e.target.files![0]);
      HttpClient().post(
          `/${routes.UserManagement.UploadFile}`,
          formData,
          options1
        )
        .then((res) => {
          setLabInformation({
            ...labInformation,
            [e.target.name]: res.data.data,
          });
        })
        .catch((err) => {

        });
    } else {
      setFileExtensionError(true);
    }
  };
  const removeImaage = () => {
    setFile("");
  };
  const createLab = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      labDirector.firstName.length > 0 &&
      labDirector.lastName.length > 0 &&
      labDirector.mobile.length > 0 &&
      labDirector.address.address1.length > 0 &&
      labDirector.address.city.length > 0 &&
      labDirector.address.state.length > 0 &&
      directorMobileNoFormatError === "" &&
      phoneFormatError === "" &&
      emailFormatError === ""
    ) {
      LabManagementService.saveLab(labInformation)
        .then((res: AxiosResponse) => {
          if (res.status === 200) {

            navigate("/labs");
          } else {

          }
        })
        .catch((err: AxiosError) => {

        });
    } else {
      validateLabDirectorInfoFields();
    }
  };
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
        >
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="#" className="text-muted text-hover-primary">
                  {t("Home")}
                </a>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("Admin")}</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("Add a Lab")}</li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              to="/labs"
              className="btn btn-sm fw-bold btn-cancel"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_create_app"
            >
              {t("Cancel")}
            </Link>
            {/* <button disabled={isDisabled} onClick={addUser} className="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_new_target">save</button> */}
          </div>
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <span className="card-label fw-bold text-dark">
                  {t("Add Reference Lab")}
                </span>
              </div>
            </div>
            <div className="card-body p-0">
              <div
                className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid gap-10"
                id="kt_create_account_stepper"
              >
                <div className="border-right d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xxl-350px w-xl-350px">
                  <div className="card-body px-3 px-md-8">
                    <div className="stepper-nav">
                      <div
                        className={
                          count === 1 ? "stepper-item current" : "stepper-item"
                        }
                        data-kt-stepper-element="nav"
                      >
                        <div className="stepper-wrapper">
                          <div className="stepper-icon w-40px h-40px">
                            <i className="stepper-check fas fa-check"></i>
                            <span className="stepper-number">1</span>
                          </div>
                          <div className="stepper-label">
                            <h3 className="stepper-title">{t("Lab Information")}</h3>
                            <div className="stepper-desc fw-semibold">
                              {t("Setup")}
                            </div>
                          </div>
                        </div>
                        <div className="stepper-line h-40px"></div>
                      </div>
                      <div
                        className={
                          count === 2 ? "stepper-item current" : "stepper-item"
                        }
                        data-kt-stepper-element="nav"
                      >
                        <div className="stepper-wrapper">
                          <div className="stepper-icon w-40px h-40px">
                            <i className="stepper-check fas fa-check"></i>
                            <span className="stepper-number">2</span>
                          </div>
                          <div className="stepper-label">
                            <h3 className="stepper-title">{t("Lab Director Info")}</h3>
                            <div className="stepper-desc fw-semibold">
                              {t("Enter Lab Director Details")}
                            </div>
                          </div>
                        </div>
                        <div className="stepper-line h-40px"></div>
                      </div>
                      {/* <div className={count === 3 ? "stepper-item" : "stepper-item"} data-kt-stepper-element="nav">
                                                <div className="stepper-wrapper">
                                                    <div className="stepper-icon w-40px h-40px">
                                                        <i className="stepper-check fas fa-check"></i>
                                                        <span className="stepper-number">3</span>
                                                    </div>
                                                    <div className="stepper-label">
                                                        <h3 className="stepper-title">Lab Association</h3>
                                                        <div className="stepper-desc fw-semibold">Lab Configuration Information</div>
                                                    </div>
                                                </div>
                                                <div className="stepper-line h-40px"></div>
                                            </div> */}
                    </div>
                  </div>
                </div>
                <div className="d-flex flex-row-fluid flex-center">
                  <form
                    onSubmit={createLab}
                    className="card-body w-100"
                    noValidate={true}
                  >
                    {count === 1 ? (
                      <div className="user-info-section">
                        <div className="w-100">
                          <div className="pb-5 pb-lg-6">
                            <h2 className="fw-bold d-flex align-items-center text-dark">
                              {t("Enter Lab Details")}
                            </h2>
                          </div>
                          <div className="row">
                            <div className="col-xl-6">
                              <div className="row">
                                <div className="fv-row mb-7 col-xl-12 col-lg-12 col-md-6 col-sm-12">
                                  <label className="required  mb-2">
                                    {t("Lab Name")}
                                  </label>
                                  <input
                                    type="text"
                                    name="labName"
                                    onChange={onInputChange}
                                    className="form-control bg-transparent mb-3 mb-lg-0"
                                    placeholder="Lab Name"
                                    value={labName}
                                  />
                                  {labNameError ? (
                                    <span style={{ color: "red" }}>
                                      {t("Lab Name is")}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="fv-row mb-4 col-xl-12 col-lg-12 col-md-6 col-sm-12">
                                  <label className="required  mb-2">
                                    {t("Lab Display Name")}
                                  </label>
                                  <input
                                    type="text"
                                    name="labDisplayName"
                                    onChange={onInputChange}
                                    className="form-control bg-transparent mb-3 mb-lg-0"
                                    placeholder="Display Name"
                                    value={labDisplayName}
                                  />
                                  {labDisplayNameError ? (
                                    <span style={{ color: "red" }}>
                                      {t("Lab DisplayName is required")}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="fv-row mb-3 col-xl-12 col-lg-12 col-md-6 col-sm-12">
                                  {/* <!--begin::Input group--> */}
                                  <div
                                    className="fv-row mb-2"
                                    data-kt-password-meter="true"
                                  >
                                    {/* <!--begin::Label--> */}
                                    <label className="required   mb-2">
                                      {t("CLIA")}
                                    </label>
                                    {/* <!--end::Label--> */}
                                    {/* <!--begin::Wrapper--> */}
                                    <div className="mb-1">
                                      {/* <!--begin::Input wrapper--> */}
                                      <div className="position-relative mb-2 getPass">
                                        <input
                                          type="text"
                                          className="form-control bg-transparent"
                                          name="clia"
                                          onChange={(e) => onInputChange(e)}
                                          placeholder="CLIA"
                                          autoComplete="off"
                                          value={clia}
                                        />
                                        {cliaError ? (
                                          <span style={{ color: "red" }}>
                                            {t("CLIA is required")}
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="fv-row mb-3 col-xl-12 col-lg-12 col-md-6 col-sm-12">
                                  <label className="required  mb-2">
                                    {t("Status")}
                                  </label>
                                  <label className="form-check form-switch form-switch-sm form-check-solid flex-stack">
                                    <input
                                      className="form-check-input"
                                      name="isActive"
                                      onChange={onInputChange}
                                      type="checkbox"
                                      checked={true}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6">
                              <div className="fv-row mb-7 mt-6">
                                <div className="image-input image-input-outline image-input-placeholder">
                                  <img
                                    src={file}
                                    className="image-input-wrapper w-125px h-125px"
                                  />
                                  <label
                                    style={{
                                      marginTop: "-112px",
                                      marginLeft: "-3px",
                                    }}
                                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                                  >
                                    <i className="bi bi-pencil-fill fs-7"></i>
                                    <input
                                      type="file"
                                      name="logo"
                                      style={{ display: "none" }}
                                      onChange={uploadFile}
                                    />
                                  </label>
                                  <span
                                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                                    data-kt-image-input-action="cancel"
                                    data-bs-toggle="tooltip"
                                    title="Cancel avatar"
                                  >
                                    <i className="bi bi-x fs-2"></i>
                                  </span>
                                  <span
                                    style={{ marginLeft: "-12px" }}
                                    className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                                    data-kt-image-input-action="remove"
                                    data-bs-toggle="tooltip"
                                    title="Remove avatar"
                                  >
                                    <button
                                      style={{
                                        border: "none",
                                        background: "white",
                                      }}
                                      onClick={removeImaage}
                                      type="button"
                                    >
                                      <i className="bi bi-x fs-2"></i>
                                    </button>
                                  </span>
                                </div>
                                {fileExtensionError ? (
                                  <div
                                    className="form-text"
                                    style={{ color: "red" }}
                                  >
                                    {t("Plz Upload: png, jpg, jpeg. file")}
                                  </div>
                                ) : (
                                  <div className="form-text">
                                    {t("Allowed file types: png, jpg, jpeg.")}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={{ margin: "25px 0px" }}>
                            <hr />
                          </div>
                          <div className="row">
                            <div className="mb-3">
                              <h3>{t("Enter Lab Address")}</h3>
                            </div>
                            <div className="fv-row mb-7 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                              <label className=" mb-2">{t("Email")}</label>
                              <input
                                type="text"
                                name="email"
                                onChange={onInputChange}
                                className="form-control bg-transparent mb-3 mb-lg-0"
                                placeholder="Email"
                                value={email}
                              />
                              <span style={{ color: "red" }}>
                                {emailFormatError}
                              </span>
                              {emailError ? (
                                <span style={{ color: "red" }}>
                                  {t("Email is required")}
                                </span>
                              ) : null}
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required  mb-2">{t("Phone")}</label>
                                <input
                                  type="text"
                                  name="phone"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="(999) 999-9999"
                                  value={phone}
                                />
                                <span style={{ color: "red" }}>
                                  {phoneFormatError}
                                </span>
                                {phoneError ? (
                                  <span style={{ color: "red" }}>
                                    {t("PhoneNo is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="fv-row mb-7 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                              <label className=" mb-2">{t("Fax")}</label>
                              <input
                                type="text"
                                name="fax"
                                onChange={onInputChange}
                                className="form-control bg-transparent mb-3 mb-lg-0"
                                placeholder="Fax"
                                value={fax}
                              />
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required  mb-2">
                                  {t("Address1")}
                                </label>
                                <input
                                  type="text"
                                  name="address1"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="Address1"
                                  value={address1}
                                />
                                {address1Error ? (
                                  <span style={{ color: "red" }}>
                                    {t("Address is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="fv-row mb-7 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                              <label className=" mb-2">{t("Address2")}</label>
                              <input
                                type="text"
                                name="address2"
                                onChange={onInputChange}
                                className="form-control bg-transparent mb-3 mb-lg-0"
                                placeholder="Address2"
                                value={address2}
                              />
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required  mb-2">{t("City")}</label>
                                <input
                                  type="text"
                                  name="city"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="City"
                                  value={city}
                                />
                                {cityError ? (
                                  <span style={{ color: "red" }}>
                                    {t("City is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="fv-row mb-7 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                              <label className="required mb-2">{t("State")}</label>
                              <select
                                name="state"
                                onChange={onInputChange}
                                value={state}
                                className="form-select form-control bg-transparent"
                                data-control="select2"
                                data-hide-search="true"
                                data-placeholder="--Select Option--"
                              >
                                <option></option>
                                <option value="california">{t("California")}</option>
                                <option value="texas">{t("Texas")}</option>
                                <option value="Item 3">{t("Florida")}</option>
                                <option value="alaska">{t("Alaska")}</option>
                              </select>
                              {stateError ? (
                                <span style={{ color: "red" }}>
                                  {t("State is required")}
                                </span>
                              ) : null}
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required  mb-2">
                                  {t("Zip Code")}
                                </label>
                                <input
                                  type="text"
                                  name="zipCode"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="ZipCode"
                                  value={zipCode}
                                />
                                {zipCodeError ? (
                                  <span style={{ color: "red" }}>
                                    {t("ZipCode required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : count === 2 ? (
                      <div className="user-address-section">
                        <div className="w-100">
                          <div className="pb-5 pb-lg-6">
                            <h2 className="fw-bold text-dark">
                              {t("Enter Director Details")}
                            </h2>
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required mb-2">
                                  {t("First Name")}
                                </label>
                                <input
                                  type="text"
                                  name="firstName"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent"
                                  placeholder="First Name"
                                  value={labDirector.firstName}
                                />
                                {firstNameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("FirstName is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="mb-2">{t("Middle Name")}</label>
                                <input
                                  type="text"
                                  name="middleName"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent"
                                  placeholder="Middle Name"
                                  value={labDirector.middleName}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required mb-2">
                                  {t("Last Name")}
                                </label>
                                <input
                                  type="text"
                                  name="lastName"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent"
                                  placeholder="Last Name"
                                  value={labDirector.lastName}
                                />
                                {lastNameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("LastName is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className=" mb-2">{t("Email Address")}</label>
                                <input
                                  type="text"
                                  name="emailAddress"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="Email Address"
                                  value={labDirector.emailAddress}
                                />
                                <span style={{ color: "red" }}>
                                  {emailFormatError}
                                </span>
                                {emailAddressError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Email is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required  mb-2">{t("Mobile")}</label>
                                <input
                                  type="text"
                                  name="mobile"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="Mobile"
                                  value={labDirector.mobile}
                                />
                                <span style={{ color: "red" }}>
                                  {directorMobileNoFormatError}
                                </span>
                                {directorMobileNoError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Mobile No is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className=" mb-2">{t("Phone")}</label>
                                <input
                                  type="text"
                                  name="phone"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="(999) 999-9999"
                                  value={labDirector.phone}
                                />
                                <span style={{ color: "red" }}>
                                  {phoneFormatError}
                                </span>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className=" mb-2">{t("Address1")}</label>
                                <input
                                  type="text"
                                  name="address1"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="Address1"
                                  value={labDirector.address.address1}
                                />
                                {directorAddressError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Address is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className=" mb-2">{t("City")}</label>
                                <input
                                  type="text"
                                  name="city"
                                  onChange={onInputChange}
                                  className="form-control bg-transparent mb-3 mb-lg-0"
                                  placeholder="City"
                                  value={labDirector.address.city}
                                />
                                {directorCityError ? (
                                  <span style={{ color: "red" }}>
                                    {t("City is required")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <label className="required mb-2">{t("State")}</label>
                              <select
                                name="state"
                                onChange={onInputChange}
                                value={labDirector.address.state}
                                className="form-select form-control bg-transparent"
                                data-control="select2"
                                data-hide-search="true"
                                data-placeholder="--Select Option--"
                              >
                                <option></option>
                                <option value="california">{t("California")}</option>
                                <option value="texas">{t("Texas")}</option>
                                <option value="Item 3">{t("Florida")}</option>
                                <option value="alaska">{t("Alaska")}</option>
                              </select>
                              {directorStateError ? (
                                <span style={{ color: "red" }}>
                                  {t("State is required")}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div className="d-flex flex-stack pt-10">
                      {count === 2 ? (
                        <div className="mr-2">
                          <button
                            onClick={countDecrement}
                            type="button"
                            className="btn btn-lg btn-light-primary me-3"
                          >
                            {t("Back")}
                          </button>
                        </div>
                      ) : null}
                      <div style={{ marginLeft: "auto" }}>
                        {count === 2 ? (
                          <button
                            type="submit"
                            className="btn btn-lg btn-primary me-3"
                          >
                            {t("Submit")}
                          </button>
                        ) : null}
                        {count === 1 ? (
                          <button
                            onClick={countIncrement}
                            type="button"
                            className="btn btn-lg btn-primary"
                          >
                            {t("Next")}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(CreateLab);
