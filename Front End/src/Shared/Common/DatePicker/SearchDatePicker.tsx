import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import "./SearchDatePicker.css";

export default function SearchDatePicker({
  value,
  onChange,
  name,
  customClass,
  borderRadius,
}: any) {
  console.log("SearchDatePicker value:", value);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        value={value ? moment(value, "MM/DD/YYYY") : null}
        onChange={(newVal) => {
          const date = newVal ? moment(newVal).format("MM/DD/YYYY") : "";
          onChange({ target: { name, value: date } });
        }}
        slotProps={{
          field: { clearable: true },
          textField: {
            className: customClass ? customClass : "search-date-picker",
            fullWidth: true,
            // required: props?.required,
            id: name,
            name: name,
            error: value === "Invalid date",
            placeholder: "MM/DD/YYYY",
            InputProps: {
              style: {
                fontSize: "14px",
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              },
            },
            sx: {
              "& .MuiOutlinedInput-root": {
                minHeight: "40px",
                fontSize: "14px",
                backgroundColor: "#fff",
                borderRadius: borderRadius ? borderRadius : "8px",
                "& fieldset": {
                  borderColor: value === "Invalid date" ? "red" : "#939292",
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: value === "Invalid date" ? "red" : "#939292",
                },
                "&.Mui-focused fieldset": {
                  borderColor: value === "Invalid date" ? "red" : "#939292",
                  borderWidth: "2px",
                },
                "&.Mui-error fieldset": {
                  borderColor: "red !important",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "8px 12px",
                fontSize: "14px",
                height: "auto",
                lineHeight: "1.5",
              },
              "& .MuiInputAdornment-root": {
                marginLeft: "0",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "20px",
                color: "#6b7280",
              },
              "& .MuiIconButton-root": {
                padding: "6px",
                marginRight: "4px",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              },
              "& .MuiInputAdornment-root .MuiIconButton-root": {
                "&:hover": {
                  backgroundColor: "#fff",
                },
                "& svg": {
                  fontSize: "18px",
                },
              },
              /* 🔥 Style the placeholder text */
              "& .MuiOutlinedInput-input::placeholder": {
                fontSize: "12px", // <-- Change placeholder font size
                color: "#9ca3af", // <-- Change placeholder color
                opacity: 1, // <-- Required or Chrome lowers opacity
              },
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                marginTop: "4px",
                border: "1px solid #939292",
                borderRadius: borderRadius ? borderRadius : "8px",
                padding: "16px",
                height: "280px", // 🔥 reduce width
                // minWidth: "20px",
              },
              "& .MuiPickersCalendarHeader-root": {
                paddingLeft: "0",
                paddingRight: "0",
                marginTop: "0",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
              "& .MuiPickersCalendarHeader-label": {
                fontSize: "16px",
                fontWeight: 600,
                color: "#111827",
              },
              "& .MuiPickersArrowSwitcher-root": {
                display: "flex",
                gap: "4px",
                "& .MuiIconButton-root": {
                  padding: "6px",
                  backgroundColor: "transparent",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "18px",
                  color: "#6b7280",
                },
              },
              "& .MuiDayCalendar-header": {
                paddingLeft: "0",
                paddingRight: "0",
                justifyContent: "space-between",
                "& .MuiDayCalendar-weekDayLabel": {
                  width: "32px",
                  height: "32px",
                  margin: "0",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#111827",
                  textTransform: "uppercase",
                },
              },
              "& .MuiDayCalendar-weekContainer": {
                margin: "0",
                justifyContent: "space-between",
              },
              "& .MuiPickersDay-root": {
                fontSize: "14px",
                fontWeight: 400,
                width: "28px",
                height: "28px",
                margin: "0",
                borderRadius: "6px",
                color: "#111827",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
                "&.Mui-selected": {
                  backgroundColor: "#bbf7d0 !important",
                  color: "#111827 !important",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "#86efac !important",
                  },
                  "&:focus": {
                    backgroundColor: "#bbf7d0 !important",
                  },
                },
                "&.MuiPickersDay-today": {
                  border: "none",
                  backgroundColor: "transparent",
                  fontWeight: 600,
                  "&:not(.Mui-selected)": {
                    border: "2px solid #10b981",
                  },
                },
              },
              "& .MuiPickersDay-dayOutsideMonth": {
                color: "#9ca3af !important",
                opacity: 0.6,
              },
              "& .MuiPickersYear-yearButton": {
                fontSize: "14px",
                "&.Mui-selected": {
                  backgroundColor: "#bbf7d0",
                  color: "#111827",
                  "&:hover": {
                    backgroundColor: "#86efac",
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
                      color: "#ef4444 !important",
                      "&.Mui-selected": {
                        color: "#111827 !important",
                      },
                    }
                  : {}),
              },
            };
          },
        }}
      />
    </LocalizationProvider>
  );
}
