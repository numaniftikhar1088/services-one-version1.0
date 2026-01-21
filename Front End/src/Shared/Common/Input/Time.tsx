import { useEffect, useRef, useState, useMemo, ChangeEvent } from "react";
import MuiSkeleton from "../MuiSkeleton";
import useLang from "./../../hooks/useLanguage";

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const TimeInput: React.FC<any> = (props) => {
  const { t } = useLang();
  const nativeRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [safari] = useState(isSafari());

  // Local state for Safari dropdowns - this allows immediate UI feedback
  const [localTime12h, setLocalTime12h] = useState({ hour: "", minute: "", ampm: "" });

  // Conversion helpers
  const to12h = (time24: string) => {
    if (!time24) return { h: "", m: "", ampm: "" };
    const [h, m] = time24.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    if (hour > 12) hour -= 12;
    return { h: hour.toString(), m: m ?? "", ampm };
  };

  const to24h = (h12: string, m: string, ampm: string) => {
    if (!h12 || !m || !ampm) return "";
    let hour = parseInt(h12, 10);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${m}`;
  };

  // Sync local state with props.value when it changes externally
  useEffect(() => {
    if (safari) {
      const { h, m, ampm } = to12h(props.value ?? "");
      setLocalTime12h({ hour: h, minute: m, ampm });
    }
  }, [props.value, safari]);

  // Emit change to parent
  const emitChange = (newHour: string, newMinute: string, newAmPm: string) => {
    // Update local state immediately for UI feedback
    setLocalTime12h({ hour: newHour, minute: newMinute, ampm: newAmPm });

    // Calculate 24h value and emit to parent
    const time24 = to24h(newHour, newMinute, newAmPm);
    const fakeEvt: ChangeEvent<HTMLInputElement> = {
      target: { value: time24, name: props.name } as HTMLInputElement,
    } as ChangeEvent<HTMLInputElement>;
    props.onChange(fakeEvt);
  };

  const handleHourChange = (e: ChangeEvent<HTMLSelectElement>) => {
    emitChange(e.target.value, localTime12h.minute, localTime12h.ampm);
  };

  const handleMinuteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    emitChange(localTime12h.hour, e.target.value, localTime12h.ampm);
  };

  const handleAmPmChange = (e: ChangeEvent<HTMLSelectElement>) => {
    emitChange(localTime12h.hour, localTime12h.minute, e.target.value);
  };

  // Sync native input for non-Safari
  useEffect(() => {
    if (nativeRef.current && !safari) {
      nativeRef.current.value = props.value ?? "";
    }
  }, [props.value, safari]);

  // Error scrolling (unchanged)
  useEffect(() => {
    if (props.error && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    props.setErrorFocussedInput?.();
  }, [props?.errorFocussedInput, props.error]);

  return (
    <div
      ref={containerRef}
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
      ) : safari ? (
        /* Custom picker with LOCAL STATE - shows selection immediately */
        <div className="d-flex gap-2 align-items-center">
          {/* Hour */}
          <select
            className="form-select"
            value={localTime12h.hour}
            onChange={handleHourChange}
            style={{ width: "70px" }}
          >
            <option value="">HH</option>
            {Array.from({ length: 12 }, (_, i) => {
              const val = (i + 1).toString();
              return (
                <option key={val} value={val}>
                  {val.padStart(2, "0")}
                </option>
              );
            })}
          </select>

          <span>:</span>

          {/* Minute */}
          <select
            className="form-select"
            value={localTime12h.minute}
            onChange={handleMinuteChange}
            style={{ width: "70px" }}
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => {
              const val = (i * 5).toString().padStart(2, "0");
              return (
                <option key={val} value={val}>
                  {val}
                </option>
              );
            })}
          </select>

          {/* AM/PM */}
          <select
            className="form-select"
            value={localTime12h.ampm}
            onChange={handleAmPmChange}
            style={{ width: "70px" }}
          >
            <option value="">--</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      ) : (
        /* Native input for other browsers */
        <input
          type="time"
          value={props.value ?? ""}
          name={props.name}
          id={props.id}
          onChange={props.onChange}
          className="form-control bg-transparent"
          required={props.required}
          ref={nativeRef}
        />
      )}

      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}
    </div>
  );
};

export default TimeInput;