import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { addDays } from "date-fns";
import format from "date-fns/format";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Select from "react-select";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";
import useLang from "Shared/hooks/useLanguage";
import { CrossIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { DateTimePickerStyling } from "Utils/Common/DateTimePickerStyling";
import { upsertArray } from "Utils/Common/Requisition";

enum FilterTypeColumns {
  Text = "text",
  Datepicker = "datepicker",
  Dropdown = "dropdown",
  Number = "number",
  DateRange = "daterange",
}

function PatientSearchInput({
  column,
  setSearchValue,
  searchValue,
  setFilters,
  filters,
  loadData,
  setCurPage,
}: any) {
  const { t } = useLang();
  const handleChange = (e: any, name?: string) => {
    console.log(name, "name", e);

    let value;
    let type;
    if (name !== FilterTypeColumns.Dropdown) {
      value = e.target.value;
      type = e.target.type;
    } else {
      value = e.value;
      type = name;
    }
    if (type === "date") {
      value = moment(value, "YYYY-MM-DD").format("MM/DD/YYYY");
    }
    const updatedFilters = [...filters];

    const existingFilterIndex = updatedFilters.findIndex(
      (filter: any) => filter.columnName === column.filterColumns
    );

    if (existingFilterIndex !== -1) {
      updatedFilters[existingFilterIndex] = {
        ...updatedFilters[existingFilterIndex],
        filterValue: value,
      };
    } else {
      updatedFilters.push({
        columnName: column.filterColumns,
        filterValue: value,
        columnType: column.filterColumnsType,
        label: column.columnLabel,
      });
    }

    setFilters(updatedFilters);
    setSearchValue((prevValue: any) => {
      return {
        ...prevValue,
        filters: updatedFilters,
      };
    });
  };

  const getFilterValue = (columnName: any) => {
    const filter = searchValue.filters.find(
      (item: any) => item.columnName === columnName
    );
    if (column.filterColumnsType.toLowerCase() === FilterTypeColumns.Dropdown) {
      const option = options.find(
        (opt: any) => opt.value === filter?.filterValue
      );
      return option ? option : null;
    }
    return filter ? filter.filterValue : "";
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setCurPage && setCurPage(1);
      loadData(false);
    }
  };

  let options: any = [];

  if (column && column.jsonOptionData) {
    try {
      const parsedData = JSON.parse(column.jsonOptionData);
      if (Object.keys(parsedData).length > 0) {
        options = parsedData;
      }
    } catch (error) {
      console.error(t("Error parsing jsonOptionData:"), error);
    }
  }

  const containsComma = column?.filterColumnsType?.toLowerCase().includes(",");
  const commanSeparatedSecondValue = column?.filterColumnsType?.split(",")[0];
  console.log(column, "column");

  return (
    <div>
      {column?.filterColumnsType?.toLowerCase() === FilterTypeColumns.Text && (
        <input
          id={`PatientDynamicGrid_${column?.columnKey}`}
          type="text"
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
          placeholder={t("Search ...")}
          value={getFilterValue(column.filterColumns)}
          name={column?.columnKey}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
        />
      )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.Number && (
        <input
          id={`PatientDynamicGrid_${column?.columnKey}`}
          type="number"
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
          placeholder={t("Search ...")}
          value={getFilterValue(column.filterColumns)}
          name={column?.columnKey}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
        />
      )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.Dropdown && (
        <Select
          inputId={`PatientDynamicGrid_${column?.columnKey}`}
          menuPortalTarget={document.body}
          placeholder={t("Select ...")}
          theme={(theme) => styles(theme)}
          options={options}
          name={column?.filterColumnsType}
          styles={reactSelectSMStyle}
          value={getFilterValue(column.filterColumns)}
          onChange={(e: any) => handleChange(e, column?.filterColumnsType)}
          // onKeyDown={handleKeyPress}
        />
      )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.Datepicker && (
        <SearchDatePicker
          value={getFilterValue(column.filterColumns)}
          onChange={handleChange}
        />
      )}
      {containsComma &&
        commanSeparatedSecondValue.toLowerCase() ===
          FilterTypeColumns.DateRange && (
          <DateRange
            column={column}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.DateRange && (
        <DateRange
          column={column}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      )}
    </div>
  );
}

export default PatientSearchInput;

const DateRange = ({ column, searchValue, setSearchValue }: any) => {
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
  }, []);

  const hideOnEscape = (e: any) => {
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

  const setDateToInput = (searchValue: any, columnKey?: string) => {
    let filterDate = searchValue?.filters?.find(
      (filteredObj: any) => filteredObj.columnName == columnKey
    );

    if (filterDate?.columnName == columnKey) {
      return filterDate?.filterValue;
    } else {
      return "";
    }
  };

  return (
    <div>
      <input
        id={`PatientDynamicGrid_${column?.columnKey}`}
        value={setDateToInput(searchValue, column?.columnKey)}
        readOnly
        onClick={() => {
          setOpen(!open);
        }}
        className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8"
        placeholder={t("MM/DD/YYYY")}
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
                  onChange={(item: any) => {
                    setRange([item.selection]);
                    let startDate = format(
                      item?.selection?.startDate,
                      "MM/dd/yyyy"
                    );
                    let endDate = format(
                      item?.selection?.endDate,
                      "MM/dd/yyyy"
                    );
                    console.log();

                    let concatedDate = startDate + " to " + endDate;
                    setSearchValue((preVal: any) => {
                      return {
                        ...preVal,
                        [column.columnKey]: concatedDate,
                      };
                    });
                    let filterObj = {
                      columnName: column.columnKey,
                      filterValue: concatedDate,
                      columnType: column.filterColumnsType,
                    };
                    searchValue.filters = upsertArray(
                      searchValue.filters,
                      filterObj,
                      (element: any) =>
                        element.columnName === filterObj.columnName
                    );
                  }}
                  editableDateInputs={true}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  initialFocusedRange={[] as any}
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
