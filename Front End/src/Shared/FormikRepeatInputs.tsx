import React from "react";
import { repeatFieldsProps } from "../Interface/Requisition";
import FormInputs from "../Pages/Requisition/SingleRequsition2/FormInputs";
import { genUniqueId } from "../Utils/Common";
import useLang from "./hooks/useLanguage";

const FormikRepeatInputs = ({
  sectionIndex,
  section,
  fieldIndex,
  repeatFields,
  repeatDependencyControls,
  displatClassForBtn,
  Inputs,
  setInputs,
  setIsShown,
  isShown,
}: repeatFieldsProps) => {
  const { t } = useLang()
  const [crossObj, setCrossObj] = React.useState({
    controlId: 131,
    controlDataID: 131,
    systemFieldName: "RepeatStart",
    displayFieldName: "Repeat Start",
    uiTypeId: 25,
    uiType: "RepeatStart",
    required: false,
    isNew: false,
    sectionType: 0,
    visible: true,
    defaultValue: "",
    options: [],
    sortOrder: 1,
    cssStyle: "",
    dispayRule: "",
    enableRule: "",
    displayType: "col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 ",
    dependencyControls: [],
    repeatFields: [],
    repeatDependencyControls: [],
    repeatFieldsState: [],
    repeatDependencyControlsState: [],
  });
  const addFields = (
    repeatFieldsState: any,
    repeatDependencyControlsState: any,
    sectionIndex: number,
    Inputs: any,
    fieldIndex: number,
    addCount: number
  ) => {
    let inputsCopy = JSON.parse(JSON.stringify(Inputs));
    let copyRepeatField = JSON.parse(
      JSON.stringify(inputsCopy[sectionIndex].fields[fieldIndex])
    );
    let id = genUniqueId();
    copyRepeatField.repeatFields.unshift(crossObj);
    copyRepeatField.id = id;
    //
    copyRepeatField?.repeatDependencyControls?.forEach(
      (element1: any, depindex: number, arrayItself: any) => {
        arrayItself[depindex].dependecyFields.forEach(
          (element2: any, DepFieldindex: number, arrayItselDepFields: any) => {
            if (
              arrayItselDepFields[DepFieldindex]?.displayType.includes("d-none")
            ) {
              // return;
            } else {
              arrayItselDepFields[DepFieldindex].displayType =
                arrayItselDepFields[DepFieldindex].displayType + " " + "d-none";
            }
          }
        );
      }
    );
    copyRepeatField.repeatFields.forEach(
      (element1: any, repeatfieldIndex: number, arrayItself: any) => {
        if (arrayItself[repeatfieldIndex]?.displayType.includes("d-none")) {
          let removeDisplayNone = arrayItself[
            repeatfieldIndex
          ]?.displayType.replace("d-none", " ");
          arrayItself[repeatfieldIndex].displayType = removeDisplayNone;
        }
      }
    );
    inputsCopy[sectionIndex].fields.splice(fieldIndex + 1, 0, copyRepeatField);
    setInputs && setInputs(inputsCopy);
    setIsShown && setIsShown(!isShown);
    //Inputs = [...inputsCopy];


    if (fieldIndex > 0) {
      copyRepeatField.repeatFields.shift();
    }
  };


  return (
    <>
      {repeatFields?.map((field: any, repeatFieldsFieldIndex: number) => (
        <>
          <FormInputs
            Inputs={repeatFields}
            sectionIndex={sectionIndex}
            isDependent={false}
            field={field}
            fieldIndex={repeatFieldsFieldIndex}
            section={section}
            setIsShown={setIsShown}
          />
        </>
      ))}
      {repeatDependencyControls?.map(
        (options: any, repeatDependencySectionIndex: number) => (
          <>
            {options?.dependecyFields?.map(
              (depfield: any, repeatDepFieldIndex: number) => (
                <>
                  <FormInputs
                    Inputs={repeatDependencyControls}
                    sectionIndex={sectionIndex}
                    isDependent={true}
                    field={depfield}
                    fieldIndex={repeatDepFieldIndex}
                    section={section}
                    setIsShown={setIsShown}
                  />
                </>
              )
            )}
          </>
        )
      )}
      <div className="col-12">
        <hr />
        <button
          onClick={() =>
            addFields(
              repeatFields,
              repeatDependencyControls,
              sectionIndex,
              Inputs,
              fieldIndex,
              1
            )
          }
          className={`${displatClassForBtn} btn btn-primary w-100px`}
        // className={` btn btn-primary w-100px`}
        >
          {t("Add")}
        </button>
      </div>
    </>
  );
};

export default FormikRepeatInputs;
