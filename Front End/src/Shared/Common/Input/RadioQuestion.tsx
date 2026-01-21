import React, { useEffect, useRef } from "react";
import useLang from "./../../hooks/useLanguage";

const RadioQuestion = (props: any) => {
  const { t } = useLang();
  const inputElementReactSelect = useRef(props?.name);
  useEffect(() => {
    if (
      props?.errorFocussedInput === inputElementReactSelect.current ||
      props?.errorFocussedInput === inputElementReactSelect.current.id
    ) {
      const defaultSelectedOption =
        Array.isArray(props?.RadioOptions) &&
        props?.RadioOptions?.find((choice: any) => choice?.isSelectedDefault);
      if (!defaultSelectedOption) {
        inputElementReactSelect.current.focus();
      }
    }
  }, [props?.errorFocussedInput]);
  useEffect(() => {
    const defaultSelectedOption =
      Array.isArray(props?.RadioOptions) &&
      props?.RadioOptions?.find((choice: any) => choice?.isSelectedDefault);
    const e = {
      target: {
        value: defaultSelectedOption?.value,
        attributes: {
          "data-name": { value: props?.systemFieldName },
          "data-id": { value: defaultSelectedOption?.id },
        },
        checked: false,
      },
    };
    if (defaultSelectedOption) {
      props?.onChange(
        e,
        defaultSelectedOption.value,
        defaultSelectedOption.value,
        defaultSelectedOption?.label
      );
    }
  }, []);
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
  console.log("nnnnnnn",props)
  return (
    <>
      <div
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mb-2 d-flex flex-wrap justify-content-between gap-2`
            : "col-lg-6 col-md-6 col-sm-12 d-flex flex-wrap justify-content-between gap-2 mb-2"
        }
        id={props?.name}
        ref={inputElementReactSelect}
        tabIndex={-1}
      >
        <label
          className={`d-block mb-2 fw-500 text-dark${
            props.required ? " required" : ""
          }`}
        >
          {t(props?.label)}
        </label>
        <div className="d-flex gap-2 justify-content-start">
          {Array.isArray(props?.RadioOptions) &&
            props?.RadioOptions?.map((choice: any) => {
              return (
                choice?.isVisable && (
                  <label
                    key={choice?.id}
                    className={
                      props.name === "POCTestResult"
                        ? "col-12 fw-400 d-flex justify-content-start align-items-start"
                        : "col-12 col-lg-6 fw-400 d-flex justify-content-start align-items-start"
                    }
                    htmlFor={choice?.name + choice?.id}
                    id={choice?.name + choice?.id}
                  >
                    <input
                      className="form-check-input ifuser flex-column-auto h-20px w-20px"
                      type="radio"
                      name={
                        props?.name +
                        props?.repeatFieldIndex +
                        window.crypto.randomUUID()
                      }
                      id={choice?.id}
                      data-nameCheck={props?.name}
                      data-test-id={choice.label.split(" ").join("")}
                      data-name={choice?.name}
                      data-id={choice?.id}
                      data-optionDataId={choice?.optionDataID}
                      value={choice?.value}
                      checked={
                        props.defaultValue
                          ? choice?.value.split(" ").join("") ===
                            props?.defaultValue.split(" ").join("")
                          : choice?.isSelectedDefault
                      }
                      defaultChecked={choice.isSelectedDefault ? true : false}
                      onChange={async (e: any) => {
                        const { value } = e.target;
                        props?.onChange(e, value, choice?.value, choice?.label);
                      }}
                      disabled={
                        props.sectionId === 45 || props.sectionId === 46
                          ? props.isEnable
                          : props?.disabled
                      }
                      required={props.required}
                    />
                    <span className="ps-2 text-break">{t(choice?.label)}</span>
                  </label>
                )
              );
            })}
        </div>
        {props.error && (
          <div className="form__error">
            <span>{t(props.error)}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(RadioQuestion);