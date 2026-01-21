import React from "react";
import PanelsCheckBox from "../Input/PanelsCheckBox";

const SpecimenSource = (props: any) => {
  

  return (
    <>
      {props?.section?.fields?.map((fieldData: any) => (
        <>
          <PanelsCheckBox
            panels={fieldData?.panels}
            //   Inputs={Inputs}
            //   dependenceyControls={dependenceyControls}
            //   index={index}
            //   depControlIndex={depControlIndex}
            //   fieldIndex={fieldIndex}
            //   isDependency={isDependency}
            //   repeatFieldSection={repeatFieldSection}
            //   isDependencyRepeatFields={isDependencyRepeatFields}
            //   repeatFieldIndex={repeatFieldIndex}
            //   repeatDependencySectionIndex={repeatDependencySectionIndex}
            //   repeatDepFieldIndex={repeatDepFieldIndex}
            //   defaultValue={props.field}
            //   setInputs={props?.setInputs}
            //   displayType={displayType}
            //   sectionName={sectionName}
            //   sectionDisplayType={props?.sectionDisplayType}
          />
        </>
      ))}
    </>
  );
};

export default SpecimenSource;
