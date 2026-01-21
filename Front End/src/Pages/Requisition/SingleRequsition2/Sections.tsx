import {
  IDependencyFields,
  IRequisitionSectionsCompProps,
  IRequisitionSectionsField,
} from "../../../Interface/Requisition";
import FormInputs from "./FormInputs";

const SectionComp = ({
  sectionIndex,
  Inputs,
  section,
  setInputs,
  setIsShown,
  isShown,
}: IRequisitionSectionsCompProps) => {
  return (
    <div className="shadow card">
      <div className="card-header minh-42px d-flex justify-content-between align-items-center">
        <h3 className="m-0 fs-15px">{section.sectionName}</h3>
      </div>
      <div className="card-body py-md-4 py-3">
        <div className="row d-flex">
          {section.fields?.map(
            (field: IRequisitionSectionsField, fieldIndex: number) => (
              <FormInputs
                Inputs={Inputs}
                setInputs={setInputs}
                setIsShown={setIsShown}
                isShown={isShown}
                field={field}
                isDependent={false}
                section={section}
                fieldIndex={fieldIndex}
                sectionIndex={sectionIndex}
              />
            )
          )}
        </div>
        <div className="row col-12">
          {section?.dependencyControls?.map(
            (options: any, depControlIndex: number) => (
              <>
                {options?.dependecyFields?.map(
                  (depfield: any, dependencyFieldIndex: number) => (
                    <>
                      <FormInputs
                        Inputs={Inputs}
                        setInputs={setInputs}
                        setIsShown={setIsShown}
                        isShown={isShown}
                        fieldIndex={dependencyFieldIndex}
                        field={depfield}
                        depControlIndex={depControlIndex}
                        isDependent={true}
                        sectionIndex={sectionIndex}
                        section={section}
                      />
                    </>
                  )
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionComp;
