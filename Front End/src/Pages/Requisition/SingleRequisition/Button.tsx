import { toast } from "react-toastify";
import {
  assignFormValues,
  fnBrowserDetect,
  getOS,
  SignatureForPatient,
} from "Utils/Auth";

const Button = (props: any) => {
  let PatientFullNameIndex = props.Inputs[props.index].fields.findIndex(
    (fieldsData: any) => fieldsData?.systemFieldName == "PatientFullName"
  );
  let PatientSignatureIndex = props.Inputs[props.index].fields.findIndex(
    (fieldsData: any) => fieldsData?.systemFieldName == "PatientSignature"
  );
  const handleClick = async () => {
    let browserInfo = fnBrowserDetect();
    let osInfo = getOS();
    if (
      props?.Inputs[props?.index]?.fields[PatientFullNameIndex]?.defaultValue
    ) {
      await SignatureForPatient(
        props.Inputs,
        props.index,
        osInfo,
        browserInfo,
        props?.setInputs
      );
      let input = await assignFormValues(
        props.Inputs,
        props.index,
        props.depControlIndex,
        props.fieldIndex,
        props.Inputs[props.index].fields[PatientSignatureIndex].defaultValue,
        props.isDependency,
        props.repeatFieldSection,
        props.isDependencyRepeatFields,
        props.repeatFieldIndex,
        props.repeatDependencySectionIndex,
        props.repeatDepFieldIndex,
        undefined,
        props?.setInputs
      );
      props.setInputs(input);
      props.setSignPadValue(
        props.Inputs[props.index].fields[PatientSignatureIndex].defaultValue
      );
      props.setSignPadVal(
        props.Inputs[props.index].fields[PatientSignatureIndex].defaultValue
      );
    } else {
      toast.error("Select information in order to create signature");
    }
  };

  return (
    <div className={`${props.parentDivClassName} mb-5`}>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => {
          handleClick();
          handleClick();
        }}
        id={"signpadButton"}
      >
        {props.label}
      </button>
    </div>
  );
};

export default Button;
