import { Divider, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import { addDays, format } from "date-fns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { RxCross2 } from "react-icons/rx";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

interface PickerProps {
  onDateChange: (
    startDate: string,
    endDate: string,
    dateFilter: string
  ) => void;
}

const Picker: React.FC<PickerProps> = ({ onDateChange }) => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const now = new Date();

  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const quickSelections = ["today", "yesterday", "thisWeek", "lastWeek", "thisMonth", "lastMonth"];
  const [currentSelection, setCurrentSelection] = useState<string>("thisMonth");

  // Open the Popover and reset the dates
  const handleOpen = (event: React.MouseEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the Popover
  const handleClose = () => {
    setAnchorEl(null);
    setRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  };

  const handleDateChange = (ranges: any) => {
    const { startDate: newStartDate, endDate: newEndDate } = ranges.selection;
    setRange([ranges.selection]);

    if (newStartDate && newEndDate) {
      console.log(newStartDate, "newStartDate");

      let startDate = format(newStartDate, "MM/dd/yyyy");
      let endDate = format(newEndDate, "MM/dd/yyyy");

      const dateFilter = `${startDate} to ${endDate}`;
      console.log(dateFilter, "dateFilter");

      // Adjust newStartDate and newEndDate to midnight UTC
      const startDateISO = new Date(
        Date.UTC(
          newStartDate.getFullYear(),
          newStartDate.getMonth(),
          newStartDate.getDate()
        )
      ).toISOString();

      const endDateISO = new Date(
        Date.UTC(
          newEndDate.getFullYear(),
          newEndDate.getMonth(),
          newEndDate.getDate()
        )
      ).toISOString();

      // Pass adjusted dates to onDateChange
      onDateChange(startDateISO, endDateISO, dateFilter);

      setInputValue(`${startDate} - ${endDate}`);
    }
  };

  const handleQuickSelection = (type: string) => {
    const now = new Date();
    let newStartDate: Date;
    let newEndDate: Date = now;

    switch (type) {
      case "today":
        newStartDate = now;
        break;
      case "yesterday":
        newStartDate = addDays(now, -1);
        newEndDate = addDays(now, -1);
        break;
      case "thisWeek":
        const dayOfWeek = now.getDay();
        newStartDate = addDays(now, -dayOfWeek);
        break;
      case "lastWeek":
        const lastWeekEnd = addDays(now, -now.getDay() - 1);
        newStartDate = addDays(lastWeekEnd, -6);
        newEndDate = lastWeekEnd;
        break;
      case "thisMonth":
        newStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "lastMonth":
        newStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        newEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      default:
        return;
    }

    setRange([
      {
        startDate: newStartDate,
        endDate: newEndDate,
        key: "selection",
      },
    ]);

    let startDate = format(newStartDate, "MM/dd/yyyy");
    let endDate = format(newEndDate, "MM/dd/yyyy");

    const dateFilter = `${startDate} to ${endDate}`;

    const startDateISO = new Date(
      Date.UTC(
        newStartDate.getFullYear(),
        newStartDate.getMonth(),
        newStartDate.getDate()
      )
    ).toISOString();

    const endDateISO = new Date(
      Date.UTC(
        newEndDate.getFullYear(),
        newEndDate.getMonth(),
        newEndDate.getDate()
      )
    ).toISOString();

    onDateChange(startDateISO, endDateISO, dateFilter);
    setInputValue(`${startDate} - ${endDate}`);
  };

  useEffect(() => {
    const now = new Date(); // Current date
    const defaultEndDate = now; // Set to today
    const defaultStartDate = new Date(
      now.getFullYear(),
      now.getMonth() - 4,
      now.getDate() + 1
    ); // Set to 6 months before

    // Using moment.utc to handle dates consistently
    const localeDateStart = moment.utc(defaultStartDate).format("M/D/YYYY");
    const localeDateEnd = moment.utc(defaultEndDate).format("M/D/YYYY");

    // Pass the updated start and end dates as ISO strings
    const dateFilter = `${localeDateStart} to ${localeDateEnd}`;

    onDateChange(
      defaultStartDate.toISOString(),
      defaultEndDate.toISOString(),
      dateFilter
    );

    setInputValue(`${localeDateStart} - ${localeDateEnd}`);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "date-picker-popover" : undefined;

  console.log(inputValue, "inputValue");

  return (
    <div>
      <input
        onClick={handleOpen}
        value={inputValue}
        readOnly
        className="form-control mb-lg-0 h-30px rounded-2 fs-8"
        placeholder="MM/DD/YYYY"
        style={{
          backgroundColor: "#57b35c",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isMobile ? "left" : "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isMobile ? "left" : "center",
        }}
        slotProps={{
          paper: {
            sx: {
              maxWidth: isMobile ? "100vw" : "auto",
              width: isMobile ? "100vw" : "auto",
              maxHeight: isMobile ? "90vh" : "auto",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box sx={{ padding: isMobile ? 1 : 2 }}>
          <div className="d-flex justify-content-end">
            <IconButton onClick={handleClose} aria-label="delete">
              <RxCross2 />
            </IconButton>
          </div>
          <Divider className="m-2" />
          
          {/* Quick Selection - Mobile: Arrows with text */}
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                px: 1,
              }}
            >
              <IconButton
                onClick={() => {
                  const current = quickSelections.indexOf(currentSelection);
                  const prev = current > 0 ? current - 1 : quickSelections.length - 1;
                  setCurrentSelection(quickSelections[prev]);
                  handleQuickSelection(quickSelections[prev]);
                }}
                size="small"
              >
                <MdChevronLeft size={24} />
              </IconButton>
              
              <Box sx={{ textAlign: "center", minWidth: "150px" }}>
                <span style={{ fontSize: "14px", fontWeight: 500 }}>
                  {currentSelection === "today" && "Today"}
                  {currentSelection === "yesterday" && "Yesterday"}
                  {currentSelection === "thisWeek" && "This Week"}
                  {currentSelection === "lastWeek" && "Last Week"}
                  {currentSelection === "thisMonth" && "This Month"}
                  {currentSelection === "lastMonth" && "Last Month"}
                </span>
              </Box>
              
              <IconButton
                onClick={() => {
                  const current = quickSelections.indexOf(currentSelection);
                  const next = current < quickSelections.length - 1 ? current + 1 : 0;
                  setCurrentSelection(quickSelections[next]);
                  handleQuickSelection(quickSelections[next]);
                }}
                size="small"
              >
                <MdChevronRight size={24} />
              </IconButton>
            </Box>
          )}
          
          <Box
            sx={{
              overflowX: isMobile ? "hidden" : "visible",
              overflowY: "visible",
              width: "100%",
              "& .rdrCalendarWrapper": {
                width: isMobile ? "100%" : "auto",
              },
              "& .rdrDateRangePickerWrapper": {
                display: "flex",
                flexDirection: "row",
              },
              "& .rdrDefinedRangesWrapper": {
                display: isMobile ? "none !important" : "block",
              },
            }}
          >
            <DateRangePicker
              ranges={range}
              inputRanges={[]}
              staticRanges={isMobile ? [] : undefined}
              // @ts-ignore
              orientation="horizontal"
              onChange={handleDateChange}
              editableDateInputs={true}
              moveRangeOnFirstSelection={false}
              months={isMobile ? 1 : 2}
              direction="horizontal"
              maxDate={addDays(new Date(), 0)}
            />
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default React.memo(Picker);