import React, { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import Select from "react-select";
import { reactSelectStyle, styles } from "../../Utils/Common";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Facilities from "../Facility/FacilityUser/CreateFacilityUser/Facilities";
import AdditionalUserRole from "../Admin/UserManagement/UserList/AdditionalUserRole";
import InputMask from "react-input-mask";
import useLang from "Shared/hooks/useLanguage";
import { SalesGroupGetAll } from "Services/SalesGroup/SalesGroup";
export interface NavLinkProps<T> {
  NavigatorsArray: T[];
  AddBtnText: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  Inputs: any;
  searchRequest: any;
  setSearchRequest: any;
  loadData: any;
  statusDropDownName: string;
  handleOpen: any;
  handleOnChange: any;
  values: any;
  errors: any;
  setErrors: any;
  editGridHeader: any;
  PanelSetupList: any;
  setPanelSetupList: any;
  openModal: any;
  setValues: any;
  modalheader: any;
  setEditGridHeader: any;
  handleSubmit: any;
  setRequest: any;
  request: any;
  panels: any;
  setPanels: any;
  sports2: any;
  setSports2: any;
  selectedPanels: any;
  setSelectedPanels: any;
  open: any;
  setOpen: any;
  facilities: any;
  GetDataAgainstRoles: any;
  checkboxes: any;
  setCheckboxes: any;
  roletype: any;
  valFacility: any;
  setValFacility: any;
}
export interface LinksArray {
  text: string;
  link: string;
}

const GridNavbar: React.FC<NavLinkProps<LinksArray>> = ({
  setOpenModal,
  values,
  setErrors,
  editGridHeader,
  openModal,
  setValues,
  modalheader,
  setEditGridHeader,
  handleSubmit,
  setRequest,
  sports2,
  setSports2,
  loadData,
  setSelectedPanels,
  facilities,
  GetDataAgainstRoles,
  checkboxes,
  setCheckboxes,
  roletype,
  valFacility,
  setValFacility,
}) => {
  const { t } = useLang();
  const [show, isShow] = useState<boolean>(false);
  const [salesGroups, setSalesGroups] = useState<any[]>([]);
  const [loadingSalesGroups, setLoadingSalesGroups] = useState<boolean>(false);
  Yup.addMethod(Yup.string, "phone", function (errorMessage: string) {
    return this.test("test-phone", errorMessage, function (value) {
      const { path, createError } = this;
      if (value === undefined || value === null) {
        return createError({ path, message: errorMessage });
      }
      const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
      return (
        phoneRegex.test(value) || createError({ path, message: errorMessage })
      );
    });
  });
  //Formik Validation
  const phoneRegExp = /^\(\d{3}\) \d{3}-\d{4}$/;

  const validationSchema = Yup.object({
    positionTitle: Yup.string().nullable().notRequired(),
    firstName: Yup.string().required(t("First Name is required")),
    lastName: Yup.string().required(t("Last Name is required")),
    phone: Yup.string().matches(phoneRegExp, t("Phone number is not valid")),

    salesEmail: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    salesRepNumber: Yup.string().nullable().notRequired(),
    adminType: Yup.string().required("Role Type is required"),
    salesGroupId: Yup.number().nullable().notRequired(),
  });

  // Fetch all sales groups
  const fetchSalesGroups = async () => {
    setLoadingSalesGroups(true);
    try {
      const obj = {
        pageIndex: 0,
        pageSize: 0,
        requestModel: {
          name: "",
          isActive: true,
          isArchived: false,
        },
        sortColumn: "Id",
        sortDirection: "Desc",
      };
      const resp = await SalesGroupGetAll(obj);
      if (resp?.data?.result) {
        const transformedGroups = resp.data.result.map((group: any) => ({
          value: group.id,
          label: group.name,
        }));
        setSalesGroups(transformedGroups);
      }
    } catch (error) {
      console.error("Error fetching sales groups:", error);
    } finally {
      setLoadingSalesGroups(false);
    }
  };

  // Fetch sales groups when modal opens
  useEffect(() => {
    if (openModal) {
      fetchSalesGroups();
    }
  }, [openModal]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <Collapse in={openModal}>
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid ">
            <Formik
              initialValues={values}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({
                setFieldValue,
                values,
                isSubmitting,
                handleChange,
                resetForm,
              }) => (
                <Form>
                  <div id="ModalCollapse" className="card">
                    <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-3 minh-42px">
                      <h5 className="m-0 ">{t(modalheader)}</h5>
                      <div className="d-flex align-items-center gap-2 gap-lg-3">
                        <button
                          id={`ManageSaleRep2Cancel`}
                          className="btn btn-secondary btn-sm fw-bold "
                          aria-controls="SearchCollapse"
                          type="button"
                          aria-expanded="true"
                          onClick={() => {
                            setOpenModal(false);
                            setEditGridHeader(false);
                            setSports2([]);
                            setCheckboxes([]);
                            setRequest(false);
                            resetForm();
                            loadData(true);
                            setValues({
                              id: "",
                              positionTitle: "",
                              firstName: "",
                              lastName: "",
                              salesRepPhone: "",
                              salesEmail: "",
                              salesRepNumber: "",
                              adminType: "",
                              salesGroupId: "",
                            });
                          }}
                        >
                          <span>
                            <i className="fa fa-times"></i>
                            <span>{t("Cancel")}</span>
                          </span>
                        </button>
                        <button
                          id={`ManageSaleRep2Save`}
                          className="btn btn-primary btn-sm btn-primary--icon px-7"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          {t("Save")}
                        </button>
                      </div>
                    </div>
                    <div id="form-search" className=" card-body py-2 py-md-3">
                      <div className="row">
                        <div className="row">
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                            {t("Position Title")}
                            <div className="mb-2">
                              <Field
                                id={`ManageSaleRep2PositionTitle`}
                                className="form-control mt-1"
                                type="text"
                                name="positionTitle"
                                placeholder={t("Position Title")}
                              />
                              <ErrorMessage
                                name="positionTitle"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                            <label className="mr-2 mb-1 required">
                              {t("First Name")}
                            </label>
                            <div className="mb-2">
                              <Field
                                id={`ManageSaleRep2FirstName`}
                                className="form-control"
                                type="text"
                                name="firstName"
                                placeholder={t("First Name")}
                              />
                              <ErrorMessage
                                name="firstName"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                            <label className="mr-2 mb-1 required">
                              {t("Last Name")}
                            </label>
                            <div className="mb-2">
                              <Field
                                id={`ManageSaleRep2LastName`}
                                className="form-control"
                                type="text"
                                name="lastName"
                                placeholder={t("Last Name")}
                              />
                              <ErrorMessage
                                name="lastName"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                            <label className="mr-2 mb-1">{t("Phone")}</label>
                            <div className="mb-2">
                              <InputMask
                                id={`ManageSaleRepPhoneNUmber`}
                                mask="(999) 999-9999"
                                value={values.phone || ""}
                                onChange={handleChange}
                                name="phone"
                                className="form-control"
                                placeholder={t("(xxx) xxx-xxxx")}
                              ></InputMask>
                              <ErrorMessage
                                name="phone"
                                className="text-danger"
                                component="div"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                            <label className="mr-2 mb-1 required">
                              {t("Email")}
                            </label>
                            <div className="mb-2">
                              <Field
                                id={`ManageSaleRep2Email`}
                                className="form-control"
                                type="text"
                                disabled={editGridHeader}
                                name="salesEmail"
                                placeholder={t("Email")}
                              />
                              <ErrorMessage
                                name="salesEmail"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                            <label className="mr-2 mb-1">
                              {t("Sales Rep No")}
                            </label>
                            <div className="mb-2">
                              <Field
                                id={`ManageSaleRep2SaleRepNumber`}
                                className="form-control"
                                type="text"
                                name="salesRepNumber"
                                placeholder={t("Sales Rep No")}
                              />
                              <ErrorMessage
                                name="salesRepNumber"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>
                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                            <div className="fv-row mb-4">
                              <label className="required mb-1">
                                {t("Role Type")}
                              </label>
                              <Select
                                inputId="ManageSaleRep2RolType"
                                menuPortalTarget={document.body}
                                styles={reactSelectStyle}
                                theme={(theme) => styles(theme)}
                                options={roletype}
                                name="adminType"
                                placeholder={t("Select Role Type")}
                                value={roletype.filter(
                                  (option: any) =>
                                    option.value === values.adminType.toString()
                                )}
                                isDisabled={editGridHeader}
                                onChange={(option) => {
                                  setFieldValue(
                                    "adminType",
                                    option ? option.value : ""
                                  );

                                  GetDataAgainstRoles(option.value);
                                }}
                                isSearchable={true}
                                isClearable={true}
                                className="z-index-3"
                              />
                              <ErrorMessage
                                name="adminType"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>

                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                            <div className="fv-row mb-4">
                              <label className="mb-1">{t("Sales Group")}</label>
                              <Select
                                inputId="ManageSaleRep2SalesGroup"
                                menuPortalTarget={document.body}
                                styles={reactSelectStyle}
                                theme={(theme) => styles(theme)}
                                options={salesGroups}
                                name="salesGroupId"
                                placeholder={t("Select Sales Group")}
                                value={
                                  values.salesGroupId
                                    ? salesGroups.find(
                                        (option: any) =>
                                          option.value ===
                                            values.salesGroupId ||
                                          option.value ===
                                            Number(values.salesGroupId)
                                      ) || null
                                    : null
                                }
                                isDisabled={loadingSalesGroups}
                                onChange={(option) => {
                                  setFieldValue(
                                    "salesGroupId",
                                    option ? option.value : ""
                                  );
                                }}
                                isSearchable={true}
                                isClearable={true}
                                className="z-index-3"
                                isLoading={loadingSalesGroups}
                              />
                              <ErrorMessage
                                name="salesGroupId"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>

                          <AdditionalUserRole
                            checkboxes={checkboxes}
                            setCheckboxes={setCheckboxes}
                          />
                          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <Facilities
                              facilities={facilities}
                              values={valFacility}
                              setValues={setValFacility}
                              setSports2={setSports2}
                              sports2={sports2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default GridNavbar;
