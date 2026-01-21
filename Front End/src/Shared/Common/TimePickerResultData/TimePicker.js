import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import moment from "moment";
import { memo, useRef, useState } from "react";
import TimeRange from "react-time-range";
import { DateTimePickerStyling } from "../../../Utils/Common/DateTimePickerStyling";
import { upsertArray } from "../../../Utils/Common/Requisition";
import { CrossIcon } from "../../Icons";
import { useResultDataContext } from "../../ResultDataContext";
import useLang from "./../../hooks/useLanguage";

const TimePicker = (props) => {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [time, setTime] = useState({
    startTime: moment(),
    endTime: moment(),
  });
  const refTimePicker = useRef(null);
  const { setSearchValue, setFilterData, filterData } = useResultDataContext();

  const TimeConcatination = (event, isstartTime) => {
    //
    //var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    let startTime = moment(event.startTime)
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
    let endTime = moment(event.endTime).local().format("YYYY-MM-DD HH:mm:ss");
    let concatedTime = "";
    let timeKey = isstartTime ? "startTime" : "endTime";
    if (typeof startTime === "string") {
      if (typeof time.endTime === "string") {
        concatedTime =
          startTime +
          " to " +
          moment(time.endTime).local().format("YYYY-MM-DD HH:mm:ss");
      }
      if (typeof time.endTime === "object") {
        concatedTime = startTime + " to " + startTime;
      }
    }
    if (typeof endTime === "string") {
      if (typeof time.startTime === "string") {
        concatedTime =
          moment(time.startTime).local().format("YYYY-MM-DD HH:mm:ss") +
          " to " +
          endTime;
      }
      if (typeof time.startTime === "object") {
        concatedTime = endTime + " to " + endTime;
      }
    }
    setTime((preVal) => {
      return {
        ...preVal,
        [timeKey]: event[timeKey],
      };
    });

    setSearchValue((preVal) => {
      return {
        ...preVal,
        [props?.tabsDetail?.columnKey]: concatedTime,
      };
    });
    let filterObj = {
      columnName: props?.tabsDetail.filterColumns,
      filterValue: concatedTime,
      columnType: props?.tabsDetail.filterColumnsType,
    };
    filterData.filters = upsertArray(
      filterData.filters,
      filterObj,
      (element) => element.columnName === filterObj.columnName
    );
    setFilterData(filterData);
  };
  const handleChangeStartTime = (event) => {
    TimeConcatination(event, true);
  };
  const handleChangeEndTime = (event) => {
    TimeConcatination(event, false);
  };

  return (
    <div>
      <div>
        <input
          id={`IDResultDataSearch_${props?.tabsDetail?.columnKey}`}
          onClick={handleOpen}
          readOnly
          className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8"
          placeholder="00:00:00"
          // onClick={() => setOpen((open) => !open)}
        />
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={DateTimePickerStyling}>
            <div ref={refTimePicker}>
              {open && (
                <>
                  <Box onClick={handleClose} className="icon-container">
                    <CrossIcon />
                  </Box>
                  <TimeRange
                    onStartTimeChange={handleChangeStartTime}
                    onEndTimeChange={handleChangeEndTime}
                    startMoment={time.startTime}
                    endMoment={time.endTime}
                  />
                </>
              )}
            </div>
            <div style={{ textAlign: "end", padding: "0% 2%" }}>
              <button onClick={handleClose} variant="contained">
                {t("Submit")}
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default memo(TimePicker);
