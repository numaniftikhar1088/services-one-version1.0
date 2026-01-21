import Masonry from "masonry-layout";
import moment from "moment";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import { savePdfUrls } from "../../../../Redux/Actions/Index";
import AdditionalPanel from "./SectionUiPreview/AdditionalPanel";
import BasicFields from "./SectionUiPreview/BasicFields";
import ICDPanelTable from "./SectionUiPreview/ICDPanelTable";
import Medication from "./SectionUiPreview/Medication";
import PanelDisplay from "./SectionUiPreview/PanelDisplay";
import PPSignature from "./SectionUiPreview/PPSignature";
import SpecimenSource from "./SectionUiPreview/SpecimenSource";
import BillingInformation from "./SectionUiPreview/BillingInformation";
import FammilyHistory from "./SectionUiPreview/FamilyHistory";

export function convertTo12HourFormat(time: string) {
  const timeStr = String(time);
  if (!timeStr || !timeStr.includes(":")) return;
  const [hours, minutes] = time.split(":").map(Number); // Converts both to numbers
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  const paddedMinutes = String(minutes).padStart(2, "0"); // Ensure minutes are two digits
  return `${adjustedHours}:${paddedMinutes} ${period}`;
}
const RequisitionPreview = ({ previewData, infectiousData }: any) => {
  const { t } = useLang();
  console.log(previewData, "Preview");
  const dispatch = useDispatch();
  const masonryRef = useRef<any | null>(null);
  useEffect(() => {
    if (masonryRef.current) {
      masonryRef.current = new Masonry(".grid1", {
        itemSelector: ".grid-item1",
        columnWidth: ".grid-sizer1",
        percentPosition: true,
      });
      masonryRef.current.layout();
    }
  }, []);
  let arr: any = [];
  previewData?.requisitions?.map((item: any) => (
    <>
      {item?.reqSections.map((inner: any) => (
        <>
          {inner?.sectionId === 13 || inner?.sectionId === 14
            ? arr?.push(inner)
            : null}
        </>
      ))}
    </>
  ));
  const SplitStringByDollarSign = (inputString: any) => {
    const splitIndex = inputString?.indexOf("$");
    if (splitIndex === -1) {
      return <span>{inputString}</span>;
    } else {
      const part1 = inputString.substring(0, splitIndex);
      const part2 = inputString.substring(splitIndex + 1);
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

  const replaceDollarSignsWithNumberedLines = (inputString: any) => {
    if (!inputString || typeof inputString !== "string") {
      return inputString;
    }
    let count = 1;
    const parts = inputString.split("$$");
    if (parts.length === 1) {
      return <span>{inputString}</span>;
    }
    return (
      <>
        <span>{parts[0]}</span>
        {parts.slice(1).map((part: string, index: number) => (
          <span key={index}>
            <br />
            <span style={{ fontSize: "12px" }}>
              {count++}. {part}
            </span>
          </span>
        ))}
      </>
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <h3 className="text-danger fw-bold py-3 border-bottom">
        Review Requisition for Submission
      </h3>
      {previewData?.requisitions?.map((reqSectionsInfo: any, index: number) => (
        <div key={index} className="req-preview">
          <div className="card card-bordered border-gray-500 overflow-hidden shadow-xs mb-3">
            {index !== 0 && (
              <div className="align-items-center bg-gray-100i card-header d-flex fs-5 fw-500 min-h-35px px-5 text-dark">
                {t(reqSectionsInfo?.reqName)}
              </div>
            )}

            <div className="card-body px-2 row grid1">
              {reqSectionsInfo?.reqSections?.map((reqSectionsinfo: any) =>
                reqSectionsinfo?.sectionId === 13 ||
                  reqSectionsinfo?.sectionId === 14 ||
                  reqSectionsinfo?.sectionId === 5 || reqSectionsinfo?.sectionId === 112 ? null : (
                  <div
                    key={reqSectionsinfo?.sectionName}
                    className={
                      reqSectionsinfo?.sectionId === 10 ||
                        reqSectionsinfo?.sectionId === 9 ||
                        reqSectionsinfo?.sectionId === 89 ||
                        reqSectionsinfo?.sectionName === "Indication for Testing"
                        ? "col-sm-12 col-md-12 col-xl-12 col-xxl-12 grid-item1"
                        : "col-lg-6 col-md-6 col-sm-12 grid-item1"
                    }
                  >
                    <div className="card card-bordered border-gray-500 overflow-hidden shadow-xs mb-3">
                      <div className="align-items-center bg-gray-100i card-header d-flex fs-5 fw-500 min-h-35px px-5 text-dark">
                        {t(reqSectionsinfo?.sectionName)}
                      </div>
                      <div className="card-body px-5 py-3">
                        {Array.isArray(reqSectionsinfo?.fields) &&
                          reqSectionsinfo?.fields.map((fieldsData: any) => (
                            <>
                              <div
                                key={fieldsData?.displayName}
                                className={`row mb-1 `}
                              >
                                {/* <<<<<----------- label value ------>>>> */}
                                {fieldsData?.displayName === "ICD Panels" ||
                                  fieldsData?.systemFieldName === "Compendium" ||
                                  fieldsData.systemFieldName ===
                                  "PhysicianSignatureType" ||
                                  fieldsData.systemFieldName ===
                                  "PhysicianSignature" ||
                                  fieldsData.systemFieldName ===
                                  "PatientFullName" ||
                                  fieldsData.systemFieldName ===
                                  "PatientSignature" ||
                                  fieldsData.systemFieldName === "LabID" ||
                                  fieldsData.systemFieldName ===
                                  "SpecimenSource" ||
                                  fieldsData?.displayName === "PatientID" ||
                                  fieldsData.displayName === "Drug Allergies" ||
                                  fieldsData.systemFieldName ===
                                  "TestingOprtionCheckboxes" ||
                                  fieldsData.systemFieldName ===
                                  "PATIENTCONSENTSIGNATURE" ||
                                  fieldsData.systemFieldName === "repeat" ||
                                  fieldsData.systemFieldName ===
                                  "PHYSICIANCONSENTSIGNATURE" || fieldsData.systemFieldName ===
                                  "MedicalNessityPanel" || fieldsData.systemFieldName === 'MedicationPanel' || fieldsData.systemFieldName === 'ComorbidityPanels' ? null : fieldsData.systemFieldName ===
                                    "ConfirmationRequired" ||
                                    fieldsData.systemFieldName ===
                                    "ConfirmationRequiredN" ? (
                                  <span className="col-lg-6 fw-600 fs-6">
                                    {SplitStringByDollarSign(
                                      fieldsData.displayName
                                    )}
                                  </span>
                                ) : fieldsData.systemFieldName ===
                                  "MedicalNecessityAndConsent" ? (
                                  <div className="col-lg-6 fw-600 fs-6">
                                    {replaceDollarSignsWithNumberedLines(
                                      fieldsData.displayName
                                    )}
                                  </div>
                                ) : (
                                  <div className="col-lg-6 fw-600 fs-6">
                                    <>
                                      {t(fieldsData?.displayName)}&nbsp;&nbsp;
                                    </>
                                  </div>
                                )}
                                {/* <<<<<----------- Field value ------>>>> */}
                                <div
                                  className={
                                    fieldsData.systemFieldName ===
                                      "ICDPanels" || fieldsData.systemFieldName === "ComorbidityPanels" ||
                                      fieldsData.systemFieldName ===
                                      "PhysicianSignatureType" ||
                                      fieldsData.systemFieldName ===
                                      "PhysicianSignature" ||
                                      fieldsData.systemFieldName ===
                                      "PatientFullName" ||
                                      fieldsData.systemFieldName ===
                                      "PatientSignature" ||
                                      fieldsData.systemFieldName === "Compendium"
                                      ? "col-lg-12 col-md-12 col-sm-12 col-xl-12"
                                      : fieldsData.systemFieldName ===
                                        "ExperiencingSymptom" ||
                                        fieldsData.systemFieldName ===
                                        "NoSymptom" ||
                                        fieldsData.systemFieldName ===
                                        "DrugAllergies" ||
                                        fieldsData.systemFieldName ===
                                        "DrugOthres" ||
                                        fieldsData.systemFieldName ===
                                        "TestingOprtionCheckboxes" ||
                                        fieldsData.systemFieldName ===
                                        "AdditionalReferenceTest"
                                        ? "col-lg-12 col-md-12 col-sm-12 col-xl-12 d-flex flex-wrap gap-2"
                                        : fieldsData.systemFieldName ===
                                          "OtherMedication" ||
                                          fieldsData.systemFieldName ===
                                          "AssignedMedications"
                                          ? "col-lg-12 col-xl-12 col-xxl-12 col-sm-12 fs-6 gap-2 mb-2"
                                          : fieldsData.systemFieldName ===
                                            "SpecimenSource" ||
                                            fieldsData.systemFieldName ===
                                            "PATIENTCONSENTSIGNATURE" ||
                                            fieldsData.systemFieldName ===
                                            "ProviderSignatururee" ||
                                            fieldsData.systemFieldName ===
                                            "PHYSICIANCONSENTSIGNATURE" ||
                                            fieldsData.systemFieldName === "repeat"
                                            ? "col-lg-12 col-md-12 col-sm-12 col-xl-12"
                                            : (fieldsData.systemFieldName ===
                                              "PhotosForInsuranceCard" &&
                                              fieldsData?.fieldValue.length ===
                                              0) ||
                                              (fieldsData.systemFieldName ===
                                                "PhotoForDemographicInfo" &&
                                                fieldsData?.fieldValue.length === 0)
                                              ? "col-lg-6 fs-6 text-end"
                                              : fieldsData.systemFieldName ===
                                                "PhotosForInsuranceCard" ||
                                                fieldsData.systemFieldName ===
                                                "PhotoForDemographicInfo"
                                                ? "col-lg-12 col-md-12 col-sm-12 col-xl-12 d-flex flex-wrap gap-2"
                                                : "col-lg-6 fs-6 text-end"
                                  }
                                >
                                  {typeof fieldsData?.fieldValue === "string" ||
                                    typeof fieldsData?.fieldValue === "boolean" ||
                                    typeof fieldsData?.fieldValue === "number" ? (
                                    fieldsData?.systemFieldName ===
                                      "PatientId" ||
                                      fieldsData.systemFieldName ===
                                      "PhysicianSignatureType" ||
                                      fieldsData.systemFieldName ===
                                      "PatientFullName" ||
                                      fieldsData.systemFieldName ===
                                      "PhysicianSignature" ||
                                      fieldsData.systemFieldName ===
                                      "PatientSignature" ||
                                      fieldsData.systemFieldName ===
                                      "TimeofCollection" ? (
                                      <div>
                                        {convertTo12HourFormat(
                                          fieldsData?.fieldValue
                                        )}
                                      </div>
                                    ) : fieldsData.systemFieldName === "DOB" ? (
                                      <div>
                                        {moment(fieldsData?.fieldValue).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </div>
                                    ) : fieldsData.systemFieldName ===
                                      "LabID" ? null : (
                                      <BasicFields fieldsData={fieldsData} />
                                    )
                                  ) : Array.isArray(fieldsData?.fieldValue) ? (
                                    fieldsData.systemFieldName ===
                                      "ICDPanels" || fieldsData.systemFieldName === "ComorbidityPanels" ? (
                                      <ICDPanelTable fieldsData={fieldsData} />
                                    ) : fieldsData.systemFieldName ===
                                      "AdditionalReferenceTest" ? (
                                      <AdditionalPanel
                                        fieldsData={fieldsData}
                                      />
                                    ) : fieldsData.systemFieldName ===
                                      "repeat" ? (
                                      <>
                                        <FammilyHistory
                                          fieldsData={fieldsData}
                                        />
                                      </>
                                    ) : fieldsData.systemFieldName ===
                                      "SpecimenSource" ? (
                                      <SpecimenSource fieldsData={fieldsData} />
                                    ) : fieldsData.systemFieldName ===
                                      "TestingOprtionCheckboxes" ? (
                                      <>
                                        <h6 className="text-primary">
                                          Testing Options:
                                        </h6>
                                        <div className="mb-5 px-3">
                                          {fieldsData?.fieldValue.map(
                                            (option: any, index: any) => (
                                              <span
                                                className="fw-bold text-muted"
                                                key={index}
                                              >
                                                {option}
                                                {index <
                                                  fieldsData?.fieldValue.length -
                                                  1
                                                  ? ", "
                                                  : ""}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </>
                                    ) : fieldsData?.systemFieldName ===
                                      "OtherMedication" ||
                                      fieldsData?.systemFieldName ===
                                      "AssignedMedications" ? (
                                      <Medication fieldsData={fieldsData} />
                                    ) : fieldsData.systemFieldName ===
                                      "PhotosForInsuranceCard" ||
                                      fieldsData.systemFieldName ===
                                      "PhotoForDemographicInfo" ||
                                      fieldsData.systemFieldName ===
                                      "PhotoForPrescribedMedication" || fieldsData.systemFieldName === "ClinicalInformation" ? (
                                      <>
                                        {fieldsData?.fieldValue.length === 0 ? (
                                          <>
                                            <i className="fa-solid fa-ban"></i>{" "}
                                            {""}
                                            <span className="fw-500 text-muted">
                                              No File Selected
                                            </span>
                                          </>
                                        ) : (
                                          Array.isArray(
                                            fieldsData?.fieldValue
                                          ) &&
                                          fieldsData?.fieldValue?.map(
                                            (item: any) => (
                                              <>
                                                <div className="badge badge-secondary">
                                                  <Link
                                                    to={`/docs-viewer`}
                                                    target="_blank"
                                                    onClick={() => {
                                                      dispatch(
                                                        savePdfUrls(
                                                          item.fileUrl
                                                        )
                                                      );
                                                    }}
                                                  >
                                                    <i
                                                      className="fa fa-file text-primary"
                                                      style={{
                                                        fontSize: "18px",
                                                      }}
                                                    ></i>{" "}
                                                    {item.fileName}
                                                  </Link>
                                                </div>
                                              </>
                                            )
                                          )
                                        )}
                                      </>
                                    ) : fieldsData.systemFieldName ===
                                      "DrugAllergies" ? (
                                      fieldsData?.fieldValue?.map(
                                        (item: any) => (
                                          <>
                                            <span className="badge badge-secondary round-3 py-1">
                                              {item?.value
                                                ? item.label
                                                : JSON.stringify(item)}
                                            </span>
                                            <span> </span>
                                          </>
                                        )
                                      )
                                    ) : fieldsData.systemFieldName === "MedicalNessityPanel" ? null : fieldsData.systemFieldName ===
                                      "Compendium" ? (
                                      <PanelDisplay fieldsData={fieldsData} />
                                    ) : (fieldsData.systemFieldName !== "MedicalNessityPanel" && fieldsData.systemFieldName !== "MedicationPanel") &&
                                    fieldsData?.fieldValue?.map(
                                      (item: any) => (
                                        <>
                                          <span className="badge badge-secondary round-3 py-1">
                                            {item?.value
                                              ? item.value
                                              : JSON.stringify(item)}
                                          </span>
                                          <span> </span>
                                        </>

                                      )
                                    )

                                  ) : null}
                                </div>
                              </div>
                            </>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              )}
              <BillingInformation reqSectionsInfo={reqSectionsInfo} />
              <div className="grid-item1 grid-sizer1"></div>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex">
        {Array.isArray(arr) &&
          arr?.map((signatureData: any) => (
            <>
              <PPSignature signatureData={signatureData} />
            </>
          ))}
      </div>
    </>
  );
};

export default RequisitionPreview;
