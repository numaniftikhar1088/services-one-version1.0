import { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useLang from "Shared/hooks/useLanguage";


export const genderChoices = [
  { id: "Male", label: "Male", value: "Male" },
  { id: "Female", label: "Female", value: "Female" },
  { id: "Unknown", label: "Unknown", value: "Unknown" },
];

export const accountChoices = [
  { id: "Email", label: "Email", value: "Email" },
  { id: "Username", label: "Username", value: "Username" },
];

interface CollapseProps {
  open: boolean;
  handleClose?: any;
  isShown: any;
  setIsShown: any;
  inputs: any;
  setInputs: any;
  index: number;
  selectedDropDownValue: any;
  setSelectedDropDownValue: any;
  dependenceyControls: any;
  setPhysicianList: any;
  physicianList: any;
  onFacilitySelect: any;
  fields: any;
  getCollectorNameList: any;
  ProviderLookup: any;
}

const Popup = (props: CollapseProps) => {
  const { t } = useLang();
  const [loading, setLoading] = useState({ search: false, save: false });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const validationSchema = Yup.object().shape({
    npi: Yup.string()
      .matches(/^\d+$/, t("NPI must only contain numbers"))
      .length(10, t("NPI must be exactly 10 digits"))
      .required(t("NPI is required")),
    firstName: Yup.string().required(t("First name is required")),
    lastName: Yup.string().required(t("Last name is required")),
    //sex: Yup.string().required("Gender is required"),

    accountType: Yup.string()
      .oneOf(["Email", "Username"], t("Invalid account type"))
      .required(t("Account type is required")),
    email: Yup.string().when("accountType", {
      is: "Email",
      then: (schema) =>
        schema.email("Invalid email").required(t("Email is required")),
      otherwise: (schema) => schema.notRequired(),
    }),
    username: Yup.string().when("accountType", {
      is: "Username",
      then: (schema) => schema.required(t("Username is required")),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: Yup.string().when("accountType", {
      is: "Username",
      then: (schema) =>
        schema
          .required(t("Password is required"))
          .min(8, t("Password must be at least 8 characters"))
          .matches(/[A-Z]/, t("Password must contain at least one uppercase letter"))
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            t("Password must contain a special character")
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], t("Passwords must match"))
      .when("accountType", {
        is: "Username",
        then: (schema) => schema.required(t("Please confirm your password")),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const handleSearchNPI = async (npi: string, setFieldValue: any) => {
    setLoading((prev) => ({ ...prev, search: true }));
    try {
      const res: AxiosResponse = await RequisitionType.searchNpi(npi);
      if (Object.values(res?.data).every((value) => value === null)) {
        toast.error(t("No matching records found"));
      } else {
        setFieldValue("firstName", res?.data?.FirstName || "");
        setFieldValue("lastName", res?.data?.LastName || "");
        // setFieldValue(
        //   "sex",
        //   res?.data?.Gender === "M"
        //     ? "Male"
        //     : res?.data?.Gender === "F"
        //     ? "Female"
        //     : "Unknown"
        // );
      }
    } catch (error) {
      console.trace(error);
    } finally {
      setLoading((prev) => ({ ...prev, search: false }));
    }
  };

  const handleSubmit = async (values: any, reset: any) => {

    const {
      npi,
      firstName,
      lastName,
      sex,
      email,
      username,
      password,
      accountType,
    } = values;
    const facilityID = localStorage.getItem("facilityID");
    if (!facilityID) {
      toast.error("Please select a facility");
      return;
    }
    const facilities = [parseInt(facilityID)];
    const payload = {
      npi,
      firstName,
      lastName,
      sex,
      email,
      facilities,
      username,
      password,
      AccountType: accountType,
    };

    setLoading((prev) => ({ ...prev, save: true }));
    try {
      const res = await RequisitionType.CreateFacilityProvider(payload);
      if (res.data.statusCode === 400) {
        toast.error(res.data.message);
        return;
      }
      toast.success("Provider added successfully");
      reset();
      props.handleClose();
      await props.ProviderLookup(facilityID);
    } catch (error) {
      console.trace(error);
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  return (
    <Collapse in={props.open}>
      <Box>
        <div className="card px-0">
          <div className="card-header min-h-30px mt-3 px-0">
            <h3 className="m-0 fs-15px">{t("Add New Provider")}</h3>
          </div>
          <div className="card-body px-0 pb-2 pt-4">
            <Formik
              initialValues={{
                npi: "",
                firstName: "",
                lastName: "",
                sex: "",
                accountType: "Email",
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                handleSubmit(values, resetForm);
              }}
            >
              {({ values, setFieldValue, resetForm }) => (
                <Form>
                  {/* NPI */}
                  <div className="row">
                    <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <label className="required">NPI</label>
                      <Field
                        name="npi"
                        type="text"
                        className="form-control"
                        placeholder="NPI"
                        maxLength="10" // Prevent typing more than 10 characters
                        onInput={(e: any) => {
                          // Restrict input to numbers only
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                      />
                      <ErrorMessage
                        name="npi"
                        component="div"
                        className="form__error text-danger"
                      />
                    </div>
                    <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <button
                        type="button"
                        className="btn btn-light btn-sm mt-2"
                        onClick={() =>
                          handleSearchNPI(values.npi, setFieldValue)
                        }
                        disabled={loading.search}
                      >
                        {loading.search ? t("Searching...") : t("Search NPI Records")}
                      </button>
                    </div>

                    {/* First Name */}
                    <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <label className="required">{t("First Name")}</label>
                      <Field
                        name="firstName"
                        type="text"
                        className="form-control"
                        placeholder={t("First Name")}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="form__error text-danger"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <label className="required">{t("Last Name")}</label>
                      <Field
                        name="lastName"
                        type="text"
                        className="form-control"
                        placeholder={t("Last Name")}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="form__error text-danger"
                      />
                    </div>

                    {/* Gender */}
                    {/* <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <label className="required">Gender</label>
                      <div>
                        {genderChoices.map((choice) => (
                          <label
                            key={choice.id}
                            className="form-check form-check-inline"
                          >
                            <Field
                              type="radio"
                              name="sex"
                              value={choice.value}
                              className="form-check-input"
                            />
                            {choice.label}
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="sex"
                        component="div"
                        className="form__error text-danger"
                      />
                    </div> */}

                    {/* Account Type */}
                    <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <label className="required">{t("Account Type")}</label>
                      <div>
                        {accountChoices.map((choice) => (
                          <label
                            key={choice.id}
                            className="form-check form-check-inline"
                          >
                            <Field
                              type="radio"
                              name="accountType"
                              value={choice.value}
                              className="form-check-input"
                            />
                            {t(choice.label)}
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="accountType"
                        component="div"
                        className="form__error text-danger"
                      />
                    </div>

                    {/* Email */}
                    {values.accountType === "Email" && (
                      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <label className="required">Email</label>
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="form__error text-danger"
                        />
                      </div>
                    )}

                    {/* Username */}
                    {values.accountType === "Username" && (
                      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <label className="required">Username</label>
                        <Field
                          name="username"
                          type="text"
                          className="form-control"
                          placeholder="Username"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="form__error text-danger"
                        />
                      </div>
                    )}

                    {/* Password */}
                    {values.accountType === "Username" && (
                      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <label className="required">Password</label>
                        <div className="d-flex justify-content-between border rounded m-auto">
                          <Field
                            name="password"
                            type={passwordVisible ? "text" : "password"}
                            className="form-control"
                            placeholder="Password"
                          />

                          <button
                            type="button"
                            className="border-0 bg-transparent d-flex align-items-center"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            <i
                              className={`fa ${passwordVisible ? "fa-eye-slash" : "fa-eye"
                                } password-toggle`}
                            ></i>
                          </button>
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="form__error text-danger"
                        />
                      </div>
                    )}

                    {/* Confirm Password */}
                    {values.accountType === "Username" && (
                      <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <label className="required">Confirm Password</label>
                        <div className="d-flex justify-content-between border rounded m-auto">
                          <Field
                            name="confirmPassword"
                            type={confirmPasswordVisible ? "text" : "password"}
                            className="form-control"
                            placeholder="Confirm Password"
                          />
                          <button
                            type="button"
                            className="border-0 bg-transparent d-flex align-items-center"
                            onClick={() =>
                              setConfirmPasswordVisible(!confirmPasswordVisible)
                            }
                          >
                            <i
                              className={`fa ${confirmPasswordVisible
                                ? "fa-eye-slash"
                                : "fa-eye"
                                } password-toggle`}
                            ></i>
                          </button>
                        </div>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="form__error text-danger"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        props.handleClose();
                        resetForm();
                      }}
                    >
                      {t("Cancel")}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ms-2"
                      disabled={loading.save}
                    >
                      {loading.save ? t("Saving...") : t("Save")}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Box>
    </Collapse>
  );
};

export default Popup;
