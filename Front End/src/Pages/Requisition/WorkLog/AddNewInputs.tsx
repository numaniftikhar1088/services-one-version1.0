import { TableCell } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { reactSelectSMStyle, styles } from "Utils/Common";

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
 * @param {Function} handleInputsChange - Function to handle changes in input fields within the row.
 * @param {number} columnHeaderIndex - The index of the column header that is being edited.
 * @param {Array} inputFields - Array of input fields that are dynamically created or modified in the row.
 */

function DynamicAddNewInputs({
  column,
  item,
  handleInputsChange,
  columnHeaderIndex,
  inputFields,
}: any) {
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

  function isDateString(dateString: string): boolean {
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

    if (!datePattern.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);

    return !isNaN(date.getTime());
  }

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
            handleInputsChange(column?.columnKey, e.target.value, item?.id)
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
            handleInputsChange(column?.columnKey, e.value, item?.id)
          }
        />
      )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.Datepicker && (
        <input
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
          type="date"
          value={
            isDateString(item?.[column?.columnKey] ?? "")
              ? convertToDateInputFormat(item?.[column?.columnKey])
              : undefined
          }
          onChange={(e: any) =>
            handleInputsChange(column?.columnKey, e.target.value, item?.id)
          }
        />
      )}
    </TableCell>
  );
}

export default DynamicAddNewInputs;

const convertToDateInputFormat = (dateString: string) => {
  if (!dateString) return "";

  const isSlashesFormat = dateString.includes("/");

  if (isSlashesFormat) {
    const [month, day, year] = dateString.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  } else {
    return dateString;
  }
};
