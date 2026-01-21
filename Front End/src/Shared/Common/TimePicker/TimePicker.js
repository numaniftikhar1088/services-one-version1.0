import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import moment from "moment";
import { useReqDataContext } from "Pages/Requisition/SingleRequisition/ViewReq/RequisitionContext/useReqContext";
import { memo, useRef, useState } from "react";
import TimeRange from "react-time-range";
import { upsertArray } from "../../../Utils/Common/Requisition";
import { useDataContext } from "../../DataContext";
import { CrossIcon } from "../../Icons";
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

  const viewRequisitionData = useReqDataContext();
  const commonData = useDataContext();

  const data =
    props?.callFrom === "requisition" ? viewRequisitionData : commonData;

  const { searchValue, setSearchValue, setFilterData, filterData } = data;

  const TimeConcatination = (event, isstartTime) => {
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
      label: props?.tabsDetail.columnLabel,
      columnKey: props?.tabsDetail.columnKey,
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
  const style = {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
  };

  const handleSubmit = () => {
    const { startTime, endTime } = time;

    if (!startTime || !endTime || moment(startTime).isAfter(endTime)) {
      console.error("Invalid time range selected");
      return;
    }

    const formattedStartTime = moment(startTime)
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
    const formattedEndTime = moment(endTime)
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
    const concatenatedTime = `${formattedStartTime} to ${formattedEndTime}`;

    setSearchValue((prevValue) => ({
      ...prevValue,
      [props?.tabsDetail?.columnKey]: concatenatedTime,
    }));

    const filterObj = {
      columnName: props?.tabsDetail?.filterColumns,
      filterValue: concatenatedTime,
      columnType: props?.tabsDetail?.filterColumnsType,
    };
    filterData.filters = upsertArray(
      filterData.filters,
      filterObj,
      (element) => element.columnName === filterObj.columnName
    );
    setFilterData(filterData);
    handleClose();
  };

  return (
    <div>
      <input
        id={`ViewRequisitionSearch_${props?.tabsDetail?.columnKey}`}
        onClick={handleOpen}
        readOnly
        className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8"
        placeholder="00:00 - 00:00"
        value={
          searchValue.TimeofCollection
            ? moment(time.startTime).format("HH:mm") +
              " - " +
              moment(time.endTime).format("HH:mm")
            : ""
        }
      />
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div ref={refTimePicker}>
            {open && (
              <>
                <Box className="icon-container">
                  <span onClick={handleClose} className="cursor-pointer">
                    <CrossIcon />
                  </span>
                </Box>
                <TimeRange
                  use24Hours={true}
                  onStartTimeChange={handleChangeStartTime}
                  onEndTimeChange={handleChangeEndTime}
                  startMoment={time.startTime}
                  endMoment={time.endTime}
                />
              </>
            )}
          </div>
          <div style={{ textAlign: "end", padding: "0% 2%" }}>
            <button
              onClick={handleSubmit}
              variant="contained"
              className="btn btn-sm fw-500 btn-primary"
            >
              {t("Submit")}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default memo(TimePicker);
