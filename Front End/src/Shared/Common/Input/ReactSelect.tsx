import { Collapse, IconButton } from "@mui/material";
import { useFormik } from "formik";
import { t } from "i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Select from "react-select";
import { useBilling } from "Shared/hooks/useBilling";
import * as Yup from "yup";
import InsuranceService from "../../../Services/InsuranceService/InsuranceService";
import { assignFormValues } from "../../../Utils/Auth";
import { stateDropdownArray, styles } from "../../../Utils/Common";
import { toast } from "react-toastify";

const ReactSelect = (props: any) => {
  const { addBillingInfo, getBillingData } = useBilling();
  const {
    Inputs,
    index,
    depControlIndex,
    fieldIndex,
    inputValue,
    isDependency,
    repeatFieldSection,
    isDependencyRepeatFields,
    repeatFieldIndex,
    repeatDependencySectionIndex,
    repeatDepFieldIndex,
  } = props;

  const insuranceID = localStorage.getItem("insuranceOptionId");
  const facilityID = localStorage.getItem("facilityID");
  const [isClearable, setIsClearable] = useState(true);
  // const inputElementReactSelect = useRef(props?.name);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [newInsuranceAdded, setNewInsurance] = useState(false);
  const [billings, setBillings] = useState<any>({});
  const valueSetRef = useRef(false); // Track if value has been successfully set
  const [localStorageData, setLocalStorageData] = useState(() => {
    // Initial data load from localStorage
    return (
      JSON.parse(sessionStorage.getItem("billingInsurances") ?? "{}") || null
    );
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const data = JSON.parse(
        sessionStorage.getItem("billingInsurances") ?? "{}"
      );

      // Only update the state if the data has changed
      if (JSON.stringify(data) !== JSON.stringify(localStorageData)) {
        setLocalStorageData(data); // Update the state if data has changed
      }
    }, 500); // Check every 500ms (adjust as needed)

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [localStorageData]); // Dependency on localStorageData to track changes

  const billingInfo = useMemo(
    () => getBillingData(),
    [fieldIndex, localStorageData]
  );

  useEffect(() => {
    if (billingInfo !== billings) {
      setBillings(billingInfo ?? {});
    }
  }, [billingInfo]);
  const getInsuranceType = (inputs: any): any => {
    for (const item of inputs) {
      if (item.sectionId === 5) {
        for (const field of item.fields) {
          if (field.displayFieldName === "Repeat Start") {
            return parseValue(field?.defaultValue);
          }
        }
      }
    }
    return null;
  };

  const parseValue = (value: any): any => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return value.trim();
      }
    }
    return value;
  };

  const validationSchema = Yup.object({
    providerName: Yup.string().required("Provider Name is required"),
    // providerCode: Yup.string().required("Provider Code is required"),
    address1: Yup.string().required("Address 1 is required"),
    address2: Yup.string(),
    city: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "City must contain only alphabetic characters")
      .required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string()
      .matches(/^\d{5}$/, "Zip Code must be exactly 5 digits")
      .required("Zip Code is required"),
  });

  const formik = useFormik({
    initialValues: {
      providerName: "",
      // providerCode: "",
      address1: "",
      city: "",
      zipCode: "",
      state: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const payload = {
        providerName: values.providerName || null,
        providerCode: null,
        address1: values.address1 || null,
        city: values.city || null,
        state: values.state || null,
        zipCode: values.zipCode || null,
        insuranceId: insuranceID,
        insuranceType: getInsuranceType(props?.Inputs)?.BillingType,
        facilityId: localStorage.getItem("facilityID"),
      };
      const facilityId = localStorage.getItem("facilityID");
      const billingType = getInsuranceType(props?.Inputs)?.BillingType;
      if (!facilityId) {
        toast.error("Select Facility");
        return;
      }
      if (!billingType) {
        toast.error("Select Billing Type");
        return;
      }
      try {
        await InsuranceService.addPatientInsuranceProvider(payload);
        setOpenModal(false);
        formik.resetForm();
        const response = await getOptions(insuranceID);
        addBillingInfo(props?.fieldIndex, response);
        setSelectedOptions(response[0]);
        setNewInsurance(true);
        setTimeout(() => setNewInsurance(false), 100);

        assignFormValues(
          Inputs,
          index,
          depControlIndex,
          fieldIndex,
          response[0].value,
          isDependency,
          repeatFieldSection,
          isDependencyRepeatFields,
          repeatFieldIndex,
          repeatDependencySectionIndex,
          repeatDepFieldIndex,
          response[0].label,
          props?.setInputs
        );
        props.fields.enableRule = "";
      } catch (err) {
        console.error("Error saving insurance provider", err);
      }
    },
  });

  const getOptions = async (id: any) => {
    try {
      const res = await InsuranceService.GetInsuranceProvidersDropdown(id);
      return res?.data;
    } catch (err) {
      console.error("Error fetching insurance providers", err);
    }
  };

  useEffect(() => {
    if (facilityID && insuranceID) {
      const response = getOptions(insuranceID);
      addBillingInfo(props?.fieldIndex, response);
    }
  }, [facilityID]);

  const handleCancel = () => {
    setOpenModal(false);
    formik.resetForm();
  };
  const setPrefilledValue = () => {
    if (Object.values(billings).length > 0 && billings[fieldIndex]) {
      const selected = (billings[fieldIndex] as any)?.find(
        (x: any) => x.value === parseInt(inputValue ?? "0")
      );
      if (selected && !newInsuranceAdded) {
        assignFormValues(
          Inputs,
          index,
          depControlIndex,
          fieldIndex,
          selected.value,
          isDependency,
          repeatFieldSection,
          isDependencyRepeatFields,
          repeatFieldIndex,
          repeatDependencySectionIndex,
          repeatDepFieldIndex,
          selected.label,
          props?.setInputs
        );
        setSelectedOptions(selected);
        valueSetRef.current = true; // Mark that value has been set
      } else {
        // Only clear if:
        // 1. No new insurance was added
        // 2. There's no valid inputValue (empty, null, "0", or undefined)
        // 3. AND we haven't successfully set a value yet (to prevent clearing a value that was just set)
        const isEmptyValue = !inputValue || inputValue === "0" || inputValue === "";
        if (!newInsuranceAdded && isEmptyValue && !valueSetRef.current) {
          setSelectedOptions([]);
          valueSetRef.current = false;
        }
      }
    }
    // If billings[fieldIndex] doesn't exist yet but we have a value set, don't clear it
    // This prevents clearing when billings is temporarily empty during updates
  };

  useEffect(() => {
    // Set a timeout to delay the function call by 2 seconds
    // Only run if we haven't set a value yet or if there's a valid inputValue to process
    const timer = setTimeout(() => {
      if (!valueSetRef.current || (inputValue && inputValue !== "0" && inputValue !== "")) {
        setPrefilledValue();
      }
    }, 2000); // 2000 ms = 2 seconds

    // Cleanup function to clear the timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, [localStorageData]);

  useEffect(() => {
    // Reset the ref when inputValue changes to a valid value, allowing re-setting
    if (inputValue && inputValue !== "0" && inputValue !== "") {
      valueSetRef.current = false;
    }
    setPrefilledValue();
  }, [billings, localStorageData, inputValue, fieldIndex]);
  const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
  useEffect(() => {
    // Scroll to the div if props.error is present
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    props.setErrorFocussedInput && props.setErrorFocussedInput();
  }, [props?.errorFocussedInput]);

  return (
    <>
      <div id={props?.name} tabIndex={-1}></div>
      <div
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mb-5`
            : "col-lg-6 col-md-6 col-sm-12 mb-5"
        }
        ref={divElement}
      >
        <label
          className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
        >
          {t(props?.label)}
        </label>
        <Select
          menuPortalTarget={document.body}
          options={billings[fieldIndex]}
          placeholder={t(props?.label)}
          inputId={props.name}
          theme={(theme) => styles(theme)}
          value={selectedOptions}
          onChange={(e: any) => {
            setSelectedOptions(e);
            
            // Handle clear button - when e is null, clear the field
            const value = e ? e.value : "";
            const label = e ? e.label : undefined;
            
            // Update the ref based on whether a value is being set or cleared
            valueSetRef.current = !!e;
            
            assignFormValues(
              Inputs,
              index,
              depControlIndex,
              fieldIndex,
              value,
              isDependency,
              repeatFieldSection,
              isDependencyRepeatFields,
              repeatFieldIndex,
              repeatDependencySectionIndex,
              repeatDepFieldIndex,
              label,
              props?.setInputs
            );
            props.fields.enableRule = "";
          }}
          isSearchable={props?.isSearchable}
          isClearable={isClearable}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: "var(--kt-input-border-color)",
              color: "var(--kt-input-border-color)",
            }),
          }}
        />
        {props.error && (
          <div className="form__error">
            <span>{t(props.error)}</span>
          </div>
        )}
      </div>
      <div
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mb-5 d-flex align-items-end`
            : "col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-5 d-flex align-items-end"
        }
      >
        <button
          onClick={() => setOpenModal(true)}
          className="btn btn-light-primary btn-sm px-4 p-2 py-3"
        >
          <span className="bi bi-plus "></span>{" "}
          {t("Add New Insurance Provider")}
        </button>
      </div>
      <Collapse in={openModal}>
        <div className="card">
          <div
            className="card-header px-0 flex justify-content-between align-items-center"
            id="kt_engage_demos_header"
          >
            <h3 className="card-title fw-bold">
              {t("Add Insurance Provider")}
            </h3>
            <div>
              <IconButton aria-label="delete" onClick={handleCancel}>
                <RxCross2 />
              </IconButton>
            </div>
          </div>
        </div>
        <form
          className="card-body px-0 pb-2 pt-4"
          onSubmit={formik.handleSubmit}
        >
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="fv-row mb-4">
                <label className="required mb-2">
                  {t("Insurance Provider Name")}
                </label>
                <input
                  type="text"
                  name="providerName"
                  className="form-control bg-transparent"
                  placeholder={t("Insurance Provider Name")}
                  onChange={formik.handleChange}
                  value={formik.values.providerName}
                />
                {formik.errors.providerName && (
                  <div className="form__error">
                    <span>{t(formik.errors.providerName)}</span>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="fv-row mb-4">
                <label className="required mb-2">
                  {t("Insurance Provider Code")}
                </label>
                <input
                  type="text"
                  name="providerCode"
                  className="form-control bg-transparent"
                  placeholder={t("Insurance Provider Code")}
                  onChange={formik.handleChange}
                  value={formik.values.providerCode}
                />
                {formik.errors.providerCode && (
                  <div className="form__error">
                    <span>{t(formik.errors.providerCode)}</span>
                  </div>
                )}
              </div>
            </div> */}
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="fv-row mb-4">
                <label className="required mb-2">{t("Address 1")}</label>
                <input
                  type="text"
                  name="address1"
                  className="form-control bg-transparent"
                  placeholder={t("Address 1")}
                  onChange={formik.handleChange}
                  value={formik.values.address1}
                />
                {formik.errors.address1 && (
                  <div className="form__error">
                    <span>{t(formik.errors.address1)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="fv-row mb-4">
                <label className="required mb-2">{t("City")}</label>
                <input
                  type="text"
                  name="city"
                  className="form-control bg-transparent"
                  placeholder={t("City")}
                  onChange={formik.handleChange}
                  value={formik.values.city}
                />
                {formik.errors.city && (
                  <div className="form__error">
                    <span>{t(formik.errors.city)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="fv-row mb-4">
                <label htmlFor="status" className="mb-2 required">
                  {t("State")}
                </label>
                <Select
                  menuPortalTarget={document.body}
                  options={stateDropdownArray}
                  placeholder={t("Select State")}
                  theme={(theme) => styles(theme)}
                  isSearchable={true}
                  onChange={(option) =>
                    formik.setFieldValue("state", option ? option.value : null)
                  }
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: "var(--kt-input-border-color)",
                      color: "var(--kt-input-border-color)",
                    }),
                  }}
                />
                {formik.errors.zipCode && (
                  <div className="form__error">
                    <span>
                      {t(formik.errors.state ? formik.errors.state : "")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="fv-row mb-4">
                <label className="required mb-2">{t("Zip Code")}</label>
                <input
                  type="text"
                  name="zipCode"
                  className="form-control bg-transparent"
                  placeholder={t("Zip Code")}
                  onChange={formik.handleChange}
                  value={formik.values.zipCode}
                />
                {formik.errors.zipCode && (
                  <div className="form__error">
                    <span>{t(formik.errors.zipCode)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex card-footer mt-3 py-3 px-0 align-items-center justify-content-start">
                <button
                  onClick={handleCancel}
                  type="button"
                  className="btn btn-secondary"
                >
                  {t("Cancel")}
                </button>
                <button type="submit" className="btn btn-primary m-2">
                  {t("Save")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </Collapse>
    </>
  );
};

export default ReactSelect;