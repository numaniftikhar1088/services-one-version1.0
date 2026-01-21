import { TableCell } from "@mui/material";
import moment from "moment";
import Select from "react-select";
import { useWorkLogDataContext } from "./WorkLogContext/useWorkLogContext";
import { reactSelectSMStyle, styles } from "Utils/Common";

enum FilterTypeColumns {
  Text = "text",
  Datepicker = "datepicker",
  Dropdown = "dropdown",
}

function DynamicAddNewInputs({
  column,
  item,
  handleInputsChange,
  columnHeaderIndex,
  inputFields,
}: any) {
  const { value } = useWorkLogDataContext();

  // const handleChange = (e: any) => {
  //   let value = e.target.value;
  //   let type = e.target.type;
  //   if (type === "date") {
  //     value = moment(value, "YYYY-MM-DD").format("MM/DD/YYYY");
  //   }
  // };

  const filteredData = inputFields
    ?.map((item: any, index: number) =>
      item && item.jsonOptionData ? { ...item, defaultIndex: index } : null
    )
    ?.filter((item: any) => item !== null);

  const JSONOptions = filteredData?.find(
    (item: any) => item.defaultIndex === columnHeaderIndex
  );

  let dropdownOptions: any = "";
  if (JSONOptions) {
    dropdownOptions = JSON.parse(JSONOptions.jsonOptionData ?? "{}");
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
            handleInputsChange(
              e.target.name,
              e.target.value,
              value === 2
                ? item?.PhlAssignmentId
                : value === 4
                  ? item.RejectionReasonID
                  : item?.RequisitionOrderId
            )
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
            handleInputsChange(
              column?.columnKey,
              e.value,
              value === 2
                ? item?.PhlAssignmentId
                : value === 4
                  ? item.RejectionReasonID
                  : item?.RequisitionOrderId
            )
          }
          isDisabled={value === 4 && item.RejectionReasonID ? true : false}
        />
      )}
      {column?.filterColumnsType?.toLowerCase() ===
        FilterTypeColumns.Datepicker && (
        <input
          className="form-control bg-white mb-lg-0 h-30px rounded-2 fs-8 w-100"
          type="date"
          value={convertToDateInputFormat(item?.[column?.columnKey])}
          onChange={(e: any) =>
            handleInputsChange(
              column?.columnKey,
              e.target.value,
              value === 2
                ? item?.PhlAssignmentId
                : value === 4
                  ? item.RejectionReasonID
                  : item?.RequisitionOrderId
            )
          }
        />
      )}
    </TableCell>
  );
}

export default DynamicAddNewInputs;

const convertToDateInputFormat = (dateString: string) => {
  if (!dateString) return "";

  const formattedDate = moment(dateString).format("MM/DD/YYYY");
  const isSlashesFormat = formattedDate.includes("/");

  if (isSlashesFormat) {
    const [month, day, year] = formattedDate.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  } else {
    return dateString;
  }
};
