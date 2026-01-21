import { Formik, Field, FastField, Form } from "formik";
import {
  IRequisitionSectionsField,
  IRequsitionSection,
} from "../../../Interface/Requisition";
import Input from "../../../Shared/Common/Input/Input";
import Select from "react-select";
import { styles } from "../../../Utils/Common";
import Radio2 from "../../../Shared/Common/Input/Radio2";
import FormikRepeatInputs from "../../../Shared/FormikRepeatInputs";
import ReactSelect from "../../../Shared/Common/Input/ReactSelect";
import { LooseReactState } from "../../../Shared/Type";
import { CrossIcon } from "../../../Shared/Icons";
import SignPad from "../../../Shared/Common/Input/SignPad";
import ReadMore from "../SingleRequisition/ReadMore";
import FileUpload from "../../../Shared/Common/Input/FileUpload";

export const renderSwitch = (
  sectionIndex: number,
  fieldIndex: number,
  section: IRequsitionSection,
  field: IRequisitionSectionsField,
  isDependent: boolean,
  Inputs: any,
  setInputs?: React.Dispatch<React.SetStateAction<any>>,
  setIsShown?: LooseReactState,
  isShown?: boolean
) => {
  const removeFields = (billingInfoSectionid: number, fieldsId: number) => {
    let inputsCopy = [...Inputs];
    delete inputsCopy[fieldsId].fields[billingInfoSectionid];
    setInputs && setInputs(inputsCopy);
  };
  const {
    uiType,
    visible,
    displayType,
    options,
    displayFieldName,
    systemFieldName,
    required,
    repeatFields,
    repeatFieldsState,
    repeatDependencyControls,
    repeatDependencyControlsState,
  } = field; ///////destructuring field data
  switch (true) {
    case (uiType === "TextBox" ||
      uiType === "TextArea" ||
      uiType === "Email" ||
      uiType === "Date" ||
      uiType === "Time" ||
      uiType === "Integer") &&
      (visible || isDependent):
      return (
        //////text email date time input starts here
        <FastField name={displayFieldName}>
          {({ field, form, meta }: any) => {
            return (
              <Input
                parentDivClassName={displayType}
                type={uiType === "Integer" ? "number" : uiType.toLowerCase()}
                label={displayFieldName}
                onChange={(e: any) => {
                  ////getting values from input to save
                  const inputValue = e.target.value;
                  // assignFormValues(
                  //   Inputs,
                  //   dependenceyControls,
                  //   index,
                  //   depControlIndex,
                  //   fieldIndex,
                  //   inputValue,
                  //   isDependency,
                  //   repeatFieldSection,
                  //   isDependencyRepeatFields,
                  //   repeatFieldIndex,
                  //   repeatDependencySectionIndex,
                  //   repeatDepFieldIndex
                  // );
                  ////getting values from input to save
                }}
                required={required}
                //depOptionID={props?.optionID}
              />
            );
          }}
        </FastField>
      );
    //////text email date time input ends here
    //////React select dropdown input starts here
    case uiType === "DropDown" && (visible || isDependent):
      return (
        <FastField name={displayFieldName}>
          {({ field, form, meta }: any) => {
            return (
              <div
                className={
                  displayType ? displayType : "col-lg-6 col-md-6 col-sm-12 mb-4"
                }
              >
                <label
                  className={required ? "required mb-2 fw-500" : "mb-2 fw-500"}
                >
                  {displayFieldName}
                </label>
                <Select
                  menuPortalTarget={document.body}
                  options={
                    uiType === "RadioButton" ||
                    uiType === "CheckBoxList" ||
                    uiType === "DropDown"
                      ? options
                      : ""
                  }
                  placeholder={displayFieldName}
                  theme={(theme) => styles(theme)}
                  isSearchable={true}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: "var(--kt-input-border-color)",
                      color: "var(--kt-input-border-color)",
                    }),
                  }}
                />
              </div>
            );
          }}
        </FastField>
      );
    //////React select dropdown input ends here
    //////Radio buttons input starts here
    case uiType === "RadioButton" && (visible || isDependent):
      return (
        <FastField name={displayFieldName}>
          {({ field, form, meta }: any) => {
            return (
              <Radio2
                parentDivClassName={displayType}
                RadioOptions={options}
                label={displayFieldName}
                name={systemFieldName}
                required={required}
                index={fieldIndex}
                //depOptionID={props?.optionID} required in future it will be dependency control fields map
                sectionName={section?.sectionName}
              />
            );
          }}
        </FastField>
      );
    ///////////Radio buttons input ends here
    //////Insurance Provider Dropdown based on React Select starts here
    case uiType === "InsuranceProviderControl" && (visible || isDependent):
      return (
        <FastField name={displayFieldName}>
          {({ field, form, meta }: any) => {
            return (
              <ReactSelect
                parentDivClassName={displayType}
                label={displayFieldName}
                placeholder="InsuranceProviderControl"
                //value={}
                //Inputs={Inputs}
                // dependenceyControls={dependenceyControls}
                // index={index}
                // depControlIndex={depControlIndex}
                // fieldIndex={fieldIndex}
                // isDependency={isDependency}
                // repeatFieldSection={repeatFieldSection}
                // isDependencyRepeatFields={isDependencyRepeatFields}
                // repeatFieldIndex={repeatFieldIndex}
                // repeatDependencySectionIndex={repeatDependencySectionIndex}
                // repeatDepFieldIndex={repeatDepFieldIndex}
                // isSearchable={true}
              />
            );
          }}
        </FastField>
      );
    //////Insurance Provider Dropdown based on React Select ends here
    ///////////billing section inputs starts here
    case uiType === "Repeat" && (visible || isDependent):
      return (
        <FormikRepeatInputs
          Inputs={Inputs}
          setInputs={setInputs}
          setIsShown={setIsShown}
          isShown={isShown}
          sectionIndex={sectionIndex}
          section={section}
          fieldIndex={fieldIndex}
          repeatFields={repeatFields}
          repeatFieldsState={repeatFieldsState}
          repeatDependencyControls={repeatDependencyControls}
          repeatDependencyControlsState={repeatDependencyControlsState}
          displatClassForBtn={
            fieldIndex + 1 ===
            Inputs[sectionIndex].fields.filter(
              (item: any) => item?.uiType === "Repeat"
            ).length
              ? ""
              : "d-none"
          }
        />
      );

    case uiType === "RepeatStart" && (visible || isDependent):
      return (
        <span
          onClick={() => removeFields(fieldIndex, sectionIndex)}
          className="d-flex justify-content-end"
        >
          <CrossIcon className="fs-2hx text-gray-700 bi bi-x" />{" "}
        </span>
      );
    ///////////billing section inputs ends here
    ////file upload section starts here
    case uiType === "File":
      return (
        <div className={`${displayType} order-3`}>
          <FileUpload />
        </div>
      );
    ////file upload section ends here
    //////////signaturePad section starts here
    // case uiType === "Signature":
    //   return (
    //     <div className=" col-xl-12 col-lg-12 col-md-12 col-sm-12">
    //       <SignPad
    //       // formData={props?.formData}
    //       // formState={props?.formState}
    //       // sectionName={props?.sectionName}
    //       />
    //       <div>
    //         <ReadMore>
    //           I authorize the collection of a Nasopharyngeal specimen for
    //           Covid-19 Testing. I further understand and agree to the following
    //           term and condition depending upon the situation. I authorize the
    //           collection of a Nasopharyngeal specimen for Covid-19 Testing. I
    //           further understand and agree to the following term and condition
    //           depending upon the situation.
    //         </ReadMore>
    //       </div>
    //     </div>
    //   );
    /////////signaturePad section ends here
    default:
      return "";
  }
};
