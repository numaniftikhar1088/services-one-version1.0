import { useCallback, useEffect, useState } from "react";
import { maskInt, maskPhone } from "../../Utils/Common";
import {
  confirmPasswordValidator,
  noValidator,
  passwordValidator,
} from "../../Utils/Validations";

const useForm = (initialState, validate, activationType, check, noProvider) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  // Set form data and errors
  const setDataAndErrors = useCallback(
    (data) => {
      setFormData(data);
      const errors = validate(data);
      setErrors(errors);
    },
    [validate]
  );

  useEffect(() => {
    let updatedData = null;
    if (check === undefined && activationType === undefined) return;
    if (noProvider) {
      updatedData = {
        ...formData,
        physicianFirstName: noValidator,
        physicianLastName: noValidator,
        phoneNumber: noValidator,
        activationType: noValidator,
        email: noValidator,
        password: noValidator,
        reEnterPassword: noValidator,
        username: noValidator,
        npi: noValidator,
      };
    } else if (activationType == 0) {
      updatedData = {
        ...formData,
        password: check ? passwordValidator : noValidator,
        reEnterPassword: check ? confirmPasswordValidator : noValidator,
        username: {
          value: formData?.username?.value,
          required: true,
        },
        email: noValidator,
      };
    } else {
      updatedData = {
        ...formData,
        email: {
          value: formData?.email?.value,
          required: true,
          requiredMessage: "Email address is required!",
          email: true,
          emailMessage: "Email address is not valid!",
        },
        password: noValidator,
        reEnterPassword: noValidator,
        username: noValidator,
      };
    }
    setFormData(updatedData);
  }, [activationType, check, noProvider]);

  // Change inputs handler
  const changeHandler = (e) => {
    let updatedData;

    if (e.target.name === "enter3DigitsProgram" || e.target.name === "enter3DigitsLabCode") {
      const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
      updatedData = {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          value: newValue,
          touched: true,
        },
      };
    }
    else if (e.target.name === "clia") {
      const cliaValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toUpperCase();
      updatedData = {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          value: cliaValue,
          touched: true,
        },
      };
    }
    else if (e.target.name === "zipCode1" || e.target.name === "DirzipCode1") {
      const zipValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);
      updatedData = {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          value: zipValue,
          touched: true,
        },
      };
    }
    else if (e?.target?.tagName === "INPUT" && e?.target?.type === "checkbox") {
      updatedData = {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          value: e.target.checked,
          touched: true,
        },
      };
    } else if (e.target.tagName === "INPUT" && e.target.type === "file") {
      updatedData = {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          value: e.target.files,
          touched: true,
        },
      };
    } else if (e.target.tagName === "INPUT" && e.target.type === "tel") {
      updatedData = {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          value:
            e.target.name === "npi"
              ? maskInt(e.target.value)
              : maskPhone(e.target.value),
          touched: true,
        },
      };
    } else if (e.target.type === "dropDown") {
      updatedData = {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          value: maskPhone(e.target.value),
          touched: true,
        },
      };
    } else {
      updatedData = {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          value: e.target.value,
          touched: true,
        },
      };
    }
    setDataAndErrors(updatedData);
  };

  return {
    formData,
    setFormData,
    errors,
    changeHandler,
    setErrors,
    setDataAndErrors,
  };
};

export default useForm;
