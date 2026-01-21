import { useRef, useEffect } from "react";
import InputMask from "react-input-mask";
import { useLocation } from "react-router-dom";
import MuiSkeleton from "../MuiSkeleton";
import useLang from "./../../hooks/useLanguage";

const Input = (props) => {
  // const location = useLocation();
  // const inputElement = useRef(props?.name);
  const { t } = useLang();
  const location = useLocation();
  // const inputElement = useRef(props?.name);
  // useEffect(() => {
  //   if (inputElement?.current) {
  //     if (
  //       props?.errorFocussedInput === inputElement?.current ||
  //       props?.errorFocussedInput === inputElement?.current.name
  //     ) {
  //       if (
  //         typeof inputElement.current === "object" ||
  //         inputElement?.current ||
  //         typeof inputElement.current === "undefined"
  //       )
  //         inputElement?.current?.focus();
  //     }
  //   }
  // }, [props?.errorFocussedInput]);
  const inputElement = useRef(null); // Initialize to null

  useEffect(() => {
    // Focus the input if props.error matches the name of the input
    if (inputElement.current && props.error) {
      inputElement.current.focus();
    }
  }, [props.error]);
  return (
    <>
      <div
        //data-depoptionid={props?.depOptionID}
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mb-4`
            : "col-lg-6 col-md-6 col-sm-12 mb-4"
        }
      >
        {props.name === "DrugOthres" ||
        (props.name === "OtherDescription" && props.sectionId === 21) ? null : (
          <label
            className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
            htmlFor={props.id}
          >
            {t(props.label)}
          </label>
        )}
        {props?.loading ? (
          <MuiSkeleton />
        ) : props.mask ? (
          <>
            <InputMask
              mask={props?.mask}
              value={props?.value}
              name={props.name}
              id={props.id}
              autoComplete="off"
              onChange={props.onChange}
              className="form-control bg-transparent"
              //disabled={props?.disabled === true ? false : true}
              maxLength={props?.maxLengthValue}
              required={props.required}
              ref={inputElement}
            />
            {(InputProps) => <input {...InputProps} />}
          </>
        ) : props.name === "DrugOthres" ? null : (
          <>
            {props.name === "SpecimenID" ? (
              <input
                mask={props?.mask}
                value={props?.value}
                placeholder={props.placeholder}
                disabled={
                  // (props.name === "SpecimenID" &&
                  //   location?.state?.reqId &&
                  //   location?.state?.Check) ||
                  // !location?.state?.reqId ||
                  // location?.state?.status === "Missing Info"
                  //   ? false
                  //   : true
                  false
                }
                type={props?.type ?? "text"}
                pattern={props?.pattern}
                max={props.max}
                name={props.name}
                id={props.id}
                autoComplete="off"
                onChange={props.onChange}
                onBlur={props.onBlur}
                className={
                  // (props.name === "SpecimenID" &&
                  //   location?.state?.reqId &&
                  //   location?.state?.Check) ||
                  // !location?.state?.reqId ||
                  // location?.state?.status === "Missing Info"
                  //   ? "form-control bg-transparent"
                  //   : "form-control bg-secondary"
                  "form-control bg-transparent"
                }
                //disabled={props?.disabled === true ? false : true}
                maxLength={props?.length}
                required={props.required}
                ref={inputElement}
                onKeyDown={props.onKeyDown}
              />
            ) : props.name === "OtherDescription" && props.sectionId === 21 ? (
              <>
                <textarea
                  mask={props?.mask}
                  value={props?.value}
                  placeholder={props.placeholder}
                  type={props?.type ?? "text"}
                  pattern={props?.pattern}
                  max={props.max}
                  className="form-control bg-transparent h-50px"
                  name={props.name}
                  id={props.id}
                  autoComplete="off"
                  onChange={props.onChange}
                  onBlur={props.onBlur}
                  maxLength={props?.length}
                  required={props.required}
                  ref={inputElement}
                  onKeyDown={props.onKeyDown}
                ></textarea>
              </>
            ) : (
              <>
                <input
                  mask={props?.mask}
                  value={props?.value}
                  placeholder={props.placeholder}
                  type={props?.type ?? "text"}
                  pattern={props?.pattern}
                  max={props.max}
                  name={props.name}
                  id={props.id}
                  autoComplete="off"
                  onChange={props.onChange}
                  onBlur={props.onBlur}
                  className={`${props.className} form-control ${
                    props?.disabled ? "" : "bg-transparent"
                  }`}
                  disabled={props?.disabled}
                  maxLength={props?.length}
                  required={props.required}
                  ref={inputElement}
                  onKeyDown={props.onKeyDown}
                />
              </>
            )}
          </>
        )}
        {props.error && (
          <div className="form__error">
            <span>{t(props.error)}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Input;
