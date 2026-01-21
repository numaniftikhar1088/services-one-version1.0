import React, { forwardRef, useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import useLang from "../../hooks/useLanguage";

interface InputProps {
  type?: string;
  label?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  parentDivClassName?: string;
  placeholder?: string;
  value?: any;
  error?: string;
  required?: boolean;
  mask?: string;
  loading?: boolean;
  maxLength?: number;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLengthValue?: number;
  disabled?: boolean;
  max?: string;
  length?: number;
  errorFocussedInput?: any;
  sectionId?: any;
  ArrayReqId?: any;
  disablessn?: any;
  setDisableSSN?: any;
  setErrorFocussedInput?: any;
}

const MaskedInput = forwardRef<HTMLInputElement, InputProps>(
  (props: any, ref: any) => {
    const [isVisibility, setIsVisibility] = useState(false); // State to toggle visibility
    const { t } = useLang();

    // Toggle visibility function
    const toggleVisibility = () => {
      setIsVisibility((prevState) => !prevState);
    };
    const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
    useEffect(() => {
      // Scroll to the div if props.error is present
      if (props.error && divElement.current) {
        divElement.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      props.setErrorFocussedInput && props.setErrorFocussedInput();
    }, [props?.errorFocussedInput]);
    return (
      <>
        <div
          className={
            props?.parentDivClassName
              ? `${props?.parentDivClassName} mb-4`
              : "col-lg-6 col-md-6 col-sm-12 mb-4"
          }
        >
          <label
            className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
            htmlFor={props.id}
          >
            {t(props.label)}
          </label>
          <>
            <div className="d-flex gap-2">
              {/* Apply mask only when password visibility is off */}
              <InputMask
                mask={isVisibility ? "" : props?.mask} // Remove the mask when visible
                value={props?.value}
                name={props.name}
                id={props.id}
                autoComplete="off"
                onChange={props.onChange}
                className="form-control bg-transparent"
                placeholder={props.label}
                maxLength={props?.maxLengthValue}
                required={props.required}
                type={isVisibility ? "text" : "password"} // Toggle between text and password
                ref={ref}
              />

              <button
                className="btn btn-sm btn-secondary w-45px p-1 btn-icon"
                style={{ height: "38px" }}
                onClick={toggleVisibility} // Toggle visibility on button click
              >
                <i
                  className={`bi ${
                    isVisibility ? "bi-eye-slash" : "bi-eye"
                  } fs-1`}
                ></i>
              </button>
            </div>
          </>

          {props.error && (
            <div className="form__error">
              <span>{t(props.error)}</span>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default MaskedInput;
