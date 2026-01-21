import { AxiosResponse } from 'axios';
import moment from 'moment';
import Button from 'Pages/Requisition/SingleRequisition/Button';
import ClearButton from 'Pages/Requisition/SingleRequisition/ClearButton';
import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import ReadMore from '../Pages/Requisition/SingleRequisition/ReadMore';
import { setRequisitionData } from '../Redux/Actions/Pages/Requisition';
import Commonservice from '../Services/CommonService';
import RequisitionType from '../Services/Requisition/RequisitionTypeService';
import Checkbox from '../Shared/Common/Input/Checkbox';
import Input from '../Shared/Common/Input/Input';
import Radio2 from '../Shared/Common/Input/Radio2';
import ReactSelect from '../Shared/Common/Input/ReactSelect';
import { CrossIcon } from '../Shared/Icons';
import {
  assignFormValues,
  assignFormValuesForMedicalNecessity,
  validationExpression,
} from '../Utils/Auth';
import { showDep, styles } from '../Utils/Common';
import {
  isJson,
  setDropDownValue,
  setJSONDataFormat,
  setPatientValues,
  showDepRepeatFields,
} from '../Utils/Common/Requisition';
import AutoComplete from './AutoComplete';
import ActiveMedicationListCheckbox from './Common/Input/ActiveMedicationListCheckbox';
import AdditionalTest from './Common/Input/AdditionalTest';
import AutoAddress from './Common/Input/AutoAddress';
import CheckBoxList from './Common/Input/CheckBoxList';
import ControlAutoDynamicComplete from './Common/Input/ControlDynamicAutocomplete';
import ControlDynamicDropDown from './Common/Input/ControlDynamicDropDown';
import CopyCheckBox from './Common/Input/CopyCheckbox';
import DatePicker from './Common/Input/DatePicker';
import Document from './Common/Input/Document';
import DynamicAutoComplete from './Common/Input/DynamicAutoComplete';
import FileUpload from './Common/Input/FileUpload';
import GenericPhoneNumberInput from './Common/Input/GenericPhoneNumberType';
import HeaderSelectableOnlyPanel from './Common/Input/HeaderSelectableOnlyPanel';
import LogoUpload from './Common/Input/Logo';
import MaskedInput from './Common/Input/MaskedInput';
import MultipleReferenceLabPanel from './Common/Input/MultipleReferenceLabPanel';
import { MultipleHeaderSelectable } from './Common/Input/MultipleSelectableHeader';
import { MultipleHeaderSelectable2 } from './Common/Input/MultipleSelectableHeader2';
import MultiSelectComponent from './Common/Input/MultiSelect';
import PanelsCheckBox from './Common/Input/PanelsCheckBox';
import PanelsCheckboxSelected from './Common/Input/PanelsCheckboxSelected';
import PanelsCheckboxSpecimenSource from './Common/Input/PanelsCheckboxSpecimenSource';
import RadioButtonWithText from './Common/Input/RadioButtonWithText';
import RadioQuestion from './Common/Input/RadioQuestion';
import RawText from './Common/Input/RawText';
import ReportTemplates from './Common/Input/ReportTemplates';
import ServerSideDynamicDropDown from './Common/Input/ServerSideDynamicDropDown';
import SignPad from './Common/Input/SignPad';
import SSNNumberWithText from './Common/Input/SSNNumberWithText';
import Switch from './Common/Input/Switch';
import TextArea from './Common/Input/Textarea';
import TimeInput from './Common/Input/Time';
import ToxTestingOption from './Common/Input/ToxTestingOption';
import CommonSignPad from './Common/Signpad';
import useLang from './hooks/useLanguage';
import RepeatInputs from './RepeatInputs';
import ToxTestingOptionCheckbox from './TestingOptionCheckbox';
import ValidationPanel from './Common/Input/ValidationPanel';
import { toast } from 'react-toastify';
import { getCityState } from 'Utils/Common/HelperFunction';
import PrescribedOtherMedication from './Common/Input/PrescribedOtherMedication';
import ItalicizeCheckboxList from './Common/Input/ItalicizeCheckboxList';
import CurrentDate from './Common/Input/CurrentDate';
import CurrentTime from './Common/Input/CurrentTime';
import AlphabaticField from './Common/Input/AlphabaticField';
import ChooseFileUpload from "./Common/Input/ChooseFileUpload";
import PanelsCheckboxSpecimenSingleSource from './Common/Input/PanelCheckboxSpecimenSingleSource';

// empty comment
const DynamicFormInputs = (props: any) => {
  const {
    label,
    uiType,
    visible,
    required,
    displayType,
    RadioOptions,
    index,
    setShowHideFields,
    sysytemFieldName,
    isDependent,
    dependenceyControls,
    depControlIndex,
    isDependency,
    depfield,
    removeUi,
    Inputs,
    setInputs,
    recursiveDependencyControls,
    showRecursiveDep,
    fieldIndex,
    repeatFieldIndex,
    repeatDependencySectionIndex,
    repeatDepFieldIndex,
    sectionName,
    repeatFieldSection,
    defaultValue,
    isDependencyRepeatFields,
    enableRule,
    ArrayReqId,
    fields,
  } = props;

  const params = new URLSearchParams(window.location.search);
  const workflowId = params.get('workflowId');

  const { t } = useLang();
  const [selectedMedications, setSelectedMedications] = useState<any>([]);
  const location = useLocation();
  const [providerInfoValidation, setProviderInfoValidation] = useState([]);
  const inputElement = useRef<any>(0);
  const dispatch = useDispatch();
  interface LooseObject {
    [key: string]: any;
  }
  const _setState = (key?: any, value?: string | boolean) => {
    const obj: LooseObject = {};
    if (key) {
      obj[key] = value;
      obj.sectionName = props?.section?.sectionName;
    }
    props?.setFormState({
      ...props?.formState,
      ...obj,
    });
  };
  const handleChange = async (
    name: string,
    value: string,
    id: string,
    depfield?: any,
    searchID?: any,
    controlId?: any,
    index?: any,
    sectionName?: any,
    fieldIndex?: any,
    isDependency?: any,
    infectiousInputs?: boolean,
    sectionId?: any
  ) => {
    if (sectionId === 89 || sectionName.toLowerCase() === 'medical necessity') {
      return;
    }
    if (sectionName === 'Billing Information' || sectionName === 'Facility') {
      if (name === 'BillingType') {
        await loadReqSec();
      }
    }
    if (isDependency) {
      Inputs[index].dependencyControls[depControlIndex].dependecyFields[
        fieldIndex
      ].defaultValue = value;
    }
    if (!isDependency) {
      Inputs[index].fields[fieldIndex].defaultValue = value;
    }
    const obj: any = {};
    obj[name] = value;
    props?.setFormData({
      ...props?.formData,
      ...obj,
      name: name,
      id: id,
      value: value,
      [name]: value,
      depfield: depfield,
      searchID: searchID,
      preId: props?.formData?.id,
      preName: props?.formData?.name,
      controlId: controlId,
      sectionName: sectionName,
    });

    const modifiedInputsArray = await showDep(
      Inputs,
      index,
      id,
      name,
      depfield,
      searchID,
      ArrayReqId
    );
    if (!infectiousInputs) {
      if (props?.setInputs) {
        props.setInputs(modifiedInputsArray);
      }
    } else {
      let infectiousDataCopy: any;
      if (props.infectiousData) {
        infectiousDataCopy = [...props.infectiousData];
      }
      infectiousDataCopy[FindIndex(infectiousDataCopy, ArrayReqId)].sections =
        modifiedInputsArray;
      if (props?.setInfectiousData) {
        props.setInfectiousData([...infectiousDataCopy]);
      }
    }
    return modifiedInputsArray;
  };

  const handleChangeRepeatFields = async (
    name: string,
    id: string,
    depfield?: any,
    searchID?: any,
    controlId?: any,
    index?: any,
    sectionName?: any,
    fieldIndex?: any
  ) => {
    const modifiedInputsArray = await showDepRepeatFields(
      Inputs,
      index,
      id,
      name,
      fieldIndex,
      controlId
    );
    if (props?.setInputs) {
      props.setInputs(modifiedInputsArray);
    }
    if (sectionName === 'Billing Information' || sectionName === 'Facility') {
      // if (!location?.state?.reqId) {
      if (name === 'BillingType') {
        if (fieldIndex === 0) {
          await loadReqSec();
        }
      }
      // }
    }

    return modifiedInputsArray;
  };

  const handleChangeDepFieldCheckbox = async (
    id: any,
    name: any,
    searchID: any,
    infectiousInputs: any
  ) => {
    const modifiedInputsArray = await showDep(
      Inputs,
      index,
      id,
      name,
      depfield,
      searchID,
      ArrayReqId
    );
    if (!infectiousInputs) {
      if (props?.setInputs) {
        props?.setInputs(modifiedInputsArray);
      }
    } else {
      let infectiousDataCopy: any;
      if (props.infectiousData) {
        infectiousDataCopy = [...props.infectiousData];
      }
      infectiousDataCopy[FindIndex(infectiousDataCopy, ArrayReqId)].sections =
        modifiedInputsArray;
      if (props?.setInfectiousData) {
        props?.setInfectiousData([...infectiousDataCopy]);
      }
    }
    return modifiedInputsArray;
  };

  const loadReqSec = async () => {
    // if (!location?.state?.reqId) {
    window.dispatchEvent(new Event('storage'));
    const getValuesFromLocalStorage = () => {
      const facilityId = localStorage.getItem('facilityID') || '';
      const insuranceTypeId = localStorage.getItem('insurnceID') || '';
      const patientId = +(localStorage.getItem('patientID') || 0);

      return {
        facilityId,
        insuranceTypeId,
        patientId,
        pageId: 6,
        workflowId,
        requisitionId: location?.state?.reqId || 0,
        requisitionOrderId: location?.state?.orderid || 0
      };
    };

    const obj = getValuesFromLocalStorage();
    if (!obj.facilityId || !obj.insuranceTypeId) {
      setTimeout(loadReqSec, 100);
      return;
    }
    await RequisitionType?.LoadReqSectionByFacilityIDandInsuranceId(obj)
      .then((res: AxiosResponse) => {
        if (Array.isArray(res.data)) {
          res.data.forEach((requisitionNameLevel: any) => {
            requisitionNameLevel.sections.forEach((sectionsLevel: any) => {
              sectionsLevel.fields.forEach((fieldsLevel: any) => {
                fieldsLevel.singleRequsition = true;
              });
            });
          });
          props.setInfectiousData(res.data);
          props?.setInfectiousDataInputsForValidation(res?.data);
          props.setIsSelectedByDefaultCompendiumData(
            !props.IsSelectedByDefaultCompendiumData
          );
          dispatch(
            setRequisitionData({
              reqRequestData: res?.data,
            })
          );
        } else {
          props.setInfectiousData([]);
          toast.error(res.data.message);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
    // }
  };

  const inputElementDropdown = useRef(
    uiType === 'DropDown' && (visible || isDependent) ? sysytemFieldName : ''
  );

  useEffect(() => {
    if (!inputElementDropdown.current) return;
    if (
      props?.errorFocussedInput === inputElementDropdown.current ||
      props?.errorFocussedInput === inputElementDropdown.current.id
    ) {
      inputElementDropdown.current.focus();
    }
  }, [props?.errorFocussedInput]);

  function FindIndex(arr: any[], rid: any) {
    return arr.findIndex((i: any) => i.reqId === rid);
  }

  const handleServerSideDropdownOnChange = async (
    e: any,
    isAutoPopulateChangeTrigger: boolean = false,
  ) => {
    const newInputs = isAutoPopulateChangeTrigger
      ? await assignFormValues(
        Inputs,
        index,
        depControlIndex,
        e.fieldIndex,
        e.value,
        isDependency,
        repeatFieldSection,
        isDependencyRepeatFields,
        repeatFieldIndex,
        repeatDependencySectionIndex,
        repeatDepFieldIndex,
        e.label,
        props?.setInputs
      )
      : await assignFormValues(
        Inputs,
        index,
        depControlIndex,
        fieldIndex,
        e.value,
        isDependency,
        repeatFieldSection,
        isDependencyRepeatFields,
        repeatFieldIndex,
        repeatDependencySectionIndex,
        repeatDepFieldIndex,
        e.label,
        props?.setInputs
      );
    if (!location?.state?.reqId) {
      props?.setInputs(newInputs);
    }

    let newData = null;
    if (!props?.repeatInputs) {
      newData = await handleChange(
        e.name,
        e.value,
        e.id,
        depfield,
        props?.searchID,
        props?.controlId,
        props?.index,
        props?.section?.sectionName,
        isAutoPopulateChangeTrigger ? e.fieldIndex : fieldIndex,
        isDependency,
        props?.infectiousInputs
      );
    } else {
      newData = await handleChangeRepeatFields(
        e.name,
        e.id,
        depfield,
        props?.searchID,
        props?.controlId,
        props?.index,
        sectionName,
        isAutoPopulateChangeTrigger ? e.fieldIndex : fieldIndex
      );
    }
    _setState(props?.sysytemFieldName, e.value);
    initialApiLoad(newData);
  };

  const initialApiLoad = async (newData: any) => {
    if ((props?.depfield ?? props?.field)?.autoCompleteOption) {
      const parsedAutoCompleteData: any = JSON.parse(
        (props?.depfield ?? props?.field)?.autoCompleteOption
      );

      if (!parsedAutoCompleteData.DependentControls) return false;

      // payload for API call with systemFieldName comma separated
      const payload = {
        systemFieldName: parsedAutoCompleteData.DependentControls.map(
          (control: any) => control.systemFieldName
        ).join(', '),
        jsonFieldNames: '',
      };

      // Making requestBody by matching systemFieldName
      const requestBody = parsedAutoCompleteData?.RequestBody;

      if (!requestBody) return false;

      newData.map((section: any) => {
        section.fields.map((field: any) => {
          if (
            Object.prototype.hasOwnProperty.call(
              requestBody,
              field.systemFieldName
            )
          )
            requestBody[field.systemFieldName] = field.defaultValue;
        });
        section.dependencyControls.map((options: any) => {
          options.dependecyFields.map((field: any) => {
            if (
              Object.prototype.hasOwnProperty.call(
                requestBody,
                field.systemFieldName
              ) &&
              !field.displayType.includes('d-none')
            ) {
              requestBody[field.systemFieldName] = field.defaultValue;
            }
          });
        });
      });

      newData[index].fields[fieldIndex].repeatFields.forEach((field: any) => {
        if (field.systemFieldName !== 'RepeatStart') {
          // if (requestBody.hasOwnProperty(field.systemFieldName))
          //   requestBody[field.systemFieldName] = field.defaultValue;
          if (
            Object.prototype.hasOwnProperty.call(
              requestBody,
              field.systemFieldName
            )
          ) {
            requestBody[field.systemFieldName] = field.defaultValue;
          }
        }
      });

      if (parsedAutoCompleteData.Uri) {
        payload.jsonFieldNames = JSON.stringify(requestBody);

        // API call for response
        const response = await Commonservice.makeApiCallForDropDown(
          parsedAutoCompleteData.Uri,
          payload
        );

        // Function to assign options to dropdown or value to input
        const updatedData = assignOptionsToDropDown(
          response.data.responseModel,
          parsedAutoCompleteData,
          newData
        );

        if (
          updatedData[index]?.fields?.[fieldIndex]?.repeatFields?.length > 0
        ) {
          const dynamicObj: { [key: string]: any } = {};

          updatedData[index].fields[
            fieldIndex
          ].repeatFields.forEach((field: any) => {
            if (field.systemFieldName !== "RepeatStart") {
              dynamicObj[field.systemFieldName] = field.defaultValue;
            }
          });

          updatedData[index].fields[fieldIndex].defaultValue =
            JSON.stringify(dynamicObj);
        }

        props.setInputs(updatedData);
      }
    }
  };

  const assignOptionsToDropDown = (
    _options: any,
    parsedAutoCompleteData: any,
    newData: any
  ) => {
    const updatedFields = newData.map((section: any) => {
      // setting options and default values in case of non-repeating fields
      section.fields.map((field: any) => {
        parsedAutoCompleteData?.DependentControls?.map((control: any) => {
          if (field.systemFieldName === control.systemFieldName) {
            if (control.valueSetType === 'options') {
              field.options = _options;
            } else {
              field.defaultValue = _options[0]?.[field.systemFieldName];
            }
          }
        });
      });



      section?.dependencyControls.map((dependentControl: any) => {
        dependentControl?.dependecyFields?.map((field: any) => {
          parsedAutoCompleteData?.DependentControls?.map((control: any) => {
            if (field.systemFieldName === control.systemFieldName) {
              if (control.valueSetType === 'options') {
                field.options = _options;
              } else {
                field.defaultValue = _options[0]?.[field.systemFieldName];
              }
            }
          });
        });
      });

      // setting options and default values for repeat fields
      newData[index].fields[fieldIndex].repeatFields.forEach((field: any) => {
        if (field.systemFieldName !== 'RepeatStart') {
          parsedAutoCompleteData?.DependentControls?.map((control: any) => {
            if (field.systemFieldName === control.systemFieldName) {
              if (control.valueSetType === 'options') {
                field.options = _options;
              } else {
                field.defaultValue = _options[0]?.[field.systemFieldName];
              }
            }
          });
        }
      });

      return section;
    });

    return updatedFields;
  };

  useEffect(() => {
    if (sysytemFieldName === 'FacilityID' && defaultValue) {
      localStorage.setItem('facilityID', defaultValue);
    }
  }, [sysytemFieldName, defaultValue]);

  return (
    <>
      {uiType === 'DropDown' && (visible || isDependent) ? (
        <>
          <div
            className={
              props?.displayType
                ? props?.displayType
                : 'col-lg-6 col-md-6 col-sm-12 mb-4'
            }
          >
            {' '}
            <div id={sysytemFieldName} ref={inputElementDropdown} tabIndex={-1}>
              {' '}
            </div>
            <label
              className={required ? 'required mb-2 fw-500' : 'mb-2 fw-500'}
            >
              {t(label)}
            </label>
            <Select
              menuPortalTarget={document.body}
              isDisabled={props?.displayType.includes('overlay') || (props.noActiveMedication && props.sectionId === 112)}
              inputId={sysytemFieldName}
              options={
                props?.field?.systemFieldName === 'CollectorID'
                  ? RadioOptions?.length
                    ? [{ value: 'N/A', label: 'N/A' }, ...RadioOptions]
                    : [
                      { value: 'N/A', label: 'N/A' },
                      ...(props?.selectOpt || []),
                    ]
                  : RadioOptions?.length
                    ? RadioOptions
                    : props?.selectOpt || []
              }
              placeholder={t(label)}
              theme={theme => styles(theme)}
              value={setDropDownValue(
                RadioOptions?.length
                  ? [{ value: 'N/A', label: 'N/A' }, ...RadioOptions]
                  : [
                    { value: 'N/A', label: 'N/A' },
                    ...(props?.selectOpt || [{ value: 'N/A', label: 'N/A' }]),
                  ],
                defaultValue,
                location?.state?.reqId
              )}
              onChange={async (e: any) => {
                fields.enableRule = '';
                const newInputs = await assignFormValues(
                  Inputs,
                  index,
                  depControlIndex,
                  fieldIndex,
                  e.value,
                  isDependency,
                  repeatFieldSection,
                  isDependencyRepeatFields,
                  repeatFieldIndex,
                  repeatDependencySectionIndex,
                  repeatDepFieldIndex,
                  e.label,
                  props?.setInputs
                );

                if (ArrayReqId) {
                  let infectiousDataCopy: any;
                  if (props.infectiousData) {
                    infectiousDataCopy = [...props.infectiousData];
                  }
                  infectiousDataCopy[
                    FindIndex(infectiousDataCopy, ArrayReqId)
                  ].sections = newInputs;
                  if (props?.setInfectiousData) {
                    props?.setInfectiousData([...infectiousDataCopy]);
                  }
                } else {
                  props?.setInputs(newInputs);
                }

                // if (!props?.repeatInputs) {
                //   handleChange(
                //     e.name,
                //     e.value,
                //     e.id,
                //     depfield,
                //     props?.searchID,
                //     props?.controlId,
                //     props?.index,
                //     props?.section?.sectionName,
                //     fieldIndex,
                //     isDependency,
                //     props?.infectiousInputs
                //   );
                // } else {
                //   handleChangeRepeatFields(
                //     e.name,
                //     e.id,
                //     depfield,
                //     props?.searchID,
                //     props?.controlId,
                //     props?.index,
                //     sectionName,
                //     fieldIndex
                //   );
                // }
                _setState(props?.sysytemFieldName, e.value);
              }}
              isSearchable={true}
              styles={{
                control: baseStyles => ({
                  ...baseStyles,
                  borderColor: 'var(--kt-input-border-color)',
                  color: 'var(--kt-input-border-color)',
                }),
              }}
              id={label.split(' ').join('')}
            />
            {props.enableRule && (
              <div className="form__error">
                <span>{t(props.enableRule)}</span>
              </div>
            )}
          </div>
        </>
      ) : null}
      {uiType === 'MultiSelect' && (visible || isDependent) ? (
        <MultiSelectComponent
          label={label}
          index={index}
          Inputs={Inputs}
          fieldIndex={fieldIndex}
          enableRule={enableRule}
          displayType={displayType}
          defaultValue={defaultValue}
          isDependency={isDependency}
          setInputs={props.setInputs}
          depControlIndex={depControlIndex}
          repeatFieldIndex={repeatFieldIndex}
          systemFieldName={sysytemFieldName}
          repeatFieldSection={repeatFieldSection}
          repeatDepFieldIndex={repeatDepFieldIndex}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          options={RadioOptions?.length ? RadioOptions : props?.selectOpt || []}
        />
      ) : null}
      {uiType === 'Repeat' && (visible || isDependent) ? (
        <>
          <RepeatInputs
            repeatDependencyControls={props?.repeatDependencyControls}
            repeatFields={props?.repeatFields}
            repeatFieldsState={props?.repeatFieldsState}
            repeatDependencyControlsState={props?.repeatDependencyControlsState}
            index={props?.index}
            fieldIndex={props?.fieldIndex}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            formState={props?.formState}
            setFormState={props?.setFormState}
            repeatControlLength={
              Inputs[index].fields.filter(
                (item: any) => item?.uiType === 'Repeat'
              ).length
            }
            pageId={props?.pageId}
            displatClassForBtn={
              Number(fieldIndex) + 1 ===
                Number(
                  Inputs[index].fields.filter(
                    (item: any) => item?.uiType === 'Repeat'
                  ).length
                )
                ? ''
                : 'd-none'
            }
            sectionName={sectionName}
            infectiousData={props.infectiousData}
            setInfectiousData={props.setInfectiousData}
            rror={props?.field?.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            requisitionflow={props.requisitionflow}
            setIns={props.setIns}
            reqId={location?.state?.reqId}
            disableCheckbox={props.disableCheckbox}
            setDisableCheckbox={props.setDisableCheckbox}
            patientId={props.patientId}
            checkbox={props.checkbox}
            setCheckbox={props.setCheckbox}
            showButton={props.showButton}
            setShowButton={props.setShowButton}
            fields={fields}
            ArrayReqId={ArrayReqId}
            setErrorFocussedInput={props.setErrorFocussedInput}
            noActiveMedication={props.noActiveMedication}
            sectionId={props.sectionId}
            infectiousInputs={props?.infectiousInputs}
          />
        </>
      ) : null}

      {uiType === 'CheckBox' && (visible || isDependent) ? (
        <>
          <Checkbox
            spanClassName="mb-2 mr-2"
            label={props.label}
            sectionName={props?.section?.sectionName}
            parentDivClassName={displayType}
            depOptionID={props?.optionID}
            systemFieldName={sysytemFieldName}
            formState={props?.formState}
            depControlIndex={depControlIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatDepFieldIndex={repeatDepFieldIndex}
            onChange={async (e: any) => {
              const obj: any = {};
              fields.enableRule = '';
              const inputValue = e.target.value;
              obj[e.target?.name] = inputValue;
              assignFormValues(
                Inputs,
                index,
                depControlIndex,
                fieldIndex,
                e.target.checked,
                isDependency,
                repeatFieldSection,
                isDependencyRepeatFields,
                repeatFieldIndex,
                repeatDependencySectionIndex,
                repeatDepFieldIndex,
                e.target.name,
                props?.setInputs,
                location?.state?.reqId,
                props?.patientId
              );
              if (
                sysytemFieldName === 'NoKnownFamilyHistory' ||
                sysytemFieldName === 'NoPersonalHistory' ||
                sysytemFieldName === 'NoCardiopulmonaryHistory' ||
                sysytemFieldName === 'NoClinicalHistory'
              ) {
                if (e.target.checked) {
                  Inputs[index].fields.map((i: any) => {
                    if (i.systemFieldName !== sysytemFieldName) {
                      i.isEnable = true;
                      i.defaultValue = '';
                    }
                  });
                } else {
                  Inputs[index].fields.map((i: any) => {
                    if (i.systemFieldName !== sysytemFieldName) {
                      i.isEnable = false;
                    }
                  });
                }
              }
              if (sysytemFieldName === 'NoKnownFamilyHistory') {
                if (e.target.checked) {
                  props.setNoFamilyHistory(true);
                  Inputs[index].fields.map((i: any) => {
                    if (i.systemFieldName !== sysytemFieldName) {
                      i.isEnable = true;
                      i.defaultValue = '';
                    }
                  });
                } else {
                  props.setNoFamilyHistory(false);
                  Inputs[index].fields.map((i: any) => {
                    if (i.systemFieldName !== sysytemFieldName) {
                      i.isEnable = false;
                    }
                  });
                }
              }

              if (sysytemFieldName === 'NeverSymptom') {
                if (e.target.checked) {
                  Inputs[index].fields.map((i: any) => {
                    if (i.systemFieldName !== 'NeverSymptom') {
                      if (i.systemFieldName !== 'MedicationPanel') {
                        i.defaultValue = [];
                        if (i.options && i.options.length > 0) {
                          i.options.map((option: any) => ({
                            ...option,
                            isSelectedDefault: false
                          }));
                        }
                      }
                    }
                    if (i.systemFieldName === 'MedicationPanel') {
                      const obj = {
                        name: e.target.name,
                        value: e.target.checked,
                      };
                      i.defaultValue = [obj];
                    }
                  });
                } else {
                  Inputs[index].fields.map((i: any) => {
                    if (i.systemFieldName === 'MedicationPanel') {
                      i.defaultValue = [];
                    }
                  });
                }
              }
              _setState(props?.sysytemFieldName, e?.target?.checked);

            }}
            sectionId={props.sectionId}
            defaultValue={props?.defaultValue}
            Inputs={props.Inputs}
            setInputs={props.setInputs}
            infectiousData={props?.infectiousData}
            apiCallCondition={props.apiCallCondition}
            index={index}
            fieldIndex={fieldIndex}
            providerInfoValidation={providerInfoValidation}
            setProviderInfoValidation={setProviderInfoValidation}
            disablessn={props.disablessn}
            setDisableSSN={props.setDisableSSN}
            setIns={props.setIns}
            reqId={location?.state?.reqId}
            disableCheckbox={props.disableCheckbox}
            setDisableCheckbox={props.setDisableCheckbox}
            patientId={props.patientId}
            checkbox={props.checkbox}
            setCheckbox={props.setCheckbox}
            showButton={props.showButton}
            setShowButton={props.setShowButton}
            required={props.required}
            setErrorFocussedInput={props.setErrorFocussedInput}
            errorFocussedInput={props?.errorFocussedInput}
            noFamilyHistroy={props.noFamilyHistroy}
            setNoFamilyHistory={props.setNoFamilyHistory}
            isEnable={fields?.isEnable}
            checked={props.defaultValue}
            error={props?.enableRule}
            noActiveMedication={props.noActiveMedication}
            setNoActiveMedication={props.setNoActiveMedication}
            ArrayReqId={ArrayReqId}

          />
        </>
      ) : null}

      {uiType === 'DynamicCopyCheckbox' && (visible || isDependent) ? (
        <>
          <CopyCheckBox
            label={props.label}
            parentDivClassName={displayType}
            value=""
            onChange={async (e: any) => {
              const obj: any = {};
              const inputValue = e.target.value;
              obj[e.target?.name] = inputValue;
              assignFormValues(
                Inputs,
                index,
                depControlIndex,
                fieldIndex,
                e.target.checked,
                isDependency,
                repeatFieldSection,
                isDependencyRepeatFields,
                repeatFieldIndex,
                repeatDependencySectionIndex,
                repeatDepFieldIndex,
                e.target.name,
                props?.setInputs,
                location?.state?.reqId,
                props?.patientId
              );
              _setState(props?.sysytemFieldName, e?.target?.checked);
            }}
            defaultValue={props?.defaultValue}
            required={props.required}
          />
        </>
      ) : null}

      {uiType === 'Switch' && (visible || isDependent) ? (
        <>
          <Switch
            spanClassName="mb-2 mr-2"
            label={props.label}
            sectionName={props?.section?.sectionName}
            parentDivClassName={displayType}
            depOptionID={props?.optionID}
            onChange={(e: any) => {
              const obj: any = {};
              fields.enableRule = '';
              const inputValue = e.target.value;
              obj[e.target?.name] = inputValue;
              props?.setFormData({
                ...props?.formData,
                ...obj,
                sectionName: props?.section?.sectionName,
              });
              assignFormValues(
                Inputs,
                index,
                depControlIndex,
                fieldIndex,
                e.target.checked,
                isDependency,
                repeatFieldSection,
                isDependencyRepeatFields,
                repeatFieldIndex,
                repeatDependencySectionIndex,
                repeatDepFieldIndex,
                e.target.name,
                props?.setInputs
              );

              _setState(props?.sysytemFieldName, e.target.checked);
            }}
            sectionId={props.sectionId}
            defaultValue={props.defaultValue}
            Inputs={props.Inputs}
            visible={props.field.visible}
            RequisitionName={props.rname}
            required={props.required}
          />
        </>
      ) : null}
      {uiType === 'RawText' && (visible || isDependent) ? (
        <>
          <RawText
            spanClassName="mb-2 mr-2"
            label={props.label}
            sectionName={props?.section?.sectionName}
            parentDivClassName={displayType}
            depOptionID={props?.optionID}
            sectionId={props.sectionId}
            required={props.required}
            sysytemFieldName={sysytemFieldName}
            displayFieldName={label}
            Inputs={props.Inputs}
            index={props.index}
            props={props}
            linkUrl={props?.field?.fieldConfiguration}
          />
        </>
      ) : null}
      {uiType === 'TestingOptionCheckboxes' && (visible || isDependent) ? (
        <>
          <ToxTestingOptionCheckbox
            spanClassName="mb-2 mr-2"
            parentDivClassName={displayType}
            Inputs={props.Inputs}
            index={props.index}
            dependenceyControls={dependenceyControls}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            setInputs={props.setInputs}
            infectiousData={props.infectiousData}
            setInfectiousData={props.setInfectiousData}
            ArrayReqId={props.ArrayReqId}
            screening={props.screening}
          />
        </>
      ) : null}
      {uiType === 'CheckboxBlock' && (visible || isDependent) ? (
        <>
          <Checkbox
            spanClassName="mb-2 mr-2"
            label={props.label}
            onChange={(e: any) => {
              fields.enableRule = '';
              const inputValue = e.target.checked;
              props?.setFormData((preVal: any) => {
                return {
                  ...preVal,
                  [e.target?.name]: inputValue,
                  sectionName: props?.section?.sectionName,
                };
              });
              assignFormValues(
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
                undefined,
                props?.setInputs
              );

              assignFormValuesForMedicalNecessity(
                Inputs,
                index,
                fieldIndex,
                inputValue,
                isDependency,
                undefined
              );

              props.setIsShown(!props.isShown);
            }}
            checked={props.defaultValue}
            parentDivClassName={displayType}
            depOptionID={props?.optionID}
            disabled={props.disabled}
            required={props.required}
            apiCallCondition={props.apiCallCondition}
            sectionId={props.sectionId}
          />
        </>
      ) : null}
      {uiType === 'CheckBoxList' &&
        props.sectionId !== 20 &&
        (visible || isDependent) ? (
        <>
          <CheckBoxList
            parentDivClassName={displayType}
            RadioOptions={RadioOptions}
            sysytemFieldName={sysytemFieldName}
            displayFieldName={label}
            defaultValue={setJSONDataFormat(props.field.defaultValue)}
            Inputs={props.Inputs}
            index={props.index}
            props={props}
            ArrayReqId={ArrayReqId}
            handleChangeDepFieldCheckbox={handleChangeDepFieldCheckbox}
            infectiousInputs={props.infectiousInputs}
            searchID={props.searchID}
            onChange={(e: any, value: string, label: string, id: any) => {
              if (fields) fields.enableRule = '';
              const checked = e.target.checked;
              const obj = {
                value: value,
                label: label,
                id: id,
              };
              let inputValue: any = [];
              if (checked) {
                if (value === 'NoAllergies') {
                  inputValue = [obj];
                } else {
                  const result = isJson(props.field.defaultValue);
                  let defaultValue = props.field.defaultValue;
                  if (result) {
                    defaultValue = JSON.parse(defaultValue);
                  }
                  inputValue = [obj, ...defaultValue];
                }
                const newInputs = assignFormValues(
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
                  undefined,
                  props?.setInputs,
                  props.patientId
                );
                newInputs.then(res => {
                  const infectiousDataCopy = JSON.parse(
                    JSON.stringify(props?.infectiousData)
                  );
                  infectiousDataCopy[
                    FindIndex(props?.infectiousData, ArrayReqId)
                  ].sections = res;
                  if (props?.setInfectiousData) {
                    props?.setInfectiousData([...infectiousDataCopy]);
                  }
                });
              }
              if (!checked) {
                const result = isJson(props.field.defaultValue);
                let defaultValue = props.field.defaultValue;
                if (result) {
                  defaultValue = JSON.parse(defaultValue);
                }
                inputValue =
                  Array.isArray(defaultValue) &&
                  defaultValue?.filter(
                    (drugAllergiesInfo: any) =>
                      drugAllergiesInfo?.value !== value
                  );
                const newInputs = assignFormValues(
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
                  undefined,
                  props?.setInputs,
                  props.patientId
                );
                newInputs.then(res => {
                  const infectiousDataCopy = JSON.parse(
                    JSON.stringify(props?.infectiousData)
                  );
                  infectiousDataCopy[
                    FindIndex(props?.infectiousData, ArrayReqId)
                  ].sections = res;
                  if (props?.setInfectiousData) {
                    props?.setInfectiousData([...infectiousDataCopy]);
                  }
                });
              }
              const systemFieldMap = Inputs[index]?.fields.reduce(
                (acc: Record<string, boolean>, field: any) => {
                  if (field.visible) {
                    acc[field.systemFieldName] = true;
                  }
                  return acc;
                },
                {}
              );

              if (systemFieldMap["MedicationPanel"]) {
                const valueMap = Inputs[index]?.fields.reduce(
                  (acc: Record<string, any>, field: any) => {
                    if (field.systemFieldName !== "MedicationPanel") {
                      acc[field.systemFieldName] = field.defaultValue;
                    }
                    return acc;
                  },
                  {}
                );

                const isEmptyValue = (value: any) => {
                  if (value === null || value === undefined) return true;
                  if (typeof value === "string") return value.trim() === "";
                  if (Array.isArray(value)) return value.length === 0;
                  if (typeof value === "object") return Object.keys(value).length === 0;
                  return false;
                };

                const allFieldsEmpty = Object.values(valueMap).every(isEmptyValue);

                Inputs[index].fields.forEach((field: any) => {
                  if (field.systemFieldName === "MedicationPanel") {
                    field.defaultValue = allFieldsEmpty
                      ? []
                      : Object.values(valueMap).filter(v => !isEmptyValue(v));
                  }
                });
              }
              const newInputs = assignFormValues(
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
                undefined,
                props?.setInputs,
                props.patientId
              );
              newInputs.then(res => {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = res;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                }
              });
              // handleChangeDepFieldCheckbox(
              //   e.target.id,
              //   e.target.name,
              //   props.searchID,
              //   props?.infectiousInputs
              // );
            }}
            error={props?.field?.enableRule}
            sectionName={props?.sectionName}
            defaultValueWithoutParse={props.field.defaultValue}
            dependenceyControls={dependenceyControls}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            setInputs={props?.setInputs}
            infectiousData={props?.infectiousData}
            apiCallCondition={props.apiCallCondition}
            sectionId={props.sectionId}
            patientId={props.patientId}
            setErrorFocussedInput={props.setErrorFocussedInput}
            errorFocussedInput={props?.errorFocussedInput}
            isEnable={fields?.isEnable}
            required={required}
          />
        </>
      ) : null}

      {uiType === 'italicizeCheckboxList' &&
        (visible || isDependent) ? (
        <>
          <ItalicizeCheckboxList
            parentDivClassName={displayType}
            RadioOptions={RadioOptions}
            sysytemFieldName={sysytemFieldName}
            displayFieldName={label}
            defaultValue={setJSONDataFormat(props.field.defaultValue)}
            Inputs={props.Inputs}
            index={props.index}
            props={props}
            ArrayReqId={ArrayReqId}
            handleChangeDepFieldCheckbox={handleChangeDepFieldCheckbox}
            infectiousInputs={props.infectiousInputs}
            searchID={props.searchID}
            onChange={(e: any, value: string, label: string, id: any) => {
              fields.enableRule = '';
              const checked = e.target.checked;
              const obj = {
                value: value,
                label: label,
                id: id,
              };
              let inputValue: any = [];
              if (checked) {
                if (value === 'NoAllergies') {
                  inputValue = [obj];
                } else {
                  const result = isJson(props.field.defaultValue);
                  let defaultValue = props.field.defaultValue;
                  if (result) {
                    defaultValue = JSON.parse(defaultValue);
                  }
                  inputValue = [obj, ...defaultValue];
                }
              }
              if (!checked) {
                const result = isJson(props.field.defaultValue);
                let defaultValue = props.field.defaultValue;
                if (result) {
                  defaultValue = JSON.parse(defaultValue);
                }
                inputValue =
                  Array.isArray(defaultValue) &&
                  defaultValue?.filter(
                    (drugAllergiesInfo: any) =>
                      drugAllergiesInfo?.value !== value
                  );
              }
              const newInputs = assignFormValues(
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
                undefined,
                props?.setInputs,
                props.patientId
              );
              newInputs.then(res => {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = res;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                }
              });
              handleChangeDepFieldCheckbox(
                e.target.id,
                e.target.name,
                props.searchID,
                props?.infectiousInputs
              );
            }}
            error={props?.field?.enableRule}
            sectionName={props?.sectionName}
            defaultValueWithoutParse={props.field.defaultValue}
            dependenceyControls={dependenceyControls}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            setInputs={props?.setInputs}
            infectiousData={props?.infectiousData}
            apiCallCondition={props.apiCallCondition}
            sectionId={props.sectionId}
            patientId={props.patientId}
            setErrorFocussedInput={props.setErrorFocussedInput}
            errorFocussedInput={props?.errorFocussedInput}
            isEnable={fields?.isEnable}
            required={required}
          />
        </>
      ) : null}
      {uiType === 'ValidationPanel' && (visible || isDependent) ? (
        <>
          <ValidationPanel
            error={props?.field?.enableRule}
            spanClassName="mb-2 mr-2"
            label={props.label}
            sectionName={props?.section?.sectionName}
            parentDivClassName={displayType}
            depOptionID={props?.optionID}
            systemFieldName={sysytemFieldName}
            formState={props?.formState}
            depControlIndex={depControlIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatDepFieldIndex={repeatDepFieldIndex}
            sectionId={props.sectionId}
            defaultValue={props?.defaultValue}
            Inputs={props.Inputs}
            setInputs={props.setInputs}
            infectiousData={props?.infectiousData}
            index={index}
            fieldIndex={fieldIndex}
            disablessn={props.disablessn}
            setDisableSSN={props.setDisableSSN}
            setIns={props.setIns}
            reqId={location?.state?.reqId}
            disableCheckbox={props.disableCheckbox}
            setDisableCheckbox={props.setDisableCheckbox}
            patientId={props.patientId}
            required={props.required}
            setErrorFocussedInput={props.setErrorFocussedInput}
            errorFocussedInput={props?.errorFocussedInput}
            ArrayReqId={props?.ArrayReqId}
            setInfectiousData={props?.setInfectiousData}

          />
        </>
      ) : null}
      {(uiType === 'AutoComplete' || uiType === 'CheckBoxList') &&
        props?.sectionId === 20 &&
        (visible || isDependent) ? (
        <ActiveMedicationListCheckbox
          parentDivClassName={displayType}
          options={props.field.medicationList}
          sysytemFieldName={sysytemFieldName}
          displayFieldName={label}
          defaultValue={setJSONDataFormat(props.field.defaultValue)}
          Inputs={props.Inputs}
          index={props.index}
          onChange={(e: any, value: string, label: string) => {
            fields.enableRule = '';
            const checked = e;
            const obj = {
              value: value,
              label: label,
            };
            let inputValue: any = [];
            if (checked) {
              const result = isJson(props.field.defaultValue);
              let defaultValue = props.field.defaultValue;
              if (result) {
                defaultValue = JSON.parse(defaultValue);
              }
              inputValue = [obj, ...defaultValue];
            }
            if (!checked) {
              const result = isJson(props.field.defaultValue);
              let defaultValue = props.field.defaultValue;
              if (result) {
                defaultValue = JSON.parse(defaultValue);
              }
              inputValue = defaultValue.filter(
                (drugAllergiesInfo: any) => drugAllergiesInfo.value !== value
              );
            }
            assignFormValues(
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
              undefined,
              props?.setInputs
            );
          }}
          error={props?.field?.enableRule}
          sectionName={props?.sectionName}
          defaultValueWithoutParse={props.field.defaultValue}
          dependenceyControls={dependenceyControls}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          setInputs={props?.setInputs}
          selectedMedications={selectedMedications}
          setSelectedMedications={setSelectedMedications}
          ArrayReqId={props?.ArrayReqId}
          infectiousData={props?.infectiousData}
          setInfectiousData={props.setInfectiousData}
          noActiveMedication={props.noActiveMedication}
          setNoActiveMedication={props.setNoActiveMedication}
        />
      ) : null}
      {uiType === 'MedicationAutoComplete' &&
        (visible || isDependent) ? (
        <PrescribedOtherMedication
          parentDivClassName={displayType}
          options={props.field.medicationList}
          sysytemFieldName={sysytemFieldName}
          displayFieldName={label}
          defaultValue={setJSONDataFormat(props.field.defaultValue)}
          Inputs={props.Inputs}
          index={props.index}
          onChange={(e: any, value: string, label: string) => {
            fields.enableRule = '';
            const checked = e;
            const obj = {
              value: value,
              label: label,
            };
            let inputValue: any = [];
            if (checked) {
              const result = isJson(props.field.defaultValue);
              let defaultValue = props.field.defaultValue;
              if (result) {
                defaultValue = JSON.parse(defaultValue);
              }
              inputValue = [obj, ...defaultValue];
            }
            if (!checked) {
              const result = isJson(props.field.defaultValue);
              let defaultValue = props.field.defaultValue;
              if (result) {
                defaultValue = JSON.parse(defaultValue);
              }
              inputValue = defaultValue.filter(
                (drugAllergiesInfo: any) => drugAllergiesInfo.value !== value
              );
            }
            assignFormValues(
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
              undefined,
              props?.setInputs
            );
          }}
          error={props?.field?.enableRule}
          sectionName={props?.sectionName}
          defaultValueWithoutParse={props.field.defaultValue}
          dependenceyControls={dependenceyControls}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          setInputs={props?.setInputs}
          selectedMedications={selectedMedications}
          setSelectedMedications={setSelectedMedications}
          ArrayReqId={props?.ArrayReqId}
          infectiousData={props?.infectiousData}
          setInfectiousData={props.setInfectiousData}
          noActiveMedication={props.noActiveMedication}
          setNoActiveMedication={props.setNoActiveMedication}
        />
      ) : null}


      {uiType === 'DynamicAutoComplete' && (visible || isDependent) ? (
        <>
          <DynamicAutoComplete
            error={props?.enableRule}
            data={props?.field}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            defaultValue={props?.defaultValue}
            infectiousData={props?.infectiousData}
            setInfectiousData={props?.setInfectiousData}
            ArrayReqId={props?.ArrayReqId}
            fields={fields}
          />
        </>
      ) : null}
      {uiType === 'AutoComplete' &&
        props?.sectionId !== 20 &&
        (visible || isDependent) ? (
        <>
          <AutoComplete
            setValues={setPatientValues}
            loadReqSec={loadReqSec}
            parentDivClassName={displayType}
            placeholder={`${props.label}`}
            label={props.label}
            required={required}
            sysytemFieldName={sysytemFieldName}
            error={props?.enableRule}
            apiCall="Patient"
            facilityIdForSearch={
              props?.Requisition?.ReqReducer?.ReqObjData?.facilityId
            }
            setInputs={props.setInputs}
            defaultValue={props.defaultValue}
            Inputs={Inputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            errorFocussedInput={props?.errorFocussedInput}
            setDisableCheckbox={props.setDisableCheckbox}
            checkbox={props.checkbox}
            setCheckbox={props.setCheckbox}
            setIns={props.setIns}
            showButton={props.showButton}
            setShowButton={props.setShowButton}
            setDisableSSN={props.setDisableSSN}
            fields={fields}
            setErrorFocussedInput={props.setErrorFocussedInput}
          />
        </>
      ) : null}

      {/* ------------------ */}

      {uiType === 'Date' && (visible || isDependent) ? (
        <>
          <DatePicker
            label={props.label}
            parentDivClassName={displayType}
            required={props.required}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            defaultValue={props.defaultValue}
            errorFocussedInput={props?.errorFocussedInput}
            name={sysytemFieldName}
            field={props.field}
            infectiousData={props?.infectiousData}
            setInfectiousData={props?.setInfectiousData}
            ArrayReqId={props?.ArrayReqId}
            fields={fields}
            setErrorFocussedInput={props.setErrorFocussedInput}
            fieldConfiguration={parseInt(props?.field?.fieldConfiguration)}
          />
        </>
      ) : null}
      {uiType === 'Time' && (visible || isDependent) ? (
        <>
          <TimeInput
            parentDivClassName={displayType}
            type={uiType.toLowerCase()}
            label={props.label}
            required={required}
            name={sysytemFieldName}
            mask={props.mask}
            length={props?.length ?? ''}
            error={props?.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            onChange={async (e: any) => {
              fields.enableRule = '';
              const currentValue = e.target.value;
              _setState(props?.sysytemFieldName, currentValue);
              const newInputs = await assignFormValues(
                Inputs,
                index,
                depControlIndex,
                fieldIndex,
                currentValue,
                isDependency,
                repeatFieldSection,
                isDependencyRepeatFields,
                repeatFieldIndex,
                repeatDependencySectionIndex,
                repeatDepFieldIndex,
                undefined,
                props?.setInputs
              );
              if (!ArrayReqId) {
                props?.setInputs(newInputs);
              }
              if (ArrayReqId) {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = newInputs;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                } // Update infectious data
              }
            }}
            value={props.defaultValue}
            sectionId={props.sectionId}
            setErrorFocussedInput={props.setErrorFocussedInput}
          />
        </>
      ) : null}
      {uiType === 'CurrentDate' && (visible || isDependent) ? (
        <>
          <CurrentDate
            label={props.label}
            parentDivClassName={displayType}
            required={props.required}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            defaultValue={props.defaultValue}
            errorFocussedInput={props?.errorFocussedInput}
            name={sysytemFieldName}
            field={props.field}
            infectiousData={props?.infectiousData}
            setInfectiousData={props?.setInfectiousData}
            ArrayReqId={props?.ArrayReqId}
            fields={fields}
            setErrorFocussedInput={props.setErrorFocussedInput}
            fieldConfiguration={parseInt(props?.field?.fieldConfiguration)}
            onValidityChange={props.onDateValidityChange}
          />
        </>
      ) : null}
      {uiType === 'CurrentTime' && (visible || isDependent) ? (
        <>
          <CurrentTime
            parentDivClassName={displayType}
            type={uiType.toLowerCase()}
            label={props.label}
            required={required}
            name={sysytemFieldName}
            mask={props.mask}
            length={props?.length ?? ''}
            error={props?.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            onChange={async (e: any) => {
              fields.enableRule = '';
              const currentValue = e.target.value;
              _setState(props?.sysytemFieldName, currentValue);
              const newInputs = await assignFormValues(
                Inputs,
                index,
                depControlIndex,
                fieldIndex,
                currentValue,
                isDependency,
                repeatFieldSection,
                isDependencyRepeatFields,
                repeatFieldIndex,
                repeatDependencySectionIndex,
                repeatDepFieldIndex,
                undefined,
                props?.setInputs
              );
              if (!ArrayReqId) {
                props?.setInputs(newInputs);
              }
              if (ArrayReqId) {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = newInputs;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                }
              }
            }}
            value={props.defaultValue}
            sectionId={props.sectionId}
            setErrorFocussedInput={props.setErrorFocussedInput}
          />
        </>
      ) : null}
      {uiType === 'TextArea' && (visible || isDependent) ? (
        <TextArea
          parentDivClassName={displayType}
          label={props.label}
          required={required}
          name={sysytemFieldName}
          length={props?.length ?? ''}
          error={props?.enableRule}
          errorFocussedInput={props?.errorFocussedInput}
          id={props.sectionId}
          onChange={async (e: any) => {
            fields.enableRule = '';
            if (uiType === 'Integer' && e.target.value < 0) {
              return;
            }
            const inputValue = e.target.value;
            const newInputs = await assignFormValues(
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
              undefined,
              props?.setInputs
            );
            if (!ArrayReqId) {
              props?.setInputs(newInputs);
            }
            if (ArrayReqId) {
              const infectiousDataCopy = JSON.parse(
                JSON.stringify(props?.infectiousData)
              );
              infectiousDataCopy[
                FindIndex(props?.infectiousData, ArrayReqId)
              ].sections = newInputs;
              if (props?.setInfectiousData) {
                props?.setInfectiousData([...infectiousDataCopy]);
              } // Update infectious data
            }
            _setState(props?.sysytemFieldName, e.target.value);
          }}
          value={
            uiType === 'Date'
              ? moment(props.defaultValue, 'MM/DD/YYYY').format('YYYY-MM-DD')
              : props.defaultValue
          }
          setErrorFocussedInput={props.setErrorFocussedInput}
        />
      ) : null}
      {uiType === 'AlphaticField' && (visible || isDependent) ? (
        <AlphabaticField
          parentDivClassName={displayType}
          type={uiType === 'Integer' ? 'number' : uiType.toLowerCase()}
          label={props.label}
          required={required}
          name={sysytemFieldName}
          mask={props.mask}
          length={props?.length ?? ''}
          error={props?.enableRule}
          errorFocussedInput={props?.errorFocussedInput}
          onChange={async (e: any) => {
            let inputValue = e.target.value;
            if (uiType === 'Integer' && inputValue < 0) {
              return;
            }
            if (props?.length === 4) {
              inputValue = inputValue.replace(/[^0-9]/g, '');
            }
            const newInputs = await assignFormValues(
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
              undefined,
              props?.setInputs,
              location?.state?.reqId,
              props?.patientId
            );
            if (!ArrayReqId) {
              props?.setInputs(newInputs);
            }
            if (ArrayReqId) {
              const infectiousDataCopy = JSON.parse(
                JSON.stringify(props?.infectiousData)
              );
              infectiousDataCopy[
                FindIndex(props?.infectiousData, ArrayReqId)
              ].sections = newInputs;
              if (props?.setInfectiousData) {
                props?.setInfectiousData([...infectiousDataCopy]);
              } // Update infectious data
            }
            _setState(sysytemFieldName, inputValue);
            if (fields)
              fields.enableRule = '';
          }}
          value={
            uiType === 'Date'
              ? moment(props.defaultValue, 'MM/DD/YYYY').format('YYYY-MM-DD')
              : props.defaultValue
          }
          sectionId={props?.sectionId}
          ArrayReqId={ArrayReqId}
          disablessn={props.disablessn}
          setDisableSSN={props.setDisableSSN}
          placeholder={props.label}
          setErrorFocussedInput={props.setErrorFocussedInput}
          isEnable={fields?.isEnable}
          noActiveMedication={props?.noActiveMedication}
          Inputs={Inputs}
          index={index}
          spanClassName="mb-2 mr-2"
          sectionName={props?.sectionName}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          setInputs={setInputs}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          depControlIndex={depControlIndex}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          SignPadValue={props.SignPadValue}
          setSignPadValue={props.setSignPadValue}
          setSignPadVal={props.setSignPadVal}
        />
      ) : null}
      {(uiType === 'Email' ||
        uiType === 'TextBox' ||
        uiType === 'Integer' ||
        uiType === 'Password') &&
        (visible || isDependent) ? (
        <>
          <Input
            parentDivClassName={displayType}
            type={uiType === 'Integer' ? 'number' : uiType.toLowerCase()}
            label={props.label}
            required={required}
            name={sysytemFieldName}
            mask={props.mask}
            length={props?.length ?? ''}
            error={props?.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            onChange={async (e: any) => {
              let inputValue = e.target.value;
              if (uiType === 'Integer' && inputValue < 0) {
                return;
              }
              if (props?.length === 4) {
                inputValue = inputValue.replace(/[^0-9]/g, '');
              }

              if (e?.target.name === 'Weight') {
                inputValue = inputValue.replace(/_/g, '');
              }
              //if (sysytemFieldName === "ZipCode" && /^\d{5}$/.test(inputValue)) {
              // getCityState(inputValue, (result: any) => {
              //   const updatedInputs = props.Inputs.map((input: any, idx: number) => {
              //     if (idx !== props.index) return input;
              //     return {
              //       ...input,
              //       fields: input.fields.map((f: any) => {
              //         const fieldName = f.systemFieldName?.toLowerCase();
              //         if (fieldName === "city") return { ...f, defaultValue: result?.city };
              //         if (fieldName === "state") return { ...f, defaultValue: result?.stateAbbr };
              //         return f;
              //       })
              //     };
              //   });

              //   props.setInputs(updatedInputs);
              // });
              // }

              const newInputs = await assignFormValues(
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
                undefined,
                props?.setInputs,
                location?.state?.reqId,
                props?.patientId
              );
              if (!ArrayReqId) {
                props?.setInputs(newInputs);
              }
              if (ArrayReqId) {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = newInputs;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                } // Update infectious data
              }
              _setState(sysytemFieldName, inputValue);
              if (fields)
                fields.enableRule = '';
            }}
            value={
              uiType === 'Date'
                ? moment(props.defaultValue, 'MM/DD/YYYY').format('YYYY-MM-DD')
                : props.defaultValue
            }
            sectionId={props?.sectionId}
            ArrayReqId={ArrayReqId}
            disablessn={props.disablessn}
            setDisableSSN={props.setDisableSSN}
            placeholder={props.label}
            setErrorFocussedInput={props.setErrorFocussedInput}
            isEnable={fields?.isEnable}
            noActiveMedication={props?.noActiveMedication}
          />
        </>
      ) : null}
      {uiType === 'AutoZipCode' && (visible || isDependent) ? (
        <>
          <Input
            parentDivClassName={displayType}
            type={uiType === 'Integer' ? 'number' : uiType.toLowerCase()}
            label={props.label}
            required={required}
            name={sysytemFieldName}
            mask={props.mask}
            length={props?.length ?? ''}
            error={props?.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            onChange={async (e: any) => {
              let inputValue = e.target.value;
              if (uiType === 'Integer' && inputValue < 0) {
                return;
              }
              if (props?.length === 4) {
                inputValue = inputValue.replace(/[^0-9]/g, '');
              }

              if (e?.target.name === 'Weight') {
                inputValue = inputValue.replace(/_/g, '');
              }
              if (
                sysytemFieldName === 'ZipCode' &&
                /^\d{5}$/.test(inputValue)
              ) {
                getCityState(inputValue, (result: any) => {
                  const updatedInputs = props.Inputs.map(
                    (input: any, idx: number) => {
                      if (idx !== props.index) return input;
                      return {
                        ...input,
                        fields: input.fields.map((f: any) => {
                          const fieldName = f.systemFieldName?.toLowerCase();
                          if (fieldName === 'city')
                            return { ...f, defaultValue: result?.city };
                          if (fieldName === 'state')
                            return { ...f, defaultValue: result?.stateAbbr };
                          if (fieldName === 'latitude')
                            return { ...f, defaultValue: result?.latitude };
                          if (fieldName === 'longitude')
                            return { ...f, defaultValue: result?.longitude };
                          return f;
                        }),
                      };
                    }
                  );

                  props.setInputs(updatedInputs);
                });
              }

              const newInputs = await assignFormValues(
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
                undefined,
                props?.setInputs,
                location?.state?.reqId,
                props?.patientId
              );
              if (!ArrayReqId) {
                props?.setInputs(newInputs);
              }
              if (ArrayReqId) {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = newInputs;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                } // Update infectious data
              }
              _setState(sysytemFieldName, inputValue);
              if (fields)
                fields.enableRule = '';
            }}
            value={
              uiType === 'Date'
                ? moment(props.defaultValue, 'MM/DD/YYYY').format('YYYY-MM-DD')
                : props.defaultValue
            }
            sectionId={props.sectionId}
            ArrayReqId={ArrayReqId}
            disablessn={props.disablessn}
            setDisableSSN={props.setDisableSSN}
            placeholder={props.label}
            setErrorFocussedInput={props.setErrorFocussedInput}
            isEnable={fields?.isEnable}
            noActiveMedication={props.noActiveMedication}
          />
        </>
      ) : null}
      {uiType === 'AutoCompleteAddress' && (visible || isDependent) ? (
        <>
          <AutoAddress
            parentDivClassName={displayType}
            type={uiType === 'Integer' ? 'number' : uiType.toLowerCase()}
            label={props.label}
            required={required}
            name={sysytemFieldName}
            mask={props.mask}
            length={props?.length ?? ''}
            error={props?.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            onChange={async (value: any) => {
              const inputValue = value;
              const newInputs = await assignFormValues(
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
                undefined,
                props?.setInputs,
                location?.state?.reqId,
                props?.patientId
              );
              if (!ArrayReqId) {
                props?.setInputs(newInputs);
              }
              if (ArrayReqId) {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = newInputs;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                } // Update infectious data
              }
              _setState(sysytemFieldName, inputValue);
              if (fields)
                fields.enableRule = '';
            }}
            value={props.defaultValue}
            sectionId={props.sectionId}
            ArrayReqId={ArrayReqId}
            disablessn={props.disablessn}
            setDisableSSN={props.setDisableSSN}
            placeholder={props.label}
            setErrorFocussedInput={props.setErrorFocussedInput}
            isEnable={fields?.isEnable}
            Inputs={Inputs}
            index={index}
          />
        </>
      ) : null}
      {uiType === 'SSNNumberWithCheckbox' && (visible || isDependent) ? (
        <>
          <SSNNumberWithText
            parentDivClassName={displayType}
            type={uiType === 'Integer' ? 'number' : uiType.toLowerCase()}
            label={props.label}
            required={required}
            index={index}
            fieldIndex={fieldIndex}
            name={sysytemFieldName}
            mask={props.mask}
            length={props?.length ?? ''}
            error={props?.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            onChange={async (e: any) => {
              fields.enableRule = '';
              const inputValue = e.target.value;
              _setState(sysytemFieldName, inputValue);
              const newInputs = await assignFormValues(
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
                undefined,
                props?.setInputs,
                location?.state?.reqId,
                props?.patientId
              );

              if (!ArrayReqId) {
                props?.setInputs(newInputs);
              }
              if (ArrayReqId) {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = newInputs;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                } // Update infectious data
              }
            }}
            value={
              uiType === 'Date'
                ? moment(props.defaultValue, 'MM/DD/YYYY').format('YYYY-MM-DD')
                : props.defaultValue
            }
            sectionId={props.sectionId}
            ArrayReqId={ArrayReqId}
            disablessn={props.disablessn}
            setDisableSSN={props.setDisableSSN}
            placeholder={props.label}
            Inputs={Inputs}
            setErrorFocussedInput={props.setErrorFocussedInput}
          />
        </>
      ) : null}
      {uiType === 'MaskedInput' && (visible || isDependent) ? (
        <>
          <MaskedInput
            parentDivClassName={displayType}
            type={uiType === 'Integer' ? 'number' : uiType.toLowerCase()}
            label={props.label}
            placeholder={props.label}
            required={required}
            name={sysytemFieldName}
            mask={props.mask}
            length={props?.length ?? ''}
            error={props?.enableRule}
            errorFocussedInput={props?.errorFocussedInput}
            onChange={async (e: any) => {
              fields.enableRule = '';
              let inputValue = e.target.value;
              if (uiType === 'Integer' && inputValue < 0) {
                return;
              }

              if (props?.length === 4) {
                inputValue = inputValue.replace(/[^0-9]/g, '');
              }
              _setState(sysytemFieldName, inputValue);
              const newInputs = await assignFormValues(
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
                undefined,
                props?.setInputs,
                location?.state?.reqId,
                props?.patientId
              );

              if (!ArrayReqId) {
                props?.setInputs(newInputs);
              }
              if (ArrayReqId) {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = newInputs;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                } // Update infectious data
              }
            }}
            value={
              uiType === 'Date'
                ? moment(props.defaultValue, 'MM/DD/YYYY').format('YYYY-MM-DD')
                : props.defaultValue
            }
            sectionId={props.sectionId}
            ArrayReqId={ArrayReqId}
            disablessn={props.disablessn}
            setDisableSSN={props.setDisableSSN}
            setErrorFocussedInput={props.setErrorFocussedInput}
          />
        </>
      ) : null}

      {uiType === 'GenericPhoneNumber' && (visible || isDependent) ? (
        <>
          <GenericPhoneNumberInput
            parentDivClassName={displayType}
            label={props.label}
            required={required}
            name={sysytemFieldName}
            error={props?.enableRule}
            onChange={async (e: any) => {
              fields.enableRule = '';
              const inputValue = e;
              _setState(sysytemFieldName, inputValue);
              const newInputs = await assignFormValues(
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
                undefined,
                props?.setInputs
              );

              // Handle updates based on the conditions provided
              if (!location?.state?.reqId && !ArrayReqId) {
                props?.setInputs(newInputs); // Update inputs
              }
              if (!location?.state?.reqId && ArrayReqId) {
                const infectiousDataCopy = JSON.parse(
                  JSON.stringify(props?.infectiousData)
                );
                infectiousDataCopy[
                  FindIndex(props?.infectiousData, ArrayReqId)
                ].sections = newInputs;
                if (props?.setInfectiousData) {
                  props?.setInfectiousData([...infectiousDataCopy]);
                }
              }
            }}
            value={props.defaultValue}
          />
        </>
      ) : null}
      {uiType === 'Label' && (visible || isDependent) && (
        <>
          {props.sectionId === 21 ? (
            <>
              <div className={`mb-5 ${displayType}`}>
                <h6 className="px-4 py-4 bg-light-warning text-dark fw-400 w-100 rounded-2">
                  {' '}
                  {t(props.label)}:
                </h6>
              </div>
            </>
          ) : (
            <div className={`mb-5 ${displayType}`}>
              <div className="d-flex justify-content-start align-items-center">
                <h6 className="text-primary"> {t(props.label)}:</h6>
                <h6 className="text-muted p-2 fw-500">
                  {t(props.defaultValue)}
                </h6>
              </div>
            </div>
          )}
        </>
      )}

      {uiType === 'HeaderNonSelectablePanel' && (visible || isDependent) ? (
        <PanelsCheckBox
          panels={props?.panels}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          setInputs={props?.setInputs}
          displayType={displayType}
          sectionName={sectionName}
          sectionDisplayType={props?.sectionDisplayType}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          error={props?.enableRule}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props.ArrayReqId}
          sectionId={props.sectionId}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
        />
      ) : null}
      {uiType === 'SpecimenSourceControl' && (visible || isDependent) ? (
        <PanelsCheckboxSpecimenSource
          panels={props?.specimenSources}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          setInputs={props?.setInputs}
          displayType={displayType}
          sectionName={sectionName}
          sectionDisplayType={props?.sectionDisplayType}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          error={props?.enableRule}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          inputValueForSpecimen={props.inputValueForSpecimen}
          setInputValueForSpecimen={props.setInputValueForSpecimen}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
        />
      ) : null}
      {uiType === 'SingleSpecimenSourceControl' && (visible || isDependent) ? (
        <PanelsCheckboxSpecimenSingleSource
          panels={props?.specimenSources}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          setInputs={props?.setInputs}
          displayType={displayType}
          sectionName={sectionName}
          sectionDisplayType={props?.sectionDisplayType}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          error={props?.enableRule}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          inputValueForSpecimen={props.inputValueForSpecimen}
          setInputValueForSpecimen={props.setInputValueForSpecimen}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
        />
      ) : null}
      {uiType === 'SelectablePanel' &&
        (visible || isDependent) &&
        props.sectionId !== 17 ? (
        <PanelsCheckboxSelected
          panels={props?.panels}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          displayType={props.displayType}
          error={props?.enableRule}
          setInputs={props?.setInputs}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
        />
      ) : null}
      {uiType === 'HeaderSelectableOnlyPanel' &&
        (visible || isDependent) &&
        props.sectionId !== 17 ? (
        <HeaderSelectableOnlyPanel
          panels={props?.panels}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          displayType={props.displayType}
          error={props?.enableRule}
          setInputs={props?.setInputs}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          panelCombinations={props?.field?.panelCombinations}
          inputValueForSpecimen={props.inputValueForSpecimen}
          setInputValueForSpecimen={props.setInputValueForSpecimen}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
        />
      ) : null}
      {uiType === 'MultiplerReferenceLabPanelSelection' &&
        (visible || isDependent) &&
        props.sectionId !== 17 ? (
        <MultipleReferenceLabPanel
          panels={props?.panels}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          displayType={props.displayType}
          error={props?.enableRule}
          setInputs={props?.setInputs}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          panelCombinations={props?.field?.panelCombinations}
          inputValueForSpecimen={props.inputValueForSpecimen}
          setInputValueForSpecimen={props.setInputValueForSpecimen}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
          apiCallCondition={props.apiCallCondition}
        />
      ) : null}
      {uiType === 'MultipleSelectablePanel' &&
        (visible || isDependent) &&
        props?.ArrayReqId !== 2 ? (
        <MultipleHeaderSelectable
          panels={props?.panels}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          displayType={props.displayType}
          error={props?.enableRule}
          setInputs={props?.setInputs}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
          IsSelectedByDefaultCompendiumData={
            props.IsSelectedByDefaultCompendiumData
          }
        />
      ) : null}
      {uiType === 'MultipleSelectablePanel' &&
        (visible || isDependent) &&
        props?.ArrayReqId === 2 ? (
        <MultipleHeaderSelectable2
          panels={props?.panels}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          displayType={props.displayType}
          error={props?.enableRule}
          setInputs={props?.setInputs}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
          fieldConfiguration={props.fieldConfiguration}
          apiCallCondition={props.apiCallCondition}
          IsSelectedByDefaultCompendiumData={
            props.IsSelectedByDefaultCompendiumData
          }
        />
      ) : null}
      {uiType === 'SearchableDropDown' && (visible || isDependent) ? (
        <AdditionalTest
          panels={props?.panels}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          displayType={props.displayType}
          error={props?.enableRule}
          setInputs={props?.setInputs}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
        />
      ) : null}
      {uiType === 'SelectablePanel' &&
        (visible || isDependent) &&
        props.sectionId === 17 ? (
        <ToxTestingOption
          panels={props?.panels}
          Inputs={Inputs}
          dependenceyControls={dependenceyControls}
          index={index}
          depControlIndex={depControlIndex}
          fieldIndex={fieldIndex}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatFieldIndex={repeatFieldIndex}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          defaultValue={props.field}
          displayType={props.displayType}
          error={props?.enableRule}
          setInputs={props?.setInputs}
          infectiousData={props?.infectiousData}
          setInfectiousData={props?.setInfectiousData}
          name={props?.field?.systemFieldName}
          errorFocussedInput={props?.errorFocussedInput}
          ArrayReqId={props?.ArrayReqId}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
          IsSelectedByDefaultCompendiumData={
            props.IsSelectedByDefaultCompendiumData
          }
          screening={props.screening}
        />
      ) : null}

      {uiType === 'RadioButton' && (visible || isDependent) ? (
        <Radio2
          parentDivClassName={displayType}
          RadioOptions={RadioOptions}
          label={props?.label}
          name={props?.sysytemFieldName}
          fieldIndex={fieldIndex}
          error={props?.enableRule}
          required={props.required}
          onChange={async (
            e: any,
            value: any,
            label: any,
            dropdownText: any,
            manual: boolean = true
          ) => {

            if (props?.sysytemFieldName === "BillingType" && !manual) {
              localStorage.setItem("insurnceID", e.target.attributes['data-id'].value);
              localStorage.setItem("insuranceOptionId", e.target.attributes['insuranceOptionsId'].value);
            }

            fields.enableRule = '';
            const inputValue = value;
            const newInput = await assignFormValues(
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
              dropdownText,
              props?.setInputs,
              location?.state?.reqId,
              props?.patientId
            );
            if (ArrayReqId) {
              let infectiousDataCopy: any;
              if (props?.infectiousData) {
                infectiousDataCopy = [...props.infectiousData];
              }
              infectiousDataCopy[
                FindIndex(infectiousDataCopy, ArrayReqId)
              ].sections = newInput;
              if (props?.setInfectiousData) {
                props?.setInfectiousData([...infectiousDataCopy]);
              }
            } else {
              props?.setInputs(newInput);
            }
            if (!props?.repeatInputs) {
              handleChange(
                e.target.attributes['data-name'].value,
                e.target.value,
                e.target.attributes['data-id'].value,
                depfield,
                props?.searchID,
                props?.controlId,
                props?.index,
                props?.section?.sectionName,
                fieldIndex,
                isDependency,
                props?.infectiousInputs,
                props?.section?.sectionId
              );
            } else {
              handleChangeRepeatFields(
                e.target.attributes['data-name'].value,
                e.target.attributes['data-id'].value,
                depfield,
                props?.searchID,
                props?.controlId,
                props?.index,
                sectionName,
                fieldIndex
              );
            }
            if (
              props?.section?.sectionId === 89 ||
              props?.sectionName?.toLowerCase() === 'medical necessity'
            ) {
              // typically handle Medical Necessity for PGX
              const selectedOptionId = e.target.attributes['data-id'].value;
              if (Inputs[index]?.dependencyControls?.length > 0) {
                const updatedFields = Inputs[index]?.fields.map(
                  (field: any) => {
                    const shouldBeVisible = Inputs[
                      index
                    ]?.dependencyControls.some((control: any) => {
                      if (
                        control?.optionDataID === parseInt(selectedOptionId)
                      ) {
                        return control.dependecyFields.some(
                          (depField: any) =>
                            depField?.systemFieldName === field?.systemFieldName
                        );
                      }
                      return false;
                    });
                    return {
                      ...field,
                      visible: shouldBeVisible || field?.visible,
                      validationExpression: shouldBeVisible
                        ? validationExpression
                        : field?.validationExpression,
                    };
                  }
                );
                Inputs[index].fields = updatedFields;
              }
            }

            _setState(props?.sysytemFieldName, e.target.value);
          }}
          sectionId={props?.section?.sectionId}
          index={props?.index}
          depOptionID={props?.optionID}
          setShowHideFields={setShowHideFields}
          inputElement={inputElement}
          sectionName={props?.sectionName}
          defaultValue={
            typeof props?.defaultValue === 'string'
              ? props?.defaultValue.split(' ').join('')
              : props?.defaultValue
          }
          repeatFieldIndex={props?.repeatFieldIndex}
          errorFocussedInput={props?.errorFocussedInput}
          Inputs={Inputs}
          ArrayReqId={props?.ArrayReqId}
          Rname={props.rname}
          systemFieldName={props?.field?.systemFieldName}
          infectiousData={props?.infectiousData}
          setInputs={props?.setInputs}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          dependenceyControls={dependenceyControls}
          validationBackup={props.validationBackup}
          setValidationBackup={props.setValidationBackup}
          setCheckbox={props.setCheckbox}
          setShowButton={props.setShowButton}
          setIns={props.setIns}
          disableCheckbox={props.disableCheckbox}
          setDisableCheckbox={props.setDisableCheckbox}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
          patientId={props.patientId}
          isEnable={fields?.isEnable}
          setInfectiousData={props.setInfectiousData}
          noActiveMedication={props.noActiveMedication}
          screening={props.screening}
          setScreening={props.setScreening}
        />
      ) : null}
      {uiType === 'RadioButtonWithText' && (visible || isDependent) ? (
        <RadioButtonWithText
          parentDivClassName={displayType}
          RadioOptions={RadioOptions}
          label={props?.label}
          name={props?.sysytemFieldName}
          fieldIndex={fieldIndex}
          error={props?.enableRule}
          required={props.required}
          onChange={async (
            e: any,
            value: any,
            label: any,
            dropdownText: any,
            manual: boolean = true
          ) => {

            if (props?.sysytemFieldName === "BillingType" && !manual) {
              localStorage.setItem("insurnceID", e.target.attributes['data-id'].value);
              localStorage.setItem("insuranceOptionId", e.target.attributes['insuranceOptionsId'].value);
            }

            fields.enableRule = '';
            const inputValue = value;
            const newInput = await assignFormValues(
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
              dropdownText,
              props?.setInputs,
              location?.state?.reqId,
              props?.patientId
            );
            if (ArrayReqId) {
              let infectiousDataCopy: any;
              if (props?.infectiousData) {
                infectiousDataCopy = [...props.infectiousData];
              }
              infectiousDataCopy[
                FindIndex(infectiousDataCopy, ArrayReqId)
              ].sections = newInput;
              if (props?.setInfectiousData) {
                props?.setInfectiousData([...infectiousDataCopy]);
              }
            } else {
              props?.setInputs(newInput);
            }
            if (!props?.repeatInputs) {
              handleChange(
                e.target.attributes['data-name'].value,
                e.target.value,
                e.target.attributes['data-id'].value,
                depfield,
                props?.searchID,
                props?.controlId,
                props?.index,
                props?.section?.sectionName,
                fieldIndex,
                isDependency,
                props?.infectiousInputs,
                props?.section?.sectionId
              );
            } else {
              handleChangeRepeatFields(
                e.target.attributes['data-name'].value,
                e.target.attributes['data-id'].value,
                depfield,
                props?.searchID,
                props?.controlId,
                props?.index,
                sectionName,
                fieldIndex
              );
            }
            if (
              props?.section?.sectionId === 89 ||
              props?.sectionName?.toLowerCase() === 'medical necessity'
            ) {
              // typically handle Medical Necessity for PGX
              const selectedOptionId = e.target.attributes['data-id'].value;
              if (Inputs[index]?.dependencyControls?.length > 0) {
                const updatedFields = Inputs[index]?.fields.map(
                  (field: any) => {
                    const shouldBeVisible = Inputs[
                      index
                    ]?.dependencyControls.some((control: any) => {
                      if (
                        control?.optionDataID === parseInt(selectedOptionId)
                      ) {
                        return control.dependecyFields.some(
                          (depField: any) =>
                            depField?.systemFieldName === field?.systemFieldName
                        );
                      }
                      return false;
                    });
                    return {
                      ...field,
                      visible: shouldBeVisible || field?.visible,
                      validationExpression: shouldBeVisible
                        ? validationExpression
                        : field?.validationExpression,
                    };
                  }
                );
                Inputs[index].fields = updatedFields;
              }
            }

            _setState(props?.sysytemFieldName, e.target.value);
          }}
          sectionId={props?.section?.sectionId}
          index={props?.index}
          depOptionID={props?.optionID}
          setShowHideFields={setShowHideFields}
          inputElement={inputElement}
          sectionName={props?.sectionName}
          defaultValue={
            typeof props?.defaultValue === 'string'
              ? props?.defaultValue.split(' ').join('')
              : props?.defaultValue
          }
          repeatFieldIndex={props?.repeatFieldIndex}
          errorFocussedInput={props?.errorFocussedInput}
          Inputs={Inputs}
          ArrayReqId={props?.ArrayReqId}
          Rname={props.rname}
          systemFieldName={props?.field?.systemFieldName}
          infectiousData={props?.infectiousData}
          setInputs={props?.setInputs}
          isDependency={isDependency}
          repeatFieldSection={repeatFieldSection}
          isDependencyRepeatFields={isDependencyRepeatFields}
          repeatDependencySectionIndex={repeatDependencySectionIndex}
          repeatDepFieldIndex={repeatDepFieldIndex}
          dependenceyControls={dependenceyControls}
          validationBackup={props.validationBackup}
          setValidationBackup={props.setValidationBackup}
          setCheckbox={props.setCheckbox}
          setShowButton={props.setShowButton}
          setIns={props.setIns}
          disableCheckbox={props.disableCheckbox}
          setDisableCheckbox={props.setDisableCheckbox}
          fields={fields}
          setErrorFocussedInput={props.setErrorFocussedInput}
          patientId={props.patientId}
          isEnable={fields?.isEnable}
          setInfectiousData={props.setInfectiousData}
          noActiveMedication={props.noActiveMedication}
          screening={props.screening}
          setScreening={props.setScreening} />
      ) : null}
      {
        uiType === 'RadioQuestion' && (visible || isDependent) ? (
          <RadioQuestion
            parentDivClassName={displayType}
            RadioOptions={RadioOptions}
            label={props?.label}
            name={props?.sysytemFieldName}
            fieldIndex={fieldIndex}
            error={props?.enableRule}
            required={props.required}
            onChange={async (
              e: any,
              value: any,
              label: any,
              dropdownText: any
            ) => {
              props.fields.enableRule = '';
              const inputValue = value;
              await assignFormValues(
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
                dropdownText,
                props?.setInputs,
                location?.state?.reqId,
                props?.patientId
                // props.ValidationCheckOnClick
              );

              // !props?.repeatInputs
              //   ? handleChange(
              //     e.target.attributes["data-name"].value,
              //     e.target.value,
              //     e.target.attributes["data-id"].value,
              //     depfield,
              //     props?.searchID,
              //     props?.controlId,
              //     props?.index,
              //     props?.section?.sectionName,
              //     fieldIndex,
              //     isDependency,
              //     props?.infectiousInputs
              //   )
              //   : handleChangeRepeatFields(
              //     e.target.attributes["data-name"].value,
              //     e.target.attributes["data-id"].value,
              //     depfield,
              //     props?.searchID,
              //     props?.controlId,
              //     props?.index,
              //     sectionName,
              //     fieldIndex
              //   );
              if (!props?.repeatInputs) {
                handleChange(
                  e.target.attributes['data-name'].value,
                  e.target.value,
                  e.target.attributes['data-id'].value,
                  depfield,
                  props?.searchID,
                  props?.controlId,
                  props?.index,
                  props?.section?.sectionName,
                  fieldIndex,
                  isDependency,
                  props?.infectiousInputs
                );
              } else {
                handleChangeRepeatFields(
                  e.target.attributes['data-name'].value,
                  e.target.attributes['data-id'].value,
                  depfield,
                  props?.searchID,
                  props?.controlId,
                  props?.index,
                  sectionName,
                  fieldIndex
                );
              }

              if (props?.section?.sectionId === 89) {
                // typically handle Medical Necessity for PGX
                const selectedOptionId = e.target.getAttribute('data-id');
                if (Inputs[index].dependencyControls?.length > 0) {
                  const updatedFields = Inputs[index].fields.map((field: any) => {
                    const shouldBeVisible = Inputs[index].dependencyControls.some(
                      (control: any) => {
                        if (control.optionDataID === parseInt(selectedOptionId)) {
                          return control.dependecyFields.some(
                            (depField: any) =>
                              depField.systemFieldName === field.systemFieldName
                          );
                        }
                        return false;
                      }
                    );
                    return {
                      ...field,
                      visible: shouldBeVisible || field.visible,
                      validationExpression: shouldBeVisible
                        ? validationExpression
                        : field.validationExpression,
                    };
                  });
                  Inputs[index].fields = updatedFields;
                }
              }
              _setState(props?.sysytemFieldName, e.target.value);
            }}
            sectionId={props?.section?.sectionId}
            index={props?.index}
            depOptionID={props?.optionID}
            setShowHideFields={setShowHideFields}
            inputElement={inputElement}
            sectionName={props?.sectionName}
            defaultValue={
              typeof props?.defaultValue === 'string'
                ? props?.defaultValue.split(' ').join('')
                : props?.defaultValue
            }
            repeatFieldIndex={props?.repeatFieldIndex}
            errorFocussedInput={props?.errorFocussedInput}
            Inputs={Inputs}
            ArrayReqId={props?.ArrayReqId}
            Rname={props.rname}
            systemFieldName={props?.field?.systemFieldName}
            infectiousData={props?.infectiousData}
            setInputs={props?.setInputs}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            dependenceyControls={dependenceyControls}
            setErrorFocussedInput={props.setErrorFocussedInput}
            isEnable={fields?.isEnable}
          />
        ) : null
      }

      {
        uiType === 'InsuranceProviderControl' && (visible || isDependent) ? (
          <ReactSelect
            parentDivClassName={displayType}
            required={required}
            label={props?.label}
            placeholder="InsuranceProviderControl"
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            isSearchable={true}
            error={props?.enableRule}
            inputValue={defaultValue}
            ControlType={uiType}
            name={props?.sysytemFieldName}
            errorFocussedInput={props?.errorFocussedInput}
            field={props?.field}
            fields={fields}
            setErrorFocussedInput={props.setErrorFocussedInput}
          />
        ) : null
      }

      {
        uiType === 'RequisitionSignPad' && (visible || isDependent) ? (
          <>
            <div className={`${displayType} order-1`}>
              <CommonSignPad
                Inputs={Inputs}
                index={index}
                label={label}
                required={required}
                depControlIndex={depControlIndex}
                fieldIndex={fieldIndex}
                isDependency={isDependency}
                repeatFieldSection={repeatFieldSection}
                isDependencyRepeatFields={isDependencyRepeatFields}
                repeatFieldIndex={repeatFieldIndex}
                repeatDependencySectionIndex={repeatDependencySectionIndex}
                repeatDepFieldIndex={repeatDepFieldIndex}
                error={props?.field?.enableRule}
                setInputs={props?.setInputs}
                name={props?.sysytemFieldName}
                infectiousData={props?.infectiousData}
                setInfectiousData={props?.setInfectiousData}
                ArrayReqId={props?.ArrayReqId}
                defaultValue={defaultValue}
                setErrorFocussedInput={props.setErrorFocussedInput}
                errorFocussedInput={props?.errorFocussedInput}
              />
            </div>
          </>
        ) : null
      }

      {
        uiType === 'Signature' && (visible || isDependent) ? (
          <>
            <div className={`${displayType}`}>
              <SignPad
                formData={props?.formData}
                formState={props?.formState}
                sectionName={props?.sectionName}
                padValue={props.field.signatureText ?? ''}
                defaultValue={props.field.defaultValue}
                Inputs={Inputs}
                dependenceyControls={dependenceyControls}
                index={index}
                depControlIndex={depControlIndex}
                fieldIndex={fieldIndex}
                isDependency={isDependency}
                repeatFieldSection={repeatFieldSection}
                isDependencyRepeatFields={isDependencyRepeatFields}
                repeatFieldIndex={repeatFieldIndex}
                repeatDependencySectionIndex={repeatDependencySectionIndex}
                repeatDepFieldIndex={repeatDepFieldIndex}
                error={props?.field?.enableRule}
                setInputs={props?.setInputs}
                name={props?.sysytemFieldName}
                errorFocussedInput={props?.errorFocussedInput}
                setCheck={props.setCheck}
                physicianId={props?.physicianId}
                setPhysicianId={props?.setPhysicianId}
                infectiousData={props?.infectiousData}
                setInfectiousData={props?.setInfectiousData}
                ArrayReqId={props?.ArrayReqId}
                fields={fields}
                setErrorFocussedInput={props.setErrorFocussedInput}
                setSignPadValue={props.setSignPadValue}
                sysytemFieldName={props.sysytemFieldName}
                controlId={props?.controlId}
              />
            </div>
          </>
        ) : null
      }

      {
        uiType === 'ReadmoreControl' && (visible || isDependent) ? (
          <>
            <div className={`${displayType} `}>
              <ReadMore
                spanClassName="mb-2 mr-2"
                label={props.label}
                length={props.defaultValue}
                parentDivClassName={displayType}
                depOptionID={props?.optionID}
                sectionId={props.sectionId}
              />
            </div>
          </>
        ) : null
      }
      {
        removeUi === true ? (
          <>
            <span onClick={() => props?.RemoveFields(props?.searchID, index)}>
              {/* <CrossIcon /> */}
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-icon btn-sm fw-bold btn-danger btn-icon-light">
                  <CrossIcon className="fs-2hx text-gray-700 bi bi-x" />
                </button>
              </div>
            </span>
            <br />
          </>
        ) : null
      }
      {
        uiType === 'Button' && (visible || isDependent) ? (
          <>
            <Button
              spanClassName="mb-2 mr-2"
              parentDivClassName={displayType}
              sectionId={props?.sectionId}
              label={props?.label}
              props={props}
              sectionName={props?.sectionName}
              Inputs={Inputs}
              index={index}
              fieldIndex={fieldIndex}
              isDependency={isDependency}
              setInputs={setInputs}
              name={props?.sysytemFieldName}
              infectiousData={props?.infectiousData}
              setInfectiousData={props?.setInfectiousData}
              depControlIndex={depControlIndex}
              repeatFieldSection={repeatFieldSection}
              isDependencyRepeatFields={isDependencyRepeatFields}
              repeatFieldIndex={repeatFieldIndex}
              repeatDependencySectionIndex={repeatDependencySectionIndex}
              repeatDepFieldIndex={repeatDepFieldIndex}
              SignPadValue={props.SignPadValue}
              setSignPadValue={props.setSignPadValue}
              setSignPadVal={props.setSignPadVal}
            />
          </>
        ) : null
      }
      {
        uiType === 'ClearButton' && (visible || isDependent) ? (
          <>
            <ClearButton
              spanClassName="mb-2 mr-2"
              parentDivClassName={displayType}
              sectionId={props?.sectionId}
              label={props?.label}
              props={props}
              sectionName={props?.sectionName}
              Inputs={Inputs}
              index={index}
              fieldIndex={fieldIndex}
              isDependency={isDependency}
              setInputs={setInputs}
              name={props?.sysytemFieldName}
              infectiousData={props?.infectiousData}
              setInfectiousData={props?.setInfectiousData}
              depControlIndex={depControlIndex}
              repeatFieldSection={repeatFieldSection}
              isDependencyRepeatFields={isDependencyRepeatFields}
              repeatFieldIndex={repeatFieldIndex}
              repeatDependencySectionIndex={repeatDependencySectionIndex}
              repeatDepFieldIndex={repeatDepFieldIndex}
              SignPadValue={props.SignPadValue}
              setSignPadValue={props.setSignPadValue}
              setSignPadVal={props.setSignPadVal}
              ArrayReqId={ArrayReqId}
            />
          </>
        ) : null
      }
      {
        uiType === 'RepeatEnd' && (visible || isDependent) ? (
          <>
            <hr />
            <button
              onClick={() => {
                props?.addFields(props);
              }}
              className="btn btn-primary sm mr-2 mt-2 order-2"
              style={{ width: '50%' }}
            >
              {t('Add')}
            </button>
          </>
        ) : null
      }
      {
        uiType === 'breakline' && (visible || isDependent) ? (
          <>
            <div className={displayType}><hr /></div>
          </>
        ) : null
      }
      {
        uiType === 'File' && (visible || isDependent) ? (
          <div className={`${displayType} order-3`}>
            {' '}
            <FileUpload
              {...props}
              Inputs={Inputs}
              setInputs={props?.setInputs}
              dependenceyControls={dependenceyControls}
              index={index}
              depControlIndex={depControlIndex}
              fieldIndex={fieldIndex}
              isDependency={isDependency}
              repeatFieldSection={repeatFieldSection}
              isDependencyRepeatFields={isDependencyRepeatFields}
              repeatFieldIndex={repeatFieldIndex}
              repeatDependencySectionIndex={repeatDependencySectionIndex}
              repeatDepFieldIndex={repeatDepFieldIndex}
              controlId={props?.controlId}
              ArrayReqId={ArrayReqId}
              infectiousData={props.infectiousData}
              setInfectiousData={props.setInfectiousData}
            />
          </div>
        ) : null
      }
      {uiType === "ChooseFile" && (visible || isDependent) ? (
        <div className={`${displayType} order-3`}>
          <ChooseFileUpload
            data={props?.field}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            defaultValue={props?.defaultValue}
          />
        </div>
      ) : null}
      {
        uiType === 'Document' && (visible || isDependent) ? (
          <div className={`${displayType} order-3`}>
            <Document
              data={props?.field}
              Inputs={Inputs}
              setInputs={props?.setInputs}
              dependenceyControls={dependenceyControls}
              index={index}
              depControlIndex={depControlIndex}
              fieldIndex={fieldIndex}
              isDependency={isDependency}
              repeatFieldSection={repeatFieldSection}
              isDependencyRepeatFields={isDependencyRepeatFields}
              repeatFieldIndex={repeatFieldIndex}
              repeatDependencySectionIndex={repeatDependencySectionIndex}
              repeatDepFieldIndex={repeatDepFieldIndex}
              defaultValue={props?.defaultValue}
            />
          </div>
        ) : null
      }

      {
        uiType === 'ControlDynamicAutoComplete' ? (
          <ControlAutoDynamicComplete
            data={props?.field}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            defaultValue={props?.defaultValue}
            infectiousData={props?.infectiousData}
            setInfectiousData={props?.setInfectiousData}
            ArrayReqId={props?.ArrayReqId}
            handleServerSideDropdownOnChange={handleServerSideDropdownOnChange}
          />
        ) : null
      }

      {/* FIXME: need to clean props passing for this one */}
      {
        uiType === 'ControlDynamicDropDown' ? (
          <ControlDynamicDropDown
            data={props?.field}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            defaultValue={props?.defaultValue}
            infectiousData={props?.infectiousData}
            setInfectiousData={props?.setInfectiousData}
            ArrayReqId={props?.ArrayReqId}
          />
        ) : null
      }
      {
        uiType === 'ServerSideDynamicDropDown' && (visible || isDependent) ? (
          <ServerSideDynamicDropDown
            data={props}
            label={label}
            required={required}
            RadioOptions={RadioOptions}
            defaultValue={defaultValue}
            sysytemFieldName={sysytemFieldName}
            inputElementDropdown={inputElementDropdown}
            handleServerSideDropdownOnChange={handleServerSideDropdownOnChange}
          />
        ) : null
      }
      {
        uiType === 'ReportTemplateOptions' && (visible || isDependent) ? (
          <ReportTemplates
            data={props?.field}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            defaultValue={props?.defaultValue}
            infectiousData={props?.infectiousData}
            setInfectiousData={props?.setInfectiousData}
            ArrayReqId={props?.ArrayReqId}
          />
        ) : null
      }
      {
        uiType === 'Logo' && (visible || isDependent) ? (
          <LogoUpload
            {...props}
            Inputs={Inputs}
            setInputs={props?.setInputs}
            dependenceyControls={dependenceyControls}
            index={index}
            depControlIndex={depControlIndex}
            fieldIndex={fieldIndex}
            isDependency={isDependency}
            repeatFieldSection={repeatFieldSection}
            isDependencyRepeatFields={isDependencyRepeatFields}
            repeatFieldIndex={repeatFieldIndex}
            repeatDependencySectionIndex={repeatDependencySectionIndex}
            repeatDepFieldIndex={repeatDepFieldIndex}
            controlId={props?.controlId}
            ArrayReqId={ArrayReqId}
            infectiousData={props.infectiousData}
            setInfectiousData={props.setInfectiousData}
          />
        ) : null
      }
      {
        showRecursiveDep === true
          ? recursiveDependencyControls?.map((options: any) => (
            <>
              <div className="row">
                {options?.dependecyFields?.map((depfield: any) => (
                  <div key={options.optionID}>
                    <DynamicFormInputs
                      uiType={depfield?.uiType}
                      label={depfield?.displayFieldName}
                      sysytemFieldName={depfield?.systemFieldName}
                      displayType={
                        depfield?.displayType +
                        ' ' +
                        options?.name +
                        ' ' +
                        options?.name +
                        options.optionID
                      }
                      visible={depfield?.visible}
                      required={depfield?.required}
                      RadioOptions={
                        depfield?.uiType === 'RadioButton'
                          ? depfield?.options
                          : ''
                      }
                      formData={props?.formData}
                      setFormData={props?.setFormData}
                      index={props?.index}
                      Inputs={props?.Inputs}
                      setInputs={props?.setInputs}
                      depOptionID={options.optionID}
                      setShowHideFields={setShowHideFields}
                      dependenceyControls={recursiveDependencyControls}
                      isDependent={true}
                      searchID={depfield?.searchID}
                      RemoveFields={props?.RemoveFields}
                      dependencyAction={options?.dependecyAction}
                      comp="dependency"
                      isShown={props.isShown}
                      setIsShown={props.setIsShown}
                      addFields={props?.addFields}
                      depfield={depfield}
                      depName={options?.name}
                    />
                  </div>
                ))}
              </div>
            </>
          ))
          : null
      }
    </>
  );
};

function mapStateToProps(state: any) {
  return { Requisition: state };
}
export default connect(mapStateToProps)(DynamicFormInputs);
