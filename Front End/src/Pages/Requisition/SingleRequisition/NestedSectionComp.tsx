import React from "react";
import DynamicFormInputs from "../../../Shared/DynamicFormInputs";

const NestedSectionComp = (props: any) => {
  

  return (
    <>
      {props?.dependecyFields.map((field: any) => (
        <>
          <DynamicFormInputs
            uiType={field?.uiType}
            label={field?.displayFieldName}
            displayType={field?.displayType}
            visible={field?.visible}
            required={field?.required}
            RadioOptions={field?.uiType === "RadioButton" ? field?.options : ""}
            //formData={formData}
            //setFormData={setFormData}
            index={props?.index}
            Inputs={props?.Inputs}
            setInputs={props?.setInputs}
            sysytemFieldName={field?.systemFieldName}
            //setShowHideFields={setShowHideFields}
            isDependent={false}
          />
          {<NestedSectionComp item={field.dependecyFields} />}
        </>
      ))}
    </>
  );
};

export default NestedSectionComp;
