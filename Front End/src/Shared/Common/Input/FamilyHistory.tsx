import { useEffect, useState, useRef } from "react";
import DynamicFormInputs from "../../DynamicFormInputs";
import { useLocation } from "react-router-dom";
import { reactSelectSMStyle, styles } from "Utils/Common";
import Select from "react-select";
const FamilyHistory = (props: any) => {
  const location = useLocation();
  const groupRepeatFields = (fields: any) => {
    let result: any = [];
    let currentGroup: any = [];
    let insideRepeat = false; // Flag to track if we are between RepeatStart and RepeatEnd
    // Iterate over the fields
    fields?.forEach((field: any) => {
      // When we encounter RepeatStart, start a new group but don't add it to the current group
      if (field?.displayFieldName === "RepeatStart") {
        insideRepeat = true;
      } else if (field?.displayFieldName === "RepeatEnd") {
        // When we encounter RepeatEnd, close the current group but don't add RepeatEnd to the group
        if (insideRepeat) {
          result?.push(currentGroup);
          currentGroup = []; // Reset the current group after RepeatEnd
        }
        insideRepeat = false;
      } else if (insideRepeat) {
        // Add the object to the group if we are between RepeatStart and RepeatEnd
        currentGroup?.push(field);
      }
    });
    // Handle case if the last group does not end with RepeatEnd
    if (currentGroup?.length > 0) {
      result?.push(currentGroup);
    }
    return result;
  };

  const [relationships, setRelationships] = useState<any[]>([]);
  const [repeatFieldsList, setRepeatFieldsList] = useState(
    !location?.state?.reqId
      ? [props.Section.sectionBasedRepeatFields]
      : groupRepeatFields(props.Section.sectionBasedRepeatFields)
  );
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  function FindIndex(arr: any[], rid: any) {
    return arr.findIndex((i: any) => i.reqId === rid);
  }
  const handleAddSection = () => {
    if (!location?.state?.reqId) {
      const duplicatedFields = props?.Section?.sectionBasedRepeatFields?.map(
        (field: any) => ({
          ...field,
        })
      );
      setRepeatFieldsList([...repeatFieldsList, duplicatedFields]);
    } else {
      const duplicatedFields = repeatFieldsList[0]?.map((field: any) => ({
        ...field,
        defaultValue: "",
      }));
      setRepeatFieldsList([...repeatFieldsList, duplicatedFields]);
    }
    setRelationships((prev) => [
      ...prev,
      { relationship: repeatFieldsList.length + 1, fields: [] },
    ]);
  };

  const updateRelationshipsDebounced = (
    groupIndex: number,
    fieldIndex: number,
    value: string | boolean,
    name: string
  ) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setRelationships(() => {
        // Create a new relationships array by iterating through all repeatFieldsList entries
        const updatedRelationships = repeatFieldsList.map(
          (fields: any, groupIdx: any) => {
            const updatedFields = fields
              .map((field: any, fieldIdx: any) => {
                if (groupIdx === groupIndex && fieldIdx === fieldIndex) {
                  // Update the specific field being edited
                  return {
                    ...field,
                    defaultValue: value,
                  };
                }
                return field;
              })
              .filter((field: any) => field.defaultValue); // Exclude fields without values

            const fieldsForRelationship = updatedFields.map((field: any) => ({
              controlId: field.controlId,
              displayName: field.displayFieldName,
              fieldValue: field.defaultValue,
            }));

            return {
              relationship: groupIdx + 1,
              fields: fieldsForRelationship,
            };
          }
        );

        // Remove empty relationships
        return updatedRelationships.filter((rel: any) => rel.fields.length > 0);
      });
    }, 300); // Debounce delay of 300ms
  };

  const handleChange = (
    groupIndex: number,
    fieldIndex: number,
    value: string | boolean,
    name: string
  ) => {
    // debugger;
    // Update repeatFieldsList immediately for responsive typing
    const updatedRepeatFieldsList = repeatFieldsList.map((fields: any[]) =>
      fields.map((field: any) => ({ ...field }))
    );
    updatedRepeatFieldsList[groupIndex][fieldIndex].defaultValue = value;
    setRepeatFieldsList(updatedRepeatFieldsList);

    // Debounced update for relationships
    updateRelationshipsDebounced(groupIndex, fieldIndex, value, name);
  };
  useEffect(() => {
    if (relationships.length > 0) {
      const obj = {
        controlId: 26,
        displayFieldName: "repeat",
        uiType: "repeat",
        systemFieldName: "repeat",
        fieldValue: relationships,
        fieldType: 2,
        previewDisplayType: "",
        previewSortOrder: 0,
      };
      props.Inputs.forEach((input: any) => {
        if (input.sectionId === 53) {
          const existingObjIndex = input.fields.findIndex(
            (field: any) => field.systemFieldName === "repeat"
          );
          if (existingObjIndex !== -1) {
            input.fields[existingObjIndex].fieldValue = relationships;
          } else {
            input.fields.push(obj);
          }
        }
      });
      const updated = props.infectiousData.map((data: any) => {
        if (data.reqId === props.ArrayReqId) {
          return { ...data, sections: props.Inputs };
        }
        return data;
      });
      let infectiousDataCopy = JSON.parse(
        JSON.stringify(props?.infectiousData)
      );
      const index = FindIndex(props?.infectiousData, props?.ArrayReqId);
      if (index !== -1) {
        infectiousDataCopy[index].sections = updated[index].sections;
        props?.setInfectiousData &&
          props?.setInfectiousData([...infectiousDataCopy]);
      }
    }
  }, [relationships]);

  const removeFamilyHistroyRow = (index: any) => {
    const updatedList = repeatFieldsList.filter(
      (_: any, idx: any) => index !== idx
    );
    setRepeatFieldsList(updatedList);
    props.Inputs.forEach((input: any) => {
      if (input.sectionId === 53) {
        const existingObjIndex = input.fields.findIndex(
          (field: any) => field.systemFieldName === "repeat"
        );
        if (existingObjIndex !== -1) {
          input.fields[existingObjIndex].fieldValue = input.fields[
            existingObjIndex
          ].fieldValue.filter((value: any) => value.relationship !== index + 1);
          input.fields[existingObjIndex].fieldValue.forEach(
            (value: any, idx: number) => {
              value.relationship = idx + 1;
            }
          );
        }
      }
    });

    props.infectiousData.map((data: any) => {
      if (data.reqId === props.ArrayReqId) {
        return { ...data, sections: props.Inputs };
      }
      return data;
    });
  };
  useEffect(() => {
    if (props.noFamilyHistroy) {
      setRepeatFieldsList(repeatFieldsList.slice(0, 1));
      Array.isArray(repeatFieldsList) &&
        repeatFieldsList.forEach((data: any[]) => {
          Array.isArray(data) &&
            data?.forEach((value: any) => {
              if (value.defaultValue) {
                value.defaultValue = "";
              }
            });
        });
      props.Inputs.forEach((input: any) => {
        if (input.sectionId === 53) {
          const existingObjIndex = input.fields.findIndex(
            (field: any) => field.systemFieldName === "repeat"
          );
          if (existingObjIndex !== -1) {
            input.fields[existingObjIndex].fieldValue = "";
          }
        }
      });
      const updated = props.infectiousData.map((data: any) => {
        if (data.reqId === props.ArrayReqId) {
          return { ...data, sections: props.Inputs };
        }
        return data;
      });
      let infectiousDataCopy = JSON.parse(
        JSON.stringify(props?.infectiousData)
      );
      const index = FindIndex(props?.infectiousData, props?.ArrayReqId);
      if (index !== -1) {
        infectiousDataCopy[index].sections = updated[index].sections;
        props?.setInfectiousData &&
          props?.setInfectiousData([...infectiousDataCopy]);
      }
    }
  }, [props.noFamilyHistroy]);

  return (
    <>
      {props?.Section?.fields.map((field: any, index: number) => (
        <DynamicFormInputs
          key={index}
          uiType={field?.uiType}
          label={field?.displayFieldName}
          length={field?.length}
          disabled={field?.disabled}
          defaultValue={field?.defaultValue ?? ""}
          displayType={field?.displayType}
          sectionDisplayType={props?.Section?.displayType}
          visible={field?.visible}
          required={field?.required}
          RadioOptions={
            field?.uiType === "RadioButton" ||
              field?.uiType === "CheckBoxList" ||
              field?.uiType === "DropDown" ||
              field?.uiType === "ServerSideDynamicDropDown"
              ? field?.options
              : ""
          }
          panels={field?.panels ?? []}
          specimenSources={field?.specimenSources ?? []}
          formData={props?.formData}
          setFormData={props?.setFormData}
          formState={props?.formState}
          setFormState={props?.setFormState}
          index={props?.index}
          fieldIndex={index}
          Inputs={props?.Inputs}
          setInputs={props?.setInputs}
          sysytemFieldName={field?.systemFieldName ?? "undefined"}
          isDependent={false}
          controlId={field?.controlId}
          dependenceyControls={props?.Section?.dependencyControls}
          searchID={field?.searchID}
          isDependency={false}
          isShown={props.isShown}
          setIsShown={props.setIsShown}
          removeUi={field?.removeUi ? field?.removeUi : false}
          recursiveDependencyControls={
            field?.showDep ? field?.dependencyControls : false
          }
          showRecursiveDep={field?.showDep ? field?.showDep : false}
          section={props?.Section}
          pageId={props?.pageId}
          repeatFields={field?.repeatFields}
          repeatDependencyControls={field?.repeatDependencyControls}
          repeatFieldsState={field?.repeatFieldsState}
          repeatDependencyControlsState={field?.repeatDependencyControlsState}
          fieldLength={props?.Section?.fields}
          sectionName={props?.Section?.sectionName}
          field={field}
          infectiousData={props.infectiousData}
          setInfectiousData={props.setInfectiousData}
          mask={field?.mask}
          enableRule={field?.enableRule}
          errorFocussedInput={props?.errorFocussedInput}
          setInfectiousDataInputsForValidation={
            props?.setInfectiousDataInputsForValidation
          }
          setInputsForValidation={props?.setInputsForValidation}
          infectiousInputs={props?.infectiousInputs}
          setCheck={props.setCheck}
          ArrayReqId={props?.rid}
          editId={props?.editID}
          rname={props.rname}
          sectionId={props?.Section?.sectionId}
          finaliseArray={props.finaliseArray}
          setFinalizeArray={props.setFinalizeArray}
          FinalAppendedArray={props.FinalAppendedArray}
          requisitionflow={"requisitionbilling"}
          LoadRequisitionSection={props.LoadRequisitionSection}
          setIns={props.setIns}
          disableCheckbox={props.disableCheckbox}
          setDisableCheckbox={props.setDisableCheckbox}
          physicianChange={props?.physicianChange}
          inputValueForSpecimen={props.inputValueForSpecimen}
          setInputValueForSpecimen={props.setInputValueForSpecimen}
          checkbox={props.checkbox}
          setCheckbox={props.setCheckbox}
          showButton={props.showButton}
          setShowButton={props.setShowButton}
          noFamilyHistroy={props.noFamilyHistroy}
          setNoFamilyHistory={props.setNoFamilyHistory}
          fields={field}
        />
      ))}
      {props?.Section?.sectionBasedRepeatFields && (
        <div className="d-flex justify-content-start mb-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={handleAddSection}
            disabled={props.noFamilyHistroy}
          >
            <i className="bi bi-plus fs-1"></i>
            Add New Row
          </button>
        </div>
      )}
      {props?.Section?.sectionBasedRepeatFields && (
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="table_bordered table-responsive overflow-hidden">
            <table className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0">
              <thead className="h-40px">
                <tr>
                  <th className="text-center">Sr. # </th>
                  {repeatFieldsList[0]?.map((item: any, index: any) => (
                    <th key={index}>{item.displayFieldName}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(repeatFieldsList) &&
                  repeatFieldsList?.map((fields: any, groupIndex: number) => (
                    <tr key={groupIndex}>
                      <td className="text-center">{groupIndex + 1}</td>
                      {Array.isArray(fields) &&
                        fields?.map((item: any, index: any) => (
                          <>
                            <td key={index} className="text-center">
                              {item.uiType === "CheckBox" && (
                                <label
                                  className={
                                    "form-check form-check-inline form-check-solid m-0 fw-500"
                                  }
                                >
                                  <input
                                    className={
                                      props.noFamilyHistroy
                                        ? "form-check-input h-20px w-20px bg-secondary"
                                        : "form-check-input h-20px w-20px"
                                    }
                                    type="checkbox"
                                    name={item?.displayFieldName}
                                    checked={item?.defaultValue || false}
                                    disabled={props.noFamilyHistroy}
                                    onChange={(e: any) =>
                                      handleChange(
                                        groupIndex,
                                        index,
                                        e.target.checked,
                                        e.target.name
                                      )
                                    }
                                  />
                                </label>
                              )}
                              {item.uiType === "TextBox" && (
                                <input
                                  value={item?.defaultValue}
                                  placeholder={item?.displayFieldName}
                                  className={
                                    props.noFamilyHistroy
                                      ? "form-control bg-secondary mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                      : "form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                  }
                                  disabled={props.noFamilyHistroy}
                                  onChange={(e) =>
                                    handleChange(
                                      groupIndex,
                                      index,
                                      e.target.value,
                                      item?.displayFieldName
                                    )
                                  }
                                />
                              )}
                              {item.uiType === "RawText" && (
                                <span>{item?.defaultValue}</span>
                              )}

                              {item.uiType === "RadioButton" && (
                                <>
                                  <div className="d-flex">
                                    {Array.isArray(item.options) &&
                                      item.options.map((choice: any) => (
                                        <label
                                          key={choice?.id}
                                          className="col-md-6 fw-400 d-flex justify-content-start align-items-start"
                                          htmlFor={choice?.name + choice?.id}
                                          id={choice?.name + choice?.id}
                                        >
                                          <input
                                            className="form-check-input ifuser flex-column-auto h-20px w-20px"
                                            type="radio"
                                            name={`${item?.displayFieldName}_${groupIndex}`} // Unique name for each row
                                            id={choice?.id}
                                            value={choice?.value}
                                            checked={
                                              item?.defaultValue ===
                                              choice?.value
                                            }
                                            disabled={props.noFamilyHistroy}
                                            onChange={async (e: any) => {
                                              handleChange(
                                                groupIndex,
                                                index,
                                                choice?.value,
                                                item?.displayFieldName
                                              );
                                            }}
                                          />
                                          <span className="ps-2 text-break">
                                            {choice?.label}
                                          </span>
                                        </label>
                                      ))}
                                  </div>
                                </>
                              )}

                              {item.uiType === "DropDown" && (
                                <Select
                                  menuPortalTarget={document.body}
                                  options={
                                    Array.isArray(item?.options) &&
                                    item?.options
                                  }
                                  className=""
                                  placeholder={item?.displayFieldName}
                                  theme={(theme: any) => styles(theme)}
                                  onChange={async (e: any) => { }}
                                  isSearchable={true}
                                  styles={reactSelectSMStyle}
                                  isDisabled={props.noFamilyHistroy}
                                />
                              )}
                              {item.uiType === "Switch" && (
                                <>
                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      name={item?.displayFieldName}
                                      onChange={async (e: any) => {
                                        handleChange(
                                          groupIndex,
                                          index,
                                          e.target.checked,
                                          item?.displayFieldName
                                        );
                                      }}
                                      disabled={props.noFamilyHistroy}
                                      checked={
                                        item.defaultValue === "True"
                                          ? true
                                          : false
                                      }
                                    />
                                  </div>
                                </>
                              )}
                            </td>
                          </>
                        ))}
                      <td style={{ cursor: "pointer" }} className="text-center">
                        {groupIndex != 0 && (
                          <button
                            className="btn btn-icon btn-danger h-30px w-30px rounded"
                            onClick={() => removeFamilyHistroyRow(groupIndex)}
                            style={{ cursor: "pointer" }}
                          >
                            <i className="bi bi-x fs-1"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default FamilyHistory;
