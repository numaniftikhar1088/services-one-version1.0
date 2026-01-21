import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { addDays } from "date-fns";
import format from "date-fns/format";
import { useReqDataContext } from "Pages/Requisition/SingleRequisition/ViewReq/RequisitionContext/useReqContext";
import { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useDataContext } from "Shared/DataContext";
import { DateTimePickerStyling } from "../../../Utils/Common/DateTimePickerStyling";
import { setDateToInput, upsertArray } from "../../../Utils/Common/Requisition";
import { CrossIcon } from "../../Icons";
import useLang from "./../../hooks/useLanguage";
import "./DatePicker.css";
import { useBillingDataContext } from "Shared/BillingContext";
import { useBillingContext } from "Pages/Requisition/Billing-v2/useReqContext";

const DatePicker = (props) => {
  const { t } = useLang();

  const viewRequisitionData = useReqDataContext();
  const commonData = useDataContext();
  const billingData = useBillingContext();

  const data =
    props?.callFrom === "requisition"
      ? viewRequisitionData
      : props?.callFrom === "billing"
      ? billingData
      : commonData;

  const { setSearchValue, setFilterData, filterData, open, setOpen } = data;

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // open close
  const handleClose = () => {
    setOpen((prev) => ({ ...prev, [props?.columnKey]: false }));
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
    // event listeners
    document.addEventListener("keydown", hideOnEscape, true);
    // document.addEventListener("click", hideOnClickOutside, true);
    //stringToDates();
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
          id={`ViewRequisitionSearch_${props?.tabsDetail?.columnKey}`}
          value={setDateToInput(filterData, props?.columnKey)}
          readOnly
          onClick={() => {
            setOpen((prev) => ({
              ...prev,
              [props?.columnKey]: !prev[props?.columnKey],
            }));
            props?.setCurrentColumnKey(props?.columnKey);
          }}
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8"
          placeholder="MM/DD/YYYY"
        />

        <Modal
          open={!!open?.[props?.columnKey]}
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
                      // debugger;

                      let startDate = format(
                        item?.selection?.startDate,
                        "MM/dd/yyyy"
                      );
                      let endDate = format(
                        item?.selection?.endDate,
                        "MM/dd/yyyy"
                      );
                      let concatedDate = startDate + " to " + endDate;
                      setSearchValue((preVal) => {
                        return {
                          ...preVal,
                          [props?.currentColumnKey]: concatedDate,
                        };
                      });
                      let filterObj = {
                        columnName: props?.tabsDetail?.filterColumns,
                        filterValue: concatedDate,
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
              <button
                onClick={handleClose}
                variant="contained"
                className="btn btn-primary btn-sm"
              >
                {t("Submit")}
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default DatePicker;
