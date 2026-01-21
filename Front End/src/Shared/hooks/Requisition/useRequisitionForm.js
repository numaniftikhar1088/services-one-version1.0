import { useCallback, useState } from "react";
// import { maskPhone } from '../../Utils/Common'

const useForm = (initialState, setInputs, validate) => {
  const [InputsDataValidation, setInputValidation] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Set form data and errors
  const setDataAndErrors = useCallback(
    (
      data,
      dependenceyControls,
      index,
      depControlIndex,
      fieldIndex,
      inputValue,
      isDependency,
      repeatFieldSection,
      isDependencyRepeatFields,
      repeatFieldIndex,
      repeatDependencySectionIndex,
      repeatDepFieldIndex
    ) => {
      setInputValidation(data);
      //setInputs(data);
      const errors = validate(
        data,
        dependenceyControls,
        index,
        depControlIndex,
        fieldIndex,
        inputValue,
        isDependency,
        repeatFieldSection,
        isDependencyRepeatFields,
        repeatFieldIndex,
        repeatDependencySectionIndex,
        repeatDepFieldIndex
      );
      setErrors(errors);
    },
    []
  );

  // Change inputs handler
  const changeHandler = useCallback(
    (
      e,
      dependenceyControls,
      index,
      depControlIndex,
      fieldIndex,
      inputValue,
      isDependency,
      repeatFieldSection,
      isDependencyRepeatFields,
      repeatFieldIndex,
      repeatDependencySectionIndex,
      repeatDepFieldIndex
    ) => {

      let updatedData = InputsDataValidation;
      InputsDataValidation[index].fields[fieldIndex].defaultValue = inputValue
      InputsDataValidation[index].fields[fieldIndex].touched = true;

      // if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
      //   updatedData = {
      //     ...InputsDataValidation,
      //     [e.target.name]: {
      //       ...InputsDataValidation[e.target.name],
      //       value: e.target.checked,
      //       touched: true,
      //     },
      //   }
      // } else if (e.target.tagName === 'INPUT' && e.target.type === 'file') {
      //   updatedData = {
      //     ...InputsDataValidation,
      //     [e.target.name]: {
      //       ...InputsDataValidation[e.target.name],
      //       value: e.target.files,
      //       touched: true,
      //     },
      //   }
      // } else if (e.target.tagName === 'INPUT' && e.target.type === 'tel') {
      //   updatedData = {
      //     ...InputsDataValidation,
      //     [e.target.name]: {
      //       ...InputsDataValidation[e.target.name],
      //       value: e.target.value,
      //       touched: true,
      //     },
      //   }
      // } else if (e.target.type === 'dropDown') {
      //   updatedData = {
      //     ...InputsDataValidation,
      //     [e.target.name]: {
      //       ...InputsDataValidation[e.target.name],
      //       value: e.target.value,
      //       touched: true,
      //     },
      //   }
      // } else {
      //   updatedData = {
      //     ...InputsDataValidation,
      //     [e.target.name]: {
      //       ...InputsDataValidation[e.target.name],
      //       value: e.target.value,
      //       touched: true,
      //     },
      //   }
      // }

      setDataAndErrors(
        updatedData,
        dependenceyControls,
        index,
        depControlIndex,
        fieldIndex,
        inputValue,
        isDependency,
        repeatFieldSection,
        isDependencyRepeatFields,
        repeatFieldIndex,
        repeatDependencySectionIndex,
        repeatDepFieldIndex
      );
    },
    [setDataAndErrors, InputsDataValidation]
  );

  return {
    InputsDataValidation,
    setInputValidation,
    errors,
    changeHandler,
    setErrors,
    setDataAndErrors,
  };
};

export default useForm;
