import React from 'react';
import useLang from './../../../../Shared/hooks/useLanguage';

interface CheckBoxProps {
  childChecked: boolean[];
  handleChildChange: (
    index: number
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const patientInfo = [
  'First Name',
  'Last Name',
  'Date Of Birth',
  'Patient ID',
  'Gender',
  'Address',
  'City',
  'State',
  'Zip Code',
  'Email',
];

const requisitionInfo = [
  'Requisition Type',
  'Data Of Collection',
  'Time of Collection',
  'Received Date',
  'Validated Date',
  'Rejected Date',
  'Rejected Reason',
  'Status',
  'Accession#',
  'Insurance Type',
  'Lab Code',
  'Reference Lab',
  'pharm D',
  'Panel Name',
];

const insuranceInfo = [
  // "Primary Insurance Provider",
  'Provider Name',
  'GroupID',
  'Relationship to insured',
  'Policy ID',
  'Policy Holder DOB',
];

const facilityInfo = [
  "Facility Name",
  "Facility Address",
  "Facility City",
  "Facility State",
  "Facility ZipCode",
  "Facility ID",
  "Physician Name",
  "NPI",
  "Sales Rep Name",
  "Result Delivery",
  "Sales Rep Group"
];

function CheckBox({ childChecked, handleChildChange }: CheckBoxProps) {
  const { t } = useLang();

  const renderCheckboxes = (labels: string[], startIndex: number) =>
    labels.map((label, index) => {
      const uniqueId = `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}-${
        index + startIndex
      }`;

      return (
        <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" key={uniqueId}>
          <div className="mb-4">
            <label
              className="form-check form-check-sm form-check-solid"
              htmlFor={uniqueId}
            >
              <input
                id={uniqueId}
                className="form-check-input h-20px w-20px"
                type="checkbox"
                checked={childChecked[index + startIndex]}
                onChange={handleChildChange(index + startIndex)}
              />
              {t(label)}
            </label>
          </div>
        </div>
      );
    });

  return (
    <>
      <div className="row">
        <div className="col-12">
          <p className="mb-3 mt-5">{t('Patient Information')}</p>
        </div>
        {renderCheckboxes(patientInfo, 0)}
      </div>

      <div className="row">
        <div className="col-12">
          <p className="mb-3 mt-5">{t('Requisition Information')}</p>
        </div>
        {renderCheckboxes(requisitionInfo, 10)}
      </div>

      <div className="row">
        <div className="col-12">
          <p className="mb-3 mt-5">{t('Insurance Information')}</p>
        </div>
        {renderCheckboxes(insuranceInfo, 25)}
      </div>

      <div className="row">
        <div className="col-12">
          <p className="mb-3 mt-5">{t('Facility Information')}</p>
        </div>
        {renderCheckboxes(facilityInfo, 30)}
      </div>
    </>
  );
}

export default CheckBox;
