import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { styles } from "../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";
import PatientServices from "../../../Services/PatientServices/PatientServices";
import moment from "moment";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { Fade, Tooltip } from "@mui/material";
import { usePatientSmartSearch } from "./usePatientSmartSearch";

const PaperCheckIn = () => {
  const { t } = useLang();
  
  const [loadingProvider, setLoadingProvider] = useState<any>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  
  const [dropdowns, setDropdown] = useState<any>({
    insurance: [],
    requisition: [],
    panel: [],
    physician: [],
    facility: [],
  });

  const initialState = {
    firstName: "",
    lastName: "",
    dob: "",
    dateofCollection: "",
    facility: { value: 0, label: "" },
    physician: { value: 0, label: "" },
    requisition: { value: 0, label: "" },
    insurance: { value: 0, label: "" },
    panel: { value: 0, label: "" },
    accessionNumber: "",
  };

  const [data, setData] = useState<any>(initialState);
  const today = new Date().toISOString().split("T")[0];

  const {
    patientSuggestions,
    showSuggestions,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    currentSearchField,
    suggestionRefs,
    searchPatients,
    handlePatientSelect,
    handleKeyDown,
    setCurrentSearchField,
  } = usePatientSmartSearch(
    data.facility.value,
    setLoadingProvider,
    PatientServices.getPatientDetailEitherByFirstNameOrLastname
  );

  const LoadData = () => {
    RequisitionType.GetRequisitionTypeLookup()
      .then((res: AxiosResponse) => {
        setDropdown((pre: any) => ({
          ...pre,
          requisition: res.data,
        }));
      })
      .catch(() => console.log("error"));

    RequisitionType.GetFacilityLookupForPaperCheckIn()
      .then((res: AxiosResponse) => {
        setDropdown((pre: any) => ({
          ...pre,
          facility: res.data,
        }));
      })
      .catch(() => console.log("error"));

    RequisitionType.GetInsuranceLookup()
      .then((res: AxiosResponse) => {
        setDropdown((pre: any) => ({
          ...pre,
          insurance: res.data,
        }));
      })
      .catch(() => console.log("error"));
  };

  const handleChangeInput = (e: any, name: string) => {
    setData((prev: any) => ({
      ...prev,
      [name]: e,
    }));
    if (name === "facility") {
      RequisitionType.GetPhysicianPaperCheckIn(e.value)
        .then((res: AxiosResponse) => {
          setDropdown((pre: any) => ({
            ...pre,
            physician: res.data,
          }));
        })
        .catch(() => console.log("error"));
    }
  };

  const panelLookup = () => {
    const obj = {
      facilityId: data.facility.value,
      reqTypeId: data.requisition.value,
      insuranceId: data.insurance.value,
    };
    RequisitionType.GetPanelTypeLookup(obj)
      .then((res: AxiosResponse) => {
        setDropdown((pre: any) => ({
          ...pre,
          panel: res.data,
        }));
      })
      .catch(() => console.log("error"));
  };

  useEffect(() => {
    if (data.facility.value && data.requisition.value && data.insurance.value) {
      setData((prevData: any) => ({
        ...prevData,
        panel: { value: 0, label: "" },
      }));
      panelLookup();
    }
  }, [data.facility.value, data.requisition.value, data.insurance.value]);

  const handleChangeIput = (e: any, name: string) => {
    if (name === "dateofCollection") {
      const selectedDate = e.target.value;
      if (selectedDate > today) {
        toast.error(t("Date of Collection cannot be in the future"));
        return;
      }
    }
    if (name === "dob") {
      const selectedDate = e.target.value;
      if (selectedDate > today) {
        toast.error(t("Date of Birth cannot be in the future"));
        return;
      }
    }
    if (name === "accessionNumber") {
      const value = e.target.value;
      // Allow only alphanumeric characters
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        toast.error(t("Accession Number cannot contain special characters"));
        return;
      }
    }

    const value = e.target.value;
    setData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    if ((name === "firstName" || name === "lastName") && data.facility.value) {
      setCurrentSearchField(name as "firstName" | "lastName");
      return searchPatients(value, name as "firstName" | "lastName");
    }
  };

  const handleSave = async () => {
    setDisableButton(true);
    const params = {
      facilityId: data.facility.value,
      physicianId: data.physician.value,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      reqTypeId: data.requisition.value,
      insuranceId: data.insurance.value,
      insuranceName: data.insurance.label,
      dateofCollection: data.dateofCollection,
      panelId: data.panel.value,
      panelName: data.panel.label,
      accessionNumber: data.accessionNumber,
    };

    if (
      params.facilityId &&
      params.physicianId &&
      params.firstName &&
      params.lastName &&
      params.dob &&
      params.reqTypeId &&
      params.insuranceId &&
      params.dateofCollection &&
      params.panelId
    ) {
      try {
        // Check for accession number duplication before saving
        if (params.accessionNumber) {
          const response = await RequisitionType.checkSpecimenDuplicationForReq(
            params.accessionNumber
          );
          console.log("Duplication Check Response:", response);
          if (response?.data?.httpStatusCode === 409) {
            toast.error(
              t(response?.data?.message || "Accession number already exists")
            );
            return;
          }
        }
        setDisableButton(true);

        const saveResponse =
          await RequisitionType.saveRequsitionPageCheckIn(params);
        if (saveResponse?.status === 200) {
          toast.success(t(saveResponse?.data?.message));
          setData(initialState);
          setDisableButton(false);
          setDropdown((prev: any) => ({
            ...prev,
            panel: [],
          }));
        }
      } catch (err: any) {
        toast.error(t("Something went wrong..."));
        console.trace(err);
        setDisableButton(false);
      }
    } else {
      toast.error(t("Please Enter The Required Fields"));
      setDisableButton(false);
    }
  };

  useEffect(() => {
    LoadData();
  }, []);

  const handleClickInput = async () => {
    const obj = {
      fid: data.facility.value,
      rid: data.requisition.value,
    };
    if (!obj.fid || !obj.rid) {
      toast.error(t("Please select Facility and Requisition Type"));
      return;
    }
    try {
      const response = await RequisitionType.GenerateAssecission(obj);
      if (response && response.data) {
        const generatedValue = response.data;
        setData((prev: any) => ({
          ...prev,
          accessionNumber: generatedValue,
        }));
      }
    } catch (error) {
      console.error("Error generating specimen ID:", error);
    }
  };

  useEffect(() => {
    if (data.accessionNumber) {
      const debounceTimeout = setTimeout(async () => {
        try {
          const response = await RequisitionType.checkSpecimenDuplicationForReq(
            data.accessionNumber
          );
          if (response?.data?.httpStatusCode === 409) {
            toast.error(
              t(response?.data?.message || "Accession number already exists")
            );
          }
        } catch (err) {
          console.error("Error checking accession number:", err);
        }
      }, 300);

      return () => clearTimeout(debounceTimeout);
    }
  }, [data.accessionNumber]);

  return (
    <>
      <div className="col-xxl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card mb-3">
          <div className="card-body py-md-3 py-2">
            <div className="row" id="BulkCheckInPaperCheckIn">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_facility"
                >
                  {t("Facility Name")}
                </label>
                <Select
                  inputId="BulkCheckInPaperCheckIn_facility"
                  menuPortalTarget={document.body}
                  options={dropdowns.facility}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Facility Name")}
                  name="facility"
                  value={dropdowns?.facility?.filter(
                    (item: any) => item?.value === data?.facility?.value
                  )}
                  onChange={(event: any) => {
                    handleChangeInput(event, "facility");
                  }}
                />
              </div>

              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_physician"
                >
                  {t("Physician")}
                </label>
                <Select
                  inputId="BulkCheckInPaperCheckIn_physician"
                  menuPortalTarget={document.body}
                  options={dropdowns.physician}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Physician")}
                  name="physician"
                  value={dropdowns.physician.filter(
                    (item: any) => item.value === data.physician.value
                  )}
                  onChange={(event: any) => {
                    handleChangeInput(event, "physician");
                  }}
                />
              </div>

              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 position-relative patient-search-container">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_firstName"
                >
                  {t("First Name")}
                </label>
                <input
                  id="BulkCheckInPaperCheckIn_firstName"
                  type="text"
                  name="firstName"
                  className="form-control bg-transparent w-100"
                  placeholder={t("First Name")}
                  value={data.firstName}
                  onChange={(event) => {
                    handleChangeIput(event, "firstName");
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "firstName", setData)}
                  autoComplete="off"
                />
                {loadingProvider && currentSearchField === "firstName" && (
                  <div
                    className="position-absolute px-2"
                    style={{ right: "10px", top: "35px" }}
                  >
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {showSuggestions &&
                  patientSuggestions.length > 0 &&
                  currentSearchField === "firstName" && (
                    <div
                      className="position-absolute w-100 bg-white border rounded shadow-lg mt-1"
                      style={{
                        zIndex: 1050,
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {patientSuggestions.map((patient, index) => (
                        <div
                          key={index}
                          ref={(el) => (suggestionRefs.current[index] = el)}
                          className={`px-3 py-2 cursor-pointer border-bottom ${
                            index === activeSuggestionIndex
                              ? "bg-primary text-white"
                              : "hover:bg-light"
                          }`}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              index === activeSuggestionIndex
                                ? "#0d6efd"
                                : "transparent",
                            color:
                              index === activeSuggestionIndex
                                ? "white"
                                : "inherit",
                          }}
                          onClick={() =>
                            handlePatientSelect(patient, "firstName", setData)
                          }
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                        >
                          <div className="fw-bold">
                            {patient.FirstName} {patient.LastName}
                          </div>
                          <small
                            className={
                              index === activeSuggestionIndex
                                ? "text-light"
                                : "text-muted"
                            }
                          >
                            DOB:{" "}
                            {patient.DOB
                              ? moment(patient.DOB).format("MM/DD/YYYY")
                              : "N/A"}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 position-relative patient-search-container">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_lastName"
                >
                  {t("Last Name")}
                </label>
                <input
                  id="BulkCheckInPaperCheckIn_lastName"
                  type="text"
                  name="lastName"
                  className="form-control bg-transparent"
                  placeholder={t("Last Name")}
                  value={data.lastName}
                  onChange={(event) => {
                    handleChangeIput(event, "lastName");
                  }}
                  onKeyDown={(e) => handleKeyDown(e, "lastName", setData)}
                  autoComplete="off"
                />
                {loadingProvider && currentSearchField === "lastName" && (
                  <div
                    className="position-absolute px-2"
                    style={{ right: "10px", top: "35px" }}
                  >
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {showSuggestions &&
                  patientSuggestions.length > 0 &&
                  currentSearchField === "lastName" && (
                    <div
                      className="position-absolute w-100 bg-white border rounded shadow-lg mt-1"
                      style={{
                        zIndex: 1050,
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {patientSuggestions.map((patient, index) => (
                        <div
                          key={index}
                          ref={(el) => (suggestionRefs.current[index] = el)}
                          className={`px-3 py-2 cursor-pointer border-bottom ${
                            index === activeSuggestionIndex
                              ? "bg-primary text-white"
                              : "hover:bg-light"
                          }`}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              index === activeSuggestionIndex
                                ? "#0d6efd"
                                : "transparent",
                            color:
                              index === activeSuggestionIndex
                                ? "white"
                                : "inherit",
                          }}
                          onClick={() =>
                            handlePatientSelect(patient, "lastName", setData)
                          }
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                        >
                          <div className="fw-bold">
                            {patient.FirstName} {patient.LastName}
                          </div>
                          <small
                            className={
                              index === activeSuggestionIndex
                                ? "text-light"
                                : "text-muted"
                            }
                          >
                            DOB:{" "}
                            {patient.DOB
                              ? moment(patient.DOB).format("MM/DD/YYYY")
                              : "N/A"}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <div className="mt-2 col-xxl-3 col-lg-3 col-md-6 col-sm-12">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_dob"
                >
                  {t("Date of Birth")}
                </label>
                <input
                  id="BulkCheckInPaperCheckIn_dob"
                  type="date"
                  name="dob"
                  className="form-control bg-transparent"
                  value={data.dob ? moment(data.dob).format("YYYY-MM-DD") : ""}
                  onChange={(event) => handleChangeIput(event, "dob")}
                />
              </div>

              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mt-2">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_requisition"
                >
                  {t("Test Type (Requisition)")}
                </label>
                <Select
                  inputId="BulkCheckInPaperCheckIn_requisition"
                  menuPortalTarget={document.body}
                  options={dropdowns.requisition}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Test Type")}
                  name="requisition"
                  value={dropdowns.requisition.filter(
                    (item: any) => item.value === data.requisition.value
                  )}
                  onChange={(event: any) => {
                    handleChangeInput(event, "requisition");
                  }}
                />
              </div>

              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mt-2">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_insurance"
                >
                  {t("Insurance Types")}
                </label>
                <Select
                  inputId="BulkCheckInPaperCheckIn_insurance"
                  menuPortalTarget={document.body}
                  options={dropdowns.insurance}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Insurance Type")}
                  name="insurance"
                  value={dropdowns.insurance.filter(
                    (item: any) => item?.value == data?.insurance.value
                  )}
                  onChange={(event: any) => {
                    handleChangeInput(event, "insurance");
                  }}
                />
              </div>

              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mt-2">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_dateofCollection"
                >
                  {t("Date of Collection")}
                </label>
                <input
                  id="BulkCheckInPaperCheckIn_dateofCollection"
                  type="date"
                  name="dateofCollection"
                  className="form-control bg-transparent"
                  value={data.dateofCollection}
                  max={today}
                  onChange={(event) =>
                    handleChangeIput(event, "dateofCollection")
                  }
                />
              </div>

              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mt-2">
                <label
                  className="required mb-2 fw-600"
                  htmlFor="BulkCheckIn_panel"
                >
                  {t("Select Panel")}
                </label>
                <Select
                  inputId="BulkCheckInPaperCheckIn_panel"
                  menuPortalTarget={document.body}
                  options={dropdowns.panel}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Panel Type")}
                  name="panel"
                  value={dropdowns.panel.filter(
                    (item: any) => item.value === data.panel.value
                  )}
                  onChange={(event: any) => {
                    handleChangeInput(event, "panel");
                  }}
                />
              </div>

              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mt-2">
                <label
                  className="mb-2 fw-600"
                  htmlFor="BulkCheckIn_accessionNumber"
                >
                  {t("Accession Number")}
                </label>
                <div className="d-flex gap-2">
                  <input
                    placeholder={t("Accession Number")}
                    type="text"
                    name="accessionNumber"
                    className="form-control bg-transparent"
                    value={data.accessionNumber}
                    onChange={(e) => handleChangeIput(e, "accessionNumber")}
                  />
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    title={t("Generate Accession")}
                    onClick={handleClickInput}
                  >
                    <button
                      className="btn btn-sm btn-primary w-40px p-1 btn-icon"
                      style={{ height: "38px" }}
                      id={"generateSpecimenId"}
                    >
                      <i className="bi bi-arrow-repeat fs-1"></i>
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-end gap-1 gap-lg-1">
              <PermissionComponent
                moduleName="Requisition"
                pageName="Bulk CheckIn"
                permissionIdentifier="Save"
              >
                <button
                  id="BulkCheckInPaperCheckInSave"
                  className="btn btn-primary btn-sm btn-primary--icon px-7 fw-bold"
                  onClick={handleSave}
                  disabled={disableButton}
                >
                  {t("Save Order")}
                </button>
              </PermissionComponent>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaperCheckIn;
