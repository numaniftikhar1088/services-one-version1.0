import { TableCell } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { reactSelectSMStyle, styles } from "../../Utils/Common";
import { useDynamicGrid } from "./Context/useDynamicGrid";
import TextCalendarInputs from "./textCalendarInputs";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";

enum FilterTypeColumns {
  Text = "text",
  Datepicker = "datepicker",
  Dropdown = "dropdown",
  DateRange = "daterange",
  TextDate = "textdate",
}

/**
 * **`DynamicAddNewInputs`** is used when editing within a row.
 *
 * @param {Object} column - The column object representing the current column in the table.
 * @param {Object} item - The item or data associated with the current row being edited.
 * @param {number} columnHeaderIndex - The index of the column header that is being edited.
 */

export function AddNewInputs({ column, item, columnHeaderIndex }: any) {
  const { setRows, inputFields } = useDynamicGrid();

  const handleChange = (name: string, value: string, Id: number) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.Id === Id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  // Handler specifically for DatePicker that converts event-style to direct params
  const handleDatePickerChange = (e: any) => {
    handleChange(e.target.name, e.target.value, item?.Id);
  };

  const filteredData = inputFields
    .map((item: any, index: number) =>
      item && item.jsonOptionData ? { ...item, defaultIndex: index } : null
    )
    .filter((item: any) => item !== null);

  const JSONOptions = filteredData.find(
    (item: any) => item.defaultIndex === columnHeaderIndex
  );

  let dropdownOptions: any = "";
  if (JSONOptions) {
    dropdownOptions = JSON.parse(JSONOptions.jsonOptionData ?? "{}");
  }

  const containsComma = column?.filterColumnsType?.toLowerCase().includes(",");
  const commanSeparatedSecondValue = column?.filterColumnsType?.split(",")[1];

  return (
    <TableCell>
      {column?.filterColumnsType?.toLowerCase() === FilterTypeColumns.Text && (
        <input
          type="text"
          className="form-control bg-white mb-lg-0 h-30px rounded-2 w-100"
          placeholder={column?.columnLabel}
          value={item?.[column?.columnKey]}
          name={column?.columnKey}
          onChange={(e: any) =>
            handleChange(e.target.name, e.target.value, item?.Id)
          }
        />
      )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.Dropdown && (
        <Select
          menuPortalTarget={document.body}
          theme={(theme) => styles(theme)}
          name={column?.columnKey}
          value={
            dropdownOptions?.length &&
            dropdownOptions?.filter((option: any) => {
              return option.value === item?.[column?.columnKey];
            })
          }
          options={dropdownOptions}
          styles={reactSelectSMStyle}
          onChange={(e: any) =>
            handleChange(column?.columnKey, e.value, item?.Id)
          }
        />
      )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.Datepicker && (
        // <input
        //   className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
        //   type="date"
        //   value={convertToDateInputFormat(item?.[column?.columnKey])}
        //   onChange={(e: any) =>
        //     handleChange(column?.columnKey, e.target.value, item?.Id)
        //   }
        // />
        <SearchDatePicker
          value={item?.[column?.columnKey]}
          name={column?.columnKey}
          onChange={handleDatePickerChange}
        />
      )}
      {containsComma &&
        commanSeparatedSecondValue.toLowerCase() ===
          FilterTypeColumns.TextDate && (
          <TextCalendarInputs
            column={column}
            item={item}
            handleInputsChange={handleChange}
          />
        )}
    </TableCell>
  );
}

// const convertToDateInputFormat = (dateString: string) => {
//   if (!dateString) return "";

//   // Handles formats like "2024/04/08" or "2024-04-08"
//   const normalized = dateString.replaceAll("/", "-");
//   const date = new Date(normalized);

//   if (isNaN(date.getTime())) return ""; // Invalid date check

//   const year = date.getFullYear();
//   const month = `0${date.getMonth() + 1}`.slice(-2); // month is 0-indexed
//   const day = `0${date.getDate()}`.slice(-2);

//   return `${year}-${month}-${day}`;
// };
