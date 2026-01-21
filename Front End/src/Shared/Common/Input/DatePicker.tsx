import { t } from "i18next";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import { FindIndex } from "Utils/Common/CommonMethods";
import { assignFormValues } from "../../../Utils/Auth";

const DateTimePickerInput = (props: any) => {
  const today = new Date();
  const [value, setValue] = useState<Date | null>(null);
  const [yearValidationError, setYearValidationError] = useState<string>("");
  const inputElementReactSelect = useRef(props?.name);

  useEffect(() => {
    if (
      props?.errorFocussedInput === inputElementReactSelect.current ||
      props?.errorFocussedInput === inputElementReactSelect.current.id
    ) {
      inputElementReactSelect.current.focus();
    }
  }, [props?.errorFocussedInput]);

  // Helper: parse incoming defaultValue to a Date (supports MM/DD/YYYY, M/D/YYYY)
  const parseToDate = (input: any): Date | null => {
    if (!input) return null;
    if (input instanceof Date && !isNaN(input.getTime())) return input;
    // Try known string formats strictly
    if (typeof input === "string") {
      const m = moment(
        input,
        ["MM/DD/YYYY", "M/D/YYYY", moment.ISO_8601],
        true
      );
      if (m.isValid()) return m.toDate();
      const parsed = new Date(input);
      if (!isNaN(parsed.getTime())) return parsed;
      return null;
    }
    const parsed = new Date(input);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  useEffect(() => {
    setValue(parseToDate(props.defaultValue));
  }, [props.defaultValue]);

  const validateYear = (date: Date | null): boolean => {
    if (!date) return true;

    const year = date.getFullYear();

    // Check if the year is suspiciously low (likely a parsing issue)
    if (year < 1000) {
      setYearValidationError(
        "Please provide the full year in 4 digits (e.g., 2024 instead of 24)"
      );
      return false;
    }

    setYearValidationError("");
    return true;
  };

  // Calculate maxDate based on fieldConfiguration
  const getMaxDate = () => {
    if (
      (props.name === "DateofCollection" || props.name === "DateReceived") &&
      typeof props.fieldConfiguration === "number" &&
      props.fieldConfiguration > 0 &&
      Number.isInteger(props.fieldConfiguration)
    ) {
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + props.fieldConfiguration);
      return maxDate;
    }

    // Set max date to today for specific fields
    if (
      props.name === "DateofCollection" ||
      props.name === "DateReceived" ||
      props.name === "DOB" ||
      props.name === "SubscriberDOB" ||
      props.name === "AccidentDate" ||
      props.name === "ConsentDate" ||
      props.name === "MostRecentSurgeryDate" ||
      props.name === "ImagingDate"
    ) {
      return today;
    }

    return undefined;
  };

  const handleChange = async (e: any) => {
    setYearValidationError("");

    if (e && !validateYear(e)) {
      setValue(e);
      return;
    }

    const now = new Date();
    let updatedDate = e ? moment(e).format("MM/DD/YYYY") : "";

    if (props.name === "DateReceived") {
      updatedDate = e ? updatedDate + " " + now.toLocaleTimeString() : "";
    }
    setValue(e);

    const newInputs = await assignFormValues(
      props.Inputs,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      e ? updatedDate : "",
      props.isDependency,
      props.repeatFieldSection,
      props.isDependencyRepeatFields,
      props.repeatFieldIndex,
      props.repeatDependencySectionIndex,
      props.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    );

    if (props?.ArrayReqId) {
      const infectiousDataCopy = JSON?.parse(
        JSON?.stringify(props?.infectiousData)
      );
      infectiousDataCopy[
        FindIndex(props?.infectiousData, props?.ArrayReqId)
      ].sections = newInputs;
      props?.setInfectiousData([...infectiousDataCopy]);
    } else {
      props.setInputs(newInputs);
    }
    props.fields.enableRule = "";
  };

  const divElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (props.setErrorFocussedInput) {
      props.setErrorFocussedInput();
    }
  }, [props?.errorFocussedInput]);

  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const lastTypedPartsRef = useRef<{
    month: string;
    day: string;
    year: string;
  }>({
    month: "",
    day: "",
    year: "",
  });
  const readDateFromInputs = (): Date | null => {
    const root = datePickerRef.current as HTMLElement | null;
    if (!root) return null;
    const monthByName = root.querySelector(
      "input[name='month']"
    ) as HTMLInputElement | null;
    const dayByName = root.querySelector(
      "input[name='day']"
    ) as HTMLInputElement | null;
    const yearByName = root.querySelector(
      "input[name='year']"
    ) as HTMLInputElement | null;
    // Then class-based selection used by react-date-picker
    const group = root.querySelector(
      ".react-date-picker__inputGroup"
    ) as HTMLElement | null;
    const classInputs = group
      ? (Array.from(
        group.querySelectorAll(".react-date-picker__inputGroup__input")
      ) as HTMLInputElement[])
      : [];
    const monthInput = monthByName || classInputs[0];
    const dayInput = dayByName || classInputs[1];
    const yearInput = yearByName || classInputs[2];
    if (!monthInput || !dayInput || !yearInput) return null;
    const month = (monthInput.value || "").padStart(2, "0");
    const day = (dayInput.value || "").padStart(2, "0");
    const year = yearInput.value || "";
    if (month.length === 2 && day.length === 2 && year.length === 4) {
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);
      const candidate = new Date(yearNum, monthNum - 1, dayNum);
      if (
        candidate.getFullYear() === yearNum &&
        candidate.getMonth() === monthNum - 1 &&
        candidate.getDate() === dayNum
      ) {
        return candidate;
      }
    }
    return null;
  };
  const preventLeapNormalizationIfPartialYear = () => {
    const root = datePickerRef.current as HTMLElement | null;
    if (!root) return;
    const group = root.querySelector(
      ".react-date-picker__inputGroup"
    ) as HTMLElement | null;
    const inputs = group
      ? (Array.from(
        group.querySelectorAll(".react-date-picker__inputGroup__input")
      ) as HTMLInputElement[])
      : [];
    const monthInput =
      (root.querySelector("input[name='month']") as HTMLInputElement | null) ||
      inputs[0];
    const dayInput =
      (root.querySelector("input[name='day']") as HTMLInputElement | null) ||
      inputs[1];
    const yearInput =
      (root.querySelector("input[name='year']") as HTMLInputElement | null) ||
      inputs[2];
    if (!monthInput || !dayInput || !yearInput) return;
    const currentMonth = (monthInput.value || "").padStart(2, "0");
    const currentDay = (dayInput.value || "").padStart(2, "0");
    const currentYear = yearInput.value || "";
    const prev = lastTypedPartsRef.current;
    if (
      currentYear.length < 4 &&
      prev.month === "02" &&
      prev.day === "29" &&
      currentMonth === "03" &&
      currentDay === "01"
    ) {
      monthInput.value = "02";
      dayInput.value = "29";
    }
    // Update last typed parts snapshot
    lastTypedPartsRef.current = {
      month: currentMonth,
      day: currentDay,
      year: currentYear,
    };
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text").trim();

    // Matches formats like 08/01/2025, 8-1-2025, 08-01-25 etc.
    const match = pastedData.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);

    if (match) {
      e.preventDefault();

      let [, month, day, year] = match;
      month = month.padStart(2, "0");
      day = day.padStart(2, "0");
      if (year.length === 2) {
        year = `20${year}`; // assume 20xx for 2-digit year
      }

      const parsedDate = new Date(`${year}-${month}-${day}`);

      if (!isNaN(parsedDate.getTime())) {
        setValue(parsedDate); // update local state
        await handleChange(parsedDate); // trigger normal change flow
      }
    }
  };

  const handlePickerChange = (e: Date | null) => {
    // Allow clears immediately
    if (e === null) {
      handleChange(null);
      return;
    }
    // If calendar popup is open, accept the selected date directly
    const root = datePickerRef.current as HTMLElement | null;
    const calendarOpen = root?.querySelector(
      ".react-date-picker__calendar--open"
    );
    if (calendarOpen) {
      handleChange(e);
      return;
    }
    // Guard: only commit when year field has 4 digits for manual typing
    const yearInput = root?.querySelector(
      "input[name='year']"
    ) as HTMLInputElement | null;
    const group = root?.querySelector(
      ".react-date-picker__inputGroup"
    ) as HTMLElement | null;
    const fallbackYear = group
      ? (group.querySelectorAll(
        ".react-date-picker__inputGroup__input"
      )[2] as HTMLInputElement) || null
      : null;
    const yearStr = yearInput?.value || fallbackYear?.value || "";
    if (yearStr.length < 4) {
      return; // don't let partial years cause auto-normalization to Mar 1
    }
    // Also ensure the date we commit matches the typed parts exactly
    const typed = readDateFromInputs();
    if (typed) {
      handleChange(typed);
      return;
    }
    // Fallback: if typed parts cannot be read, commit the picker value
    handleChange(e);
  };
  const handleKeyUp = () => {
    preventLeapNormalizationIfPartialYear();
    const combinedDate = readDateFromInputs();
    if (combinedDate) {
      handleChange(combinedDate);
    }
  };
  const handleInput = () => {
    preventLeapNormalizationIfPartialYear();
    const combinedDate = readDateFromInputs();
    if (combinedDate) {
      handleChange(combinedDate);
    }
  };
  const handleBlur = () => {
    preventLeapNormalizationIfPartialYear();
    const combinedDate = readDateFromInputs();
    if (combinedDate) {
      handleChange(combinedDate);
    }
  };

  return (
    <>
      <div
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mb-4 d-flex flex-column`
            : "col-lg-6 col-md-6 col-sm-12 mb-4"
        }
        ref={divElement}
      >
        <div
          className={props?.name === "PatientDescription" ? "d-none" : ""}
          id={props?.name}
          ref={inputElementReactSelect}
          tabIndex={-1}
        >
          {" "}
        </div>
        <label
          className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
          htmlFor={props.id}
        >
          {t(props.label)}
        </label>
        <div
          onPaste={handlePaste}
          ref={datePickerRef}
          onKeyUp={handleKeyUp}
          onInput={handleInput}
          onBlur={handleBlur}
        >
          <DatePicker
            format="MM/dd/yyyy"
            dayPlaceholder="dd"
            monthPlaceholder="mm"
            yearPlaceholder="yyyy"
            maxDate={getMaxDate()}
            onChange={(e: any) => handlePickerChange(e as Date)}
            value={value ?? null}
            disabled={props?.name === "PatientDescription" ? true : false}
            id={props?.name}
            className={yearValidationError ? "error" : ""}
          />
        </div>

        {/* Year validation error */}
        {yearValidationError && (
          <div className="form__error">
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {yearValidationError}
            </span>
          </div>
        )}

        {/* Existing field validation error */}
        {props.field?.enableRule && (
          <div className="form__error">
            <span>{t(props.field?.enableRule)}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default DateTimePickerInput;