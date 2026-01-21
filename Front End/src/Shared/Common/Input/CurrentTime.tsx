import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import useLang from "./../../hooks/useLanguage";

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const CurrentTime: React.FC<any> = (props) => {
  const location = useLocation();
  const { t } = useLang();
  const nativeRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [safari] = useState(isSafari());
  const getCurrentTime = () => moment().format('HH:mm');
  const [localTime12h, setLocalTime12h] = useState({ hour: "", minute: "", ampm: "" });
  const [isInvalid, setIsInvalid] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [localTimeValue, setLocalTimeValue] = useState<string>("");

  const to12h = (time24: string) => {
    if (!time24) return { h: "", m: "", ampm: "" };
    const [h, m] = time24.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    if (hour > 12) hour -= 12;
    return { h: hour.toString(), m, ampm };
  };

  const to24h = (h12: string, m: string, ampm: string) => {
    if (!h12 || !m || !ampm) return "";
    let hour = parseInt(h12, 10);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${m}`;
  };

  useEffect(() => {
    // Initialize on mount: set current time if no value exists
    if (!initialized) {
      const isEditMode = !!location?.state?.reqId;
      
      if (!isEditMode) {
        // Add mode: set current time immediately
        const currentTime = getCurrentTime();
        setLocalTimeValue(currentTime);
        
        if (safari) {
          const { h, m, ampm } = to12h(currentTime);
          setLocalTime12h({ hour: h, minute: m, ampm });
        }
        
        // Trigger onChange to update form state with current time - delayed to ensure parent is ready
        setTimeout(() => {
          props.onChange({
            target: { value: currentTime, name: props.name }
          });
        }, 150);
      } else if (props.value) {
        // Edit mode with value: set it
        setLocalTimeValue(props.value);
        if (safari) {
          const { h, m, ampm } = to12h(props.value);
          setLocalTime12h({ hour: h, minute: m, ampm });
        }
      } else {
        // Edit mode without value: keep empty
        setLocalTimeValue("");
      }
      
      setInitialized(true);
    }
  }, [initialized, location?.state?.reqId]);

  const emitChange = (newHour: string, newMinute: string, newAmPm: string) => {
    setLocalTime12h({ hour: newHour, minute: newMinute, ampm: newAmPm });
    const time24 = to24h(newHour, newMinute, newAmPm);
    
    if (!time24 || !moment(time24, "HH:mm", true).isValid()) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
    
    setLocalTimeValue(time24);
    props.onChange({
      target: { value: time24, name: props.name }
    } as ChangeEvent<HTMLInputElement>);
  };

  const handleNativeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTimeValue(value);
    
    if (!value || !moment(value, "HH:mm", true).isValid()) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
    props.onChange(e);
  };

  // Sync with props.value only after initialization and when it actually changes
  useEffect(() => {
    if (initialized && props.value && props.value !== localTimeValue) {
      setLocalTimeValue(props.value);
      if (safari) {
        const { h, m, ampm } = to12h(props.value);
        setLocalTime12h({ hour: h, minute: m, ampm });
      }
    }
  }, [props.value, initialized, safari, localTimeValue]);

  useEffect(() => {
    if (props.error && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    props.setErrorFocussedInput?.();
  }, [props?.errorFocussedInput, props.error]);

  return (
    <div
      ref={containerRef}
      className={
        props?.parentDivClassName
          ? `${props.parentDivClassName} mb-4`
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
    >
      <label
        className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
        htmlFor={props.id}
      >
        {t(props.label)}
      </label>

      {safari ? (
        <div className="d-flex gap-2 align-items-center">
          <select
            className={`form-select ${isInvalid || props.error ? 'is-invalid' : ''}`}
            value={localTime12h.hour}
            onChange={(e) => emitChange(e.target.value, localTime12h.minute, localTime12h.ampm)}
            style={{ width: "70px", borderColor: isInvalid || props.error ? 'red' : undefined }}
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
          <select
            className={`form-select ${isInvalid || props.error ? 'is-invalid' : ''}`}
            value={localTime12h.minute}
            onChange={(e) => emitChange(localTime12h.hour, e.target.value, localTime12h.ampm)}
            style={{ width: "70px", borderColor: isInvalid || props.error ? 'red' : undefined }}
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
          <select
            className={`form-select ${isInvalid || props.error ? 'is-invalid' : ''}`}
            value={localTime12h.ampm}
            onChange={(e) => emitChange(localTime12h.hour, localTime12h.minute, e.target.value)}
            style={{ width: "70px", borderColor: isInvalid || props.error ? 'red' : undefined }}
          >
            <option value="">--</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      ) : (
        <input
          type="time"
          value={localTimeValue}
          name={props.name}
          id={props.id}
          onChange={handleNativeChange}
          className="form-control bg-transparent"
          required={props.required}
          ref={nativeRef}
          style={{ borderColor: isInvalid || props.error ? 'red' : undefined }}
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

export default CurrentTime;
