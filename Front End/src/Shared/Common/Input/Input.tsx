import React, { forwardRef, useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import useLang from "../../hooks/useLanguage";
import MuiSkeleton from "../MuiSkeleton";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import { useDispatch, useSelector } from "react-redux";
import { setReqErrors } from "Redux/Actions/Index";
import { useLocation } from "react-router-dom";
import { EyeIconSlash } from "Shared/Icons";
import { Fade, Tooltip } from "@mui/material";

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
  isEnable?: any;
  noActiveMedication?: any;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (props: any, ref: any) => {
    const location = useLocation();
    const [isVisibility, setIsVisibility] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState<string>(props?.name === "SpecimenID" ? props?.value : "");
    const { t } = useLang();
    const dispatch = useDispatch();
    const requisitionErrors = useSelector(
      (state: any) => state?.ReqReducer?.requisitionUnhandledError
    );
    useEffect(() => {
      // if (!location?.state?.reqId) {
      if (props?.name === "SpecimenID" && props?.value) {
        const debounceTimeout = setTimeout(async () => {
          const response =
            await RequisitionType.checkSpecimenDuplicationForReq(
              props?.value
            );
          if (response?.data?.httpStatusCode === 409 && inputValue !== props?.value) {
            setError(response?.data?.message);
          }
          if (inputValue !== props?.value) {
            setError(response?.data?.message);
            dispatch(
              setReqErrors({
                ...requisitionErrors,
                [props.name]: response?.data?.message,
              })
            );
          }
        }, 300);

        return () => clearTimeout(debounceTimeout);
      }
      // }
    }, [props?.value]);

    const handleClick = async () => {
      const facilityID = localStorage.getItem("facilityID");
      const obj = {
        fid: facilityID,
        rid: props.ArrayReqId,
      };
      try {
        const response = await RequisitionType.GenerateAssecission(obj);

        if (response && response.data) {
          const generatedValue = response.data;
          if (props.onChange) {
            props.onChange({
              target: {
                name: props.name,
                value: generatedValue,
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }
      } catch (error) {
        console.error("Error generating specimen ID:", error);
      }
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

    function formatHeight(height: string): string | null {
      height = height.trim(); // Remove extra spaces

      // Full height case (feet and inches)
      let match = height.match(/^(\d{1,2})' *(\d{1,2})"$/);
      if (match) {
        let feet = match[1].padStart(2, "0");
        let inches = match[2].padStart(2, "0");
        return `${feet}'${inches}"`;
      }

      // Only feet case (e.g., "3'" or "03'")
      match = height.match(/^(\d{1,2})' *"?$/); // Allows optional double quote
      if (match) {
        let feet = match[1].padStart(2, "0");
        return `${feet}'00"`; // Default inches to 00
      }

      return null; // Return null for invalid inputs
    }

    return (
      <>
        <div
          className={
            props?.parentDivClassName
              ? `${props?.parentDivClassName} mb-4`
              : "col-lg-6 col-md-6 col-sm-12 mb-4"
          }
          ref={divElement}
        >
          {props.name === "DrugOthres" ||
            (props.name === "OtherDescription" && props.sectionId === 21) ||
            props.sectionId === 53 ? null : (
            <label
              className={
                props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"
              }
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
                value={
                  props.name === "Height"
                    ? formatHeight(props.value)
                    : props?.value
                }
                name={props.name}
                id={props.name}
                autoComplete="off"
                placeholder={t(props.placeholder)}
                onChange={props.onChange}
                className="form-control bg-transparent"
                maxLength={props?.maxLengthValue}
                required={props.required}
                ref={ref}
              />
              {(InputProps: any) => <input {...InputProps} />}
            </>
          ) : props.name === "DrugOthres" ? null : (
            <>
              {props.name === "SpecimenID" ? (
                location?.state?.reqId ? (
                  <>
                    <div className="d-flex gap-2">
                      <input
                        ref={ref}
                        value={props?.value}
                        placeholder={t(props.placeholder)}
                        type={props?.type ?? "text"}
                        pattern={props?.pattern}
                        max={props.max}
                        name={props.name}
                        //  id={props.id}
                        id={props.name}
                        autoComplete="off"
                        onChange={props.onChange}
                        onBlur={props.onBlur}

                        className={
                          " form-control bg-transparent"
                        }
                        maxLength={props?.length}
                        required={props.required}
                        onKeyDown={props.onKeyDown}
                      />
                      <div>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          title={t("Generate SpecimenId")}
                        >
                          <button
                            className="btn btn-sm btn-primary w-40px p-1 btn-icon"
                            style={{ height: "38px" }}
                            id={"generateSpecimenId"}
                            onClick={handleClick}

                          >
                            <i className="bi bi-arrow-repeat fs-1"></i>
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="d-flex gap-2">
                    <input
                      ref={ref}
                      value={props?.value}
                      placeholder={t(props.placeholder)}
                      disabled={
                        location?.state?.reqId &&
                          location.state.status != "Missing Info"
                          ? true
                          : false
                      }
                      type={props?.type ?? "text"}
                      pattern={props?.pattern}
                      max={props.max}
                      name={props.name}
                      //  id={props.id}
                      id={props.name}
                      autoComplete="off"
                      onChange={props.onChange}
                      onBlur={props.onBlur}
                      className={
                        "form-control bg-transparent"
                      }
                      maxLength={props?.length}
                      required={props.required}
                      onKeyDown={props.onKeyDown}
                    />

                    <Tooltip
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                      title={t("Generate SpecimenId")}
                    >
                      <button
                        className="btn btn-sm btn-primary w-40px p-1 btn-icon"
                        style={{ height: "38px" }}
                        onClick={handleClick}
                        id={"generateSpecimenId"}
                      >
                        <i className="bi bi-arrow-repeat fs-1"></i>
                      </button>
                    </Tooltip>
                  </div>
                )
              ) : props.name === "OtherDescription" &&
                props.sectionId === 21 ? (
                <>
                  <textarea
                    value={props?.value}
                    placeholder={t(props.placeholder)}
                    className="form-control bg-transparent h-50px"
                    name={props.name}
                    //id={props.id}
                    id={props.name}
                    autoComplete="off"
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                    maxLength={props?.length}
                    required={props.required}
                    ref={ref}
                    onKeyDown={props.onKeyDown}
                  ></textarea>
                </>
              ) : props.type === "password" ? (
                <div className="position-relative mb-3">
                  <input
                    className={"form-control bg-transparent"}
                    onChange={props.onChange}
                    type={isVisibility ? "text" : "password"}
                    placeholder={t(props.label)}
                    value={props?.value}
                    id={props.name}
                  />
                  <span
                    onClick={() => setIsVisibility(!isVisibility)}
                    className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                  >
                    {isVisibility ? (
                      <i className="fa fa-eye text-primary"></i>
                    ) : (
                      <EyeIconSlash />
                    )}
                  </span>
                </div>
              ) : props.name === "SocialSecurityNumber" ? (
                <>
                  <input
                    value={props?.value}
                    placeholder={t(props.placeholder)}
                    type={props?.type ?? "text"}
                    pattern={props?.pattern}
                    max={props.max}
                    name={props.name}
                    // id={props.id}
                    id={props.name}
                    autoComplete="off"
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                    className={`${props.className} form-control ${props?.disablessn ? "bg-secondary" : "bg-transparent"
                      }`}
                    disabled={props?.disablessn}
                    maxLength={props?.length}
                    required={props.required}
                    ref={ref}
                    onKeyDown={props.onKeyDown}
                  />
                </>
              ) : (
                <>
                  <input
                    value={props?.value}
                    placeholder={t(props.placeholder)}
                    type={props?.type ?? "text"}
                    pattern={props?.pattern}
                    max={props.max}
                    name={props.name}
                    // id={props.id}
                    id={props.name}
                    autoComplete="off"
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                    className={`${props.className} form-control ${props?.disabled ? "" : "bg-transparent"
                      }`}
                    disabled={
                      (() => {
                        if (props.sectionId === 45 || props.sectionId === 46) {
                          return props.isEnable;
                        }
                        if (props.name === "PatientDescription") {
                          return true;
                        }
                        if (props.noActiveMedication && props.sectionId === 112) {
                          return true;
                        }
                        return false
                      })()
                    }
                    maxLength={props?.length}
                    required={props.required}
                    ref={ref}
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

          {error && (
            <div className="form__error">
              <span>{t(error)}</span>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default Input;
