import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { addDays } from "date-fns";
import format from "date-fns/format";
import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateTimePickerStyling } from "../../../Utils/Common/DateTimePickerStyling";
import { CrossIcon } from "../../Icons";
import useLang from './../../hooks/useLanguage';
import "./DatePicker.css";

const DatePickerDuplicate = (props) => {
  const { t } = useLang()
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  // open close
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
  // get the target element to toggle
  const refOne = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
  }, []);

  const hideOnEscape = (e) => {
    setRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    if (e.key === "Escape") {
      setOpen(false);
    }
  };
  const orientation = window.matchMedia("(max-width: 700px)").matches
    ? "vertical"
    : "horizontal";
  return (
    <>
      <div>
        <input
          value={props.filterData}
          readOnly
          onClick={() => {
            setOpen(!open);
          }}
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8"
          placeholder="MM/DD/YYYY to MM/DD/YYYY"
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
                    onChange={(item) => {
                      setRange([item.selection]);
                      let startDate = format(
                        item?.selection?.startDate,
                        "MM/dd/yyyy"
                      );
                      let endDate = format(
                        item?.selection?.endDate,
                        "MM/dd/yyyy"
                      );
                      let concatedDate = startDate + " to " + endDate;
                      props.setFilterData(concatedDate);
                    }}
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

export default React.memo(DatePickerDuplicate);
