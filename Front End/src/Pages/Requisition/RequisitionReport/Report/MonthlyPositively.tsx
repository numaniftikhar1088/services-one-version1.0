import React from "react";
import useLang from "./../../../../Shared/hooks/useLanguage";

const PositivelyInfo = [
  "Facility - Result ID",
  "Patient Name",
  "DOB",
  "Insurance and Subscriber ID",
  "Pathologist (Physician Name)",
  "CPT Codes",
  "ICD10 Codes",
  "Location (Facility)",
  "Physician",
  "Collected Date",
  "Received Date",
  "Reported Date",
];

const MonthlyPositively = () => {
  const { t } = useLang();

  const renderCheckboxes = (labels: string[], startIndex: number) =>
    labels.map((label, index) => {
      const uniqueId = `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}-${
        index + startIndex
      }`;

      return (
        <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" key={uniqueId}>
          <div className="mb-7">
            <label
              className="form-check form-check-sm form-check-solid"
              htmlFor={uniqueId}
            >
              {t(label)}
            </label>
          </div>
        </div>
      );
    });

  return (
    <>
      <div className="row mt-10">{renderCheckboxes(PositivelyInfo, 0)}</div>
    </>
  );
};

export default MonthlyPositively;
