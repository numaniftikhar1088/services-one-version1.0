import * as yup from "yup";

// export default (
//   fields,
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
//   repeatDepFieldIndex,
//   submit = false
// ) => {
//   let errors = {};
//   const currentField = fields[index].fields[fieldIndex];
//   if (
//     currentField.required &&
//     (currentField.defaultValue === "" || !currentField.defaultValue) &&
//     currentField.defaultValue !== 0 &&
//     currentField.touched
//   ) {
//     fields[index].fields[fieldIndex].error = "This field is required!";
//     errors[currentField.displayFieldName] = currentField.requiredMessage
//       ? currentField.requiredMessage
//       : "This field is required!";
//   }
//
//   return errors;
// };

async function convertStringToYupSchema(
  stringSchema: string | undefined
): Promise<yup.Schema<unknown, any, any, "">> {
  try {
    if (!stringSchema) {
      // Return a default Yup schema or `null` schema if the input is undefined
      return yup.mixed().nullable().optional();
    }
    const schema = await new Function("yup", `return ${stringSchema}`)(yup);
    if (schema instanceof yup.Schema) {
      return schema;
    } else {
      throw new Error("Invalid schema string.");
    }
  } catch (error: any) {
    throw new Error(
      `Error converting string to Yup schema: ${error.message} ${stringSchema}`
    );
  }
}
export const ValidateInput = async (Inputs: any, setInputs: any) => {
  //let isValid: boolean = false;

  // let inputsCopy = [...Inputs];
  for (let i = 0; i < Inputs.length; i++) {
    let valueObj: any = {};
    let schemaObj: any = {};

    for (let y = 0; y < Inputs[i].fields.length; y++) {
      valueObj[Inputs[i].fields[y].systemFieldName] =
        Inputs[i].fields[y].defaultValue;
      if (
        Inputs[i].fields[y].validationExpression !== "" &&
        Inputs[i].fields[y].validationExpression !== null
      )
        schemaObj[Inputs[i].fields[y].systemFieldName] =
          await convertStringToYupSchema(
            Inputs[i].fields[y].validationExpression
          );
    }

    await yup
      .object()
      .shape(schemaObj)
      .validate(valueObj, { abortEarly: false })
      .then(function (value: any) {
        Inputs[i].fields.forEach((x: any, index: number) => {
          Inputs[i].fields[index].enableRule = "";
        });
      })
      .catch((err: any) => {
        //
        Inputs[i].fields.forEach((x: any, index: number) => {
          let innerError = err?.inner?.find((y: any) => {
            return y.path == x.systemFieldName;
          });

          if (innerError) {
            //isValid = false;
            Inputs[i].fields[index].enableRule = innerError.message;
            // x.enableRule = innerError.message;
          } else {
            Inputs[i].fields[index].enableRule = "";
          }
        });
      });
    //var vlaidatetion=await schemaObj.validate(valueObj);

    setInputs(Inputs);
    //return Inputs;
    //setInputs(inputsCopy);
    // return isValid;
  }
};

export const generateNewArray = (Inputs: any) => {
  Inputs.forEach((item: any, index: number, arrayItself: any) => {
    item.fields.forEach(
      (fieldItem: any, fieldIndex: number, arrayItselfFields: any) => {
        if (fieldItem.enableRule)
          arrayItselfFields[fieldIndex].enableRule = fieldItem.enableRule;
      }
    );
  });

  return Inputs;
};

export const getInputsEmptyValues = (Inputs: any) => {
  let emptyValuesArr: any = [];
  let InputsCopy = [...Inputs];
  InputsCopy.forEach((sectionData: any) => {
    if (sectionData.isSelected) {
      sectionData.fields.forEach((fieldData: any) => {
        if (fieldData.repeatFields) {
          fieldData.repeatFields.forEach((repeatFieldsData: any) => {
            if (!repeatFieldsData?.defaultValue && repeatFieldsData?.required && repeatFieldsData?.systemFieldName != "PatientId" && repeatFieldsData.visible) {
              emptyValuesArr.push(repeatFieldsData.displayFieldName);
            }
          });
        }
        if (!fieldData?.defaultValue && fieldData?.required && fieldData?.visible && fieldData?.systemFieldName != "PatientId") {
          emptyValuesArr.push(fieldData?.displayFieldName);
        }
      });
    }
  });
  return emptyValuesArr;
};
