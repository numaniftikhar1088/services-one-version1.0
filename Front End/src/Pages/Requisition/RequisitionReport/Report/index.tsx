import React, { useEffect, useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import { getFacilitiesLookup } from "../../../../Services/Marketing/BulletinBoardService";
import { SAlesRepLookupApi } from "../../../../Services/Marketing/TrainingAids";
import {
  RequisitionReportSave,
  ScheduledReportDownload,
} from "../../../../Services/Requisition/RequisitionReports/RequisitionReport";
import DateAndTimeDuplicate from "../../../../Shared/Common/DatePicker/DateAndTime";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import useLang from "./../../../../Shared/hooks/useLanguage";
import ByFacility from "./ByFacility";
import BySaleRep from "./BySaleRep";
import CheckBox from "./CheckBox";
import MonthlyPositively from "./MonthlyPositively";

interface Lookups {
  value: number;
  label: string;
}

interface radioVal {
  label: string;
  value: number;
}

const ReqReport = () => {
  const { t } = useLang();
  const radioValues: radioVal[] = [
    {
      label: t("All Data"),
      value: 0,
    },
    {
      label: t("By Facility"),
      value: 1,
    },
    {
      label: t("By Sales Rep"),
      value: 2,
    },
    {
      label: t("Positive Accession Report"),
      value: 3,
    },
  ];

  const [showFacility, setShowFacility] = useState(false);
  const [showSaleRep, setShowSaleRep] = useState(false);
  const [monthlyPositively, setMonthlyPositively] = useState(false);
  const [parentChecked, setParentChecked] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  /*#####################-----Facility states Start-----###################*/

  const [facilityLookup, setFacilityLookup] = useState<Lookups[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<Lookups[]>([]);
  const [selectedFacilitiesSearchTerm, setSelectedFacilitiesSearchTerm] =
    useState("");
  const [allFacilitiesSearchTerm, setAllFacilitiesSearchTerm] = useState("");

  /*#####################-----Facility states End-----###################*/
  /*#####################-----Salerep states Start-----###################*/
  const [salesReplookup, setSalesReplookup] = useState<Lookups[]>([]);
  const [selectedSalesRep, setSelectedSalesRep] = useState<Lookups[]>([]);
  const [allRepsSearchTerm, setAllRepsSearchTerm] = useState("");
  const [selectedRepsSearchTerm, setSelectedSalesRepsSearchTerm] = useState("");
  /*#####################-----Salerep states End-----###################*/

  // ###  Date state
  const [filterData, setFilterData] = useState<any>({});
  const [scheduleDate, setScheduleDate] = useState<string>("");

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // e.g., "2025-08-19T15:30"

    // Optional: validate format before processing
    if (!value.includes("T")) {
      setScheduleDate(""); // or handle error
      return;
    }

    const [datePart, timePart] = value.split("T");
    const localISOString = `${datePart}T${timePart}:00.000`; // basic ISO-like string

    setScheduleDate(localISOString);
  };

  // ## CheckBox  State
  const [childChecked, setChildChecked] = useState(Array(41).fill(false));

  const initialPostData = {
    id: 0,
    fileName: "",
    frequencyLabel: "",
    selectLabel: "",
  };
  const [postData, setpostData] = useState<any>(initialPostData);

  /*#####################-----Facility function Start-----###################*/
  useEffect(() => {
    const fetchFacilities = async () => {
      const facilities = await getFacilitiesLookup();
      setFacilityLookup(facilities.data);
    };
    fetchFacilities();
  }, [selectedValue]);

  const handleFacilityClick = (facility: Lookups) => {
    setSelectedFacilities((prevSelectedFacilities) => {
      if (
        prevSelectedFacilities.some(
          (selected) => selected.value === facility.value
        )
      ) {
        return prevSelectedFacilities;
      } else {
        return [...prevSelectedFacilities, facility];
      }
    });

    setFacilityLookup((prevFacilityLookup) =>
      prevFacilityLookup.filter((f) => f.value !== facility.value)
    );
  };

  const removeSelectedFacilities = (facility: Lookups) => {
    setSelectedFacilities((prevSelectedFacilities) =>
      prevSelectedFacilities.filter((f) => f.value !== facility.value)
    );
    setFacilityLookup((prevFacilityLookup) => [
      ...prevFacilityLookup,
      facility,
    ]);
  };
  const filteredSelectedFacilities = selectedFacilities.filter((facility) =>
    facility?.label
      ?.toLowerCase()
      .includes(selectedFacilitiesSearchTerm.toLowerCase())
  );

  const removeDuplicates = (arr: Lookups[]): Lookups[] => {
    const uniqueValues = new Set<number>();
    return arr.filter((item) => {
      if (uniqueValues.has(item.value)) {
        return false;
      } else {
        uniqueValues.add(item.value);
        return true;
      }
    });
  };
  const uniqueLookup = removeDuplicates(facilityLookup);
  const lookupForEdit = uniqueLookup.filter(
    (lookupItem: Lookups) =>
      !selectedFacilities.some(
        (selectedItem: Lookups) => selectedItem.value === lookupItem.value
      )
  );
  const filteredAllFacilities = lookupForEdit.filter((facility) =>
    facility.label.toLowerCase().includes(allFacilitiesSearchTerm.toLowerCase())
  );
  const moveAllToSelectedFacilities = () => {
    setSelectedFacilities((prevSelectedFacilities) => [
      ...prevSelectedFacilities,
      ...facilityLookup,
    ]);
    setFacilityLookup([]);
  };

  const moveAllToFacilityLookup = () => {
    setFacilityLookup((prevFacilityLookup) => [
      ...prevFacilityLookup,
      ...selectedFacilities,
    ]);
    setSelectedFacilities([]);
  };

  const moveAllToSelectedSaleRep = () => {
    setSelectedSalesRep((prevSelectedSalesRep) => [
      ...prevSelectedSalesRep,
      ...salesReplookup,
    ]);
    setSalesReplookup([]);
  };

  const moveAllToDaleRepLookup = () => {
    setSalesReplookup((prevSalesReplookup) => [
      ...prevSalesReplookup,
      ...selectedSalesRep,
    ]);
    setSelectedSalesRep([]);
  };

  /*#####################-----Facility function End-----###################*/

  /*###################  SalesRep lookup & selectedSalesRep function Start ######################### */

  useEffect(() => {
    const fetchSalesRep = async () => {
      const salesRep: any = await SAlesRepLookupApi();
      setSalesReplookup(salesRep.data);
    };
    fetchSalesRep();
  }, [selectedValue]);

  const handleRepClick = (rep: Lookups) => {
    setSelectedSalesRep((prevSelectedSalesRep) => {
      if (
        prevSelectedSalesRep.some((selected) => selected.value === rep.value)
      ) {
        return prevSelectedSalesRep;
      } else {
        return [...prevSelectedSalesRep, rep];
      }
    });

    setSalesReplookup((prevSalesReplookup) =>
      prevSalesReplookup.filter((r) => r.value !== rep.value)
    );
  };

  const removeSelectedRep = (rep: Lookups) => {
    setSelectedSalesRep((prevSelectedSalesRep) =>
      prevSelectedSalesRep.filter((r) => r.value !== rep.value)
    );
    setSalesReplookup((prevSalesReplookup) => [...prevSalesReplookup, rep]);
  };
  const filteredSelectedReps = selectedSalesRep.filter((rep) =>
    rep?.label?.toLowerCase().includes(selectedRepsSearchTerm.toLowerCase())
  );

  const saleRepremoveDuplicates = (arr: Lookups[]): Lookups[] => {
    const uniqueValues = new Set<number>();
    return arr.filter((item) => {
      if (uniqueValues.has(item.value)) {
        return false;
      } else {
        uniqueValues.add(item.value);
        return true;
      }
    });
  };
  //##########  Remove duplicates from the lookup array ############
  const saleRepuniqueLookup = saleRepremoveDuplicates(salesReplookup);

  const saleReplookupForEdit = saleRepuniqueLookup.filter(
    (lookupItem: Lookups) =>
      !selectedSalesRep.some(
        (selectedItem: Lookups) => selectedItem.value === lookupItem.value
      )
  );

  const filteredAllReps = saleReplookupForEdit.filter((facility) =>
    facility.label.toLowerCase().includes(allRepsSearchTerm.toLowerCase())
  );
  /*###################  SalesRep lookup & selectedSalesRep function End ######################### */

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setParentChecked(checked);
    setChildChecked(childChecked.map(() => checked));
  };
  const selectlookup = [
    { value: 5, label: t("date of collection") },
    { value: 10, label: t("received date") },
    { value: 15, label: t("validated date") },
    { value: 20, label: t("rejected date") },
  ];
  const frequencylookup = [
    { value: 1, label: t("Daily") },
    { value: 2, label: t("Weekly") },
    { value: 3, label: t("Monthly") },
  ];

  const handleChildChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      const updatedChildChecked = [...childChecked];
      updatedChildChecked[index] = checked;
      setChildChecked(updatedChildChecked);
      setParentChecked(updatedChildChecked.every(Boolean));
    };
  const [openalert, setOpenAlert] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = () => {
    if (selectedValue === null) {
      toast.error(t("Select at least one option."));
      return;
    }

    if (selectedValue === 0 && childChecked.every((val) => !val)) {
      toast.error(t("Select at least one checkbox."));
      return;
    }
    if (
      selectedValue === 1 &&
      (!selectedFacilities || selectedFacilities.length === 0)
    ) {
      toast.error(t("Select at least one Facility."));
      return;
    }
    if (selectedValue === 1 && childChecked.every((val) => !val)) {
      toast.error(t("Select at least one checkbox."));
      return;
    }
    if (selectedValue === 2) {
      if (!selectedSalesRep || selectedSalesRep.length === 0) {
        toast.error(t("Select at least one Sales Rep."));
        return;
      }
    }
    if (selectedValue === 2 && childChecked.every((val) => !val)) {
      toast.error(t("Select at least one checkbox."));
      return;
    }
    if (!postData.selectLabel?.trim()) {
      toast.error(t("Please select any data field."));
      return;
    }
    setOpenAlert(true);
  };

  const handleChangeCategory = (e: any) => {
    setpostData((prevData: any) => ({
      ...prevData,
      selectLabel: e.label,
    }));
  };
  const handleChangeFrequency = (e: any) => {
    setpostData((prevData: any) => ({
      ...prevData,
      frequencyLabel: e.label,
    }));
  };

  const APISENDFacility = selectedFacilities.map((value: any) => value.value);
  const APISENDSaleRep = selectedSalesRep.map((value: any) => value.value);
  /*#####################-----Scheduled Report API Start-----###################*/

  const PostApiData = async () => {
    const data = {
      id: postData.id,
      reportName: postData.fileName,
      frequency: postData.frequencyLabel,
      scheduledDate: scheduleDate,
      facilityIds: APISENDFacility || null,
      salesRepIds: APISENDSaleRep || null,
      reportDataArray: {
        patientFirstName: childChecked?.[0],
        patientLastName: childChecked?.[1],
        patientDateOfBirth: childChecked?.[2],
        patientID: childChecked?.[3],
        patientGender: childChecked?.[4],
        patientAddress: childChecked?.[5],
        patientCity: childChecked?.[6],
        patientState: childChecked?.[7],
        patientZipCode: childChecked?.[8],
        patientEmail: childChecked?.[9],
        requisitionType: childChecked?.[10],
        dateOfCollection: childChecked?.[11],
        timeOfCollection: childChecked?.[12],
        recievedDate: childChecked?.[13],
        validatedDate: childChecked?.[14],
        rejectedDate: childChecked?.[15],
        rejectedReason: childChecked?.[16],
        status: childChecked?.[17],
        accessionNo: childChecked?.[18],
        insuranceType: childChecked?.[19],
        labCode: childChecked?.[20],
        referenceLab: childChecked?.[21],
        pharmD: childChecked?.[22],
        panelName: childChecked?.[23],
        primaryInsuranceProvider: false,
        providerName: childChecked?.[25],
        groupID: childChecked?.[26],
        relationshipToInsure: childChecked?.[27],
        policyID: childChecked?.[28],
        policyHolderDOB: childChecked?.[29],
        facilityName: childChecked?.[30],
        facilityAddress: childChecked?.[31],
        facilityCity: childChecked?.[32],
        facilityState: childChecked?.[33],
        facilityZipCode: childChecked?.[34],
        facilityID: childChecked?.[35],
        physicianName: childChecked?.[36],
        npi: childChecked?.[37],
        saleRepName: childChecked?.[38],
        resultDelivery: childChecked?.[39],
        SaleGroupName: childChecked?.[40],
      },
      reportType: postData.selectLabel,
      reportBy: selectedValue,
      isDeleted: false,
    };

    try {
      // API call to save data
      const resp = await RequisitionReportSave(data);
      return resp; // return the response
    } catch (error) {
      throw new Error("Error while saving data");
    }
  };

  const handleSave = async () => {
    setButtonDisable(true);
    if (!postData.fileName?.trim()) {
      toast.error(t("Please Select File Name."));
      return;
    }

    if (!postData.frequencyLabel?.trim()) {
      toast.error(t("Please Select Frequency."));
      return;
    }
    if (!scheduleDate || !scheduleDate.trim()) {
      toast.error(t("Please select Schedule Date and Time."));
      return;
    }
    try {
      const resp = await PostApiData();
      if (resp.data.statusCode === 200) {
        toast.success("Request Processed Successfully...");
        resetState();
        setButtonDisable(false);
      } else if (resp.data.statusCode === 400) {
        toast.error(
          resp.data.message || t("An error occurred. Please try again.")
        );
      } else {
        toast.error(t("An unexpected error occurred."));
      }
    } catch (error) {
      toast.error(t("An error occurred while saving data."));
    }
  };

  const resetState = () => {
    setSelectedValue(null);
    setFilterData({});
    setOpenAlert(false);
    setShowSaleRep(false);
    setShowFacility(false);
    setParentChecked(false);
    setMonthlyPositively(false);
    setpostData(initialPostData);
    setChildChecked(Array(41).fill(false));
  };

  const handleCancle = () => {
    setOpenAlert(false);
    setpostData(initialPostData);
    setScheduleDate("");
  };

  /*#####################-----Scheduled Report Download API Start-----###################*/

  const handleDownload = async () => {
    const validateDownload = () => {
      if (selectedValue === null) return t("Select at least one option.");

      if (selectedValue === 0 && childChecked.every((val) => !val))
        return t("Select at least one checkbox.");
      if (
        selectedValue === 1 &&
        (!selectedFacilities || selectedFacilities.length === 0)
      )
        return t("Select at least one Facility.");
      if (selectedValue === 1 && childChecked.every((val) => !val))
        return t("Select at least one checkbox.");
      if (
        selectedValue === 2 &&
        (!selectedSalesRep || selectedSalesRep.length === 0)
      )
        return t("Select at least one Sales Rep.");
      if (selectedValue === 2 && childChecked.every((val) => !val))
        return t("Select at least one checkbox.");
      if (Object.keys(filterData).length === 0) {
        return t("Please Enter Date.");
      }
      if (!postData.selectLabel?.trim())
        return t("Please select any data field.");
      return null;
    };
    const errorMessage = validateDownload();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      const obj = {
        reportBy: selectedValue,
        facilityIds: APISENDFacility || null,
        salesRepIds: APISENDSaleRep || null,
        reportData: {
          patientFirstName: childChecked?.[0],
          patientLastName: childChecked?.[1],
          patientDateOfBirth: childChecked?.[2],
          patientID: childChecked?.[3],
          patientGender: childChecked?.[4],
          patientAddress: childChecked?.[5],
          patientCity: childChecked?.[6],
          patientState: childChecked?.[7],
          patientZipCode: childChecked?.[8],
          patientEmail: childChecked?.[9],
          requisitionType: childChecked?.[10],
          dateOfCollection: childChecked?.[11],
          timeOfCollection: childChecked?.[12],
          recievedDate: childChecked?.[13],
          validatedDate: childChecked?.[14],
          rejectedDate: childChecked?.[15],
          rejectedReason: childChecked?.[16],
          status: childChecked?.[17],
          accessionNo: childChecked?.[18],
          insuranceType: childChecked?.[19],
          labCode: childChecked?.[20],
          referenceLab: childChecked?.[21],
          pharmD: childChecked?.[22],
          panelName: childChecked?.[23],
          primaryInsuranceProvider: false,
          providerName: childChecked?.[25],
          groupID: childChecked?.[26],
          relationshipToInsure: childChecked?.[27],
          policyID: childChecked?.[28],
          policyHolderDOB: childChecked?.[29],
          facilityName: childChecked?.[30],
          facilityAddress: childChecked?.[31],
          facilityCity: childChecked?.[32],
          facilityState: childChecked?.[33],
          facilityZipCode: childChecked?.[34],
          facilityID: childChecked?.[35],
          physicianName: childChecked?.[36],
          npi: childChecked?.[37],
          saleRepName: childChecked?.[38],
          resultDelivery: childChecked?.[39],
          SaleGroupName: childChecked?.[40],
        },
        dateFrom: filterData.dateFrom,
        dateTo: filterData.dateTo,
        reportType: postData.selectLabel,
      };
      const res = await ScheduledReportDownload(obj);
      if (res.data.statusCode === 200) {
        toast.success(res.data.message || t("Report downloaded successfully!"));
        const fileContent = res.data.data.fileContents;
        const downloadLink = document.createElement("a");
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileContent}`;
        downloadLink.download = res.data.data.fileDownloadName;
        downloadLink.click();
        resetDownloadState();
      } else if (res.data.statusCode === 400) {
        toast.error(
          res.data.message ||
            t("An error occurred while downloading the report.")
        );
      } else {
        toast.error(t("An unexpected error occurred."));
      }
    } catch (error) {
      toast.error(t("An error occurred while downloading the report."));
    }
  };

  const resetDownloadState = () => {
    setSelectedValue(null);
    setFilterData({});
    setShowSaleRep(false);
    setShowFacility(false);
    setParentChecked(false);
    setSelectedSalesRep([]);
    setSelectedFacilities([]);
    setMonthlyPositively(false);
    setpostData(initialPostData);
    setChildChecked(Array(41).fill(false));
  };

  const handleRadioChange = (value: number) => {
    setSelectedValue(value);

    switch (value) {
      case 0:
        setShowSaleRep(false);
        setShowFacility(false);
        setSelectedSalesRep([]);
        setSelectedFacilities([]);
        setMonthlyPositively(false);
        break;
      case 1:
        setShowSaleRep(false);
        setShowFacility(true);
        setSelectedSalesRep([]);
        setMonthlyPositively(false);
        break;
      case 2:
        setShowSaleRep(true);
        setShowFacility(false);
        setSelectedFacilities([]);
        setMonthlyPositively(false);
        break;
      case 3:
        setShowSaleRep(false);
        setShowFacility(false);
        setSelectedSalesRep([]);
        setSelectedFacilities([]);
        setMonthlyPositively(true);
        setChildChecked(Array(41).fill(false));
        break;
      default:
        setShowSaleRep(false);
        setShowFacility(false);
        setSelectedSalesRep([]);
        setSelectedFacilities([]);
        setMonthlyPositively(false);
        break;
    }
  };

  return (
    <>
      <div className="card">
        <div className="row card-header px-0">
          <div className="card-heading ">
            <h6 className="required">{t("Select Report")}</h6>
          </div>
          <div className="row">
            <div className="col-sm-8 pt-2">
              <div className="row d-flex justify-content-between">
                {radioValues.map((radVal, index) => {
                  const uniqueId = `radio-${radVal.value}-${index}`;
                  return (
                    <div key={radVal.value} className="col-xs-3 mb-2">
                      <label
                        className="form-check form-check-sm form-check-solid w-fit-content"
                        style={{ width: "fit-content" }}
                        htmlFor={uniqueId}
                      >
                        <input
                          id={uniqueId}
                          className="form-check-input h-20px w-20px rounded-4"
                          type="radio"
                          value={radVal.value}
                          name="resultType"
                          checked={selectedValue === radVal.value}
                          onChange={() => handleRadioChange(radVal.value)}
                        />
                        {radVal.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {showFacility ? (
          <ByFacility
            handleFacilityClick={handleFacilityClick}
            filteredAllFacilities={filteredAllFacilities}
            allFacilitiesSearchTerm={allFacilitiesSearchTerm}
            moveAllToFacilityLookup={moveAllToFacilityLookup}
            removeSelectedFacilities={removeSelectedFacilities}
            filteredSelectedFacilities={filteredSelectedFacilities}
            setAllFacilitiesSearchTerm={setAllFacilitiesSearchTerm}
            moveAllToSelectedFacilities={moveAllToSelectedFacilities}
            selectedFacilitiesSearchTerm={selectedFacilitiesSearchTerm}
            setSelectedFacilitiesSearchTerm={setSelectedFacilitiesSearchTerm}
          />
        ) : null}
        {showSaleRep ? (
          <BySaleRep
            handleRepClick={handleRepClick}
            filteredAllReps={filteredAllReps}
            allRepsSearchTerm={allRepsSearchTerm}
            removeSelectedRep={removeSelectedRep}
            filteredSelectedReps={filteredSelectedReps}
            setAllRepsSearchTerm={setAllRepsSearchTerm}
            selectedRepsSearchTerm={selectedRepsSearchTerm}
            moveAllToFacilityLookup={moveAllToDaleRepLookup}
            moveAllToSelectedFacilities={moveAllToSelectedSaleRep}
            setSelectedSalesRepsSearchTerm={setSelectedSalesRepsSearchTerm}
          />
        ) : null}
        {monthlyPositively ? (
          <MonthlyPositively />
        ) : (
          <>
            <div className="row card-body px-0 py-3">
              <div className="card-heading">
                <h6>{t("Select Data")}</h6>
                <label className="form-check form-check-sm form-check-solid  ">
                  <input
                    id="CheckAllCheckBox"
                    name="urgent"
                    className="form-check-input h-20px w-20px"
                    type="checkbox"
                    checked={parentChecked}
                    onChange={handleParentChange}
                  />
                  {t("Check All")}
                </label>
              </div>
            </div>
            <CheckBox
              childChecked={childChecked}
              handleChildChange={handleChildChange}
            />
          </>
        )}
      </div>

      <div className="card-footer px-0 pt-2 pb-0">
        <div className="card-heading">
          <h6>{t("Filter")}</h6>
        </div>

        <div className="d-flex flex-wrap justify-content-start align-items-center mb-2 gap-2">
          <div className="d-flex align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <span className="fw-400 mr-3">{t("Date")}</span>
              <DateAndTimeDuplicate
                setFilterData={setFilterData}
                filterData={filterData}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <Select
                inputId="RequisitionReportCategory"
                menuPortalTarget={document.body}
                styles={reactSelectSMStyle}
                theme={(theme: any) => styles(theme)}
                options={selectlookup}
                placeholder={t("Select...")}
                name="selectLabel"
                onChange={handleChangeCategory}
                value={
                  selectlookup.find(
                    (option) => option.label === postData.selectLabel
                  ) || null
                }
              />
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              id="RequisitionReportDownloadReports"
              className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light"
              onClick={() => {
                handleDownload();
              }}
            >
              <i className="fa fa-download"></i>
            </button>
            <button
              id="RequisitionReportScheduleReports"
              className="btn btn-info btn-sm fw-bold search d-block"
              onClick={handleClickOpen}
            >
              {t("Schedule Reports")}
            </button>
          </div>
        </div>
      </div>
      <BootstrapModal
        BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Please select a Frequency and Time")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body className="py-3">
          <div>
            <label>{t("Name")}</label>
            <input
              id="RequisitionReportName"
              type="text"
              name="fileName"
              className="form-control bg-white mb-3 mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Name")}
              value={postData.fileName}
              onChange={(e) =>
                setpostData((oldData: any) => ({
                  ...oldData,
                  fileName: e.target.value,
                }))
              }
            />
          </div>
          <div className="mt-3">
            <label>{t("Frequency")}</label>
            <Select
              inputId="RequisitionReportFrequency"
              menuPortalTarget={document.body}
              theme={(theme: any) => styles(theme)}
              styles={reactSelectSMStyle}
              options={frequencylookup}
              name="frequencylookup"
              value={frequencylookup.find(
                (option: any) => option.value === postData.frequencyLabel
              )}
              onChange={handleChangeFrequency}
            />
          </div>
          <div className="mt-3">
            <label className=" fw-400 mr-3">{t("Schedule Date")}</label>
            <input
              id="ScheduleDate"
              type="datetime-local"
              name="ScheduleDate"
              className="form-control bg-transparent"
              placeholder={t("Pickup Date and Time")}
              onChange={handleDateTimeChange}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id="RequisitionReportCancel"
            type="button"
            className="btn btn-secondary"
            onClick={handleCancle}
          >
            {t("Cancel")}
          </button>
          <button
            id="RequisitionReportSave"
            type="button"
            className="btn btn-danger m-2"
            onClick={handleSave}
            disabled={buttonDisable}
          >
            {t("Save")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};

export default ReqReport;
