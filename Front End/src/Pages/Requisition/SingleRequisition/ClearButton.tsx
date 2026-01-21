import { assignFormValues } from "Utils/Auth";
import { FindIndex } from "Utils/Common/CommonMethods";
import { Field, FieldOption, Props } from "./SingleRequisitionInterface";
const ClearButton = (props: Props) => {
  const handleClick = async () => {
    props?.Inputs[props?.index]?.dependencyControls?.filter((i: any) => {
      i.dependecyFields.filter((j: any) => {
        j.defaultValue = "";
      })
    })
    props?.Inputs[props?.index]?.fields?.forEach((input: Field, index: number) => {
      if (index != props.fieldIndex) {
        if (props?.Inputs[props.index]?.sectionId === 89 && input?.systemFieldName !== "MedicalNessityPanel" && props?.Inputs[props.index]?.sectionId === 89 && input?.systemFieldName !== "MedicalNecessityAndConsent") {
          input.defaultValue = "";
          input.validationExpression = "";
          if (input?.options)
            input?.options.forEach((element: FieldOption) => {
              element.isSelectedDefault = false;
            });
        }
        else {
          if (input?.systemFieldName !== "MedicalNecessityAndConsent") {
            input.defaultValue = "";
          }
        }
      }
    });
    const Input = await assignFormValues(
      props.Inputs,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      "",
      props.isDependency,
      props.repeatFieldSection,
      props.isDependencyRepeatFields,
      props.repeatFieldIndex,
      props.repeatDependencySectionIndex,
      props.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    );

    props.infectiousData[
      FindIndex(props?.infectiousData, props.ArrayReqId)
    ].sections = Input;
    props?.setInfectiousData &&
      props?.setInfectiousData([...props.infectiousData]);
  };

  return (
    <div
      className={`${props.parentDivClassName} mb-5 d-flex justify-content-between`}
    >
      <div></div>
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => {
          handleClick();
        }}
        id={"clearButton"}
      >
        {props.label}
      </button>
    </div>
  );
};

export default ClearButton;