import { useEffect, useState } from "react";
import * as yup from "yup";
import { isDate, parse } from "date-fns";
import { modifyValidationSchemaForSaveLater } from "Utils/Common/Requisition";

function parseDateString(value: any, originalValue: any) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "MM/dd/yyyy", new Date());
  return parsedDate;
}
const useYupForm = (initialState: any, validate: any) => {
  const [inputsForValidation, setInputsForValidation] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [errosTrack, setErrosTrack] = useState({});

  useEffect(() => {
    setInitialData();
  }, [initialState]);
  ///
  const setInitialData = () => {
    //setInputs(data);
    setInputsForValidation(initialState);
  };
  ///
  // Set form data and errors
  // const setDataAndErrors = async (data: any, saveForSignature: boolean) => {
  //   let errorsObj: any = {};
  //   async function convertStringToYupSchema(
  //     stringSchema: string | undefined
  //   ): Promise<yup.Schema<unknown, any, any, "">> {
  //     try {
  //       if (!stringSchema) {
  //         // Return a default Yup schema or `null` schema if the input is undefined
  //         return yup.mixed().nullable().optional();
  //       }
  //       const schema = await new Function(
  //         "yup",
  //         "parseDateString",
  //         `return ${stringSchema}`
  //       )(yup, parseDateString);
  //       if (schema instanceof yup.Schema) {
  //         return schema;
  //       } else {
  //         throw new Error(`Invalid schema string.", ${stringSchema}`);
  //       }
  //     } catch (error: any) {
  //       throw new Error(
  //         `Error converting string to Yup schema: ${error.message} ${stringSchema}`
  //       );
  //     }
  //   }
  //   ////for billing information field values
  //   const fieldsRepeatLoop = async (
  //     errors: any,
  //     i: number,
  //     fieldsIndex: number,
  //     isValid: boolean
  //   ) => {
  //     return await new Promise((resolve, reject) => {
  //       const looprepeateField = async () => {
  //         await data[i].fields[fieldsIndex].repeatFields.forEach(
  //           (x: any, index: number) => {
  //             if (!isValid) {
  //               let innerError = errors.inner.find((y: any) => {
  //                 return y.path == x.systemFieldName;
  //               });
  //               //
  //               if (innerError) {
  //                 //isValid = false;
  //                 data[i].fields[fieldsIndex].repeatFields[index].enableRule =
  //                   innerError.message;
  //                 // errorsObj = {...errorsObj,x.systemFieldName:innerError.message}
  //                 errorsObj[x.systemFieldName] = innerError.message;
  //                 // setErrosTrack((preVal) => {
  //                 //   return {
  //                 //     ...preVal,
  //                 //     [x.systemFieldName]: innerError.message,
  //                 //   };
  //                 // });
  //                 // x.enableRule = innerError.message;
  //               } else {
  //                 data[i].fields[fieldsIndex].repeatFields[index].enableRule =
  //                   "";
  //                 errorsObj[x.systemFieldName] = "";
  //                 // setErrosTrack((preVal) => {
  //                 //   return {
  //                 //     ...preVal,
  //                 //     [x.systemFieldName]: "",
  //                 //   };
  //                 // });
  //               }
  //             } else {
  //               data[i].fields[fieldsIndex].repeatFields[index].enableRule = "";
  //               errorsObj[x.systemFieldName] = "";
  //             }
  //           }
  //         );
  //         ///////////////for dependecies validation
  //         for (
  //           let y = 0;
  //           y < data[i].fields[fieldsIndex].repeatDependencyControls.length;
  //           y++
  //         ) {
  //           for (
  //             let z = 0;
  //             z <
  //             data[i].fields[fieldsIndex].repeatDependencyControls[y]
  //               .dependecyFields.length;
  //             z++
  //           ) {
  //             if (!isValid) {
  //               let innerError = errors.inner.find((er: any) => {
  //                 return (
  //                   er.path ==
  //                   data[i].fields[fieldsIndex].repeatDependencyControls[y]
  //                     .dependecyFields[z].systemFieldName
  //                 );
  //               });
  //               //
  //               if (innerError) {
  //                 //isValid = false;
  //                 data[i].fields[fieldsIndex].repeatDependencyControls[
  //                   y
  //                 ].dependecyFields[z].enableRule = innerError.message;
  //                 // x.enableRule = innerError.message;
  //                 errorsObj[
  //                   data[i].fields[fieldsIndex].repeatDependencyControls[
  //                     y
  //                   ].dependecyFields[z].systemFieldName
  //                 ] = innerError.message;
  //               } else {
  //                 errorsObj[
  //                   data[i].fields[fieldsIndex].repeatDependencyControls[
  //                     y
  //                   ].dependecyFields[z].systemFieldName
  //                 ] = "";
  //                 data[i].fields[fieldsIndex].repeatDependencyControls[
  //                   y
  //                 ].dependecyFields[z].enableRule = "";
  //               }
  //             } else {
  //               errorsObj[
  //                 data[i].fields[fieldsIndex].repeatDependencyControls[
  //                   y
  //                 ].dependecyFields[z].systemFieldName
  //               ] = "";
  //               data[i].fields[fieldsIndex].repeatDependencyControls[
  //                 y
  //               ].dependecyFields[z].enableRule = "";
  //             }
  //           }
  //         }
  //         return data;
  //       };

  //       return resolve(looprepeateField());
  //     });
  //   };
  //   ////for fields other than billing information values
  //   const fieldsLoop = async (errors: any, i: number, isValid: boolean) => {
  //     return await new Promise((resolve, reject) => {
  //       const loopField = async () => {
  //         await data[i].fields.forEach((x: any, index: number) => {
  //           if (!isValid) {
  //             let innerError = errors?.inner?.find((y: any) => {
  //               return y.path == x.systemFieldName;
  //             });
  //             //
  //             if (innerError) {
  //               //isValid = false;
  //               data[i].fields[index].enableRule = innerError.message;
  //               // x.enableRule = innerError.message;
  //               errorsObj[x.systemFieldName] = innerError.message;
  //               setErrosTrack((preVal: any) => {
  //                 return {
  //                   ...preVal,
  //                   [x.systemFieldName]: innerError.message,
  //                 };
  //               });
  //             } else {
  //               data[i].fields[index].enableRule = "";
  //               errorsObj[x.systemFieldName] = "";
  //             }
  //           } else {
  //             data[i].fields[index].enableRule = "";
  //             errorsObj[x.systemFieldName] = "";
  //           }
  //         });

  //         ///////////////for dependecies validation
  //         for (let y = 0; y < data[i].dependencyControls.length; y++) {
  //           for (
  //             let z = 0;
  //             z < data[i].dependencyControls[y].dependecyFields.length;
  //             z++
  //           ) {
  //             if (!isValid) {
  //               let innerError = errors?.inner?.find((er: any) => {
  //                 return (
  //                   er.path ==
  //                   data[i].dependencyControls[y].dependecyFields[z]
  //                     .systemFieldName
  //                 );
  //               });
  //               //
  //               if (innerError) {
  //                 //isValid = false;
  //                 data[i].dependencyControls[y].dependecyFields[z].enableRule =
  //                   innerError.message;
  //                 // x.enableRule = innerError.message;
  //                 errorsObj[
  //                   data[i].dependencyControls[y].dependecyFields[
  //                     z
  //                   ].systemFieldName
  //                 ] = innerError.message;
  //               } else {
  //                 data[i].dependencyControls[y].dependecyFields[z].enableRule =
  //                   "";
  //                 errorsObj[
  //                   data[i].dependencyControls[y].dependecyFields[
  //                     z
  //                   ].systemFieldName
  //                 ] = "";
  //               }
  //             } else {
  //               data[i].dependencyControls[y].dependecyFields[z].enableRule =
  //                 "";
  //               errorsObj[
  //                 data[i].dependencyControls[y].dependecyFields[
  //                   z
  //                 ].systemFieldName
  //               ] = "";
  //             }
  //           }
  //         }
  //         return data;
  //       };

  //       resolve(loopField());
  //     });
  //   };

  //   ///this method is for inputs of billing information for converting string v schema to valid working schema
  //   const ValidateRepeatInput = async (
  //     field: any,
  //     sectionindex: number,
  //     fieldsIndex: number
  //   ) => {
  //     //let isValid: boolean = false;

  //     // let inputsCopy = [...Inputs];
  //     let valueObj: any = {};
  //     let schemaObj: any = {};

  //     for (let y = 0; y < field.repeatFields.length; y++) {
  //       if (valueObj.hasOwnProperty(field.repeatFields[y].systemFieldName)) {
  //         if (
  //           valueObj[field.repeatFields[y].systemFieldName] !== null ||
  //           valueObj[field.repeatFields[y].systemFieldName] != ""
  //         )
  //           continue;
  //       }
  //       valueObj[field.repeatFields[y].systemFieldName] =
  //         field.repeatFields[y].defaultValue;
  //       if (
  //         field.repeatFields[y].validationExpression !== "" &&
  //         field.repeatFields[y].validationExpression !== null
  //       )
  //         schemaObj[field.repeatFields[y].systemFieldName] =
  //           await convertStringToYupSchema(
  //             field.repeatFields[y].validationExpression
  //           );
  //     }
  //     ////for dependencies
  //     for (let y = 0; y < field.repeatDependencyControls.length; y++) {
  //       for (
  //         let z = 0;
  //         z < field.repeatDependencyControls[y].dependecyFields.length;
  //         z++
  //       ) {
  //         if (
  //           valueObj.hasOwnProperty(
  //             field.repeatDependencyControls[y].dependecyFields[z]
  //               .systemFieldName
  //           )
  //         ) {
  //           if (
  //             valueObj[
  //             field.repeatDependencyControls[y].dependecyFields[z]
  //               .systemFieldName
  //             ] !== null ||
  //             valueObj[
  //             field.repeatDependencyControls[y].dependecyFields[z]
  //               .systemFieldName
  //             ] != ""
  //           )
  //             continue;
  //         }

  //         valueObj[
  //           field.repeatDependencyControls[y].dependecyFields[z].systemFieldName
  //         ] = field.repeatDependencyControls[y].dependecyFields[z].defaultValue;

  //         if (
  //           field.repeatDependencyControls[y].dependecyFields[z]
  //             .validationExpression !== "" &&
  //           field.repeatDependencyControls[y].dependecyFields[z]
  //             .validationExpression !== null
  //         )
  //           schemaObj[
  //             field.repeatDependencyControls[y].dependecyFields[
  //               z
  //             ].systemFieldName
  //           ] = await convertStringToYupSchema(
  //             field.repeatDependencyControls[y].dependecyFields[z]
  //               .validationExpression
  //           );
  //       }
  //     }
  //     var schema = yup.object(schemaObj).describe();
  //     try {
  //       await yup
  //         .object()
  //         .shape(schemaObj)
  //         .validateSync(valueObj, { abortEarly: false });
  //       return await fieldsRepeatLoop(
  //         undefined,
  //         sectionindex,
  //         fieldsIndex,
  //         true
  //       );
  //     } catch (e: any) {
  //       return await fieldsRepeatLoop(e, sectionindex, fieldsIndex, false);
  //       //setInputsForValidation(b)
  //     }
  //   };

  //   ///this method is for simple inputs other than billing information for converting string v schema to valid working schema
  //   const ValidateInput = async (Inputs: any) => {
  //     //let isValid: boolean = false;

  //     // let inputsCopy = [...Inputs];
  //     for (let i = 0; i < Inputs.length; i++) {
  //       let valueObj: any = {};
  //       let schemaObj: any = {};

  //       for (let y = 0; y < Inputs[i].fields.length; y++) {
  //         if (Inputs[i].fields[y] == null) continue;
  //         if (Inputs[i].fields[y].uiType === "Repeat") {
  //           data = await ValidateRepeatInput(Inputs[i].fields[y], i, y);
  //           //
  //           continue;
  //         }
  //         if (
  //           saveForSignature &&
  //           (Inputs[i].fields[y].systemFieldName === "PhysicianSignatureType" ||
  //             Inputs[i].fields[y].systemFieldName === "PhysicianSignature")
  //         ) {
  //           continue;
  //         }
  //         valueObj[Inputs[i].fields[y].systemFieldName] =
  //           Inputs[i].fields[y].defaultValue;
  //         if (
  //           Inputs[i].fields[y].validationExpression !== "" &&
  //           Inputs[i].fields[y].validationExpression !== null
  //         )
  //           schemaObj[Inputs[i].fields[y].systemFieldName] =
  //             await convertStringToYupSchema(
  //               Inputs[i].fields[y].validationExpression
  //             );
  //       }
  //       ////for dependencies
  //       for (let y = 0; y < Inputs[i].dependencyControls.length; y++) {
  //         for (
  //           let z = 0;
  //           z < Inputs[i].dependencyControls[y].dependecyFields.length;
  //           z++
  //         ) {
  //           valueObj[
  //             Inputs[i].dependencyControls[y].dependecyFields[z].systemFieldName
  //           ] = Inputs[i].dependencyControls[y].dependecyFields[z].defaultValue;

  //           if (
  //             Inputs[i].dependencyControls[y].dependecyFields[z]
  //               .validationExpression !== "" &&
  //             Inputs[i].dependencyControls[y].dependecyFields[z]
  //               .validationExpression !== null
  //           )
  //             schemaObj[
  //               Inputs[i].dependencyControls[y].dependecyFields[
  //                 z
  //               ].systemFieldName
  //             ] = await convertStringToYupSchema(
  //               Inputs[i].dependencyControls[y].dependecyFields[z]
  //                 .validationExpression
  //             );
  //         }
  //       }

  //       try {
  //         await yup
  //           .object()
  //           .shape(schemaObj)
  //           .validateSync(valueObj, { abortEarly: false });
  //         let fieldLoopsData = await fieldsLoop(undefined, i, true);
  //       } catch (e: any) {
  //         let fieldLoopsData = await fieldsLoop(e, i, false);
  //       }
  //     }
  //   };
  //   await ValidateInput(data);
  //   setErrors(errors);
  //   return { data: data, validation: errorsObj };
  // };
  const setDataAndErrors = async (data: any, saveForSignature: boolean) => {
    let errorsObj: any = {};
    const allErrors = new Map<string, string>(); // Accumulate errors by systemFieldName (unique key)

    async function convertStringToYupSchema(
      stringSchema: string | undefined
    ): Promise<yup.Schema<unknown, any, any, "">> {
      try {
        if (!stringSchema) {
          return yup.mixed().nullable().optional();
        }
        const schema = await new Function(
          "yup",
          "parseDateString",
          `return ${stringSchema}`
        )(yup, parseDateString);
        if (schema instanceof yup.Schema) {
          return schema;
        } else {
          throw new Error(`Invalid schema string: ${stringSchema}`);
        }
      } catch (error: any) {
        throw new Error(
          `Error converting string to Yup schema: ${error.message} ${stringSchema}`
        );
      }
    }

    // Helper to merge accumulated errors into errorsObj (only set if error exists)
    const mergeErrors = () => {
      allErrors.forEach((message, key) => {
        errorsObj[key] = message;
      });
      // Optional: Clear fields with no error (set to "" if not in allErrors)
      // Adjust keys based on your form structure if needed
      Object.keys(errorsObj).forEach(key => {
        if (!allErrors.has(key)) {
          errorsObj[key] = ""; // Only clear if no error anywhere
        }
      });
    };

    ////for billing information field values
    const fieldsRepeatLoop = async (
      errors: any,
      i: number,
      fieldsIndex: number,
      isValid: boolean
    ) => {
      return await new Promise((resolve) => {
        const looprepeateField = async () => {
          await data[i].fields[fieldsIndex].repeatFields.forEach(
            (x: any, index: number) => {
              if (!isValid && errors) {
                let innerError = errors.inner.find((y: any) => {
                  return y.path == x.systemFieldName;
                });
                if (innerError) {
                  data[i].fields[fieldsIndex].repeatFields[index].enableRule = innerError.message;
                  allErrors.set(x.systemFieldName, innerError.message); // Accumulate, don't overwrite
                  setErrosTrack((preVal: any) => ({
                    ...preVal,
                    [x.systemFieldName]: innerError.message,
                  }));
                  // Optional duplicate log
                  // if (allErrors.has(x.systemFieldName) && allErrors.get(x.systemFieldName) !== innerError.message) {
                  //   console.warn(`Conflicting error for ${x.systemFieldName}: ${allErrors.get(x.systemFieldName)} vs ${innerError.message}`);
                  // }
                } else {
                  // Don't clear global error here—preserve if set elsewhere
                  data[i].fields[fieldsIndex].repeatFields[index].enableRule = "";
                }
              } else {
                data[i].fields[fieldsIndex].repeatFields[index].enableRule = "";
              }
            }
          );

          ///////////////for dependencies validation
          for (
            let y = 0;
            y < data[i].fields[fieldsIndex].repeatDependencyControls.length;
            y++
          ) {
            for (
              let z = 0;
              z < data[i].fields[fieldsIndex].repeatDependencyControls[y].dependecyFields.length;
              z++
            ) {
              if (!isValid && errors) {
                let innerError = errors.inner.find((er: any) => {
                  return (
                    er.path ==
                    data[i].fields[fieldsIndex].repeatDependencyControls[y]
                      .dependecyFields[z].systemFieldName
                  );
                });
                if (innerError) {
                  data[i].fields[fieldsIndex].repeatDependencyControls[y].dependecyFields[z].enableRule = innerError.message;
                  allErrors.set(
                    data[i].fields[fieldsIndex].repeatDependencyControls[y].dependecyFields[z].systemFieldName,
                    innerError.message
                  ); // Accumulate
                  setErrosTrack((preVal: any) => ({
                    ...preVal,
                    [data[i].fields[fieldsIndex].repeatDependencyControls[y].dependecyFields[z].systemFieldName]: innerError.message,
                  }));
                } else {
                  // Don't clear global
                  data[i].fields[fieldsIndex].repeatDependencyControls[y].dependecyFields[z].enableRule = "";
                }
              } else {
                data[i].fields[fieldsIndex].repeatDependencyControls[y].dependecyFields[z].enableRule = "";
              }
            }
          }
          resolve(data);
        };
        looprepeateField();
      });
    };

    ////for fields other than billing information values
    const fieldsLoop = async (errors: any, i: number, isValid: boolean) => {
      return await new Promise((resolve) => {
        const loopField = async () => {
          await data[i].fields.forEach((x: any, index: number) => {
            if (!isValid && errors) {
              let innerError = errors?.inner?.find((y: any) => {
                return y.path == x.systemFieldName;
              });
              if (innerError) {
                data[i].fields[index].enableRule = innerError.message;
                allErrors.set(x.systemFieldName, innerError.message); // Accumulate
                setErrosTrack((preVal: any) => ({
                  ...preVal,
                  [x.systemFieldName]: innerError.message,
                }));
              } else {
                // Don't clear global
                data[i].fields[index].enableRule = "";
              }
            } else {
              data[i].fields[index].enableRule = "";
            }
          });

          ///////////////for dependencies validation
          for (let y = 0; y < data[i].dependencyControls.length; y++) {
            for (
              let z = 0;
              z < data[i].dependencyControls[y].dependecyFields.length;
              z++
            ) {
              if (!isValid && errors) {
                let innerError = errors?.inner?.find((er: any) => {
                  return (
                    er.path ==
                    data[i].dependencyControls[y].dependecyFields[z].systemFieldName
                  );
                });
                if (innerError) {
                  data[i].dependencyControls[y].dependecyFields[z].enableRule = innerError.message;
                  allErrors.set(
                    data[i].dependencyControls[y].dependecyFields[z].systemFieldName,
                    innerError.message
                  ); // Accumulate
                } else {
                  // Don't clear global
                  data[i].dependencyControls[y].dependecyFields[z].enableRule = "";
                }
              } else {
                data[i].dependencyControls[y].dependecyFields[z].enableRule = "";
              }
            }
          }
          resolve(data);
        };
        loopField();
      });
    };

    ///this method is for inputs of billing information for converting string to schema to valid working schema
    const ValidateRepeatInput = async (
      field: any,
      sectionindex: number,
      fieldsIndex: number
    ) => {
      let valueObj: any = {};
      let schemaObj: any = {};

      for (let y = 0; y < field.repeatFields.length; y++) {
        const key = field.repeatFields[y].systemFieldName;
        if (valueObj.hasOwnProperty(key)) {
          if (valueObj[key] !== null && valueObj[key] !== "") continue;
        }
        valueObj[key] = field.repeatFields[y].defaultValue;
        if (
          field.repeatFields[y].validationExpression !== "" &&
          field.repeatFields[y].validationExpression !== null
        )
          schemaObj[key] = await convertStringToYupSchema(
            field.repeatFields[y].validationExpression
          );
      }
      ////for dependencies
      for (let y = 0; y < field.repeatDependencyControls.length; y++) {
        for (
          let z = 0;
          z < field.repeatDependencyControls[y].dependecyFields.length;
          z++
        ) {
          const key = field.repeatDependencyControls[y].dependecyFields[z].systemFieldName;
          if (valueObj.hasOwnProperty(key)) {
            if (valueObj[key] !== null && valueObj[key] !== "") continue;
          }
          valueObj[key] = field.repeatDependencyControls[y].dependecyFields[z].defaultValue;

          if (
            field.repeatDependencyControls[y].dependecyFields[z].validationExpression !== "" &&
            field.repeatDependencyControls[y].dependecyFields[z].validationExpression !== null
          )
            schemaObj[key] = await convertStringToYupSchema(
              field.repeatDependencyControls[y].dependecyFields[z].validationExpression
            );
        }
      }

      var schema = yup.object(schemaObj).describe();
      try {
        await yup
          .object()
          .shape(schemaObj)
          .validateSync(valueObj, { abortEarly: false });
        mergeErrors(); // Merge after successful validation (no new errors)
        return await fieldsRepeatLoop(undefined, sectionindex, fieldsIndex, true);
      } catch (e: any) {
        mergeErrors(); // Merge errors from this catch
        return await fieldsRepeatLoop(e, sectionindex, fieldsIndex, false);
      }
    };

    ///this method is for simple inputs other than billing information for converting string to schema to valid working schema
    const ValidateInput = async (Inputs: any) => {
      for (let i = 0; i < Inputs.length; i++) {
        let valueObj: any = {};
        let schemaObj: any = {};

        for (let y = 0; y < Inputs[i].fields.length; y++) {
          if (Inputs[i].fields[y] == null) continue;
          if (Inputs[i].fields[y].uiType === "Repeat") {
            data = await ValidateRepeatInput(Inputs[i].fields[y], i, y);
            continue;
          }
          if (
            saveForSignature &&
            (Inputs[i].fields[y].systemFieldName === "PhysicianSignatureType" ||
              Inputs[i].fields[y].systemFieldName === "PhysicianSignature")
          ) {
            continue;
          }
          const key = Inputs[i].fields[y].systemFieldName;
          valueObj[key] = Inputs[i].fields[y].defaultValue;
          if (
            Inputs[i].fields[y].validationExpression !== "" &&
            Inputs[i].fields[y].validationExpression !== null
          )
            schemaObj[key] = await convertStringToYupSchema(
              Inputs[i].fields[y].validationExpression
            );
        }
        ////for dependencies
        for (let y = 0; y < Inputs[i].dependencyControls.length; y++) {
          for (
            let z = 0;
            z < Inputs[i].dependencyControls[y].dependecyFields.length;
            z++
          ) {
            const key = Inputs[i].dependencyControls[y].dependecyFields[z].systemFieldName;
            valueObj[key] = Inputs[i].dependencyControls[y].dependecyFields[z].defaultValue;

            if (
              Inputs[i].dependencyControls[y].dependecyFields[z].validationExpression !== "" &&
              Inputs[i].dependencyControls[y].dependecyFields[z].validationExpression !== null
            )
              schemaObj[key] = await convertStringToYupSchema(
                Inputs[i].dependencyControls[y].dependecyFields[z].validationExpression
              );
          }
        }

        try {
          await yup
            .object()
            .shape(schemaObj)
            .validateSync(valueObj, { abortEarly: false });
          mergeErrors(); // No errors from this section
          await fieldsLoop(undefined, i, true);
        } catch (e: any) {
          mergeErrors(); // Capture errors from this section
          await fieldsLoop(e, i, false);
        }
      }
    };

    await ValidateInput(data);
    mergeErrors(); // Final merge
    setErrors(errorsObj); // Assuming this sets global errors
    return { data: data, validation: errorsObj };
  };

  // Change inputs handler
  const submitForValidation = async (
    saveForLater: boolean,
    saveForSignature: boolean
  ) => {
    /////this is for continue button for preview requistion
    if (saveForLater) {
      let updatedData = JSON.parse(JSON.stringify(inputsForValidation));
      const selectedItems = updatedData.filter((item: any) => item.isSelected);
      let inputsWithValidationError = await setDataAndErrors(
        selectedItems,
        saveForSignature
      );
      return inputsWithValidationError;
    }
    /////this is for saveforLater

    var saveforlatterarray: string[] = [
      "FacilityID",
      "PhysicianID",
      "FirstName",
      "LastName",
      "DOB",
    ];

    if (!saveForLater) {
      let updatedDataSaveForLater = JSON.parse(
        JSON.stringify(inputsForValidation)
      );
      let modifiedSchemaInputs = modifyValidationSchemaForSaveLater(
        updatedDataSaveForLater,
        saveforlatterarray
      );
      return modifiedSchemaInputs;
    }
  };

  const submitPayloadForValidation = async (
    formActionButton: any[],
    saveForSignature: boolean = false
  ) => {
    // Early exit for empty action button list
    if (formActionButton.length === 0) {
      return modifyValidationSchemaForSaveLater(
        cloneInputs(inputsForValidation),
        []
      );
    }

    const clonedInputs = cloneInputs(inputsForValidation);

    if (formActionButton.length > 1 || formActionButton[0] !== "AllRequired") {
      return modifyValidationSchemaForSaveLater(clonedInputs, formActionButton);
    } else {
      return setDataAndErrors(clonedInputs, saveForSignature);
    }
  };

  // Helper function to clone inputs
  function cloneInputs(inputs: any) {
    return JSON.parse(JSON.stringify(inputs));
  }

  return {
    inputsForValidation,
    setInputsForValidation,
    errors,
    submitForValidation,
    setErrors,
    setDataAndErrors,
    errosTrack,
    submitPayloadForValidation,
  };
};

export default useYupForm;
