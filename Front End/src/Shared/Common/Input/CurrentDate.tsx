import { t } from "i18next";
import moment, { Moment } from "moment";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { FindIndex } from "Utils/Common/CommonMethods";
import { assignFormValues } from "../../../Utils/Auth";
import "./CurrentDate.css";

const CurrentDate = (props: any) => {
  const location = useLocation();
  const today = moment();
  const [value, setValue] = useState<Moment | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const divElement = useRef<HTMLDivElement | null>(null);

  const prevDefaultValue = useRef(props.defaultValue);

  useEffect(() => {
    // Only initialize once on mount
    if (!initialized) {
      const isEditMode = !!location?.state?.reqId;
      
      if (isEditMode) {
        // Edit mode: show existing value or keep empty
        if (props.defaultValue !== undefined && props.defaultValue !== null && props.defaultValue !== '') {
          let dateValue = props.defaultValue;
          if (typeof dateValue === 'string' && dateValue.includes(' ')) {
            dateValue = dateValue.split(' ')[0]; // Extract date part only
          }
          const parsed = moment(dateValue, ["MM/DD/YYYY", "M/D/YYYY"], true);
          setValue(parsed.isValid() ? parsed : null);
        } else {
          setValue(null);
        }
      } else {
        // Add mode: set current date and save to form
        setValue(today);
        // Trigger form update with current date
        setTimeout(() => {
          handleChange(today);
        }, 100);
      }
      setInitialized(true);
      prevDefaultValue.current = props.defaultValue;
    } else if (props.defaultValue && props.defaultValue !== prevDefaultValue.current) {
      // Only update if defaultValue actually changes to a different value
      let dateValue = props.defaultValue;
      if (typeof dateValue === 'string' && dateValue.includes(' ')) {
        dateValue = dateValue.split(' ')[0];
      }
      const parsed = moment(dateValue, ["MM/DD/YYYY", "M/D/YYYY"], true);
      setValue(parsed.isValid() ? parsed : null);
      prevDefaultValue.current = props.defaultValue;
    }
  }, [props.defaultValue, initialized, today, location?.state?.reqId]);

  const handleChange = async (selectedDate: Moment | null) => {
    setValue(selectedDate);
    
    // If date is cleared (null), update form with empty value
    if (!selectedDate) {
      setIsInvalid(false);
      const newInputs = await assignFormValues(
        props.Inputs,
        props.index,
        props.depControlIndex,
        props.fieldIndex,
        "",
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
        const infectiousDataCopy = JSON.parse(JSON.stringify(props.infectiousData));
        infectiousDataCopy[FindIndex(props.infectiousData, props.ArrayReqId)].sections = newInputs;
        props?.setInfectiousData([...infectiousDataCopy]);
      } else {
        props.setInputs(newInputs);
      }
      
      if (props.fields) {
        props.fields.enableRule = "";
      }
      return;
    }
    
    if (!selectedDate.isValid()) {
      setIsInvalid(true);
      return;
    }
    
    setIsInvalid(false);
    const formattedDate = selectedDate.format("MM/DD/YYYY");

    const newInputs = await assignFormValues(
      props.Inputs,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      formattedDate,
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
      const infectiousDataCopy = JSON.parse(JSON.stringify(props.infectiousData));
      infectiousDataCopy[FindIndex(props.infectiousData, props.ArrayReqId)].sections = newInputs;
      props?.setInfectiousData([...infectiousDataCopy]);
    } else {
      props.setInputs(newInputs);
    }
    
    if (props.fields) {
      props.fields.enableRule = "";
    }
  };

  const handleError = (error: any) => {
    setIsInvalid(!!error);
  };

  // Notify parent component when validation state changes
  useEffect(() => {
    if (props.onValidityChange) {
      props.onValidityChange(isInvalid, props.name);
    }
  }, [isInvalid]);

  useEffect(() => {
    if (props.field?.enableRule && divElement.current) {
      divElement.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    props.setErrorFocussedInput?.();
  }, [props?.errorFocussedInput]);

  return (
    <div
      className={
        props?.parentDivClassName
          ? `${props.parentDivClassName} mb-4 d-flex flex-column`
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
      ref={divElement}
    >
      <label
        className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
        htmlFor={props?.name}
      >
        {t(props.label)}
      </label>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          value={value}
          onChange={handleChange}
          onError={handleError}
          format="MM/DD/YYYY"
          className="current-date-picker"
          slotProps={{
            field: { clearable: true },
            textField: {
              fullWidth: true,
              required: props?.required,
              id: props?.name,
              name: props?.name,
              error: isInvalid || !!props.field?.enableRule,
              helperText: props.field?.enableRule ? t(props.field.enableRule) : "",
              placeholder: "mm / dd / yyyy",
              InputProps: {
                style: {
                  fontSize: '14px',
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                },
              },
              sx: {
                '& .MuiOutlinedInput-root': {
                  minHeight: '40px',
                  fontSize: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: isInvalid || props.field?.enableRule ? 'red' : '#d1d5db',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: isInvalid || props.field?.enableRule ? 'red' : '#9ca3af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: isInvalid || props.field?.enableRule ? 'red' : '#10b981',
                    borderWidth: '2px',
                  },
                  '&.Mui-error fieldset': {
                    borderColor: 'red',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px 12px',
                  fontSize: '14px',
                  height: 'auto',
                  lineHeight: '1.5',
                },
                '& .MuiInputAdornment-root': {
                  marginLeft: '0',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '20px',
                  color: '#6b7280',
                },
                '& .MuiIconButton-root': {
                  padding: '6px',
                  marginRight: '4px',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                },
                '& .MuiInputAdornment-root .MuiIconButton-root': {
                  '&:hover': {
                    backgroundColor: '#fee2e2',
                  },
                  '& svg': {
                    fontSize: '18px',
                  },
                },
              },
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  marginTop: '4px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                },
                '& .MuiPickersCalendarHeader-root': {
                  paddingLeft: '0',
                  paddingRight: '0',
                  marginTop: '0',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
                '& .MuiPickersCalendarHeader-label': {
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#111827',
                },
                '& .MuiPickersArrowSwitcher-root': {
                  display: 'flex',
                  gap: '4px',
                  '& .MuiIconButton-root': {
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#f3f4f6',
                    },
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '18px',
                    color: '#6b7280',
                  },
                },
                '& .MuiDayCalendar-header': {
                  paddingLeft: '0',
                  paddingRight: '0',
                  justifyContent: 'space-between',
                  '& .MuiDayCalendar-weekDayLabel': {
                    width: '40px',
                    height: '40px',
                    margin: '0',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#111827',
                    textTransform: 'uppercase',
                  },
                },
                '& .MuiDayCalendar-weekContainer': {
                  margin: '0',
                  justifyContent: 'space-between',
                },
                '& .MuiPickersDay-root': {
                  fontSize: '14px',
                  fontWeight: 400,
                  width: '40px',
                  height: '40px',
                  margin: '0',
                  borderRadius: '6px',
                  color: '#111827',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#bbf7d0 !important',
                    color: '#111827 !important',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#86efac !important',
                    },
                    '&:focus': {
                      backgroundColor: '#bbf7d0 !important',
                    },
                  },
                  '&.MuiPickersDay-today': {
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontWeight: 600,
                    '&:not(.Mui-selected)': {
                      border: '2px solid #10b981',
                    },
                  },
                },
                '& .MuiPickersDay-dayOutsideMonth': {
                  color: '#9ca3af !important',
                  opacity: 0.6,
                },
                '& .MuiPickersYear-yearButton': {
                  fontSize: '14px',
                  '&.Mui-selected': {
                    backgroundColor: '#bbf7d0',
                    color: '#111827',
                    '&:hover': {
                      backgroundColor: '#86efac',
                    },
                  },
                },
              },
            },
            // Custom day component to handle weekend colors (Saturday=6, Sunday=0)
            day: (dayProps: any) => {
              const dayOfWeek = dayProps.day?.day?.();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              
              return {
                sx: {
                  ...(isWeekend
                    ? {
                        color: '#ef4444 !important',
                        '&.Mui-selected': {
                          color: '#111827 !important',
                        },
                      }
                    : {}),
                },
              };
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default CurrentDate;
