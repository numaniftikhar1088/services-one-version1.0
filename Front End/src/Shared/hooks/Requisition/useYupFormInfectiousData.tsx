import { useEffect, useState } from "react";
import * as yup from "yup";

const useYupFormInfectiousData = (
  initialState: any,
  setInfectiousData: any
) => {
  const [inputDataInputsForValidation, setInfectiousDataInputsForValidation] =
    useState(initialState);
  const [errors, setErrors] = useState({});
  const [errosTrack, setErrosTrack] = useState({});


  useEffect(() => {
    setInitialData();
  }, [initialState]);
  ///
  const setInitialData = () => {
    setInfectiousDataInputsForValidation(initialState);
  };
  const setDataAndErrors = async (
    data: any,
    isSaveForLaterRequisitionCheck: boolean = false
  ) => {
    let errorsObj: any = {};
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
    const fieldsLoop = async (errors: any, i: number, isValid: boolean) => {
      return await new Promise((resolve, reject) => {
        const loopField = async () => {
          await data[i].fields.forEach((x: any, index: number) => {
            if (!isValid) {
              let innerError = errors?.inner?.find((y: any) => {
                return y.path == x.systemFieldName;
              });
              //
              if (innerError) {
                //isValid = false;
                data[i].fields[index].enableRule = innerError.message;
                // x.enableRule = innerError.message;
                errorsObj[x.systemFieldName] = innerError.message;
                setErrosTrack((preVal: any) => {
                  return {
                    ...preVal,
                    [x.systemFieldName]: innerError.message,
                  };
                });
              } else {
                data[i].fields[index].enableRule = "";
                errorsObj[x.systemFieldName] = "";
              }
            } else {
              data[i].fields[index].enableRule = "";
              errorsObj[x.systemFieldName] = "";
            }
          });

          return data;
        };

        resolve(loopField());
      });
    };

    const ValidateInput = async (Inputs: any) => {
      for (let i = 0; i < Inputs.length; i++) {
        let valueObj: any = {};
        let schemaObj: any = {};

        for (let y = 0; y < Inputs[i].fields.length; y++) {
          if (isSaveForLaterRequisitionCheck) {
            if (Inputs[i].fields[y].systemFieldName === "SpecimenID") {
              valueObj[Inputs[i].fields[y].systemFieldName] =
                Inputs[i].fields[y].defaultValue;
              if (
                Inputs[i].fields[y].validationExpression !== "" &&
                Inputs[i].fields[y].validationExpression !== null
              ) {
                schemaObj[Inputs[i].fields[y].systemFieldName] =
                  await convertStringToYupSchema(
                    Inputs[i].fields[y].validationExpression
                  );
              }
            }
          } else {
            valueObj[Inputs[i].fields[y].systemFieldName] =
              Inputs[i].fields[y].defaultValue;
            if (
              Inputs[i].fields[y].validationExpression !== "" &&
              Inputs[i].fields[y].validationExpression !== null
            ) {
              schemaObj[Inputs[i].fields[y].systemFieldName] =
                await convertStringToYupSchema(
                  Inputs[i].fields[y].validationExpression
                );
            }
          }
        }

        try {
          await yup
            .object()
            .shape(schemaObj)
            .validateSync(valueObj, { abortEarly: false });
          await fieldsLoop(undefined, i, true);
        } catch (e: any) {
          await fieldsLoop(e, i, false);
        }
      }
    };

    await ValidateInput(data);
    setErrors(errors);
    return { data: data, validation: errorsObj };
  };

  // const submitInfectiousInputsForValidation = async (saveForLater: boolean) => {
  //   let updatedData = JSON.parse(JSON.stringify(inputDataInputsForValidation));
  //   //I have changed it
  //   let inputsWithValidationError: any;
  //   updatedData.map((item: any) => {
  //     if (item?.isSelected) {
  //       setDataAndErrors(item.sections).then(
  //         (inputsWithValidationError: any) => {
  //           item.sections = inputsWithValidationError.data;
  //
  //           inputsWithValidationError = inputsWithValidationError?.validation;
  //           setInfectiousData(updatedData);
  //         }
  //       );
  //     }
  //   });
  //   return {
  //     data: updatedData,
  //     validation: inputsWithValidationError?.validation,
  //   };
  // };
  // const submitInfectiousInputsForValidation = async (saveForLater: boolean) => {
  //   let updatedData = JSON.parse(JSON.stringify(inputDataInputsForValidation));
  //   let allInputsWithValidationError: any[] = [];

  //   // Use Promise.all to handle the asynchronous updates properly
  //   await Promise.all(
  //     updatedData.map(async (item: any) => {
  //       if (item?.isSelected) {
  //         const inputsWithValidationError: any = await setDataAndErrors(
  //           item.sections
  //         );
  //         item.sections = inputsWithValidationError.data;
  //
  //         allInputsWithValidationError.push(
  //           inputsWithValidationError?.validation
  //         );
  //       }
  //     })
  //   );

  //   setInfectiousData(updatedData);
  //   // Combining all validation errors into one
  //   const combinedValidationErrors = allInputsWithValidationError.flat();
  //   console.log(updatedData, combinedValidationErrors, "updatedData8765");
  //   return {
  //     data: updatedData,
  //     validation: combinedValidationErrors,
  //   };
  // };

  const submitInfectiousInputsForValidation = async (
    saveForLater: boolean = false
  ) => {
    let updatedData = JSON.parse(JSON.stringify(inputDataInputsForValidation));
    let promises = updatedData.map(async (item: any) => {

      if (item?.isSelected) {
        let inputsWithValidationError = await setDataAndErrors(
          item.sections,
          saveForLater
        );
        item.sections = inputsWithValidationError.data;
        return inputsWithValidationError;
      }
    });
    let results = await Promise.all(promises);
    let inputsWithValidationError = results.filter(
      (result) => result !== undefined
    );

    setInfectiousData(updatedData);

    let validationErrors = inputsWithValidationError.map(
      (error) => error.validation
    );

    return {
      data: updatedData,
      validation: validationErrors,
    };
  };

  const submitFormSaveForLaterRequisitionValidation = async () => {
    let updatedData = JSON.parse(JSON.stringify(inputDataInputsForValidation));
    let promises = updatedData.map(async (item: any) => {
      if (item?.isSelected) {
        let inputsWithValidationError = await setDataAndErrors(
          item.sections,
          true
        );
        item.sections = inputsWithValidationError.data;
        return inputsWithValidationError;
      }
    });
    let results = await Promise.all(promises);
    let inputsWithValidationError = results.filter(
      (result) => result !== undefined
    );

    setInfectiousData(updatedData);
    let validationErrors = inputsWithValidationError.map(
      (error) => error.validation
    );


    return {
      data: updatedData,
      validation: validationErrors,
    };
  };

  return {
    inputDataInputsForValidation,
    setInfectiousDataInputsForValidation,
    submitInfectiousInputsForValidation,
    submitFormSaveForLaterRequisitionValidation,
  };
};

export default useYupFormInfectiousData;
