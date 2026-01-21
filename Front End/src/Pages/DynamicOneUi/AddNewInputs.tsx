import { TableCell } from "@mui/material";
import moment from "moment";
import TextCalendarInputs from "Pages/DynamicGrid/textCalendarInputs";
import Select from "react-select";
import { reactSelectSMStyle, styles } from "../../Utils/Common";

enum FilterTypeColumns {
  Text = "text",
  Datepicker = "datepicker",
  Dropdown = "dropdown",
  TextDate = "textdate",
  Switch = "switch",
}

function DynamicOneUiInputs({
  column,
  item,
  handleInputsChange,
  columnHeaderIndex,
  inputFields,
}: any) {
  const handleChange = (e: any) => {
    let value = e.target.value;
    let type = e.target.type;
    if (type === "date") {
      value = moment(value, "YYYY-MM-DD").format("MM/DD/YYYY");
    }
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
            handleInputsChange(e.target.name, e.target.value, item?.Id)
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
            handleInputsChange(column?.columnKey, e.value, item?.Id)
          }
        />
      )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.Datepicker && (
        <input
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
          type="date"
          value={convertToDateInputFormat(item?.[column?.columnKey])}
          onChange={(e: any) =>
            handleInputsChange(column?.columnKey, e.target.value, item?.Id)
          }
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
      {column?.filterColumnsType.toLowerCase() === FilterTypeColumns.Switch && (
        <div className="form__group form__group--checkbox d-flex">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={item?.[column?.columnKey] == 1 ? true : false}
              onChange={(e) => {
                console.log(e.target.value, "JAKSdk");
                handleInputsChange(
                  column?.columnKey,
                  e.target.checked ? "1" : "0",
                  item?.Id
                );
              }}
            />
          </div>
        </div>
      )}
    </TableCell>
  );
}

export default DynamicOneUiInputs;

const convertToDateInputFormat = (dateString: string) => {
  if (!dateString) return "";

  // Handles formats like "2024/04/08" or "2024-04-08"
  const normalized = dateString.replaceAll("/", "-");
  const date = new Date(normalized);

  if (isNaN(date.getTime())) return ""; // Invalid date check

  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // month is 0-indexed
  const day = `0${date.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};
