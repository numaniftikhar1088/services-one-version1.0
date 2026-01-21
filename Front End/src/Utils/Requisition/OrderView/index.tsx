import { Box, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { t } from "i18next";
import React from "react";
import Base64Image from "../../../Shared/Base64toImage";
import { isJson } from "../../Common/Requisition";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { savePdfUrls } from "Redux/Actions/Index";

function extractDateFromDateAndTime(dateAndTime: any) {
  const parts = dateAndTime?.split(" ");
  if (parts?.length >= 1) {
    return parts[0];
  }
  return dateAndTime;
}
function convertTo12HourFormat(time24: any) {
  // Split the time into hours and minutes
  if (time24) {
    const [hours, minutes] = time24?.split(":")?.map(Number);
    // Determine the period (AM or PM)
    const period = hours >= 12 ? "PM" : "AM";
    // Convert the hours to 12-hour format (12:00 AM should be 12:00)
    const hours12 = hours % 12 || 12;
    // Format the time as a 12-hour string
    return `${hours12}:${minutes?.toString()?.padStart(2, "0")} ${period}`;
  } else {
    return ``;
  }
}

function numberDollarSections(text: any) {
  let count = 1;
  return text.replace(/\$\$/g, () => `\n\n${count++}. `);
}

export const showFieldValue = (fieldsInfo: any, fieldData: any) => {
  const SplitStringByDollarSign = (inputString: any) => {
    const splitIndex = inputString.indexOf("$");
    if (splitIndex === -1) {
      return <span>{inputString}</span>;
    } else {
      const part1 = inputString?.substring(0, splitIndex);
      const part2 = inputString?.substring(splitIndex + 1);
      return (
        <>
          <span>{part1}</span>
          <br />
          <span className="text-muted" style={{ fontSize: "11px" }}>
            {part2}
          </span>
        </>
      );
    }
  };
  let key = fieldsInfo?.fieldName;
  let value = fieldsInfo?.fieldValue;
  let result = isJson(value);
  if (result) {
    value = JSON.parse(value);
  }
  let displayType = fieldsInfo?.displayType;
  let systemFieldName = fieldsInfo?.systemFieldName;
  const dispatch = useDispatch();
  switch (true) {
    case key && value && displayType:
      return (
        <>
          <div className={displayType}>
            {Array.isArray(value)
              ? value.map((items) => (
                <>
                  <span
                    style={{ border: "1px solid red" }}
                    className="fw-bold"
                  >
                    {items.label}
                  </span>
                  <span>{items.value}</span>
                </>
              ))
              : value}
          </div>
        </>
      );
    case systemFieldName === "OtherMedication" ||
      systemFieldName === "AssignedMedications":
      return (
        <>
          <span className="fw-bold">{t(key)}</span>
          <div className={"d-flex gap-2 flex-wrap"}>
            {Array.isArray(value) ? (
              value.map((i: any) => (
                <div className="py-1">
                  <span
                    className="badge badge-secondary round-3"
                    key={i.medicationCode}
                  >
                    {i.medicationName}
                  </span>
                </div>
              ))
            ) : (
              <span></span>
            )}
          </div>
        </>
      );
    case systemFieldName === "SpecimenInformation":
      return value.map((inner: any) => (
        <>
          <div
            className={`${displayType} d-flex justify-content-between align-items-center`}
          >
            <span className="fw-500">{t("Specimen Type")}</span>
            <span>{inner.specimenType}</span>
          </div>
          <div
            className={`${displayType} d-flex justify-content-between align-items-center`}
          >
            <span className="fw-500">{t("Accession No")}</span>
            <span>{inner.accessionNo}</span>
          </div>
        </>
      ));
    case systemFieldName === "SpecimenSource":
      return value.map((inner: any) => (
        <>
          <div className={`card mb-4 w-100`}>
            <div className="card-header d-flex justify-content-between align-items-center min-h-40px bg-secondary">
              <span className="mb-0 fw-500">{inner.panelName}</span>
            </div>
            <div className="card-body px-6 py-4 row">
              {inner?.testingOptions?.map(
                (specimenInner: any, index: number) => {
                  const [mainText, extraText] = specimenInner?.split("$");

                  return (
                    <div key={index} className="py-1">
                      <span className="badge badge-secondary round-3">
                        {mainText}
                      </span>{" "}
                      {extraText && (
                        <span
                          className="text-muted"
                          style={{ fontSize: "11px" }}
                        >
                          {extraText}
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </>
      ));
    case systemFieldName === "ICD10Description" || systemFieldName === "ComorbidityDescription":
      return null;
    case systemFieldName === "DeclineToProvide":
      return null;
    case systemFieldName === "NoSecondaryInsurance":
      return null;
    case systemFieldName === "ICD10Code" || systemFieldName === "ComorbidityCode":
      return null;
    case systemFieldName === "MedicalNessityPanel":
      return null;

    case systemFieldName === "ICDPanels" || systemFieldName === "ComorbidityPanels":
      return (
        <>
          <h5 className="text-primary">{t("Code(s)")}</h5>
          <Box sx={{ height: "auto", width: "100%" }}>
            <div className="table_bordered overflow-hidden">
              <TableContainer
                sx={{
                  maxHeight: "calc(100vh - 100px)",
                  "&::-webkit-scrollbar": {
                    width: 7,
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#fff",
                  },
                  "&:hover": {
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "var(--kt-gray-400)",
                      borderRadius: 2,
                    },
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "var(--kt-gray-400)",
                    borderRadius: 2,
                  },
                }}
                component={Paper}
                className="shadow-none"
              >
                <Table
                  // aria-label="sticky table collapsible"
                  className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                >
                  <TableHead className="h-40px">
                    <TableRow>
                      <TableCell className="min-w-50px w-50px">
                        {t(systemFieldName === "ComorbidityPanels" ? "Comorbidity Code(s)" : "Icd 10 codes")}
                      </TableCell>
                      <TableCell>{t(systemFieldName === "ComorbidityPanels" ? "Comorbidity Description(s)" : "Description(s)")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array?.isArray(value) ? (
                      value?.map((item: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell>{item?.code || item?.Code}</TableCell>
                          <TableCell>
                            {item?.description || item?.Description}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>
                          {t("No data available")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Box>
        </>
      );
    case systemFieldName === "DrugAllergies":
      return (
        <div className={displayType + "d-flex gap-2 flex-wrap"}>
          {value.map((DrugAllergies: any) => (
            <>
              <div className="py-1">
                <span className="badge badge-secondary round-3">
                  {DrugAllergies}
                </span>
              </div>
            </>
          ))}
        </div>
      );
    case systemFieldName === "TestingOprtionCheckboxes":
      return (
        <>
          <div className="d-flex">
            <h6 className="text-primary">
              {t(key)}
              {":"}
            </h6>
            <span>
              {Array.isArray(value) ? (
                value.map((i: any, index: number) => (
                  <React.Fragment key={index}>
                    <span
                      style={{ marginLeft: index === 0 ? "10px" : "0" }}
                      className="fw-bold"
                    >
                      {i}
                    </span>
                    {index < value.length - 1 && <span>, </span>}
                  </React.Fragment>
                ))
              ) : (
                <span>{value}</span>
              )}
            </span>
          </div>
        </>
      );
    case systemFieldName === "Medical Necessity":
      return (
        <div>
          <div className={displayType}>
            {Array.isArray(value)
              ? value.map((medicaNeccessities: any) => (
                <>
                  <span className="fw-bold">{medicaNeccessities.label}</span>
                  <span>{medicaNeccessities?.value}</span>
                </>
              ))
              : value}
          </div>
        </div>
      );
    case systemFieldName === "ClinicalInformation":
      return (
        <div>
          <div className={`${displayType} d-flex flex-wrap gap-2`}>
            {Array?.isArray(value)
              ? value?.map((file: any) => (
                <>
                  <Link
                    to={`/docs-viewer`}
                    target="_blank"
                    onClick={() => {
                      dispatch(savePdfUrls(file?.fileUrl));
                    }}
                  >
                    <span className="badge badge-secondary">{file?.fileName}</span>
                  </Link>

                </>
              ))
              : value}
          </div>
        </div>
      );
    case systemFieldName === "PhysicianSignature" ||
      systemFieldName === "PatientSignature":
      return (
        <>
          <div>
            <Base64Image
              base64String={
                fieldsInfo.fieldValue?.includes("data:image/png;base64,")
                  ? fieldsInfo.fieldValue
                  : `data:image/png;base64,${fieldsInfo.fieldValue}`
              }
            />
          </div>
        </>
      );
    case systemFieldName === "ReadBack":
      return (
        <>
          <div
            className={`${displayType} d-flex justify-content-between align-items-center`}
          >
            <div className="fw-bold">{t(key)}</div>
            <div className="">{value}</div>
          </div>
          <div className="mb-2">
            <hr />
          </div>
        </>
      );
    case systemFieldName === "Compendium":
      return (
        <>
          {Array.isArray(fieldsInfo.fieldValue) ||
            typeof fieldsInfo.fieldValue === "string"
            ? (Array.isArray(fieldsInfo.fieldValue)
              ? fieldsInfo.fieldValue
              : JSON.parse(fieldsInfo.fieldValue)
            ).map((items: any) => {
              const options = items.testingOptions || items.testOptions || [];

              return (
                <div
                  className="col-lg-12 col-md-12 col-sm-12"
                  key={items.panelName}
                >
                  <div className="card shadow mb-4 w-100">
                    <div className="card-header d-flex justify-content-between align-items-center min-h-40px bg-gray-200i">
                      <h5 className="mb-0">{items.panelName}</h5>
                    </div>
                    <div className="card-body px-6 py-4 row">
                      {Array.isArray(options)
                        ? options.map((inner: any, index: number) => (
                          <div
                            className="col-lg-3 col-md-4 col-sm-6 col-12 my-1"
                            key={index}
                          >
                            <span className="badge badge-secondary round-3 py-1 text-wrap text-start">
                              {typeof inner === "string"
                                ? inner
                                : inner.testName}
                            </span>
                          </div>
                        ))
                        : null}
                    </div>
                  </div>
                </div>
              );
            })
            : fieldsInfo.fieldValue}
        </>
      );
    case systemFieldName === "MedicalNecessityAndConsent":
      return (
        <>
          <div
            className="fw-500 mb-5 fst-italic"
            dangerouslySetInnerHTML={{
              __html: t(numberDollarSections(key))
                ?.replace(/(\d+\.)/g, "<br>$1")
            }}
          />
          <span>
            {Array.isArray(value) && value?.map((items, index) => (
              <span
                key={index}
                className="badge badge-secondary rounded-3 py-2"
                style={{ whiteSpace: "normal" }}
              >
                {items?.value}
              </span>
            ))}
          </span>
        </>
      );

    case systemFieldName === "MAPCollectionURL":
      return (
        <div
          className={`${displayType} d-flex justify-content-between align-items-center`}
        >
          <span className="fw-bold" style={{ width: "30%" }}>
            {t(key)}
          </span>
          <div
            className="d-flex gap-2 justify-content-end flex-wrap"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              width: "70%",
            }}
          >
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-decoration-underline"
              style={{ wordBreak: "break-all" }}
            >
              {value}
            </a>
          </div>
        </div>
      );

    default:
      return systemFieldName === "RepeatStart" ? (
        <div className="mb-2">
          <hr />
        </div>
      ) : (
        <div
          className={
            fieldsInfo.systemFieldName === "ExperiencingSymptom" ||
              fieldsInfo.systemFieldName === "NoSymptom"
              ? displayType
              : `${displayType} d-flex justify-content-between align-items-center`
          }
        >
          <span style={{ width: "30%" }}>
            {systemFieldName === "PhysicianSignatureType" ||
              systemFieldName === "PatientSignatureType" ||
              systemFieldName === "PatientOption" ||
              systemFieldName === "PatientFullName" ||
              systemFieldName === "PatientDescription" ||
              systemFieldName === "RepeatEnd" ||
              systemFieldName === "RepeatStart" ||
              systemFieldName === "LabID" ||
              systemFieldName === "PhotoForPrescribedMedication" ? (
              ""
            ) : (
              <>
                <div
                  className={`fw-bold
                ${systemFieldName === "ExperiencingSymptom" ||
                      systemFieldName === "NoSymptom"
                      ? "my-2"
                      : ""
                    }
                `}
                >
                  {systemFieldName === "ConfirmationRequired" ||
                    systemFieldName === "ConfirmationRequiredN"
                    ? SplitStringByDollarSign(key)
                    : t(key)}
                </div>
              </>
            )}
          </span>
          <div
            className="d-flex gap-2 justify-content-end flex-wrap"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              width: "70%",
            }}
          >
            {Array.isArray(value) ? (
              value?.map((items, index) => (
                <span
                  key={index}
                  className="badge badge-secondary rounded-3 py-2"
                  style={{ whiteSpace: "normal" }}
                >
                  {items?.value}
                </span>
              ))
            ) : systemFieldName === "ExposuretoCovid19" ||
              systemFieldName === "SignandSymptom" ||
              systemFieldName === "RecommendedTest" ? (
              <div>
                {value ? (
                  <span className="badge badge-secondary rounded-3 py-2">
                    Yes
                  </span>
                ) : (
                  <span className="badge badge-secondary rounded-3 py-2">
                    No
                  </span>
                )}
              </div>
            ) : systemFieldName === "DateofCollection" ||
              systemFieldName === "DateReceived" ||
              systemFieldName === "DOB" ? (
              extractDateFromDateAndTime(value)
            ) : systemFieldName === "TimeofCollection" ? (
              convertTo12HourFormat(value)
            ) : systemFieldName === "RepeatStart" ||
              systemFieldName === "RepeatEnd" ||
              systemFieldName === "LabID" ||
              systemFieldName === "PhotoForPrescribedMedication" ||
              systemFieldName === "DeclineToProvide" ||
              systemFieldName === "NoSecondaryInsurance" ? null : (
              <span
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >
                {value}
              </span>
            )}
          </div>
        </div>
      );
  }
};
