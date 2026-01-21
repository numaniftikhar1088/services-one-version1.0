import { IFormInputsProps } from "../../../Interface/Requisition";
import { renderSwitch } from "./RenderSwitch";

const FormInputs = ({
  field,
  isDependent,
  Inputs,
  section,
  fieldIndex,
  sectionIndex,
  depControlIndex,
  setInputs,
  setIsShown,
  isShown,
}: IFormInputsProps) => {
  return (
    <>
      {renderSwitch(
        sectionIndex,
        fieldIndex,
        section,
        field,
        isDependent,
        Inputs,
        setInputs,
        setIsShown,
        isShown
      )}
    </>
  );
};

export default FormInputs;
