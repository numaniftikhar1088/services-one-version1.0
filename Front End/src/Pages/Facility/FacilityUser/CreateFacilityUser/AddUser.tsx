import React, { ChangeEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import { IFormValues } from ".";
import Input from "../../../../Shared/Common/Input/Input";
import Radio from "../../../../Shared/Common/Input/Radio";
import { RefreshIcon } from "../../../../Shared/Icons";
import {
  genderChoices,
  generateAutoGeneratePassword,
  reactSelectStyle,
  styles,
} from "../../../../Utils/Common";
import { GlobalAccountTypeEnum } from "../../../../Utils/Common/Enums/Enums";
import AdditionalUserRole from "../../../Admin/UserManagement/UserList/AdditionalUserRole";
import Facilities from "./Facilities";

export interface Item1 {
  [x: string]: any;
  userGroupId: number;
  name: string;
}
interface IProps {
  handleOnChange: ChangeEventHandler;
  // error: any;
  values: IFormValues;
  setValues: any;
  handleSubmit: any;
  facilities: any;
  formData: any;
  changeHandler: any;
  changeHandlerForNames: any;
  errors: any;
  setDataAndErrors: any;
  setActiveType: any;
  AdminTypeList: Item[];
  UserGroupList: Item1[];
  dropDownValues: any;
  GetDataAgainstRoles: any;
  checkboxes: any;
  setCheckboxes: any;
  sports2: any;
  setSports2: any;
  changeHandlerForNpi: any;
  changeHandlerForEmail: any;
  ValidEmail: any;
  isEmailExistError: any;
  ValidUsername: any;
  isUserNameExistError: any;
  emailError: any;
  changeHandlerForUserName: any;
  loading: any;
}
export interface Item {
  [x: string]: any;
  userGroupId: number;
  name: string;
}
export const AddUser: React.FC<IProps> = ({
  // facility,
  // error,
  values,
  setValues,
  handleOnChange,
  handleSubmit,
  facilities,
  formData,
  changeHandler,
  changeHandlerForNames,
  errors,
  setDataAndErrors,
  setActiveType,
  AdminTypeList,
  UserGroupList,
  dropDownValues,
  GetDataAgainstRoles,
  checkboxes,
  setCheckboxes,
  sports2,
  setSports2,
  changeHandlerForNpi,
  changeHandlerForEmail,
  ValidEmail,
  isEmailExistError,
  ValidUsername,
  isUserNameExistError,
  emailError,
  changeHandlerForUserName,
  loading,
  // AddInsuranceRowData,
  //   compData,
}) => {
  const { t } = useLang();
  const [email, setEmail] = useState([false]);
  const [username, setUsername] = useState([false]);

  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption1, setSelectedOption1] = useState("");

  const handleOptionChange = (event: any) => {
    setValues((preVal: any) => {
      return {
        ...preVal,
        [event.target.name]: event?.target.value,
      };
    });
    setSelectedOption(event.target.value);
  };

  console.log(formData?.adminType?.value, "formData?.adminType?.value");

  return (
    <>
      <div className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
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

              <li className="breadcrumb-item text-muted">{t("Admin")}</li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">
                {t("Add a Facility User")}
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              type="button"
              className="btn btn-secondary btn-sm btn-secondary--icon"
              id="kt_reset"
              to={"/facility-user-list"}
            >
              <span>
                <span>{t("Cancel")}</span>
              </span>
            </Link>
            <button
              className="btn btn-primary btn-sm btn-primary--icon px-7"
              onClick={handleSubmit}
            >
              <span>
                {loading ? (
                  <span>{t("Saving...")}</span>
                ) : (
                  <span>{t("Save")}</span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="app-container container-fluid">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="card shadow-sm mb-3 rounded">
            <div className="align-items-center bg-light-dark card-header d-flex min-h-35px justify-content-between">
              <h5 className="m-0 ">{t("Add New User")}</h5>
            </div>
            <div className="card-body py-md-3 py-2">
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12 mb-lg-0 mb-4">
                  <label className="mb-2 fw-500 required">
                    {t("User Type")}
                  </label>
                  <Select
                    inputId="CreatFacilityAdminType"
                    menuPortalTarget={document.body}
                    styles={reactSelectStyle}
                    theme={(theme: any) => styles(theme)}
                    options={UserGroupList}
                    onChange={(event: any) => {
                      let updatedData = {
                        ...formData,
                        adminType: {
                          ...formData["adminType"],
                          value: event.value,
                          touched: true,
                        },
                      };
                      setDataAndErrors(updatedData);
                      GetDataAgainstRoles(event.value);
                    }}
                    value={dropDownValues?.UserGroupList.filter(function (
                      option: any
                    ) {
                      return option.value === String(formData.adminType.value);
                    })}
                  />
                  <div className="form__error">
                    <span>{errors?.adminType}</span>
                  </div>
                </div>
                <Input
                  type="text"
                  label="First Name"
                  name="firstName"
                  onChange={changeHandlerForNames}
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder="First Name"
                  value={formData?.firstName?.value}
                  error={errors?.firstName}
                  //loading={loading}
                  required={true}
                />
                <Input
                  type="text"
                  label="Last Name"
                  name="lastName"
                  onChange={changeHandlerForNames}
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder="Last Name"
                  value={formData?.lastName?.value}
                  error={errors?.lastName}
                  //loading={loading}
                  required={true}
                />
                {formData?.adminType?.value === "72" ? (
                  <>
                    <Input
                      type="text"
                      label="NPI #"
                      name="npiNumber"
                      onChange={changeHandlerForNpi}
                      parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                      placeholder="NPI #"
                      value={formData?.npiNumber?.value}
                      error={errors?.npiNumber}
                      //loading={loading}
                      required={true}
                    />
                    <Input
                      type="text"
                      label="State License #"
                      name="stateLicense"
                      //onBlur={onKeyUp}
                      onChange={changeHandler}
                      parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                      placeholder="state License #"
                      value={formData?.stateLicense?.value}
                      error={errors?.stateLicense}
                      //loading={loading}
                      // required={true}
                    />
                  </>
                ) : null}
                {formData?.adminType?.value == 74 ? (
                  <Input
                    type="text"
                    label="NPI #"
                    name="npiNumber"
                    onChange={changeHandlerForNpi}
                    parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                    placeholder="NPI #"
                    value={formData?.npiNumber?.value}
                    //error={errors?.npiNumber}
                    //required={true}
                  />
                ) : null}
                {/* {AddFacilityUserInputs?.map((input: IInput, index: number) => (
                <div className="col-lg-3 col-md-6 col-sm-12">
                <FormInput
                    key={index}
                    {...input}
                    value={values[input.name]}
                    onChange={handleOnChange}
                />
                </div>
                ))} */}
                <div className="mb-lg-0 mb-4 col-lg-3 col-md-6 col-sm-12">
                  <label className="required mb-2 fw-500">{t("Gender")}</label>
                  <div className="row">
                    {genderChoices.map((choice: any) => (
                      <>
                        <div className="col-6">
                          <label className="form-check form-check-inline form-check-solid me-5 my-1">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id={choice.id}
                              onChange={changeHandler}
                              checked={formData?.gender.value === choice.value}
                              value={choice.value}
                              // error={errors.gender}
                              required={true}
                            />

                            <span className="form-check-label">
                              {choice.label}
                            </span>
                          </label>
                        </div>
                      </>
                    ))}

                    {errors.gender && (
                      <div className="form__error">
                        <span>{errors.gender}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Input
                  type="tel"
                  label="Phone No"
                  name="phoneNumber"
                  onChange={changeHandler}
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder="Phone No"
                  value={formData?.phoneNumber?.value}
                  error={errors?.phoneNumber}
                  required={true}
                />
                <div className="col-lg-3 col-md-6 col-sm-12">
                  {/* <!--begin::Input group--> */}
                  <div className="fv-row mb-lg-0 mb-4">
                    <Radio
                      label="Account Type"
                      name="accountType"
                      onChange={(e) => {
                        let updatedData = {
                          ...formData,
                          accountType: {
                            ...formData["accountType"],
                            value: e.target.value,
                            touched: true,
                          },
                        };

                        setDataAndErrors(updatedData);
                        setActiveType(e.target.value);
                      }}
                      value={formData.accountType.value}
                      choices={[
                        {
                          id: "Username1",
                          label: "Username",
                          value: String(GlobalAccountTypeEnum.Username),
                        },
                        {
                          id: "Email1",
                          label: "Email",
                          value: String(GlobalAccountTypeEnum.Email),
                        },
                      ]}
                      error={errors.accountType}
                      checked={formData.accountType.value}
                    />
                  </div>
                </div>
                {formData?.accountType.value === "0" && (
                  <>
                    <Input
                      type="text"
                      label="User Name"
                      name="username"
                      onBlur={ValidUsername}
                      onChange={changeHandlerForUserName}
                      parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                      placeholder="User Name"
                      value={formData?.username?.value}
                      error={
                        errors?.username != null
                          ? errors?.username
                          : isUserNameExistError
                      }
                      required={true}
                    />

                    <div className="col-lg-3 col-md-6 col-sm-12 showpass thenuser">
                      <label className="required mb-2 fw-500">
                        {t("Password")}
                      </label>
                      <div className="mb-1">
                        <div className="position-relative mb-3 getPass">
                          <input
                            className="form-control bg-transparent"
                            name="password"
                            onChange={changeHandler}
                            type="password"
                            placeholder="Password"
                            autoComplete="off"
                            value={formData?.password?.value}
                          />
                          <span
                            onClick={() => {
                              let updatedData = {
                                ...formData,
                                password: {
                                  ...formData["password"],
                                  value: generateAutoGeneratePassword(),
                                  touched: true,
                                },
                              };
                              setDataAndErrors(updatedData);
                            }}
                            className="generate-password mr-0 border-0"
                            data-toggle="tooltip"
                            title=""
                            data-original-title="Generate Password"
                            aria-describedby="tooltip419827"
                          >
                            {/* <RefreshIcon /> */}
                            <RefreshIcon />
                          </span>
                        </div>
                        {errors?.password && (
                          <div className="form__error">
                            <span> {errors?.password}</span>
                          </div>
                        )}
                        {/* <!--end::Input wrapper--> */}
                        {/* <!--begin::Meter--> */}
                        <div
                          className="d-flex align-items-center mb-3 d-none"
                          data-kt-password-meter-control="highlight"
                        >
                          <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                          <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                          <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                          <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                        </div>
                        {/* <!--end::Meter--> */}
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 showpass thenuser">
                      <div
                        className="fv-row mb-8"
                        data-kt-password-meter="true"
                      >
                        <label className="required mb-2 fw-500">
                          {t("Re-enter Password")}
                        </label>

                        <div className="mb-1">
                          <div className="position-relative mb-3 getPass">
                            <input
                              type="password"
                              className="form-control bg-transparent"
                              name="reEnterPassword"
                              onChange={changeHandler}
                              placeholder="Re-enter Password"
                              autoComplete="off"
                              value={formData?.reEnterPassword?.value}
                            />

                            {/* <span className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                                            {isVisibility ? (
                                              <EyeIconSlash />
                                            ) : (
                                              <EyeIcon />
                                            )}
                                          </span> */}
                          </div>
                          {errors?.reEnterPassword && (
                            <div className="form__error">
                              <span>{errors?.reEnterPassword}</span>
                            </div>
                          )}
                          {/* <!--end::Input wrapper--> */}
                          {/* <!--begin::Meter--> */}
                          <div
                            className="d-flex align-items-center mb-3 d-none"
                            data-kt-password-meter-control="highlight"
                          >
                            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                          </div>
                          {/* <!--end::Meter--> */}
                        </div>
                        {/* <!--end::Wrapper--> */}
                        {/* <!--begin::Hint--> */}
                        <div className="text-muted d-none">
                          {t(
                            "Use 8 or more characters with a mix of letters, numbers & symbols."
                          )}
                        </div>
                        {/* <!--end::Hint--> */}
                      </div>
                      {/* <!--end::Input group--> */}
                    </div>
                  </>
                )}
                {formData?.accountType.value === "1" && (
                  <>
                    <Input
                      type="text"
                      label="Email"
                      name="email"
                      onBlur={ValidEmail}
                      onChange={changeHandlerForEmail}
                      parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                      placeholder="Email"
                      value={formData?.email?.value}
                      error={errors?.email}
                      required={true}
                    />
                  </>
                )}
              </div>

              <AdditionalUserRole
                checkboxes={checkboxes}
                setCheckboxes={setCheckboxes}
              />
              {/* addd */}
              <Facilities
                facilities={facilities}
                values={values}
                setValues={setValues}
                setSports2={setSports2}
                sports2={sports2}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
