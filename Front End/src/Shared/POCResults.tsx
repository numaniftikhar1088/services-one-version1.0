import React, { useEffect, useRef } from "react";
import useLang from "./hooks/useLanguage";

const POCResults = (props: any) => {
  const { t } = useLang();
  const inputElementReactSelect = useRef(props?.name);
  useEffect(() => {
    if (
      props?.errorFocussedInput === inputElementReactSelect.current ||
      props?.errorFocussedInput === inputElementReactSelect.current.id
    ) {
      inputElementReactSelect.current.focus();
    }
  }, [props?.errorFocussedInput]);

  return (
    <>
      <div
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mb-5`
            : "col-lg-6 col-md-6 col-sm-12 mb-5 "
        }
        id={props?.name}
        ref={inputElementReactSelect}
        tabIndex={-1}
      >
        <div
          className={
            props.systemFieldName === "POCTestResult"
              ? ""
              : "row pb-2 border-dashed border-bottom-1 border-0 border-gray-300"
          }
        >
          <div className="col-4">
            <label
              className={
                props.systemFieldName === "POCTestResult"
                  ? "text-gray-800 fw-500"
                  : "fw-600 text-dark text-uppercase"
              }
            >
              {t(props?.label)}
            </label>
          </div>

          <div
            className={
              props.systemFieldName === "POCTestResult" ? "col-12" : "col-8"
            }
          >
            <div
              className={
                props.systemFieldName === "POCTestResult"
                  ? "d-flex gap-2 flex-column mt-3"
                  : "d-flex gap-5"
              }
            >
              {props?.RadioOptions?.map(
                (choice: any) =>
                  choice?.isVisable && (
                    <label
                      className=""
                      htmlFor={choice?.name + choice?.id}
                      id={choice?.name + choice?.id}
                    >
                      <input
                        className="form-check-input ifuser flex-column-auto h-20px w-20px"
                        type="radio"
                        name={
                          choice?.name + props?.repeatFieldIndex + choice?.id
                        }
                        id={choice?.id}
                        data-name={choice?.name}
                        data-id={choice?.id}
                        value={choice?.value}
                        checked={
                          choice?.value.split(" ").join("") ==
                          props.defaultValue.split(" ").join("")
                        }
                        onChange={(e: any) => {
                          props?.onChange(
                            e,
                            e.target.value,
                            choice?.value,
                            choice?.label
                          );
                        }}
                        disabled={props?.disabled}
                        required={props.required}
                      />
                      <span className="ps-2 text-break">{choice?.label}</span>
                    </label>
                  )
              )}
            </div>
          </div>
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

export default React.memo(POCResults);
