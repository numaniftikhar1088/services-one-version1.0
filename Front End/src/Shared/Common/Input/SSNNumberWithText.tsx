import React, { forwardRef, useEffect, useRef } from "react";
import useLang from "../../hooks/useLanguage";
import MuiSkeleton from "../MuiSkeleton";

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
  fieldIndex: any;
  setDisableSSN?: any;
  Inputs: any;
  index: any;
  setErrorFocussedInput?: any;
}

const SSNNumberWithText = forwardRef<HTMLInputElement, InputProps>(
  (props: any, ref: any) => {
    const handleChange = (e: any) => {
      if (e.target.checked) {
        props.setDisableSSN(true);
        props.Inputs[props?.index].fields[props?.fieldIndex].defaultValue = "";
      } else props.setDisableSSN(false);
    };
    useEffect(() => {
      if (props.Inputs[props?.index].fields[props?.fieldIndex].defaultValue) {
        props.setDisableSSN(false);
      } else {
        props.setDisableSSN(true);
      }
    }, [props.Inputs[props?.index].fields[props?.fieldIndex].defaultValue]);
    const { t } = useLang();
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
        {props?.loading ? (
          <MuiSkeleton />
        ) : (
          <>
            <input
              value={props?.value}
              placeholder={props.placeholder}
              type={props?.type ?? "text"}
              pattern={props?.pattern}
              max={props.max}
              name={props.name}
              id={props.id}
              autoComplete="off"
              onChange={(e: any) => {
                props.onChange(e);
                props.setDisableSSN(false);
              }}
              onBlur={props.onBlur}
              className={`${props.className} form-control ${
                props?.disablessn ? "bg-secondary" : "bg-transparent"
              }`}
              disabled={props?.disablessn}
              maxLength={props?.length}
              required={props.required}
              ref={ref}
              onKeyDown={props.onKeyDown}
            />
            {props.error && (
              <div className="form__error">
                <span>{t(props.error)}</span>
              </div>
            )}
            <div className="mt-2">
              <label className="form-check form-check-inline form-check-solid m-0 d-flex align-items-center gap-2">
                <input
                  className="form-check-input h-15px w-15px rounded-01"
                  type="checkbox"
                  onChange={handleChange}
                  checked={props?.disablessn}
                />
                <span className="text-gray-600 fs-7">Decline To Provide</span>
              </label>
            </div>
          </>
        )}
      </div>
    );
  }
);

export default SSNNumberWithText;
