import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { addDays, format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { CrossIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { DateTimePickerStyling } from "Utils/Common/DateTimePickerStyling";
import useLang from './../../Shared/hooks/useLanguage';

enum FilterTypeColumns {
  Text = "text",
  Datepicker = "datepicker",
  Dropdown = "dropdown",
  DateRange = "daterange",
  TextDate = "textdate",
}

interface FilterProps {
  filter: any;
  setSearchValue: (value: any) => void;
  searchValue: Record<string, any>;
  filters: any[];
  setFilters: (filters: any[]) => void;
  // dynamicGridSplitPane: any
}

function SplitFilters({
  filter,
  setSearchValue,
  searchValue,
  filters,
  setFilters,
}: FilterProps) {
  const {t} = useLang()
  const handleChange = useCallback(
    (e: any, type?: string) => {
      let value: any;

      if (type === "dropdown") {
        value = e?.value;
      } else {
        value = e.target.value;
      }

      const paneNumbers = filter.splitPaneNo
        .split(",")
        .map((pane: any) => pane.trim());

      if (paneNumbers.length > 1) {
        const columnNames = filter.filterColumn
          .split(",")
          .map((name: any) => name.trim());

        const updatedFilters = filters.filter(
          (f) => !columnNames.includes(f.columnName)
        );

        const newFilters = columnNames.map((colName: any, index: number) => {
          return {
            columnName: colName,
            filterValue: value,
            columnType: filter.filterType,
            paneNo: paneNumbers[index] || filter.splitPaneNo,
          };
        });

        updatedFilters.push(...newFilters);

        setFilters(updatedFilters);
        setSearchValue((prevValue: any) => ({
          ...prevValue,
          filters: updatedFilters,
        }));
      } else {
        const updatedFilters = filters.filter(
          (f) => f.columnName !== filter.filterColumn
        );

        const newFilter = {
          columnName: filter.filterColumn,
          filterValue: value,
          columnType: filter.filterType,
          paneNo: filter.splitPaneNo,
        };

        updatedFilters.push(newFilter);

        setFilters(updatedFilters);
        setSearchValue((prevValue: any) => ({
          ...prevValue,
          filters: updatedFilters,
        }));
      }
    },
    [filters, filter, setFilters, setSearchValue]
  );

  return (
    <>
      {filter?.filterType?.toLowerCase() === FilterTypeColumns.Text && (
        <div>
          <label>{filter?.filterLabel}</label>
          <input
            type="text"
            className="form-control bg-white mb-lg-0 h-30px rounded-2 w-100"
            placeholder={filter?.columnLabel}
            name={filter?.filterColumnsType}
            value={
              searchValue.filters.find((f: any) =>
                filter.filterColumn.includes(f.columnName)
              )?.filterValue || ""
            }
            onChange={handleChange}
          />
        </div>
      )}
      {filter?.filterType?.toLowerCase() === FilterTypeColumns.Datepicker && (
        <input
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
          type="date"
          name={filter?.filterColumnsType}
          value={
            searchValue.filters.find(
              (f: any) => f.columnName === filter.filterColumn
            )?.filterValue || ""
          }
          onChange={handleChange}
        />
      )}
      {filter?.filterType?.toLowerCase() === FilterTypeColumns.DateRange && (
        <DateRange
          filter={filter}
          searchValue={searchValue}
          setFilters={setFilters}
          setSearchValue={setSearchValue}
        />
      )}
      {filter?.filterType?.toLowerCase() === FilterTypeColumns.Dropdown && (
        <div>
          <label>{filter?.filterLabel}</label>
          <Select
            theme={(theme) => styles(theme)}
            options={JSON.parse(filter?.jsonOptionData)}
            menuPortalTarget={document.body}
            styles={reactSelectSMStyle}
            onChange={(e: any) => handleChange(e, "dropdown")}
            value={
              JSON.parse(filter?.jsonOptionData).find((option: any) =>
                searchValue.filters.some(
                  (f: any) =>
                    filter.filterColumn.includes(f.columnName) &&
                    f.filterValue === option.value
                )
              ) || ""
            }
          />
        </div>
      )}
    </>
  );
}

export default SplitFilters;

interface DateRangeProps {
  filter: any;
  searchValue: Record<string, any>;
  setSearchValue: (value: any) => void;
  setFilters: any;
}

const DateRange = ({
  filter,
  searchValue,
  setSearchValue,
  setFilters,
}: DateRangeProps) => {
  const {t} = useLang()
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
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]);
  };

  useEffect(() => {
    const hideOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", hideOnEscape);
    return () => document.removeEventListener("keydown", hideOnEscape);
  }, []);

  return (
    <div>
      <label>{filter?.filterLabel}</label>
      <input
        readOnly
        onClick={() => setOpen(!open)}
        className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
        placeholder={t("MM/DD/YYYY")}
        value={
          searchValue.filters.find(
            (f: any) => f.columnName === filter.filterColumn
          )?.filterValue || ""
        }
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={DateTimePickerStyling}>
          <div>
            {open && (
              <>
                <Box onClick={handleClose} className="icon-container">
                  <CrossIcon />
                </Box>
                <DateRangePicker
                  onChange={(item: any) => {
                    const { startDate, endDate } = item.selection;
                    setRange([item.selection]);

                    const startDateStr = format(startDate, "MM/dd/yyyy");
                    const endDateStr = format(endDate, "MM/dd/yyyy");
                    const concatedDate = `${startDateStr} to ${endDateStr}`;

                    const newFilter = {
                      columnName: filter.filterColumn,
                      filterValue: concatedDate,
                      columnType: filter.filterType,
                      paneNo: filter.splitPaneNo,
                    };

                    const updatedFilters = [...searchValue.filters];
                    const filterIndex = updatedFilters.findIndex(
                      (f) => f.columnName === filter.filterColumn
                    );

                    if (filterIndex !== -1) {
                      updatedFilters[filterIndex] = newFilter;
                    } else {
                      updatedFilters.push(newFilter);
                    }

                    setFilters(updatedFilters);
                    setSearchValue((prevVal: any) => ({
                      ...prevVal,
                      filters: updatedFilters,
                    }));
                  }}
                  editableDateInputs
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  months={2}
                  direction="horizontal"
                  maxDate={addDays(new Date(), 0)}
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
  );
};
