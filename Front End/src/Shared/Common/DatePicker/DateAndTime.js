import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { addDays, format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateTimePickerStyling } from "../../../Utils/Common/DateTimePickerStyling";
import { CrossIcon } from "../../Icons";
import useLang from "./../../hooks/useLanguage";
import "./DatePicker.css";

const DateAndTimeDuplicate = (props) => {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleClose = () => {
    setOpen(false);
    setRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  const refOne = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    return () => {
      document.removeEventListener("keydown", hideOnEscape, true);
    };
  }, []);

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const orientation = window.matchMedia("(max-width: 700px)").matches
    ? "vertical"
    : "horizontal";

  const handleDateChange = (item) => {
    setRange([item.selection]);

    const start = item.selection.startDate;
    const end = item.selection.endDate;

    // Convert selected dates to UTC start and end of day manually
    const dateFromUTC = new Date(Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(), 0, 0, 0
    ));

  const dateToLocal = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);

    const datesObject = {
      dateFrom: dateFromUTC
      .toISOString(),
      dateTo: dateToLocal.toISOString(),
    };

    props.setFilterData(datesObject);
  };

  const inputValue =
    props.filterData?.dateFrom && props.filterData?.dateTo
      ? `${format(new Date(props.filterData?.dateFrom), "MM-dd-yyyy")} to ${format(
          new Date(props.filterData?.dateTo),
          "MM-dd-yyyy"
        )}`
      : "mm-dd-yyyy - mm-dd-yyyy";

  return (
    <>
      <div>
        <input
          id="RequisitionReportDate"
          value={inputValue}
          readOnly
          onClick={() => {
            setOpen(!open);
          }}
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8"
          placeholder="mm/dd/yyyy - mm/dd/yyyy"
        />
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={DateTimePickerStyling}>
            <div ref={refOne}>
              {open && (
                <>
                  <Box onClick={handleClose} className="icon-container">
                    <CrossIcon />
                  </Box>
                  <DateRangePicker
                    orientation={orientation}
                    onChange={handleDateChange}
                    editableDateInputs={true}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                    initialFocusedRange={[]}
                    months={2}
                    direction="horizontal"
                    maxDate={addDays(new Date(), 0)}
                    showSelectionPreview={true}
                  />
                </>
              )}
            </div>
            <div style={{ textAlign: "end", padding: "0% 2%" }}>
              <button onClick={handleClose} className="btn btn-primary btn-sm">
                {t("Submit")}
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default React.memo(DateAndTimeDuplicate);
