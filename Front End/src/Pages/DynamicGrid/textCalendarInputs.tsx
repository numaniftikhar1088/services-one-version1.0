import { Button, Fade, Tooltip } from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import useLang from "./../../Shared/hooks/useLanguage";

const TextCalendarInputs = ({ column, item, handleInputsChange }: any) => {
  const { t } = useLang();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    item?.[column?.columnKey] || ""
  );

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    setInputValue(value);
    handleInputsChange(column?.columnKey, value, item?.Id);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, "MM/dd/yyyy");
      setInputValue(formattedDate);
      setIsCalendarOpen(false);
      handleInputsChange(column?.columnKey, formattedDate, item?.Id);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          name="date"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={t("Enter date or pick from calendar")}
          style={{ padding: "8px", marginRight: "8px" }}
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
        />

        <Tooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          title={t("Select Date")}
        >
          <span>
            <FaCalendarAlt
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              style={{ cursor: "pointer", fontSize: "20px" }}
            />
          </span>
        </Tooltip>
      </div>

      {isCalendarOpen && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginTop: "5px",
          }}
        >
          <DatePicker
            inline
            showYearDropdown
            showMonthDropdown
            onChange={handleDateChange}
            onClickOutside={() => setIsCalendarOpen(false)}
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsCalendarOpen(false)}
            style={{ display: "block", width: "100%" }}
          >
            {t("Close Calendar")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TextCalendarInputs;
