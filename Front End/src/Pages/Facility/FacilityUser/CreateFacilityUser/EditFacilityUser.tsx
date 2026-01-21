import useLang from "Shared/hooks/useLanguage";
import { AxiosError, AxiosResponse } from "axios";
import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  FormikProps,
} from "formik";
import React, { useEffect, useState } from "react";
import ReactInputMask from "react-input-mask";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import UserManagementService from "../../../../Services/UserManagement/UserManagementService";
import { genderChoices, styles } from "../../../../Utils/Common";
import {
  GlobalAccountTypeEnum,
  PortalTypeEnum,
} from "../../../../Utils/Common/Enums/Enums";
import AdditionalUserRole from "../../../Admin/UserManagement/UserList/AdditionalUserRole";
import Facilities from "./Facilities";

export interface IFormValues {
  facilitiesIds: [];
  [key: string]: string | boolean | null | number | Array<string>;
}
export interface IPage {
  claimsId: number;
  isChecked: boolean;
}
export interface IAdminType {
  value: number;
  label: string;
}
export interface IUserGroup {
  userGroupId: number;
  name: string;
}

export default function EditFacilityUser() {
  const { t } = useLang();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const [sports2, setSports2] = useState<any>([]);
  const [facilities, setFacilities] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowConfirmPassword = () => {
    setShowPassword(!showPassword);
  };

  const formikRef = React.useRef<FormikProps<any>>(null);
  useEffect(() => {
    if (id) {
      EditFacilityUser(id);
    }
    loadFacilities();
    GetUserType();
    GetAllUserRoleList();
  }, []);

  const [dropDownValues, setDropDownValues] = useState({
    UserGroupList: [],
    AdminTypeList: [],
  });

  const initialValues = {
    adminType: "",
    firstName: "",
    lastName: "",
    npiNumber: "",
    stateLicense: "",
    // gender: "",
    phoneNumber: "",
    accountType: "",
    userName: "",
    email: "",
    password: "",
    reenterPassword: "",
    id: "",
    isTemporaryPassword: false,
  };

  const choicesActivationType = [
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
  ];

  const [values, setValues] = useState<IFormValues>({
    facilitiesIds: [],
  });

  const GetUserType = () => {
    UserManagementService.getUserType()
      .then((res: AxiosResponse) => {
        let AdminTypeArray: any = [];
        res?.data?.forEach((val: IAdminType) => {
          let adminTypeDetails = {
            value: val?.value,
            label: val?.label,
          };
          AdminTypeArray.push(adminTypeDetails);
        });
        setDropDownValues((pre: any) => {
          return {
            ...pre,
            AdminTypeList: AdminTypeArray,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const GetAllUserRoleList = () => {
    UserManagementService.GetAllUserRoleList(PortalTypeEnum.Facility)
      .then((res: AxiosResponse) => {
        setDropDownValues((pre: any) => {
          return {
            ...pre,
            UserGroupList: res?.data?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const loadFacilities = () => {
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setFacilities(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  const [loader, setLoader] = useState(false);

  const isUsernameAnEmail = (username: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(username);
  };

  const handleSubmit = (formikValues: any) => {
    if (isUsernameAnEmail(formikValues.userName)) {
      toast.error(t("Username cannot be an email!"));
      return;
    }

    let objToSend = {
      id: formikValues.id,
      facilities: values.facilitiesIds,
      adminType: formikValues.adminType,
      firstName: formikValues.firstName,
      lastName: formikValues.lastName,
      npiNumber: formikValues.npiNumber,
      stateLicense: formikValues.stateLicense,
      accountType: parseInt(formikValues.accountType),
      username: formikValues?.accountType == 0 ? formikValues.userName : null,
      password: formikValues?.accountType == 0 ? formikValues.password : null,
      adminEmail: formikValues?.accountType == 1 ? formikValues.email : null,
      phoneNumber: formikValues.phoneNumber,
      gender: "",
      modules: checkboxes,
      isTemporaryPassword: formikValues.isTemporaryPassword,
    };

    const isAtLeastOneModuleSelected = objToSend.modules.some(
      (module: any) => module.isSelected
    );

    if (values.facilitiesIds.length === 0) {
      toast.error("Select atleast one facility");
      return;
    }

    if (!isAtLeastOneModuleSelected) {
      toast.error("Select atleast one module");
      return;
    }

    setLoader(true);
    UserManagementService.SaveOrEditFacilityUser(objToSend)
      .then((res: AxiosResponse) => {
        if (res.data.statusCode === 200) {
          toast.success(res.data.responseMessage);
          setTimeout(() => {
            navigate("/facility-user-list");
          }, 1000);
        } else if (res.data.statusCode === 400 || res.data.statusCode === 409) {
          toast.error(res.data.responseMessage);
        }
      })
      .catch((err: AxiosError) => console.error(err, "err while creating user"))
      .finally(() => setLoader(false));
  };

  const EditFacilityUser = async (id: any) => {
    await UserManagementService.getFacilityUserAgainstId(atob(id))
      .then((res: AxiosResponse) => {
        formikRef.current?.setValues({
          adminType: res?.data?.data.adminType,
          firstName: res?.data?.data.firstName,
          lastName: res?.data?.data.lastName,
          npiNumber: res?.data?.data.npiNumber,
          stateLicense: res?.data?.data.stateLicense ?? "",
          // gender: res?.data?.data.gender ?? "",
          phoneNumber: res?.data?.data.phoneNumber ?? "",
          accountType: res?.data?.data.accountType.toString(),
          userName: res?.data?.data.userName,
          email: res?.data?.data.adminEmail,
          password: res?.data?.data.password || "",
          id: res?.data?.data.id,
          isTemporaryPassword: false,
        });

        setSports2(res.data.data.facilities);
        setCheckboxes(res?.data?.data.modules);
      })
      .catch((err: AxiosError) =>
        console.error(err, "err while creating user")
      );
  };
  const [checkboxes, setCheckboxes] = useState([]);

  ////////////-----------------Get Data Against Roles-------------------///////////////////

  const GetDataAgainstRolesByUserId = async (userId: string) => {
    await UserManagementService?.getByIdAllUserRolesAndPermissions(userId)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          setCheckboxes(res?.data?.data.modules);
        } else if (res?.data?.status === 400) {
          toast.error(res?.data?.message);
        }
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  const validationSchema = Yup.object().shape({
    adminType: Yup.string().required(t("User Type is required")),
    firstName: Yup.string().required(t("First Name is required")),
    lastName: Yup.string().required(t("Last Name is required")),
    // gender: Yup.string().required(t("Gender is required")),
    npiNumber: Yup.string().when("adminType", {
      is: (value: any) => value === "72", // Ensure "value" type is compatible
      then: () =>
        Yup.string()
          .required(t("NPI # is required")) // Conditional requirement
          .matches(/^\d{10}$/, t("NPI # must be exactly 10 digits")), // Validate length and numeric-only
      otherwise: () =>
        Yup.string()
          .notRequired()
          .matches(/^\d{10}$/, t("NPI # must be exactly 10 digits")), // Not required if adminType is not "72"
    }),
    phoneNumber: Yup.string()
      .nullable()
      .when(["adminType", "accountType"], {
        is: (adminType: any, accountType: any) =>
          String(adminType) === "72" && String(accountType) === "0",
        then: (schema) =>
          schema
            .required(t("Phone Number is required"))
            .test(
              "is-valid-phone",
              "Phone number must match the format (999) 999-9999",
              (value) => {
                const digitsOnly = value?.replace(/\D/g, "") || "";
                if (digitsOnly === "") return false; // Required, so empty is invalid
                return /^\d{10}$/.test(digitsOnly); // Ensure exactly 10 digits
              }
            ),
        otherwise: (schema) =>
          schema.test(
            "is-valid-phone",
            "Phone number must match the format (999) 999-9999",
            (value) => {
              const digitsOnly = value?.replace(/\D/g, "") || "";
              if (digitsOnly === "") return true; // Treat empty masked input as empty
              return /^\d{10}$/.test(digitsOnly); // Ensure exactly 10 digits
            }
          ),
      }),
    accountType: Yup.string().required(t("Account Type is required")),
    userName: Yup.string().when("accountType", {
      is: "0",
      then: (schema) => schema.required(t("Username is required")),
      otherwise: (schema) => schema.notRequired(),
    }),
    email: Yup.string()
      .email(t("Invalid email address"))
      .when("accountType", {
        is: "1",
        then: (schema) => schema.required(t("Email is required")),
        otherwise: (schema) => schema.notRequired(),
      }),
    password: Yup.string().when(
      ["accountType", "id", "isTemporaryPassword"],
      ([accountType, id, isTemporaryPassword], schema) => {
        if (
          (accountType === "0" && !id) ||
          (accountType === "0" && id && isTemporaryPassword)
        ) {
          return schema
            .required(t("Password is required"))
            .matches(
              /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
              t(
                "Password must contain at least 8 characters, one uppercase letter, and one special character"
              )
            );
        }
        return schema.notRequired();
      }
    ),
    reenterPassword: Yup.string().when(["accountType", "id"], {
      is: (accountType: string, id: string | undefined) =>
        accountType === "0" && !id,
      then: () =>
        Yup.string()
          .required(t("Re-enter password is required"))
          .oneOf([Yup.ref("password")], t("Passwords must match")), // Remove null from the array
      otherwise: () => Yup.string().notRequired(),
    }),
  });

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
                {id ? t("Edit a Facility User") : t("Add a Facility User")}
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Link
              id="FacilityUserCancelRecord"
              type="button"
              className="btn btn-secondary btn-sm btn-secondary--icon"
              to={"/facility-user-list"}
            >
              <span>
                <span>{t("Cancel")}</span>
              </span>
            </Link>
            <button
              id="FacilityUserSaveRecord"
              className="btn btn-primary btn-sm btn-primary--icon px-7"
              type="button"
              onClick={() => formikRef.current?.submitForm()}
            >
              <span>
                {loader ? (
                  <span>{id ? t("Updating...") : t("Saving...")}</span>
                ) : (
                  <>
                    <span>{id ? t("Update") : t("Save")}</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="app-container container-fluid">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 ">
                {id ? t("Edit a Facility User") : t("Add a Facility User")}
              </h5>
            </div>
            <div className="card-body py-md-4 py-3">
              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
              >
                {({ values, handleChange }) => {
                  return (
                    <Form className="row">
                      <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                        <label className="mb-2 required">
                          {t("User Type")}
                        </label>
                        <Field
                          menuPortalTarget={document.body}
                          theme={(theme: any) => styles(theme)}
                          as="select"
                          name="adminType"
                          className="form-control"
                          disabled={id ? true : false}
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            handleChange(event);
                            GetDataAgainstRolesByUserId(event.target.value);
                          }}
                        >
                          <option value="">{t("Select User Type")}</option>
                          {dropDownValues.UserGroupList.map((option: any) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <div className="form__error">
                          <span>
                            <ErrorMessage name="adminType" component="div" />
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                        <label className="mb-2 required">
                          {t("First Name")}
                        </label>
                        <Field
                          name="firstName"
                          type="text"
                          className="form-control"
                          placeholder={t("First Name")}
                        />
                        <div className="form__error">
                          <span>
                            <ErrorMessage name="firstName" component="div" />
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                        <label className="mb-2 required">
                          {t("Last Name")}
                        </label>
                        <Field
                          name="lastName"
                          type="text"
                          className="form-control"
                          placeholder={t("Last Name")}
                        />
                        <div className="form__error">
                          <span>
                            <ErrorMessage name="lastName" component="div" />
                          </span>
                        </div>
                      </div>

                      {values.adminType == 72 && (
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                          <label className="mb-2 required">{t("NPI #")}</label>
                          <Field
                            name="npiNumber"
                            type="text"
                            className="form-control"
                            placeholder={t("NPI #")}
                            onInput={(e: any) => {
                              const input = e.target;
                              input.value = input.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 10);
                            }}
                          />
                          <div className="form__error">
                            <span>
                              <ErrorMessage name="npiNumber" component="div" />
                            </span>
                          </div>
                        </div>
                      )}
                      {values.adminType == 72 && (
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                          <label className="mb-2">{t("State License #")}</label>
                          <Field
                            name="stateLicense"
                            type="text"
                            className="form-control"
                            placeholder={t("State License #")}
                          />
                        </div>
                      )}
                      {values.adminType == 74 && (
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                          <label className="mb-2">{t("NPI #")}</label>
                          <Field
                            name="npiNumber"
                            type="text"
                            className="form-control"
                            placeholder={t("NPI #")}
                            onInput={(e: any) => {
                              const input = e.target;
                              input.value = input.value
                                .replace(/[^0-9]/g, "")
                                .slice(0, 10);
                            }}
                          />
                          <div className="form__error">
                            <span>
                              <ErrorMessage name="npiNumber" component="div" />
                            </span>
                          </div>
                        </div>
                      )}
                      {/*
                      <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                        <label className="mb-2">{t("Gender")}</label>
                        <div className="row m-0">
                          {genderChoices.map((choice) => (
                            <label
                              key={choice.value}
                              className="form-check form-check-sm form-check-solid col-6 my-1"
                            >
                              <Field
                                type="radio"
                                name="gender"
                                value={choice.value}
                                className="form-check-input"
                              />
                              <span className="form-check-label">
                                {choice.label}
                              </span>
                            </label>
                          ))}
                        </div>
                        <div className="form__error">
                          <span>
                            <ErrorMessage name="gender" component="div" />
                          </span>
                        </div>
                      </div> */}

                      <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                        <label
                          className={`mb-2 ${
                            values.adminType == 72 && values.accountType === "0"
                              ? "required"
                              : ""
                          }`}
                        >
                          {t("Phone No")}
                        </label>
                        <Field
                          name="phoneNumber"
                          render={({ field, form }: FieldProps) => (
                            <ReactInputMask
                              {...field}
                              mask="(999) 999-9999"
                              className={`form-control ${
                                form.touched[field.name] &&
                                form.errors[field.name]
                                  ? "is-invalid"
                                  : ""
                              }`}
                              placeholder="Phone Number"
                            />
                          )}
                        />
                        <div className="form__error">
                          <span>
                            <ErrorMessage name="phoneNumber" component="div" />
                          </span>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                        <label className="mb-2 required">
                          {t("Account Type")}
                        </label>
                        <div className="row m-0">
                          {choicesActivationType.map((choice) => (
                            <label
                              key={choice.value}
                              className="form-check form-check-sm form-check-solid col-6 my-1"
                            >
                              <Field
                                type="radio"
                                name="accountType"
                                value={choice?.value.toString()}
                                className="form-check-input"
                                id={choice.value}
                              />
                              <span className="form-check-label">
                                {t(choice.label)}
                              </span>
                            </label>
                          ))}
                        </div>
                        <div className="form__error">
                          <span>
                            <ErrorMessage name="accountType" component="div" />
                          </span>
                        </div>
                      </div>

                      {values.accountType === "0" && (
                        <>
                          <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                            <label className="mb-2 required">
                              {t("Username")}
                            </label>
                            <Field
                              name="userName"
                              type="text"
                              className="form-control"
                              placeholder={t("Username")}
                            />
                            <div className="form__error">
                              <span>
                                <ErrorMessage name="userName" component="div" />
                              </span>
                            </div>
                          </div>

                          {!id ? null : (
                            <div className="col-lg-3 col-md-6 col-sm-12 d-flex align-items-center mb-4">
                              <label
                                className="form-check form-check-sm form-check-solid d-flex justify-content-center"
                                htmlFor="isTemporaryPassword"
                              >
                                <Field
                                  name="isTemporaryPassword"
                                  type="checkbox"
                                  className="form-check-input mr-2"
                                />
                                {t("Temporary Password")}
                              </label>
                            </div>
                          )}

                          {id && values.isTemporaryPassword ? (
                            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                              <label className="mb-2 required">
                                {t("Temporary Password")}
                              </label>

                              <div className="d-flex justify-content-between border rounded m-auto">
                                <Field
                                  name="password"
                                  className="form-control border-0"
                                  placeholder={t("Password")}
                                  type={showPassword ? "text" : "password"}
                                  autoComplete="off"
                                />
                                <button
                                  type="button"
                                  className="border-0 bg-transparent d-flex align-items-center"
                                  onClick={toggleShowConfirmPassword}
                                >
                                  <i
                                    className={`bi ${
                                      !showPassword ? "bi-eye-slash" : "bi-eye"
                                    }`}
                                  ></i>
                                </button>
                              </div>
                              <div className="form__error">
                                <span>
                                  <ErrorMessage
                                    name="password"
                                    component="div"
                                  />
                                </span>
                              </div>
                            </div>
                          ) : null}

                          {id ? null : (
                            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                              <label className="mb-2 required">
                                {t("Temporary Password")}
                              </label>
                              <Field
                                name="password"
                                type="password"
                                className="form-control"
                                placeholder={t("Temporary Password")}
                              />
                              <div className="form__error">
                                <span>
                                  <ErrorMessage
                                    name="password"
                                    component="div"
                                  />
                                </span>
                              </div>
                            </div>
                          )}

                          {id ? null : (
                            <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                              <label className="mb-2 required">
                                {t("Re-enter Password")}
                              </label>
                              <Field
                                name="reenterPassword"
                                type="password"
                                className="form-control"
                                placeholder={t("Re-enter Password")}
                              />
                              <div className="form__error">
                                <span>
                                  <ErrorMessage
                                    name="reenterPassword"
                                    component="div"
                                  />
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {values.accountType === "1" && (
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                          <label className="mb-2 required">{t("Email")}</label>
                          <Field
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder={t("Email")}
                          />
                          <div className="form__error">
                            <span>
                              <ErrorMessage name="email" component="div" />
                            </span>
                          </div>
                        </div>
                      )}
                    </Form>
                  );
                }}
              </Formik>

              <AdditionalUserRole
                checkboxes={checkboxes}
                setCheckboxes={setCheckboxes}
              />
              <Facilities
                facilities={facilities}
                values={values}
                setValues={setValues}
                sports2={sports2}
                setSports2={setSports2}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
