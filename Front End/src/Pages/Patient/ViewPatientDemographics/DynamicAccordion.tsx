import React from "react";
import DynamicSection from "./DynamicSection";
import { isJson } from "../../../Utils/Common/Requisition";

interface CustomAccordionProps {
  items: any;
  setShown: (shown: boolean) => void;
  arr: any;
}
const CustomAccordion: React.FC<CustomAccordionProps> = ({
  items,
  setShown,
  arr,
}) => {
  return (
    <>
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="m-0">Requisition</h3>
        </div>
        <div className="card-body py-md-4 py-3">
          <div className="card" style={{ border: "2px solid #069636" }}>
            <div className="card-header bg-light-primary d-flex justify-content-between align-items-center">
              <h5>{arr.requistions[0].reqDisplayName}</h5>
            </div>
            <div className="card-body py-md-4 py-3">
              <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 py-5">
                <div className="row">
                  {arr?.requistions[0].sections?.map((req: any) => (
                    <div className={`${req.sectionDisplayType} px-2`}>
                      <DynamicSection
                        config={{
                          title: req.sectionDisplayName,
                          classNameinnerSec: "",
                          fieldvalue: "",
                          check: "",
                          fields: req.fields.map((inner: any) => {
                            const label =
                              inner.fieldName === "Panel"
                                ? ""
                                : inner.fieldName;

                            let value = inner.fieldValue;
                            let className =
                              inner.fieldName === "Panel"
                                ? `d-flex`
                                : req.sectionDisplayName === "Medical Necessity"
                                ? `col-md-12 col-lg-12 col-sm-12 d-flex justify-content-between align-items-center`
                                : `${inner.displayType}  d-flex justify-content-between align-items-center`;
                            if (
                              inner.fieldName === "Experiencing Symptom" ||
                              inner.fieldName === "No Symptom"
                            ) {
                              let result = isJson(inner.fieldValue);
                              let defaultValue = inner.fieldValue;
                              if (result) {
                                defaultValue = JSON.parse(defaultValue);
                              }
                              value = defaultValue.map((option: any) => (
                                <div className="py-1" key={option.value}>
                                  <span className="badge badge-secondary round-3">
                                    {option.value}
                                  </span>
                                </div>
                              ));
                            }
                            if (Array.isArray(inner.fieldValue)) {
                              value = inner.fieldValue.map(
                                (fieldInner: any) => {
                                  if (inner.systemFieldName === "Compendium") {
                                    return (
                                      <>
                                        <DynamicSection
                                          config={{
                                            title: fieldInner.panelName,
                                            fieldvalue: "",
                                            check: inner.fieldName,
                                            className:
                                              "col-lg-6 col-md-6 col-xl-6 col-sm-12",
                                            classNameinnerSec:
                                              "d-flex flex-wrap gap-3 w-100",
                                            fields: [
                                              {
                                                label: "",
                                                value:
                                                  fieldInner.testingOptions.map(
                                                    (option: any) => (
                                                      <div className="py-1">
                                                        <span className="badge badge-secondary round-3">
                                                          {option}
                                                        </span>
                                                      </div>
                                                    )
                                                  ),
                                                className: "",
                                              },
                                            ],
                                          }}
                                        />
                                      </>
                                    );
                                  }

                                  if (
                                    inner.systemFieldName ===
                                    "SpecimenInformation"
                                  ) {
                                    return (
                                      <>
                                        <span>{fieldInner.specimenType}</span>
                                      </>
                                    );
                                  }
                                  if (inner.systemFieldName === "ICDPanels") {
                                    {
                                      value = inner.fieldValue;
                                      return value;
                                    }
                                  }
                                  if (
                                    inner.systemFieldName === "DrugAllergies"
                                  ) {
                                    return (value = inner.fieldValue.map(
                                      (option: any) => {
                                        return (
                                          <>
                                            <div className="py-1">
                                              <span className="badge badge-secondary round-3">
                                                {option}
                                              </span>
                                            </div>
                                          </>
                                        );
                                      }
                                    ));
                                  } else {
                                    return (
                                      <div key={fieldInner.label}>
                                        <span>{fieldInner.label}</span>
                                        {fieldInner.value}
                                      </div>
                                    );
                                  }
                                }
                              );
                            }
                            if (value === null) {
                              value = "N/A";
                            } else if (!Array.isArray(value)) {
                              value = <div>{value}</div>;
                            }
                            return {
                              label,
                              value,
                              className,
                            };
                          }),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomAccordion;
