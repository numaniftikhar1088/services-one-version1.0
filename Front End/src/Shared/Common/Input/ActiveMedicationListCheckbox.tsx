import { useEffect, useRef, useState } from 'react';
import useLang from 'Shared/hooks/useLanguage';
import { assignFormValues } from '../../../Utils/Auth';
import UseMedicationAutoComplete from '../../hooks/Requisition/UseMedicationAutoComplete';
import MuiSkeleton from '../MuiSkeleton';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const ActiveMedicationListCheckbox = ({
  Inputs,
  index,
  options = [],
  sysytemFieldName,
  displayFieldName,
  depControlIndex,
  fieldIndex,
  isDependency,
  repeatFieldSection,
  isDependencyRepeatFields,
  repeatFieldIndex,
  repeatDependencySectionIndex,
  repeatDepFieldIndex,
  setInputs,
  infectiousData,
  setInfectiousData,
  ArrayReqId,
  labelClassName,
  spanClassName,
  loading,
  error,
  noActiveMedication,
  defaultValue,
}: any) => {
  const { t } = useLang();
  const location = useLocation();
  const inputSearchRef = useRef<HTMLInputElement>(null);
  function FindIndex(arr: any[], text: any): number {
    return arr.findIndex(item => item.reqId === text);
  }
  const {
    suggestions,
    handleChange,
    handleKeyDown,
    handleClick,
    searchedValue,
    setSearchedValue,
    setTouched,
    setSuggestions
  } = UseMedicationAutoComplete(inputSearchRef);

  const [AssignedMedicationList, setAssignedMedicationList] = useState<any>(
    sysytemFieldName === 'AssignedMedications'
      ? options.filter((opt: any) => opt.isSelected)
      : []
  );
  // Initialize with defaultValue but don't reset unnecessarily
  const [selectedOtherMedications, setSelectedOtherMedications] = useState<
    any[]
  >(defaultValue || []);
  const updateFields = async (
    code: string,
    isSelected: boolean,
    selectedMedications: any
  ) => {
    Inputs[index]?.fields?.map((i: any) => {
      if (i?.systemFieldName === 'MedicationPanel') {
        i.defaultValue = selectedMedications;
      }
    });
    if (Inputs[index]?.fields) {
      const medication = Inputs[index].fields
        .find((field: any) => field.systemFieldName === 'AssignedMedications')
        ?.medicationList.find((med: any) => med.medicationCode === code);
      if (medication) medication.isSelected = isSelected;
    }

    const newInputs = await assignFormValues(
      Inputs,
      index,
      depControlIndex,
      fieldIndex,
      selectedMedications,
      isDependency,
      repeatFieldSection,
      isDependencyRepeatFields,
      repeatFieldIndex,
      repeatDependencySectionIndex,
      repeatDepFieldIndex,
      undefined,
      setInputs
    );

    const infectiousDataCopy = JSON.parse(JSON.stringify(infectiousData));
    infectiousDataCopy[FindIndex(infectiousData, ArrayReqId)].sections =
      newInputs;
    if (setInfectiousData) setInfectiousData([...infectiousDataCopy]);
  };

  const handleChangeCheckbox = (event: any, code: any, name: any) => {
    const isMedicationAlreadyAssigned = (medicationCode: any) => {
      // Check if Inputs[index] and fields exist
      const fields = Inputs[index]?.fields;
      if (!fields) return false;

      // Get the field index
      const fieldIndex = FindIndex(fields, 'OtherMedication');
      if (fieldIndex === -1) return false; // Assuming FindIndex returns -1 if not found

      // Check if defaultValue is an array
      const defaultValue = fields[fieldIndex]?.defaultValue;
      if (!Array.isArray(defaultValue)) return false;

      // Check if medicationCode exists in defaultValue
      return defaultValue.some(
        (med: any) => med.medicationCode === medicationCode
      );
    };

    if (isMedicationAlreadyAssigned(code)) {
      toast.error('This medication is already selected.');
      return;
    }
    const medicationObj = { medicationCode: code, medicationName: name };
    const updatedList = event.target.checked
      ? [...AssignedMedicationList, medicationObj]
      : AssignedMedicationList.filter(
        (med: any) => med.medicationCode !== code
      );

    Inputs[index]?.fields?.map((i: any) => {
      if (i?.systemFieldName === 'MedicationPanel') {
        i.defaultValue = updatedList;
      }
    });
    setAssignedMedicationList(updatedList);
    updateFields(code, event.target.checked, updatedList);
  };

  const isMedicationAlreadySelected = (medicationCode: any) => {
    return (
      selectedOtherMedications.some(
        (med: any) => med.medicationCode === medicationCode
      ) ||
      Inputs[index]?.fields.forEach((element: any) => {
        if (element.systemFieldName === 'AssignedMedications') {
          if (element?.medicationList?.some((med: any) => med.isSelected && med.medicationCode === medicationCode)) {
            return true;
          }
        }
      }))
  };

  const handleOtherMedication = async (item: any) => {
    if (isMedicationAlreadySelected(item.medicationCode)) {
      toast.error('This medication is already selected.');
      return;
    }

    const medicationObj = {
      medicationName: item.medicationName,
      medicationCode: item.medicationCode,
    };
    const updatedList = [...selectedOtherMedications, medicationObj];
    setSelectedOtherMedications(updatedList);
    setSearchedValue('');

    Inputs[index]?.fields?.map((i: any) => {
      if (
        i?.systemFieldName === 'OtherMedication' ||
        i?.systemFieldName === 'MedicationPanel'
      ) {
        i.defaultValue = updatedList;
      }
    });

    const newInputs = await assignFormValues(
      Inputs,
      index,
      depControlIndex,
      fieldIndex,
      updatedList,
      isDependency,
      repeatFieldSection,
      isDependencyRepeatFields,
      repeatFieldIndex,
      repeatDependencySectionIndex,
      repeatDepFieldIndex,
      undefined,
      setInputs
    );

    const infectiousDataCopy = JSON.parse(JSON.stringify(infectiousData));
    infectiousDataCopy[FindIndex(infectiousData, ArrayReqId)].sections =
      newInputs;
    if (setInfectiousData) setInfectiousData([...infectiousDataCopy]);
  };

  const removeMedication = async (code: number) => {
    const updatedList = selectedOtherMedications.filter(
      (med: any) => med.medicationCode !== code
    );
    setSelectedOtherMedications(updatedList);

    Inputs[index]?.fields?.map((i: any) => {
      if (
        i?.systemFieldName === 'MedicationPanel' ||
        i?.systemFieldName === 'OtherMedication'
      ) {
        i.defaultValue = updatedList;
        i.medicationList = updatedList

      }
    });

    const newInputs = await assignFormValues(
      Inputs,
      index,
      depControlIndex,
      fieldIndex,
      updatedList,
      isDependency,
      repeatFieldSection,
      isDependencyRepeatFields,
      repeatFieldIndex,
      repeatDependencySectionIndex,
      repeatDepFieldIndex,
      undefined,
      setInputs
    );

    const infectiousDataCopy = JSON.parse(JSON.stringify(infectiousData));
    infectiousDataCopy[FindIndex(infectiousData, ArrayReqId)].sections =
      newInputs;
    if (setInfectiousData) setInfectiousData([...infectiousDataCopy]);
  };
  //In some cases, defaultValue may change (e.g., when loading existing data) need to have a look on this useEffect
  useEffect(() => {
    if (!noActiveMedication) {
      if (
        sysytemFieldName === 'OtherMedication' &&
        Array.isArray(options) &&
        location?.state?.reqId
      ) {

        const preSelected = options.filter(
          (opt: any) => opt?.medicationCode && opt?.medicationName
        );
        if (preSelected.length) {
          Inputs[index]?.fields?.map((i: any) => {
            if (
              i?.systemFieldName === 'MedicationPanel' ||
              i?.systemFieldName === 'OtherMedication'
            ) {
              i.defaultValue = preSelected;
            }
          });
        }
        // Only update if preSelected is different from current state
        if (
          JSON.stringify(preSelected) !== JSON.stringify(selectedOtherMedications)
        ) {
          setSelectedOtherMedications(preSelected);
        }
        assignFormValues(
          Inputs,
          index,
          depControlIndex,
          fieldIndex,
          preSelected,
          isDependency,
          repeatFieldSection,
          isDependencyRepeatFields,
          repeatFieldIndex,
          repeatDependencySectionIndex,
          repeatDepFieldIndex,
          undefined,
          setInputs
        );
      }
      if (
        sysytemFieldName === 'AssignedMedications' &&
        Array.isArray(options) &&
        location?.state?.reqId
      ) {
        const preSelected = options.filter((opt: any) => opt?.isSelected);
        if (preSelected.length) {
          Inputs[index]?.fields?.map((i: any) => {
            if (
              i?.systemFieldName === 'MedicationPanel' ||
              i?.systemFieldName === 'AssignedMedications'
            ) {
              i.defaultValue = preSelected;
            }
          });
        }
        assignFormValues(
          Inputs,
          index,
          depControlIndex,
          fieldIndex,
          preSelected,
          isDependency,
          repeatFieldSection,
          isDependencyRepeatFields,
          repeatFieldIndex,
          repeatDependencySectionIndex,
          repeatDepFieldIndex,
          undefined,
          setInputs
        );
      }
    }
  }, []);

  useEffect(() => {

    if (noActiveMedication) {
      setSelectedOtherMedications([]);
      setSearchedValue('');
      setTouched(false);
      setSuggestions([]);

    }
  }, [noActiveMedication]);


  return (
    <>
      <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
        <h6 className="mb-3">{t(displayFieldName)}</h6>
        {sysytemFieldName === 'AssignedMedications' && (
          <div className="row">
            {options
              ?.slice() // alphabatic order
              .sort((a: any, b: any) =>
                a?.medicationName?.localeCompare(b?.medicationName)
              )
              .map(({ medicationCode, medicationName, isSelected }: any) => (
                <div
                  className="col-lg-4 col-md-6 col-6 py-1"
                  key={medicationCode}
                >
                  <div className="form__group form__group--checkbox mb-3">
                    <label
                      className={
                        labelClassName
                          ? `${labelClassName} fw-400 text-break`
                          : 'form-check form-check-inline form-check-solid m-0 fw-400 text-break'
                      }
                    >
                      <input
                        className="form-check-input h-20px w-20px"
                        type="checkbox"
                        checked={isSelected}
                        onChange={e =>
                          handleChangeCheckbox(e, medicationCode, medicationName)
                        }
                        disabled={noActiveMedication}
                      />
                      {loading ? (
                        <MuiSkeleton height={22} />
                      ) : (
                        <span className={spanClassName}>{medicationName}</span>
                      )}
                    </label>
                  </div>
                  {error && (
                    <div className="form__error">
                      <span>{t(error)}</span>
                    </div>
                  )}
                </div>
              ))}

          </div>
        )}
        {sysytemFieldName === 'OtherMedication' && (
          <div className="d-flex flex-wrap gap-2 mt-2">
            <div
              style={{ position: 'relative', width: '100%', maxWidth: '300px' }}
            >
              <input
                type="text"
                name="Medications"
                placeholder={t('Medications')}
                className={
                  noActiveMedication
                    ? 'form-control bg-secondary position-relative'
                    : 'form-control bg-transparent position-relative'
                }
                value={searchedValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                ref={inputSearchRef}
                disabled={noActiveMedication}
              />
              {suggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '0.375rem',
                    marginTop: '5px',
                  }}
                >
                  {suggestions.map((item: any) => (
                    <div
                      key={item.medicationCode}
                      style={{
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        backgroundColor: 'white',
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = '#f3f4f6')
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor = 'white')
                      }
                      onClick={() => {
                        handleClick(item);
                        handleOtherMedication(item);
                      }}
                    >
                      <span id={item.medicationCode}>
                        {item.medicationName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {sysytemFieldName === 'OtherMedication' && (
          <div className="d-flex flex-wrap gap-2 mt-4">
            {Array.isArray(selectedOtherMedications) &&
              selectedOtherMedications.map(
                ({ medicationCode, medicationName }: any) => (
                  <div
                    className="d-flex badge badge-secondary px-2 fw-500 gap-2 align-items-center pt-2"
                    key={medicationCode}
                  >
                    <i
                      className="bi bi-x-lg cursor-pointer"
                      onClick={() => removeMedication(medicationCode)}
                    ></i>
                    <span>{medicationName}</span>
                  </div>
                )
              )}
          </div>
        )}
      </div>
    </>
  );
};

export default ActiveMedicationListCheckbox;

